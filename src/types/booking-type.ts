export interface BookingDto {
  id?: number;
  bookingCode: string | null;
  quantity: number;
  price: number;
  serviceId: number;
  userId: number;
  customerId: number;
  bookingTypeId: number;
  paid: number;
  status: number;
  fromTime: number;
  toTime: number;
  bookingSubsId: number;
  subsQuantity: number;
  subsTotalBooked: number;
  orderId: number;
  sVariantId: number;
  lastReason: string;
  lastStatusChangedTime: number;
  previousFromTime: number;
  previousToTime: number;
  createdAt?: string;
  updatedAt?: string;
}

export type TimeSlot = {
  fromTime: number;
  toTime: number;
};
