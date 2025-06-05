"use client";

import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useWishlist } from "./hooks/useWishList";
import { toast } from "sonner";
import { Wishlist } from "@/types/app-type.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Send, ShoppingCart, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { PaginationTable } from "@/components/pagination-table";

const WishListPage = () => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const customerId = Number(segments[segments.length - 2]);

  const {
    filters,
    wishlist,
    loading,
    pagination,
    onChangePage,
    onChangeSearch,
  } = useWishlist({
    filter: {
      customerId: customerId,
    },
  });

  const handleRemoveFromWishlist = (itemId: number) => {
    // Add remove from wishlist logic here
    toast.success("Đã xóa khỏi danh sách yêu thích");
  };

  const handleAddToCart = (item: Wishlist) => {
    if (!item.service) return;
    // Add to cart logic here
    toast.success(`Đã thêm "${item.service.productTitle}" vào giỏ hàng`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateTotalValue = () => {
    return wishlist.reduce((sum, item) => sum + (item.service?.price || 0), 0);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br to-blue-500">
        <div className="container mx-auto">
          <Card className="bg-white/95">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    DANH SÁCH YÊU THÍCH
                  </h1>
                  <p className="text-gray-600">
                    {formatDate(new Date().toISOString())} • {wishlist.length}{" "}
                    sản phẩm
                  </p>
                </div>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">
                    Danh sách yêu thích trống
                  </h3>
                  <p className="text-gray-500">
                    Hãy thêm những sản phẩm bạn yêu thích vào đây!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {wishlist.map((item) => {
                    if (!item.service) return null;

                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={item.service?.sImage || "/placeholder.svg"}
                            alt={item.service?.productTitle}
                            fill
                            className="object-cover rounded-lg"
                          />
                          {item.service.status === 0 && (
                            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                              Hết hàng
                            </Badge>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">
                            {item.service?.productTitle}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {item.service?.productDesc || "Không có mô tả"}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-black">
                              {item.service?.price.toLocaleString("vi-VN")}₫
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleAddToCart(item)}
                                disabled={item.service.status === 0}
                                className=" text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                {item.service.status === 0
                                  ? "Hết hàng"
                                  : "Thêm vào giỏ"}
                              </Button>
                              <Button
                                onClick={() =>
                                  handleRemoveFromWishlist(item.id!)
                                }
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-8">
                <PaginationTable
                  currentPage={pagination?.currentPage ?? 1}
                  totalPage={pagination?.totalPages ?? 1}
                  onChange={(page) => onChangePage(page)}
                  isLoading={loading}
                  total={pagination?.total ?? 0}
                />
              </div>

              {wishlist.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Tổng cộng: {wishlist.length} sản phẩm</span>
                    <span>
                      Tổng giá trị:{" "}
                      {calculateTotalValue().toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              )}

              {/* Pagination if needed */}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default WishListPage;
