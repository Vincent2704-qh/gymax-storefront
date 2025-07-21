"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  LocalStorageEnum,
  ServiceBookingTypeEnum,
  ServiceType,
} from "@/enum/app.enums";
import BookingWidget from "./widget/BookingWidget";
import { getItem } from "@/lib/utils";
import BundleOption from "./widget/BundleOption";

interface Props {
  id: number;
  sImgUrl: string;
  sTitle: string;
  sDescription: string;
  price: number;
  currencyCode: string;
  productType: ServiceType;
  bookingTypeId: number;
  hasVariants?: boolean;
  onItemClick: () => void;
  onAddToWishlist: (serviceId: number) => void;
}

const ServiceItem = ({
  id,
  sImgUrl,
  sTitle,
  sDescription,
  price,
  productType,
  bookingTypeId,
  hasVariants = false,
  onItemClick,
  onAddToWishlist,
}: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Xác định hành động khi click vào card
  const getClickAction = () => {
    if (productType === ServiceType.Product && !hasVariants) {
      return "add-to-cart";
    }
    return "view-detail";
  };

  const clickAction = getClickAction();

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0" onClick={onItemClick}>
        <div className="relative overflow-hidden">
          <Image
            src={sImgUrl || "/placeholder.svg"}
            alt={sTitle}
            width={300}
            height={300}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Hover Overlay - chỉ hiển thị wishlist button */}
          <div
            className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute top-4 right-4">
              <Button
                size="icon"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsWishlisted(true);
                  onAddToWishlist(id);
                }}
                className="bg-white hover:bg-gray-100"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
            </div>

            {/* Hiển thị action hint */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-gray-800">
                  {clickAction === "add-to-cart"
                    ? "Thêm vào giỏ hàng"
                    : "Xem chi tiết"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {sTitle}
          </h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-1">
            {sDescription}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-red-600">
              ₫{formatPrice(price)}
            </span>

            {/* Chỉ hiển thị button đặt lịch cho workout type trong danh sách */}
          </div>

          {/* Hiển thị indicator cho product có variants */}
          {productType === ServiceType.Product && hasVariants && (
            <div className="mt-2">
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Nhiều lựa chọn
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
