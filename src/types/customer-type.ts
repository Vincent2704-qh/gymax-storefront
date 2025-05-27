export interface CustomerDto {
  id?: number;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  password?: string;
  type?: number;
  phone?: string;
  email?: string;
  location?: string;
  birthDay?: number;
  gender?: string;
  defaultAddressId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerPayment extends CustomerDto {
  totalOrdered: number;
}
