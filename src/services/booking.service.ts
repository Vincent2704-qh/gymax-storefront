import { ServiceBookingTypeEnum } from "@/enum/app.enums";
import { axiosClient } from "@/lib/axios";
import { BasePaginationDto } from "@/types/base-response.type";
import { BasePaginationResponse } from "@/types/base-response.type";
import { BookingDto } from "@/types/booking-type";

export interface FilterBookingDto extends BasePaginationDto {
  serviceId: number | number[];
  employeeId: number | number[];
  code: string;
  status: number | number[];
  bookingTypeId: ServiceBookingTypeEnum | ServiceBookingTypeEnum[];
  fromTime: number;
  toTime: number;
  upTime: number;
  pastTime: number;
  customerId: number;
  search: string;
}

interface GetTimeCanBookingParams {
  serviceId: number;
  employeeId: number;
  fromTime: number;
  toTime: number;
  sVariantId?: string;
  bookingQuantity?: number;
  reschedule?: number;
}

interface TimeCanBookingDto {
  fromTime: number;
  toTime: number;
  remaining?: number;
}

interface GetAvailableDateParams {
  fromTime: number;
  toTime: number;
  serviceId: number;
  sVariantId: string;
  employeeId: number;
}

export const BookingService = {
  createBooking(body: BookingDto) {
    return axiosClient.post(`api/bookings`, body);
  },

  filterBookings(filter: FilterBookingDto) {
    return axiosClient.get<BasePaginationResponse<BookingDto>>(
      `api/bookings`,
      filter
    );
  },

  getBookingDetail(bookingId: number) {
    return axiosClient.get<BookingDto>(`api/bookings/${bookingId}`);
  },

  updateBooking(id: number, data: Partial<BookingDto>) {
    return axiosClient.patch<BookingDto>(`api/bookings/${id}`, data);
  },

  deleteBooking(bookingId: number) {
    return axiosClient.delete(`api/bookings/${bookingId}`, {});
  },

  getAvailableSlots(params: GetTimeCanBookingParams) {
    return axiosClient.get<TimeCanBookingDto[]>(
      `api/bookings/available-slots`,
      params
    );
  },

  getAvailableDates(params: GetAvailableDateParams) {
    return axiosClient.get<number[]>(`/api/bookings/available-dates`, params);
  },
};
