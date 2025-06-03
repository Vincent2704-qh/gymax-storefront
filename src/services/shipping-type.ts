import { axiosClient } from "@/lib/axios";
import { ShippingType } from "@/types/app-type.type";
import { BasePaginationResponse } from "@/types/base-response.type";

export const ShippingTypeService = {
  async filterShippingType() {
    return axiosClient.get<BasePaginationResponse<ShippingType>>(
      `api/shipping-types`
    );
  },
};
