"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LocalStorageEnum } from "@/enum/app.enums";
import { getItem } from "@/lib/utils";
import { CartService } from "@/services/cart.service";
import { type CouponDto, DiscountService } from "@/services/discount.service";
import { ShippingTypeService } from "@/services/shipping-type";
import type { CartItem, ShippingType } from "@/types/app-type.type";
import { ChevronRight, CreditCard, Info, Package } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/layout/page-header";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PaymentService } from "@/services/payment.service";
import { Address } from "../account/[customerId]/address/page";
import { CustomerService } from "@/services/customer.service";

const CheckoutPage = () => {
  const [shippingList, setShippingList] = useState<ShippingType[]>([]);
  const [discountCouponList, setDiscountCouponList] = useState<CouponDto[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedShipping, setSelectedShipping] = useState("now");
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [discountCode, setDiscountCode] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [appliedDiscounts, setAppliedDiscounts] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  // Get customerId from localStorage or context
  const [customerId, setCustomerId] = useState<number>();

  // Lấy danh sách địa chỉ
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (!customerId) return;

        const res = await CustomerService.getAddresses(customerId);
        setAddresses(res.data);
      } catch (err) {
        toast.error("Không lấy được danh sách địa chỉ");
      }
    };
    fetchAddresses();
  }, [customerId]);

  // Initialize customerId from localStorage
  useEffect(() => {
    const userInfoStr = getItem(LocalStorageEnum.UserInfo);
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    if (userInfo?.id) {
      console.log("Setting customerId:", userInfo.id);
      setCustomerId(userInfo.id);
    }
  }, []);

  //========================Payment handle==============================
  const initialOptions = {
    clientId:
      process.env.NEXT_PUBLIC_PAYPAL_CLIENTID ?? "THIS_IS_PAYPAL_CLIENT_ID",
  };

  // Phần onCreateOrder trong CheckoutPage component
  const onCreateOrder = async () => {
    try {
      console.log("Creating PayPal order...");

      const response = await PaymentService.onCreateOrder();

      console.log("Response data:", response.data);

      // Kiểm tra response structure
      if (response.data && response.data.success && response.data.data) {
        const paypalData = response.data.data;
        console.log("PayPal order ID:", paypalData.id);
        console.log("PayPal order status:", paypalData.status);

        return paypalData.id;
      } else {
        console.error("Invalid response structure:", response.data);
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error("Error creating PayPal order:", err);

      // Detailed error logging
      if (err.response) {
        console.error("Error response status:", err.response.status);
        console.error("Error response data:", err.response.data);
        console.error("Error response headers:", err.response.headers);
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Error message:", err.message);
      }

      throw err;
    }
  };

  const onApprove = async (data: any) => {
    try {
      console.log("Approval data:", data);

      if (!data.orderID) {
        // PayPal trả về orderID, không phải orderId
        throw new Error("Invalid order ID");
      }

      const response = await PaymentService.appprovePayment(data.orderID);

      console.log("Approval response:", response);

      if (response.data) {
        window.location.href = "/complete-payment";
      } else {
        throw new Error("Payment approval failed");
      }
    } catch (err) {
      console.error("Error verifying paypal order:", err);
      window.location.href = "/cancel-payment";
    }
  };

  const onError = (error: any) => {
    console.error("Paypal error", error);
    window.location.href = "/cancel-payment";
  };

  const handleValidateDiscountCode = useCallback(
    (code: string) => {
      setIsApplyingDiscount(true);
      // Simulate API call
      setTimeout(() => {
        if (code && !appliedDiscounts.includes(code)) {
          setAppliedDiscounts((prev) => [...prev, code]);
          toast.success("Áp dụng mã giảm giá thành công");
        } else if (appliedDiscounts.includes(code)) {
          toast.error("Mã giảm giá đã được áp dụng");
        } else {
          toast.error("Mã giảm giá không hợp lệ");
        }
        setIsApplyingDiscount(false);
        setDiscountCode("");
      }, 500);
    },
    [appliedDiscounts]
  );

  useEffect(() => {
    const fetchShippingType = async () => {
      try {
        const response = await ShippingTypeService.filterShippingType();

        if (response.data.body) {
          setShippingList(response.data.body);
        }
      } catch (err) {
        toast.error("Không thể tải phương thức vận chuyển", {
          description: (err as Error)?.message,
        });
      }
    };
    fetchShippingType();
  }, []);

  useEffect(() => {
    const fetchDiscountCoupon = async () => {
      try {
        const response = await DiscountService.filterDiscount();

        if (response.data.body) {
          setDiscountCouponList(response.data.body);
        }
      } catch (err) {
        toast.error("Không thể tải mã giảm giá", {
          description: (err as Error)?.message,
        });
      }
    };
    fetchDiscountCoupon();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userInfoStr = getItem(LocalStorageEnum.UserInfo);
        const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
        const userId = userInfo?.id;

        const response = await CartService.filterCartItem({
          customerId: userId,
        });

        if (response.data.body) {
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

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.serviceDetail.price * item.quantity,
      0
    );
  };

  const calculateShippingFee = () => {
    return selectedShipping === "now" ? 28000 : 20000;
  };

  const calculateDiscount = () => {
    // Example discount calculation
    return appliedDiscounts.length > 0 ? 36000 : 0;
  };

  const calculateShippingDiscount = () => {
    // Example shipping discount
    return 28000;
  };

  const calculateTotal = () => {
    return (
      calculateSubtotal() +
      calculateShippingFee() -
      calculateDiscount() -
      calculateShippingDiscount()
    );
  };

  return (
    <>
      <PageHeader title="Thanh toán" isCartHeader={true} />
      <div className="container mx-auto py-6 px-4 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Chọn hình thức giao hàng</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <RadioGroup
                    value={selectedShipping}
                    onValueChange={setSelectedShipping}
                  >
                    <div className="border rounded-md p-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="now" id="now" />
                        <div className="flex items-center">
                          <Badge
                            variant="outline"
                            className="text-red-500 border-red-500 font-bold mr-2"
                          >
                            NOW
                          </Badge>
                          <Label htmlFor="now" className="font-medium">
                            Giao siêu tốc 2h
                          </Label>
                        </div>
                        <Badge className="ml-auto bg-green-100 text-green-600 font-normal">
                          -28K
                        </Badge>
                      </div>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="font-medium">
                          Giao tiết kiệm
                        </Label>
                        <Badge className="ml-auto bg-green-100 text-green-600 font-normal">
                          -20K
                        </Badge>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b">
                  <CardTitle>Giao tới</CardTitle>
                  <Button variant="link" className="text-blue-500 p-0">
                    Thay đổi
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="font-medium">Đinh Huy</p>
                      <p>0962212482</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="bg-green-100 text-green-600 px-1 rounded mr-1">
                        Nhà
                      </span>
                      số nhà 29, Thịnh Quang, Đống Đa, Phường Bến Nghé, Quận 1,
                      Hồ Chí Minh
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Khuyến Mãi</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 border rounded-md p-3 bg-blue-50">
                      <div className="flex items-center">
                        <Image
                          src="/placeholder.svg"
                          alt="Extra"
                          width={24}
                          height={24}
                        />
                        <span className="ml-2 text-sm font-medium">
                          Giảm 70K
                        </span>
                        <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Bỏ Chọn
                    </Button>
                  </div>

                  <div className="flex items-center text-blue-500 text-sm">
                    <span>Chọn hoặc nhập mã khác</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>

                  <div className="mt-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập mã giảm giá"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleValidateDiscountCode(discountCode)}
                        disabled={isApplyingDiscount || !discountCode}
                      >
                        Áp dụng
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Chọn hình thức thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <RadioGroup
                    value={selectedPayment}
                    onValueChange={setSelectedPayment}
                  >
                    <div className="border rounded-md p-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cod" id="cod" />
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mr-2">
                            <CreditCard className="h-5 w-5 text-blue-500" />
                          </div>
                          <Label htmlFor="cod" className="font-medium">
                            Thanh toán tiền mặt khi nhận hàng
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-md p-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="paypalPayment"
                          id="paypalPayment"
                        />
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-md flex items-center justify-center mr-2">
                            <Image
                              src="/img/paypal.png"
                              alt="paypalPayment"
                              width={20}
                              height={20}
                            />
                          </div>
                          <Label
                            htmlFor="paypalPayment"
                            className="font-medium"
                          >
                            Thanh toán bằng Paypal
                          </Label>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle>Đơn hàng</CardTitle>
                    <Button
                      variant="link"
                      className="text-blue-500 p-0 text-sm"
                    >
                      Xem thông tin
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    1 sản phẩm
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-12 h-12 relative flex-shrink-0">
                        <Image
                          src="/placeholder.svg"
                          alt="Thảm tập yoga"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm line-clamp-2">
                          Thảm Tập Yoga TPE 2 Lớp PEAFLO Cao Cấp dày 6mm Kèm Túi
                          - Màu ngẫu nhiên
                        </p>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm">SL: x1</span>
                          <span className="text-sm font-medium">129.000₫</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Tổng tiền</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Tổng tiền hàng</span>
                      <span>{calculateSubtotal().toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Phí vận chuyển</span>
                      <span>{calculateShippingFee().toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm">Giảm giá trực tiếp</span>
                      <span>-{calculateDiscount().toLocaleString()}₫</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Tổng tiền thanh toán</span>
                    <span className="text-red-500 font-bold text-xl">
                      {calculateTotal().toLocaleString()}₫
                    </span>
                  </div>
                  {selectedPayment === "paypalPayment" ? (
                    <PayPalScriptProvider options={initialOptions}>
                      <PayPalButtons
                        createOrder={onCreateOrder}
                        onApprove={onApprove}
                        onError={onError}
                        fundingSource="paypal"
                      />
                    </PayPalScriptProvider>
                  ) : (
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                      Đặt hàng
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
