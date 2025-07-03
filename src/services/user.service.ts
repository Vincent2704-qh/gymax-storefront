import { axiosClient } from "@/lib/axios";
import { BasePaginationDto } from "@/types/base-response.type";
import { BasePaginationResponse } from "@/types/base-response.type";
import { UserDto } from "@/types/user-type";

export interface FilterUserDto extends BasePaginationDto {
  search?: string;
  role?: number[];
}

export const UserService = {
  filterUsers(filter: FilterUserDto) {
    return axiosClient.get<BasePaginationResponse<UserDto>>(
      `api/users`,
      filter
    );
  },
};
