import { axiosClient } from "@/lib/axios";
import { BasePaginationResponse } from "@/types/base-response.type";

export interface CouponDto {
  id?: number;
  couponCode: string;
  description?: string;
  status?: number;
  type?: number;
  percentage?: number;
  amount?: number;
  fromTime: number;
  toTime?: number;
  totalUsed?: number;
  totalUsedLimit: number;
  createAt?: string;
  updateAt?: string;
}

export const DiscountService = {
  filterDiscount() {
    return axiosClient.get<BasePaginationResponse<CouponDto>>(
      `api/discount-coupon`
    );
  },
};
