import { axiosClient } from "@/lib/axios";
import {
  BasePaginationDto,
  BasePaginationResponse,
} from "@/types/base-response.type";
import { Wishlist } from "@/types/app-type.type";

export interface FilterWishlistDto extends BasePaginationDto {
  customerId?: number;
  search?: string;
}

export const WishlistService = {
  async filterWishlist(filter: FilterWishlistDto) {
    return axiosClient.get<BasePaginationResponse<Wishlist>>(
      `api/wishlist`,
      filter
    );
  },

  async addToWishlist(data: Wishlist) {
    return axiosClient.post<Wishlist>(`/api/wishlist/add`, data);
  },

  async removeFromWishlist(customerId: number, serviceId: number) {
    return axiosClient.delete(
      `/api/wishlist/${customerId}/remove/${serviceId}`
    );
  },
};
