"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, Info, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CartService } from "@/services/cart.service";
import { LocalStorageEnum } from "@/enum/app.enums";
import { getItem } from "@/lib/utils";
import type { CartItem } from "@/types/app-type.type";
import { toast } from "sonner";
import PageHeader from "@/components/layout/page-header";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userInfoStr = getItem(LocalStorageEnum.UserInfo);
        const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
        const userId = userInfo?.id;

        const response = await CartService.filterCartItem({
          customerId: userId,
        });

        if (response?.data?.body) {
          setCartItems(response.data.body);
        }
      } catch (err) {
        toast.error("Không thể tải giỏ hàng", {
          description: (err as Error)?.message,
        });
      }
    };
    fetchCartItems();
  }, []);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      setSelectedItems(cartItems.map((item) => item.id?.toString()!));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        const newSelected = prev.filter((id) => id !== itemId);
        setSelectAll(false);
        return newSelected;
      } else {
        const newSelected = [...prev, itemId];
        if (newSelected.length === cartItems.length) {
          setSelectAll(true);
        }
        return newSelected;
      }
    });
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    setSelectedItems((prev) => prev.filter((id) => id !== itemId.toString()));
  };

  const calculateSubtotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id?.toString()!))
      .reduce(
        (sum, item) => sum + item.serviceDetail?.price * item.quantity,
        0
      );
  };

  const calculateDiscount = () => {
    // Example discount calculation
    return 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  return (
    <>
      <PageHeader title="Giỏ hàng" isCartHeader={true} />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">GIỎ HÀNG</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="grid grid-cols-12 p-4 text-sm font-medium border-b">
                  <div className="col-span-1 flex items-center">
                    <Checkbox
                      className="text-white"
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      id="select-all"
                    />
                    <label htmlFor="select-all" className="ml-2">
                      Tất cả ({cartItems.length} sản phẩm)
                    </label>
                  </div>
                  <div className="col-span-5 text-center">Sản phẩm</div>
                  <div className="col-span-2 text-center">Đơn giá</div>
                  <div className="col-span-2 text-center">Số lượng</div>
                  <div className="col-span-2 text-center">Thành tiền</div>
                </div>

                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 p-4 border-b items-center"
                    >
                      <div className="col-span-1 flex items-center">
                        <Checkbox
                          className="text-white"
                          checked={selectedItems.includes(item.id?.toString()!)}
                          onCheckedChange={() =>
                            handleSelectItem(item.id?.toString()!)
                          }
                          id={`item-${item.id}`}
                        />
                      </div>
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="w-20 h-20 relative flex-shrink-0">
                          <Image
                            src={
                              item.serviceDetail?.sImage || "/placeholder.svg"
                            }
                            alt={item.serviceDetail?.productTitle}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium line-clamp-2">
                            {item.serviceDetail?.productTitle}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.serviceDetail?.productDesc}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        <div className="flex flex-col">
                          <span className="text-red-500 font-medium">
                            {item.serviceDetail?.price.toLocaleString()}₫
                          </span>
                          {/* Remove this section or modify based on available data
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-muted-foreground text-xs line-through">
                            {item.originalPrice.toLocaleString()}₫
                          </span>
                        )}
                        */}
                          <span className="text-xs text-muted-foreground">
                            Giá chưa áp dụng khuyến mãi
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleQuantityChange(item.id!, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleQuantityChange(item.id!, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-between items-center">
                        <span className="text-red-500 font-medium">
                          {(
                            item.serviceDetail?.price * item.quantity
                          ).toLocaleString()}
                          ₫
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    Giỏ hàng của bạn đang trống
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Giao tới</h3>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-medium">Đinh Huy</p>
                    <p className="text-sm">0962212482</p>
                  </div>
                  <Button variant="link" className="text-blue-500 p-0">
                    Thay đổi
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="bg-green-100 text-green-600 px-1 rounded mr-1">
                    Nhà
                  </span>
                  số nhà 29, Thịnh Quang, Đống Đa, Phường Bến Nghé, Quận 1, Hồ
                  Chí Minh
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Tiki Khuyến Mãi</h3>
                  <div className="flex items-center">
                    <span className="text-sm mr-1">Có thể chọn 2</span>
                    <Info className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 border rounded-md p-3 bg-blue-50">
                    <div className="flex items-center">
                      <Image
                        src="/placeholder.svg"
                        alt="Tiki Extra"
                        width={24}
                        height={24}
                      />
                      <span className="ml-2 text-sm font-medium">
                        Giảm 3% cho đơn từ 0đ
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Chọn
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Tạm tính</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Tạm tính</span>
                    <span>{calculateSubtotal().toLocaleString()}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Giảm giá</span>
                    <span>{calculateDiscount().toLocaleString()}₫</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between mb-4">
                  <span className="font-medium">Tổng tiền thanh toán</span>
                  <span className="text-red-500 font-bold text-xl">
                    {calculateTotal().toLocaleString()}₫
                  </span>
                </div>

                <div className="text-xs text-right text-muted-foreground mb-4">
                  (Đã bao gồm VAT nếu có)
                </div>

                <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                  Mua Hàng ({selectedItems.length})
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
