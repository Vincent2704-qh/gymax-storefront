"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Calendar,
} from "lucide-react";
import type { ServiceDto } from "@/types/service-type";
import { toast } from "sonner";
import type { Brand } from "@/types/app-type.type";
import { useRouter } from "next/navigation";
import { getItem } from "@/lib/utils";
import {
  CookieStorageEnum,
  LocalStorageEnum,
  ServiceType,
  ServiceBookingTypeEnum,
} from "@/enum/app.enums";
import Cookies from "js-cookie";
import { CartService } from "@/services/cart.service";
import BookingWidget from "./widget/BookingWidget";
import BundleOption from "./widget/BundleOption";

interface Props {
  service: ServiceDto;
  serviceBrand: Brand;
}

const ServiceDetailContent = ({ service, serviceBrand }: Props) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number>(
    service.variants?.[0]?.id || 0
  );
  const router = useRouter();
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isOpenBookingModal, setIsOpenBookingModal] = useState(false);
  const [isOpenOptionModal, setIsOpenOptionModal] = useState(false);
  const [customerId, setCustomerId] = useState<number>();

  // Get all images from service and variants
  const images = useMemo(() => {
    const imageList: string[] = [];
    // Add main service image
    if (service.sImage) {
      imageList.push(service.sImage);
    }
    // Add variant images
    service?.variants?.forEach((variant) => {
      if (variant.sImage && variant.sImage !== service.sImage) {
        imageList.push(variant.sImage);
      }
    });
    return imageList.length > 0
      ? imageList
      : ["/placeholder.svg?height=600&width=600"];
  }, [service]);

  // Get selected variant
  const selectedVariant = useMemo(() => {
    return (
      service.variants?.find((variant) => variant.id === selectedVariantId) ||
      service.variants?.[0]
    );
  }, [service.variants, selectedVariantId]);

  // Get available sizes for selected variant
  const availableSizes = useMemo(() => {
    return selectedVariant?.sizes || [];
  }, [selectedVariant]);

  // Get selected size
  const selectedSize = useMemo(() => {
    return availableSizes.find((size) => size.id === selectedSizeId);
  }, [availableSizes, selectedSizeId]);

  // Calculate current price (base price + variant price)
  const currentPrice = useMemo(() => {
    return service.price;
  }, [service.price, selectedVariant]);

  // Set default size when variant changes
  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSizeId) {
      setSelectedSizeId(availableSizes[0].id!);
    }
  }, [availableSizes, selectedSizeId]);

  useEffect(() => {
    const userInfoStr = getItem(LocalStorageEnum.UserInfo);
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    setCustomerId(userInfo?.id);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleVariantChange = (variantId: number) => {
    setSelectedVariantId(variantId);
    // Reset size selection when variant changes
    const newVariant = service?.variants?.find((v) => v.id === variantId);
    if ((newVariant?.sizes.length ?? 0) > 0) {
      setSelectedSizeId(newVariant?.sizes[0].id!);
    } else {
      setSelectedSizeId(null);
    }
  };

  const handleAddToCart = async () => {
    // Validation cho product type
    if (service.productType === ServiceType.Product) {
      if (selectedVariant && !selectedVariant) {
        toast.error("Vui lòng chọn phiên bản sản phẩm");
        return;
      }
      if (availableSizes.length > 0 && !selectedSize) {
        toast.error("Vui lòng chọn kích thước");
        return;
      }
    }

    const userInfoStr = getItem(LocalStorageEnum.UserInfo);
    const accessToken = Cookies.get(CookieStorageEnum.AccessToken);
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    const userId = userInfo?.id;

    if (!userInfoStr || !accessToken) {
      return router.push("/auth");
    }

    try {
      await CartService.addItemToCart({
        customerId: userId,
        items: [
          {
            serviceId: service.id ?? 0,
            serviceVariantId: selectedVariant?.id,
            serviceSizeId: selectedSize?.id,
            quantity,
            selected: 0,
          },
        ],
      });
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (err) {
      toast.error("Thêm vào giỏ hàng thất bại!");
    }
  };

  const handleBuyNow = async () => {
    // Validation cho product type
    if (service.productType === ServiceType.Product) {
      if (selectedVariant && !selectedVariant) {
        toast.error("Vui lòng chọn phiên bản sản phẩm");
        return;
      }
      if (availableSizes.length > 0 && !selectedSize) {
        toast.error("Vui lòng chọn kích thước");
        return;
      }
    }

    // Lấy thông tin user
    const userInfoStr = getItem(LocalStorageEnum.UserInfo);
    const accessToken = Cookies.get(CookieStorageEnum.AccessToken);
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    const userId = userInfo?.id;

    if (!userInfoStr || !accessToken) {
      return router.push("/auth");
    }

    try {
      await CartService.addItemToCart({
        customerId: userId,
        items: [
          {
            serviceId: service.id ?? 0,
            serviceVariantId: selectedVariant?.id,
            serviceSizeId: selectedSize?.id,
            quantity,
            selected: 1, // Set selected = 1 cho mua ngay
          },
        ],
      });
      toast.success("Chuyển đến trang thanh toán!");
      router.push("/checkout");
    } catch (err) {
      toast.error("Thêm vào giỏ hàng thất bại!");
    }
  };

  const handleOpenBookingWidget = () => {
    if (service.bookingTypeId === ServiceBookingTypeEnum.Bundle) {
      setIsOpenOptionModal(true);
    } else if (service.bookingTypeId === ServiceBookingTypeEnum.Regular) {
      setIsOpenBookingModal(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={images[selectedImageIndex] || "/placeholder.svg"}
              alt={service.productTitle}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thumbnail Images */}
          <div className="flex space-x-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImageIndex === index
                    ? "border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${service.productTitle} ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Title and Brand */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {service.productTitle}
            </h1>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600">Thương hiệu:</span>
              <div className="text-blue-500">{serviceBrand?.name}</div>
              <span className="text-gray-600">Mã sản phẩm:</span>
              <span className="font-medium">
                SP{service?.id?.toString().padStart(6, "0")}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-red-600">
              ₫{formatPrice(currentPrice)}
            </div>
            {selectedVariant && selectedVariant.price > 0 && (
              <div className="text-sm text-gray-600">
                Giá gốc: ₫{formatPrice(service.price)}
              </div>
            )}
          </div>

          {/* Chỉ hiển thị variant và size selection cho product type */}
          {service.productType === ServiceType.Product && (
            <>
              {/* Variant Selection */}
              {(service.variants?.length ?? 0) > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Phiên bản:</span>
                    <span className="text-gray-600">
                      {selectedVariant?.title}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {service.variants?.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantChange(variant.id!)}
                        className={`px-4 py-2 border rounded-md transition-colors ${
                          selectedVariantId === variant.id
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {variant.title}
                        {variant.price > 0 && (
                          <span className="ml-1 text-xs text-gray-500">
                            (+₫{formatPrice(variant.price)})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {availableSizes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      Kích thước: {selectedSize?.size || "Chưa chọn"}
                    </span>
                    <button className="text-sm text-blue-600 hover:underline">
                      Hướng dẫn chọn size
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSizeId(size.id!)}
                        disabled={size.quantity === 0}
                        className={`px-4 py-2 border rounded-md transition-colors ${
                          selectedSizeId === size.id
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : size.quantity === 0
                            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {size.size}
                        <span className="ml-1 text-xs text-gray-500">
                          {size.quantity === 0
                            ? "Hết hàng"
                            : `${size.quantity} có sẵn`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Info */}
              <div className="text-sm text-gray-600">
                <span>Tồn kho: </span>
                <span className="font-medium">
                  {selectedSize
                    ? selectedSize.quantity
                    : selectedVariant?.quantity ||
                      service.inventoryQuantity}{" "}
                  sản phẩm
                </span>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">Số lượng:</span>
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons cho Product Type */}
                <div className="space-y-3">
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-gray-300 hover:border-gray-400 hover:text-white bg-transparent"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    THÊM VÀO GIỎ
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    size="lg"
                    className="w-full bg-black hover:bg-gray-800 text-white"
                  >
                    MUA NGAY
                  </Button>
                </div>

                {/* Contact Info */}
                <div className="text-center text-sm text-gray-600">
                  Gọi đặt mua{" "}
                  <span className="font-bold text-orange-500">
                    0375.321.910
                  </span>{" "}
                  (9:00 - 22:30)
                </div>
              </div>
            </>
          )}

          {/* Action Buttons cho Workout Type */}
          {service.productType === ServiceType.Workout && (
            <div className="space-y-4">
              <div className="text-center">
                <Button
                  onClick={handleOpenBookingWidget}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {service.bookingTypeId === ServiceBookingTypeEnum.Bundle
                    ? "QUẢN LÍ GÓI TẬP"
                    : "ĐẶT LỊCH TẬP"}
                </Button>
              </div>

              {/* Contact Info */}
              <div className="text-center text-sm text-gray-600">
                Liên hệ tư vấn{" "}
                <span className="font-bold text-orange-500">0375.321.910</span>{" "}
                (9:00 - 22:30)
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="w-5 h-5 text-gray-600" />
              <span>
                {service.productType === ServiceType.Product
                  ? "Giao hàng tận nơi"
                  : "Hỗ trợ 24/7"}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="w-5 h-5 text-gray-600" />
              <span>
                {service.productType === ServiceType.Product
                  ? "Sản phẩm chính hãng"
                  : "Huấn luyện viên chuyên nghiệp"}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <RotateCcw className="w-5 h-5 text-gray-600" />
              <span>
                {service.productType === ServiceType.Product
                  ? "Đổi trả trong vòng 7 ngày"
                  : "Linh hoạt thời gian"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-12">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {service.productType === ServiceType.Product
                ? "Mô tả sản phẩm"
                : "Mô tả dịch vụ"}
            </h2>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: (service.productDesc ?? "").replace(/\n/g, "<br/>"),
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Booking Widgets cho Workout */}
      <BookingWidget
        isOpen={isOpenBookingModal}
        onClose={() => setIsOpenBookingModal(false)}
        serviceId={service.id ?? 0}
        customerId={customerId}
      />
      <BundleOption
        isOpen={isOpenOptionModal}
        onClose={() => setIsOpenOptionModal(false)}
        serviceId={service.id ?? 0}
        customerId={customerId}
      />
    </div>
  );
};

export default ServiceDetailContent;
