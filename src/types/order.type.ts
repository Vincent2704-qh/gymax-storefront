export interface Order {
  id?: number;
  orderCode: string | null;
  customerId: number | undefined;
  discountId: number;
  shippingTypeId: number | null;
  shippingAddress: string | null;
  totalPrice: number;
  paidStatus: number;
  status: number;
  paymentMethod: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id?: number;
  orderId: number;
  serviceId: number;
  serviceVariantId: number;
  quantity: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}
