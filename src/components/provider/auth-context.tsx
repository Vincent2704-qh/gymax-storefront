"use client";

import Cookies from "js-cookie";
import { JwtPayload } from "jwt-decode";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import { axiosClient } from "@/lib/axios";
import { getItem, removeItem, setItem } from "@/lib/utils";
import { CookieStorageEnum, LocalStorageEnum } from "@/enum/app.enums";
import { SprinLoading } from "../sprin";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CustomerProfile extends JwtPayload {
  id?: number;
  name?: string;
  email?: string;
}
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: CustomerProfile | null;
  isLoading: boolean;
  register: (
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    password: string
  ) => Promise<void>;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setCustomer] = useState<CustomerProfile | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userInfo = getItem(LocalStorageEnum.UserInfo);
    const accessToken = Cookies.get(CookieStorageEnum.AccessToken);

    if (userInfo && accessToken) {
      setCustomer(JSON.parse(userInfo));
    } else {
      router.push("/auth");
    }
    setIsLoading(false);
  }, []);

  const register = async (
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    password: string
  ) => {
    try {
      const result = await axiosClient.post("api/storefront-auth/signUp", {
        firstName,
        lastName,
        email,
        password,
        phone,
      });
      if (result.data) {
        toast.success("Create account successfully!");
        router.push("/auth?method=login");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Customer login failed");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axiosClient.post<LoginResponse>(
        "api/storefront-auth/signIn",
        {
          email,
          password,
        }
      );
      const { accessToken, refreshToken } = data;
      axiosClient.setAccessToken(accessToken);
      axiosClient.setRefreshToken(refreshToken);
      axiosClient.setHeaderToken(accessToken);
      const profileRes = await axiosClient.get("api/storefront-auth/profile");
      setItem(LocalStorageEnum.UserInfo, profileRes.data);
      setCustomer(profileRes.data as CustomerProfile);
      router.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Customer login failed");
    }
  };

  const logout = () => {
    Cookies.remove(CookieStorageEnum.AccessToken);
    Cookies.remove(CookieStorageEnum.RefeshToken);
    removeItem(LocalStorageEnum.UserInfo);
    setCustomer(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        register,
        login,
        logout,
      }}
    >
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center text-sm text-muted-foreground">
          <SprinLoading />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
