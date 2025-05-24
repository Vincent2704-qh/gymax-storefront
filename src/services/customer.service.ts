import { axiosClient } from "@/lib/axios";
import { BasePaginationDto } from "@/types/base-response.type";
import { BasePaginationResponse } from "@/types/base-response.type";
import { CustomerDto } from "@/types/customer-type";

export interface FilterCustomerDto extends BasePaginationDto {
  search?: string;
  type?: number[];
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
};
