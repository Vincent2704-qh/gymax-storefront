import { axiosClient } from "@/lib/axios";
import {
  BasePaginationDto,
  BasePaginationResponse,
} from "@/types/base-response.type";
import { Supplier } from "@/types/app-type.type";

export interface FilterSupplierDto extends BasePaginationDto {
  search?: string;
  status?: number;
}

export const SupplierService = {
  createSupplier(body: Supplier) {
    return axiosClient.post(`api/suppliers`, body);
  },

  filterSuppliers(filter: FilterSupplierDto) {
    return axiosClient.get<BasePaginationResponse<Supplier>>(
      `api/suppliers`,
      filter
    );
  },

  getSupplierDetail(supplierId: number) {
    return axiosClient.get<Supplier>(`api/suppliers/${supplierId}`);
  },

  updateSupplier(supplierId: number, data: Partial<Supplier>) {
    return axiosClient.patch<Supplier>(`api/suppliers/${supplierId}`, data);
  },

  deleteSupplier(supplierId: number, status: number) {
    return axiosClient.delete(`api/suppliers/${supplierId}`, {
      data: { status },
    });
  },
};
