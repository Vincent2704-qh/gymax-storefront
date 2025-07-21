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

export interface OrderItemDto {
  serviceId: number;
  serviceVariantId?: number;
  quantity: number;
  price: number;
}

export interface CreateOrderDto {
  orderCode?: string;
  customerId: number;
  discountId?: number;
  shippingTypeId?: number | null;
  shippingAddress?: string;
  totalPrice: number;
  paidStatus?: number;
  status?: number;
  paymentMethod?: string;
  items: OrderItemDto[];
}

export const OrderService = {
  async filterOrder(filter: FilterOrderDto) {
    return axiosClient.get<BasePaginationResponse<Order>>(`api/order`, filter);
  },

  async createOrder(data: CreateOrderDto) {
    return axiosClient.post("api/order/create", data);
  },

  async cancelOrder(orderId: number) {
    return axiosClient.patch(`api/order/${orderId}/cancel`, {});
  },
};
