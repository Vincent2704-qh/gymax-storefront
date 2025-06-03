import { axiosClient } from "@/lib/axios";
import {
  BasePaginationDto,
  BasePaginationResponse,
} from "@/types/base-response.type";
import { Order, OrderItem } from "@/types/order.type";

export interface FilterOrderDto extends BasePaginationDto {
  customerId?: number;
  status?: number;
}

export const OrderService = {
  async filterOrder(filter: FilterOrderDto) {
    return axiosClient.get<BasePaginationResponse<Order>>(`api/order`, filter);
  },

  async createOrder(data: Order) {
    return axiosClient.post<Order>("api/order/create", data);
  },

  async cancelOrder(orderId: number) {
    return axiosClient.patch(`api/order/${orderId}/cancel`, {});
  },
};
