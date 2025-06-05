import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";

interface Props {
  id: number;
  sImgUrl: string;
  sTitle: string;
  sDescription: string;
  price: number;
  currencyCode: string;
  redirectToDetail: () => void;
  onAddToWishlist: (serviceId: number) => void;
  onAddToCart: (serviceId: number) => void;
  onBuyNow: (serviceId: number) => void;
}

const ServiceItem = ({
  id,
  sImgUrl,
  sTitle,
  sDescription,
  price,
  currencyCode,
  redirectToDetail,
  onAddToWishlist,
  onAddToCart,
  onBuyNow,
}: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0" onClick={redirectToDetail}>
        <div className="relative overflow-hidden">
          <Image
            src={sImgUrl || "/placeholder.svg"}
            alt={sTitle}
            width={300}
            height={300}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center space-x-3">
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
              <Button
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();

                  onAddToCart(id);
                }}
                className="bg-white hover:bg-gray-100"
              >
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </Button>
            </div>
          </div>

          {/* Wishlist Button - Always visible on mobile */}
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
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation(); // Ngăn redirect
                onBuyNow(id);
              }}
              className="text-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Mua ngay
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
