export interface Order {
  id?: number;
  orderCode: string | null;
  customerId: number;
  totalPrice: number;
  paidStatus: number;
  fulfillmentStatus: number;
  orderType: number;
  paymentMethod: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id?: number;
  orderId: number;
  customerId: number;
  customerAddressId: number;
  discountId: number;
  serviceVariantId: number;
  serviceSizeId: number;
  quantity: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}
