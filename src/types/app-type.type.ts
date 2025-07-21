import { ServiceDto } from "./service-type";

export interface Category {
  id?: number;
  name: string;
  codeName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  id?: number;
  name: string;
  codeName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Wishlist {
  id?: number;
  customerId: number;
  serviceId: number;
  service?: ServiceDto;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cart {
  id?: number;
  customerId: number;
  cartItem?: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id?: number;
  cartId: number;
  serviceId: number;
  quantity: number;
  selected: number;
  serviceDetail: ServiceDto;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingType {
  id: number;
  name: string;
  price: number;
  type: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id?: number;
  name: string;
  phone: string | null;
  email: string | null;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
}
