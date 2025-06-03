import { AssignedTeamMember } from "./user-type";

export interface BaseServiceDto {
  id?: number;
  status: number;
  sImage?: string;
  productTitle: string;
  productDesc?: string;
  productType: number;
  price: number;
  importPrice: number;
  currencyCode: string;
  inventoryQuantity: number;
  maxBookingAheadDays?: number;
  allowChoosingStaff?: number;
  dateRangeFrom?: Date;
  dateRangeTo?: Date;
  bookingTypeId?: number;
  placeHolderTime?: number;
  capacity?: number;
  maxCapacity?: number;
  minCapacity?: number;
  brandId?: number;
  categoryId?: number;
  supplierId?: number;
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

export interface ServiceSizeDto {
  id?: number;
  size: string;
  serviceId?: number;
  quantity?: number;
  height?: string;
  width?: string;
  volume?: string;
}

export interface ServiceVariantDto {
  id?: number;
  serviceId: number;
  serviceSizeId: number;
  title: string | null;
  bookingTypeId?: number;
  sImage: string;
  price: number;
  quantity: number;
  sizes: ServiceSizeDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceDto extends BaseServiceDto {
  schedules?: ServiceScheduleDto[];
  variants?: ServiceVariantDto[];
  members?: AssignedTeamMember[];
}
