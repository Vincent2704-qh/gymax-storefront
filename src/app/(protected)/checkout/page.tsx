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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LocalStorageEnum } from "@/enum/app.enums";
import {
  buildShippingAddress,
  convertVndToUsd,
  generateOrderCode,
  getItem,
} from "@/lib/utils";
import { type CouponDto, DiscountService } from "@/services/discount.service";
import { ShippingTypeService } from "@/services/shipping-type";
import type { ShippingType } from "@/types/app-type.type";
import { ChevronRight, CreditCard, MapPin, Ticket } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/layout/page-header";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PaymentService } from "@/services/payment.service";
import type { Address } from "../account/[customerId]/address/page";
import { CustomerService } from "@/services/customer.service";
import { useFilterCartItem } from "../cart/hooks/useCartItemList";
import { CustomerDto } from "@/types/customer-type";
import { CreateOrderDto, OrderService } from "@/services/order.service";

const CheckoutPage = () => {
  const [shippingList, setShippingList] = useState<ShippingType[]>([]);
  const [discountCouponList, setDiscountCouponList] = useState<CouponDto[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [discountCode, setDiscountCode] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<CouponDto | null>(
    null
  );
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  const [customerId, setCustomerId] = useState<number>();
  const [customer, setCustomer] = useState<CustomerDto>();

  const { pagination, cartItems, loading, onChangePage, refetch } =
    useFilterCartItem({
      filter: {
        limit: 4,
        customerId: customerId,
        selected: 1,
      },
    });

  // Lấy danh sách địa chỉ
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (!customerId) return;
        const res = await CustomerService.getAddresses(customerId);
        setAddresses(res.data);
        // Set default address if available
        if (res.data.length > 0 && !selectedAddress) {
          const defaultAddr =
            res.data.find((addr: Address) => addr.isDefault) || res.data[0];
          setSelectedAddress(defaultAddr);
        }
      } catch (err) {
        toast.error("Không lấy được danh sách địa chỉ");
      }
    };

    fetchAddresses();
  }, [customerId]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        console.log("customerId");
        console.log(customerId);
        if (!customerId) return;
        const res = await CustomerService.getCustomerDetail(customerId);
        setCustomer(res.data);
      } catch (err) {
        toast.error("Không lấy được thông tin khách hàng");
      }
    };
    fetchCustomer();
  }, [customerId]);

  useEffect(() => {
    const userInfoStr = getItem(LocalStorageEnum.UserInfo);
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    if (userInfo?.id) {
      console.log("Setting customerId:", userInfo.id);
      setCustomerId(userInfo.id);
    }
  }, []);

  //====================Cod payment=============================//
  const handlePlaceOrder = async () => {
    try {
      if (!customerId || !selectedAddress) return;
      const orderPayload: CreateOrderDto = {
        orderCode: generateOrderCode(),
        customerId,
        discountId: appliedDiscount?.id || undefined,
        shippingTypeId: selectedShipping ? Number(selectedShipping) : null,
        shippingAddress: buildShippingAddress(selectedAddress),
        totalPrice: calculateTotal(),
        paidStatus: 0, // Chưa thanh toán
        status: 0,
        paymentMethod: "cod",
        items: cartItems.map((item) => ({
          serviceId: item.serviceId,
          quantity: item.quantity,
          price: item.serviceDetail.price,
        })),
      };
      const res = await OrderService.createOrder(orderPayload);
      if (res.data) {
        toast.success("Đặt hàng thành công!");
        setTimeout(() => {
          window.location.href = "/complete-payment";
        }, 500);
      } else {
        toast.error("Đặt hàng thất bại!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đặt hàng!");
    }
  };

  //========================Payment handle==============================
  const initialOptions = {
    clientId:
      process.env.NEXT_PUBLIC_PAYPAL_CLIENTID ?? "THIS_IS_PAYPAL_CLIENT_ID",
  };

  //Xử lí momo pay
  const handleMomoCheckout = async () => {
    try {
      if (!customerId || !selectedAddress) return;
      const orderPayload: CreateOrderDto = {
        orderCode: generateOrderCode(),
        customerId,
        discountId: appliedDiscount?.id || undefined,
        shippingTypeId: selectedShipping ? Number(selectedShipping) : null,
        shippingAddress: buildShippingAddress(selectedAddress),
        totalPrice: calculateTotal(),
        paidStatus: 1,
        status: 0,
        paymentMethod: "momoPayment",
        items: cartItems.map((item) => ({
          serviceId: item.serviceId,
          quantity: item.quantity,
          price: item.serviceDetail.price,
        })),
      };
      localStorage.setItem("pendingOrder", JSON.stringify(orderPayload));

      const response = await PaymentService.momoPayment({
        amount: calculateTotal(),
        orderInfo: "Thanh toán Gymmax",
      });
      console.log("Payment response:", response.data.payUrl);
      if (response?.data?.payUrl) {
        window.location.href = formatURL(response.data.payUrl);
      } else {
        console.error("No payment URL returned");
      }
    } catch (error: any) {
      console.error("Error creating payment URL:", error);
    }
  };

  function formatURL(input: string) {
    let url = input.replace(/"/g, "");
    url = url.replace(/,\?/, "?");
    return url;
  }

  //Xử lí vnpay
  const handleCheckout = async () => {
    const orderInfo = {
      address: selectedAddress
        ? `${selectedAddress.address}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}`
        : "số nhà 29, Thịnh Quang, Đống Đa",
      phone: Number(selectedAddress?.phone || "0962212482"),
      email_receiver: selectedAddress?.company || "qhuy113749885hh@gmail.com",
      receiver_name: selectedAddress?.phone || "Đinh Quốc Huy",
      cart_id: Math.random().toString(36).substr(2, 10),
    };

    const payload = {
      amount: calculateTotal(),
      orderInfo,
    };

    console.log(
      "Sending payment request payload:",
      JSON.stringify(payload, null, 2)
    );

    try {
      const response = await PaymentService.paymentOrders(payload);
      console.log("Payment response:", response.data);
      if (response?.data?.url) {
        if (!customerId || !selectedAddress) return;
        const orderPayload: CreateOrderDto = {
          orderCode: generateOrderCode(),
          customerId,
          discountId: appliedDiscount?.id || undefined,
          shippingTypeId: selectedShipping ? Number(selectedShipping) : null,
          shippingAddress: buildShippingAddress(selectedAddress),
          totalPrice: calculateTotal(),
          paidStatus: 1,
          status: 0,
          paymentMethod: "vnpayPayment",
          items: cartItems.map((item) => ({
            serviceId: item.serviceId,
            quantity: item.quantity,
            price: item.serviceDetail.price,
          })),
        };
        localStorage.setItem("pendingOrder", JSON.stringify(orderPayload));
        window.location.href = formatURL(response.data.url);
      } else {
        console.error("No payment URL returned");
      }
    } catch (error: any) {
      console.error("Error creating payment URL:", error);
    }
  };

  const onCreateOrder = async () => {
    try {
      // Tạo danh sách items cho PayPal
      const items = cartItems.map((item) => ({
        name: item.serviceDetail?.productTitle || "Sản phẩm",
        description: "",
        quantity: item.quantity.toString(),
        currency_code: "USD",
        value: convertVndToUsd(item.serviceDetail.price),
      }));

      // Tính tổng tiền USD từ các item
      const usdValue = items
        .reduce(
          (sum, item) => sum + parseFloat(item.value) * parseInt(item.quantity),
          0
        )
        .toFixed(2);

      // Thông tin shipping
      const shipping = {
        full_name: `${customer?.lastName} ${customer?.firstName}`,
        address_line_1: selectedAddress?.address || "",
        admin_area_2: selectedAddress?.district || "",
        admin_area_1: selectedAddress?.city || "",
        country_code: "VN",
        postal_code: "",
      };

      const payload = {
        items,
        currency_code: "USD",
        value: usdValue,
        shipping,
      };

      if (selectedAddress && customerId) {
        const orderPayload: CreateOrderDto = {
          orderCode: generateOrderCode(),
          customerId,
          discountId: appliedDiscount?.id || undefined,
          shippingTypeId: selectedShipping ? Number(selectedShipping) : null,
          shippingAddress: buildShippingAddress(selectedAddress),
          totalPrice: calculateTotal(),
          paidStatus: 1,
          status: 0,
          paymentMethod: "paypalPayment",
          items: cartItems.map((item) => ({
            serviceId: item.serviceId,
            quantity: item.quantity,
            price: item.serviceDetail.price,
          })),
        };
        localStorage.setItem("pendingOrder", JSON.stringify(orderPayload));
      }

      const response = await PaymentService.onCreateOrder(payload);
      if (response.data && response.data.success && response.data.data) {
        const paypalData = response.data.data;
        return paypalData.id;
      } else {
        console.error("Invalid response structure:", response.data);
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error("Error creating PayPal order:", err);
      throw err;
    }
  };

  const onApprove = async (data: any) => {
    try {
      console.log("Approval data:", data);
      if (!data.orderID) {
        throw new Error("Invalid order ID");
      }
      const response = await PaymentService.appprovePayment(data.orderID);
      if (response.data.data.status == "COMPLETED") {
        //create order
        const orderCode = generateOrderCode();
        if (!selectedAddress || !customerId) return;
        const shippingAddress = buildShippingAddress(selectedAddress);

        const orderPayload: CreateOrderDto = {
          orderCode,
          customerId,
          discountId: appliedDiscount?.id || undefined, // hoặc null
          shippingTypeId: selectedShipping ? Number(selectedShipping) : null,
          shippingAddress,
          totalPrice: calculateTotal(),
          paidStatus: 1,
          status: 0,
          paymentMethod: selectedPayment,
          items: cartItems.map((item) => ({
            serviceId: item.serviceId, // FE phải có trường này
            // serviceVariantId: item.serviceVariantId,
            quantity: item.quantity,
            price: item.serviceDetail.price,
          })),
        };
        const orderRes = await OrderService.createOrder(orderPayload);

        if (orderRes.data) {
          setTimeout(() => {
            window.location.href = "/complete-payment";
          }, 500);
        } else {
          throw new Error("Create Order Failed");
        }
        // Chuyển trang
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
      setTimeout(() => {
        const foundCoupon = discountCouponList.find(
          (coupon) => coupon.couponCode === code
        );
        if (foundCoupon) {
          if (appliedDiscount && appliedDiscount.id === foundCoupon.id) {
            toast.error("Mã giảm giá đã được áp dụng");
          } else {
            setAppliedDiscount(foundCoupon); // Set single discount
            toast.success("Áp dụng mã giảm giá thành công");
          }
        } else {
          toast.error("Mã giảm giá không hợp lệ");
        }
        setIsApplyingDiscount(false);
        setDiscountCode("");
      }, 500);
    },
    [appliedDiscount, discountCouponList]
  );

  const handleApplyCoupon = (coupon: CouponDto) => {
    if (!appliedDiscount || appliedDiscount.id !== coupon.id) {
      setAppliedDiscount(coupon); // Set single discount
      toast.success("Áp dụng mã giảm giá thành công");
      setIsDiscountModalOpen(false);
    } else {
      toast.error("Mã giảm giá đã được áp dụng");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null); // Remove single discount
    toast.success("Đã bỏ chọn mã giảm giá");
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    setIsAddressModalOpen(false);
    toast.success("Đã chọn địa chỉ giao hàng");
  };

  // Fetch shipping types from database
  useEffect(() => {
    const fetchShippingType = async () => {
      try {
        const response = await ShippingTypeService.filterShippingType();
        if (response.data.body) {
          setShippingList(response.data.body);
          // Set default shipping if available
          if (response.data.body.length > 0 && !selectedShipping) {
            setSelectedShipping(response.data.body[0].id.toString());
          }
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
        if (!customerId || cartItems.length === 0) return;
        const serviceIds = cartItems.map((item) => item.serviceId);
        const response = await DiscountService.filterDiscount({
          customerId,
          serviceId: serviceIds,
        });
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
  }, [customerId, cartItems]);

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.serviceDetail.price * item.quantity,
      0
    );
  };

  const calculateShippingFee = () => {
    const selectedShippingType = shippingList.find(
      (shipping) => shipping.id.toString() === selectedShipping
    );
    return selectedShippingType?.price || 0;
  };

  const calculateDiscount = () => {
    if (!appliedDiscount) return 0; // Updated for single discount

    if (appliedDiscount.discountType === 1) {
      return (calculateSubtotal() * (appliedDiscount?.percentage ?? 0)) / 100;
    } else {
      return appliedDiscount?.amount ?? 0;
    }
  };

  const calculateTotal = () => {
    return Math.max(
      0,
      calculateSubtotal() + calculateShippingFee() - calculateDiscount()
    );
  };

  return (
    <>
      <PageHeader title="Thanh toán" isCartHeader={true} />
      <div className="container mx-auto py-6 px-4 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Methods */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Chọn hình thức giao hàng</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <RadioGroup
                    value={selectedShipping}
                    onValueChange={setSelectedShipping}
                  >
                    {shippingList.map((shipping) => (
                      <div
                        key={shipping.id}
                        className="border rounded-md p-4 mb-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={shipping.id.toString()}
                            id={shipping.id.toString()}
                          />
                          <div className="flex items-center flex-1">
                            {shipping.name.toLowerCase().includes("now") && (
                              <Badge
                                variant="outline"
                                className="text-red-500 border-red-500 font-bold mr-2"
                              >
                                NOW
                              </Badge>
                            )}
                            <Label
                              htmlFor={shipping.id.toString()}
                              className="font-medium"
                            >
                              {shipping.name}
                            </Label>
                          </div>
                          <Badge className="ml-auto bg-green-100 text-green-600 font-normal">
                            {shipping.price.toLocaleString()}₫
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b">
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Giao tới
                  </CardTitle>
                  <Dialog
                    open={isAddressModalOpen}
                    onOpenChange={setIsAddressModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="link" className="text-blue-500 p-0">
                        Thay đổi
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white">
                      <DialogHeader>
                        <DialogTitle>Chọn địa chỉ giao hàng</DialogTitle>
                        <DialogDescription>
                          Chọn địa chỉ bạn muốn nhận hàng
                        </DialogDescription>
                      </DialogHeader>
                      <div className="max-h-96 overflow-y-auto space-y-3">
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedAddress?.id === address.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handleSelectAddress(address)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="font-medium">
                                    {address.address}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {address.phone}
                                  </p>
                                  {address.isDefault ? (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      Mặc định
                                    </Badge>
                                  ) : undefined}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {address.address}, {address.ward},{" "}
                                  {address.district}, {address.city}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="p-4">
                  {selectedAddress ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="font-medium">{selectedAddress.address}</p>
                        <p>{selectedAddress.phone}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedAddress.isDefault && (
                          <span className="bg-green-100 text-green-600 px-1 rounded mr-1">
                            Mặc định
                          </span>
                        )}
                        {selectedAddress.address}, {selectedAddress.ward},{" "}
                        {selectedAddress.district}, {selectedAddress.city}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Chưa chọn địa chỉ giao hàng
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Promotions */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center">
                    <Ticket className="h-5 w-5 mr-2" />
                    Khuyến Mãi
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {/* Applied Discounts */}
                  {appliedDiscount && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 border rounded-md p-3 bg-blue-50">
                          <div className="flex items-center">
                            <Ticket className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">
                              {appliedDiscount.couponCode} - Giảm{" "}
                              {appliedDiscount.discountType === 1
                                ? `${appliedDiscount.percentage ?? 0}%`
                                : `${appliedDiscount.amount?.toLocaleString()}₫`}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveCoupon}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          Bỏ Chọn
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Discount Selection */}
                  <Dialog
                    open={isDiscountModalOpen}
                    onOpenChange={setIsDiscountModalOpen}
                  >
                    <DialogTrigger asChild>
                      <div className="flex items-center text-blue-500 text-sm cursor-pointer hover:underline">
                        <span>Chọn mã giảm giá</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white">
                      <DialogHeader>
                        <DialogTitle>Chọn mã giảm giá</DialogTitle>
                        <DialogDescription>
                          Chọn mã giảm giá phù hợp cho đơn hàng của bạn (chỉ
                          được chọn 1 mã)
                        </DialogDescription>
                      </DialogHeader>
                      <div className="max-h-96 overflow-y-auto space-y-3">
                        {discountCouponList.map((coupon) => {
                          const isApplied = appliedDiscount?.id === coupon.id;
                          return (
                            <div
                              key={coupon.id}
                              className={`border rounded-lg p-4 ${
                                isApplied
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-200"
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {isApplied && (
                                      <Badge className="text-xs bg-green-500">
                                        Đã áp dụng
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="font-medium text-sm">
                                    {coupon.couponCode}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Giảm{" "}
                                    {coupon.discountType === 1
                                      ? `${coupon.percentage}%`
                                      : `${coupon.amount?.toLocaleString()}₫`}
                                  </p>
                                  {coupon.description && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {coupon.description}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleApplyCoupon(coupon)}
                                  disabled={!!isApplied}
                                  className={
                                    isApplied ? "bg-green-500" : "text-white"
                                  }
                                >
                                  {isApplied ? "Đã chọn" : "Chọn"}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                        {discountCouponList.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            Không có mã giảm giá khả dụng
                          </p>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Manual Discount Code Input */}
                  <div className="mt-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập mã giảm giá"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        className="text-white"
                        onClick={() => handleValidateDiscountCode(discountCode)}
                        disabled={isApplyingDiscount || !discountCode}
                      >
                        Áp dụng
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
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

                    <div className="border rounded-md p-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="vnpayPayment"
                          id="vnpayPayment"
                        />
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-md flex items-center justify-center mr-2">
                            <Image
                              src="/img/vnpay.png"
                              alt="vnpayPayment"
                              width={20}
                              height={20}
                            />
                          </div>
                          <Label htmlFor="vnpayPayment" className="font-medium">
                            Thanh toán bằng VnPay
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-md p-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="momoPayment" id="momoPayment" />
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-md flex items-center justify-center mr-2">
                            <Image
                              src="/img/momo.png"
                              alt="momoPayment"
                              width={20}
                              height={20}
                            />
                          </div>
                          <Label htmlFor="momoPayment" className="font-medium">
                            Thanh toán bằng MoMo
                          </Label>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
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
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-start">
                        <div className="w-12 h-12 relative flex-shrink-0">
                          <Image
                            src={
                              item.serviceDetail?.sImage || "/placeholder.svg"
                            }
                            alt={item.serviceDetail?.productTitle || "Sản phẩm"}
                            fill
                            className="object-contain rounded"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium">
                            {item.serviceDetail?.productTitle}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.serviceDetail?.productDesc}
                          </p>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm">
                              SL: x{item.quantity}
                            </span>
                            <span className="text-sm font-medium">
                              {(
                                item.serviceDetail?.price || 0
                              ).toLocaleString()}
                              ₫
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
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
                    {calculateDiscount() > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="text-sm">Giảm giá</span>
                        <span>-{calculateDiscount().toLocaleString()}₫</span>
                      </div>
                    )}
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
                  ) : selectedPayment === "vnpayPayment" ? (
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                      onClick={handleCheckout}
                    >
                      Thanh toán bằng VnPay
                    </Button>
                  ) : selectedPayment === "momoPayment" ? (
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                      onClick={handleMomoCheckout}
                    >
                      Thanh toán bằng MoMo
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePlaceOrder}
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                    >
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
