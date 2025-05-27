import axios, { AxiosError, AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { stringify } from "querystring";

import { removeEmptyValues, removeItem, setItem } from "./utils";
import { LocalStorageEnum, CookieStorageEnum } from "@/enum/app.enums";

const singletonEnforcer = Symbol();

export class ErrorResponse {
  constructor(
    readonly statusCode: number,
    readonly errorCode: number,
    readonly message: string
  ) {}
}

class AxiosClient {
  private axiosClient: AxiosInstance;
  static axiosClientInstance: AxiosClient;
  private isRefreshing: boolean = false;
  private debounceTimeout: NodeJS.Timeout | null = null;

  constructor(enforcer: symbol) {
    if (enforcer !== singletonEnforcer) {
      throw new Error("Cannot initialize Axios client single instance");
    }

    this.axiosClient = axios.create({
      baseURL: process.env.API_URL || "http://127.0.0.1:8080",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const accessToken = Cookies.get(CookieStorageEnum.AccessToken);
    if (accessToken) {
      this.setAccessToken(accessToken);
      this.setHeaderToken(accessToken);
    }

    this.axiosClient.interceptors.request.use(
      (configure) => {
        return configure;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosClient.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        if (
          (error.response?.data as { statusCode?: number })?.statusCode ==
            401 ||
          error.response?.status == 401
        ) {
          this.refreshToken();
        } else {
          // ToastError({ message: error.response?.data.message });
        }
        return this.handleError(error.response?.data);
      }
    );
  }

  static get instance() {
    if (!AxiosClient.axiosClientInstance) {
      AxiosClient.axiosClientInstance = new AxiosClient(singletonEnforcer);
    }
    return AxiosClient.axiosClientInstance;
  }

  setHeaderToken(userToken: string) {
    this.axiosClient.defaults.headers.common.Authorization = `Bearer ${userToken}`;
  }

  setAccessToken(token: string) {
    this.setHeaderToken(token);
    Cookies.set(CookieStorageEnum.AccessToken, token);
  }

  getAccessToken() {
    return Cookies.get(CookieStorageEnum.AccessToken);
  }

  setRefreshToken(token: string) {
    Cookies.set(CookieStorageEnum.RefeshToken, token);
  }

  getRefreshToken() {
    return Cookies.get(CookieStorageEnum.RefeshToken);
  }

  removeAccessToken() {
    delete this.axiosClient.defaults.headers.common.Authorization;
    Cookies.remove(CookieStorageEnum.AccessToken);
  }

  removeRefreshToken() {
    Cookies.remove(CookieStorageEnum.RefeshToken);
  }

  get<T>(resource: string, params?: object) {
    const _params = removeEmptyValues(params);
    const searchParams = stringify(
      (_params as Record<
        string,
        | string
        | number
        | boolean
        | readonly string[]
        | readonly number[]
        | readonly boolean[]
        | null
      >) || {}
    );
    // const searchParams = getSearchParams(params);
    return this.axiosClient.get<T>(
      `${resource}${searchParams ? `?${searchParams}` : ""}`
    );
  }

  post<T>(resource: string, data: object, isFormData?: boolean) {
    const headers = isFormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };
    return this.axiosClient.post<T>(`${resource}`, data, {
      headers,
    });
  }

  patch<T>(resource: string, data: object) {
    return this.axiosClient.patch<T>(`${resource}`, data);
  }

  delete<T>(resource: string, data?: Record<string, unknown>) {
    return this.axiosClient.delete<T>(`${resource}`, data);
  }

  refreshToken() {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      const refeshToken = this.getRefreshToken();

      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }
      // Call RefeshToken
      this.debounceTimeout = setTimeout(() => {
        this.post("api/storefront-auth/refresh-token", {
          refeshToken: refeshToken,
        })
          .then((rs) => {
            const { accessToken, refeshToken } = rs.data as {
              [key: string]: string;
            };
            this.setAccessToken(accessToken);
            this.setRefreshToken(refeshToken);
            this.setHeaderToken(accessToken);
            this.isRefreshing = false;
            this.axiosClient.get("api/admin/auth/profile").then((res) => {
              const data = res.data;
              setItem(LocalStorageEnum.UserInfo, data);
              location.reload();
            });
          })

          .catch(() => {
            this.removeAccessToken();
            this.removeRefreshToken();
            removeItem(LocalStorageEnum.UserInfo);
            location.href = "/auth";
          });
      }, 300);
    }
  }

  handleError(error: unknown) {
    if (error instanceof ErrorResponse) {
      return Promise.reject(error);
    }
    if (error instanceof Error) {
      const { message } = error;
      return Promise.reject(new ErrorResponse(-1, -1, message));
    }
    if (typeof error === "string") {
      return Promise.reject(new ErrorResponse(-1, -1, error));
    }
    return Promise.reject(error);
  }
}

export const getSearchParams = (
  params?: Record<string, unknown>
): URLSearchParams => {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach((v) => {
          searchParams.append(key, `${v}`);
        });
      } else if (value !== undefined) {
        if (typeof value === "number") {
          if (!isNaN(value)) {
            searchParams.append(key, `${value}`);
          }
        } else {
          searchParams.append(key, `${value}`);
        }
      }
    });
  }
  return searchParams;
};

// export default AxiosClient.instance;
export const axiosClient = AxiosClient.instance;
