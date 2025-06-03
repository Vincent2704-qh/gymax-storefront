import { axiosClient } from "@/lib/axios";
import {
  BasePaginationDto,
  BasePaginationResponse,
} from "@/types/base-response.type";
import { Category } from "@/types/app-type.type";

export interface FilterCategoryDto extends BasePaginationDto {
  search?: string;
}

export const CategoryService = {
  filterCategory(filter: FilterCategoryDto) {
    return axiosClient.get<BasePaginationResponse<Category>>(
      `api/categories`,
      filter
    );
  },
};
