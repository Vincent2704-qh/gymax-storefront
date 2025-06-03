import { axiosClient } from "@/lib/axios";
import {
  BasePaginationDto,
  BasePaginationResponse,
} from "@/types/base-response.type";
import { Brand } from "@/types/app-type.type";

export interface FilterBrandCategory extends BasePaginationDto {
  search?: string;
}

export const BrandService = {
  filterBrand(filter: FilterBrandCategory) {
    return axiosClient.get<BasePaginationResponse<Brand>>(`api/brands`, filter);
  },

  getBrandDetail(brandId: number) {
    return axiosClient.get<Brand>(`api/brands/${brandId}`);
  },
};
