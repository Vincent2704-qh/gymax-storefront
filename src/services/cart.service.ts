import { axiosClient } from "@/lib/axios";
import { Cart } from "@/types/app-type.type";
import {
  BasePaginationDto,
  BasePaginationResponse,
} from "@/types/base-response.type";

export interface FilterCart extends BasePaginationDto {
  customerId?: number;
}

export interface UpdateCartItemDto {
  customerId: number;
  serviceId: number;
  quantity?: number;
  selected?: number;
}

export const CartService = {
  async filterCart(filter: FilterCart) {
    return axiosClient.get<BasePaginationResponse<Cart>>(`api/cart`, filter);
  },

  async addItemToCart(data: Cart) {
    return axiosClient.post("api/cart/add", data);
  },

  async updateCartItem(data: UpdateCartItemDto) {
    return axiosClient.patch<UpdateCartItemDto>(`api/cart/update`, data);
  },

  async removeCartItem(customerId: number, serviceId: number) {
    return axiosClient.delete(`/api/cart/${customerId}/remove/${serviceId}`);
  },

  async clearCart(customerId: number) {
    return axiosClient.delete(`api/cart/${customerId}/clear`);
  },
};
