import { AssignedTeamMember } from "./user-type";

export interface BaseServiceDto {
  id?: number;
  status: number;
  sImage?: string;
  productTitle: string;
  productDescription?: string;
  productType: number;
  price: number;
  currencyCode: string;
  inventoryQuantity: number;
  shopQuantity: number;
  maxBookingAheadDays?: number;
  dateRangeFrom?: Date;
  dateRangeTo?: Date;
  bookingTypeId?: number;
  placeHolderTime?: number;
  capacity?: number;
  maxCapacity?: number;
  minCapacity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceScheduleDto {
  id?: number;
  status: number;
  serviceId: number;
  dayOfWeek: number;
  fromTime: string;
  toTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceVariantDto {
  id?: number;
  serviceId: number;
  title: string | null;
  bookingTypeId?: number;
  sImage: string;
  price: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceDto extends BaseServiceDto {
  schedules?: ServiceScheduleDto[];
  variants?: ServiceVariantDto[];
  members?: AssignedTeamMember[];
}
