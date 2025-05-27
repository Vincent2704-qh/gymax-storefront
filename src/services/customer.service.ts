import { Address } from "@/app/(protected)/account/[customerId]/address/page";
import { axiosClient } from "@/lib/axios";
import { BasePaginationDto } from "@/types/base-response.type";
import { BasePaginationResponse } from "@/types/base-response.type";
import { CustomerDto } from "@/types/customer-type";

export interface FilterCustomerDto extends BasePaginationDto {
  search?: string;
  type?: number[];
}

export interface ChangePassDto {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export const CustomerService = {
  getCustomerDetail(customerId: number) {
    return axiosClient.get<CustomerDto>(`api/customers/${customerId}`);
  },

  updateCustomer(id: number, data: Partial<CustomerDto>) {
    return axiosClient.patch<CustomerDto>(`api/customers/${id}`, data);
  },

  deleteCustomer(customerId: number) {
    return axiosClient.delete(`api/customers/${customerId}`, {});
  },

  updatePassword(data: ChangePassDto) {
    return axiosClient.patch(`api/customers/change-password`, data);
  },

  async getAddresses(customerId: number) {
    return axiosClient.get<Address[]>(`/api/customers/${customerId}/addresses`);
  },
  async createAddress(customerId: number, data: Address) {
    return axiosClient.post<Address>(
      `/api/customers/${customerId}/addresses`,
      data
    );
  },
  async updateAddress(id: number, data: Address) {
    return axiosClient.patch(`/api/customers/addresses/${id}`, data);
  },
  async deleteAddress(id: number) {
    return axiosClient.delete(`/api/customers/addresses/${id}`);
  },
};
