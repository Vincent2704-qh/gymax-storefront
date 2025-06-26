"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, Info, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CartService } from "@/services/cart.service";
import { LocalStorageEnum } from "@/enum/app.enums";
import { getItem } from "@/lib/utils";
import type { CartItem } from "@/types/app-type.type";
import { toast } from "sonner";
import PageHeader from "@/components/layout/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFilterCartItem } from "./hooks/useCartItemList";
import { PaginationTable } from "@/components/pagination-table";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // Get customerId from localStorage or context
  const [customerId, setCustomerId] = useState<number>();

  const { pagination, cartItems, loading, onChangePage, refetch } =
    useFilterCartItem({
      filter: {
        limit: 4,
        customerId: customerId,
      },
    });

  // Initialize customerId from localStorage
  useEffect(() => {
    const userInfoStr = getItem(LocalStorageEnum.UserInfo);
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    if (userInfo?.id) {
      console.log("Setting customerId:", userInfo.id);
      setCustomerId(userInfo.id);
    }
  }, []);

  // Sync selectedItems with cart items that have selected = 1
  useEffect(() => {
    if (cartItems.length > 0) {
      const selectedIds = cartItems
        .filter((item) => item.selected === 1)
        .map((item) => item.id?.toString()!)
        .filter(Boolean);

      setSelectedItems(selectedIds);
      setSelectAll(
        selectedIds.length === cartItems.length && cartItems.length > 0
      );
    }
  }, [cartItems]);

  const handleSelectAll = async () => {
    if (isUpdating || !customerId) return;

    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setIsUpdating(true);

    try {
      // Update all items' selected status
      const updatePromises = cartItems.map((item) =>
        CartService.updateCartItem({
          customerId: Number(customerId),
          serviceId: item.serviceDetail?.id,
          selected: newSelectAll ? 1 : 0,
        })
      );

      await Promise.all(updatePromises);

      // Refetch data to ensure UI is in sync
      await refetch();

      toast.success(
        newSelectAll ? "Đã chọn tất cả sản phẩm" : "Đã bỏ chọn tất cả sản phẩm"
      );
    } catch (error) {
      console.error("Error updating select all:", error);
      toast.error("Có lỗi xảy ra khi cập nhật");
      // Revert state on error
      setSelectAll(!newSelectAll);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSelectItem = async (itemId: string) => {
    if (isUpdating || !customerId) return;

    const item = cartItems.find((item) => item.id?.toString() === itemId);
    if (!item) return;

    const isCurrentlySelected = selectedItems.includes(itemId);
    setIsUpdating(true);

    try {
      await CartService.updateCartItem({
        customerId: Number(customerId),
        serviceId: item.serviceDetail?.id,
        selected: isCurrentlySelected ? 0 : 1,
      });

      // Refetch data to ensure UI is in sync
      await refetch();

      toast.success(
        isCurrentlySelected ? "Đã bỏ chọn sản phẩm" : "Đã chọn sản phẩm"
      );
    } catch (error) {
      console.error("Error updating item selection:", error);
      toast.error("Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1 || isUpdating || !customerId) return;

    const item = cartItems.find((item) => item.id === itemId);
    if (!item) return;

    setIsUpdating(true);

    try {
      await CartService.updateCartItem({
        customerId: Number(customerId),
        serviceId: item.serviceDetail?.id,
        quantity: newQuantity,
      });

      // Refetch data to ensure UI is in sync
      await refetch();

      toast.success("Đã cập nhật số lượng sản phẩm");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Có lỗi xảy ra khi cập nhật số lượng");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (isUpdating || !customerId) return;

    const item = cartItems.find((item) => item.id === itemId);
    if (!item) return;

    setIsUpdating(true);

    try {
      await CartService.removeCartItem(
        Number(customerId),
        item.serviceDetail?.id!
      );

      // Refetch data to ensure UI is in sync
      await refetch();

      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm");
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id?.toString()!))
      .reduce(
        (sum, item) => sum + (item.serviceDetail?.price || 0) * item.quantity,
        0
      );
  };

  // Show loading when customerId is not ready
  if (!customerId) {
    return (
      <>
        <PageHeader title="Giỏ hàng" isCartHeader={true} />
        <div className="container mx-auto py-6 px-4">
          <div className="text-center">Đang tải...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Giỏ hàng" isCartHeader={true} />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">GIỎ HÀNG</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="text-center">
                      <TableHead className="w-[400px] text-left">
                        <label
                          htmlFor="select-all"
                          className="flex items-center gap-2 cursor-pointer select-none"
                        >
                          <Checkbox
                            className="text-white"
                            id="select-all"
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                            disabled={isUpdating}
                          />
                          <span className="text-sm font-medium">
                            Tất cả ({cartItems.length} sản phẩm)
                          </span>
                        </label>
                      </TableHead>

                      <TableHead>Đơn giá</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Thành tiền</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <TableRow key={item.id} className="align-middle">
                          <TableCell>
                            <div className="flex items-center gap-4 ">
                              <Checkbox
                                className="text-white"
                                checked={selectedItems.includes(
                                  item.id?.toString()!
                                )}
                                onCheckedChange={() =>
                                  handleSelectItem(item.id?.toString()!)
                                }
                                id={`item-${item.id}`}
                                disabled={isUpdating}
                              />
                              <div className="flex items-center gap-4">
                                <div className="w-40 h-40 relative flex-shrink-0">
                                  <Image
                                    src={
                                      item.serviceDetail?.sImage ||
                                      "/placeholder.svg"
                                    }
                                    alt={
                                      item.serviceDetail?.productTitle ||
                                      "Product"
                                    }
                                    fill
                                    className="object-contain rounded-md"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <h3 className="font-medium line-clamp-2">
                                    {item.serviceDetail?.productTitle}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {item.serviceDetail?.productDesc}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-center">
                            <span className="text-red-500 font-medium">
                              {(
                                item.serviceDetail?.price || 0
                              ).toLocaleString()}
                              ₫
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center border rounded-md w-fit mx-auto">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:text-white"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id!,
                                    item.quantity - 1
                                  )
                                }
                                disabled={isUpdating || item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-10 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:text-white"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id!,
                                    item.quantity + 1
                                  )
                                }
                                disabled={isUpdating}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-red-500 font-medium">
                              {(
                                (item.serviceDetail?.price || 0) * item.quantity
                              ).toLocaleString()}
                              ₫
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              className="hover:text-white"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id!)}
                              disabled={isUpdating}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6}>
                          <div className="p-8 text-center text-muted-foreground">
                            {loading
                              ? "Đang tải..."
                              : "Giỏ hàng của bạn đang trống"}
                          </div>
                        </td>
                      </tr>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="pt-2">
              <PaginationTable
                currentPage={pagination?.currentPage ?? 1}
                totalPage={pagination?.totalPages ?? 1}
                onChange={(page) => onChangePage(page)}
                isLoading={loading || isUpdating}
                limit={cartItems?.length}
                total={pagination?.total ?? 0}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Tổng tiền thanh toán</span>
                  <span className="text-red-500 font-bold text-xl">
                    {calculateSubtotal().toLocaleString()}₫
                  </span>
                </div>

                <div className="text-xs text-right text-muted-foreground mb-4">
                  (Đã bao gồm VAT nếu có)
                </div>

                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  disabled={isUpdating || selectedItems.length === 0}
                  onClick={() => router.push("/checkout")}
                >
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
