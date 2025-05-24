import { axiosClient } from "@/lib/axios";
import {
  BasePaginationDto,
  BasePaginationResponse,
} from "@/types/base-response.type";
import { ServiceDto } from "@/types/service-type";

export interface FilterServiceDto extends BasePaginationDto {
  title?: string;
  sort?: number;
  status?: number[];
}

export const GymmaxService = {
  filterService(filter: FilterServiceDto) {
    return axiosClient.get<BasePaginationResponse<ServiceDto>>(
      `api/service`,
      filter
    );
  },

  getServiceDetail(serviceId: number) {
    return axiosClient.get<ServiceDto>(`api/service/${serviceId}`);
  },
};
