"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TimeSlot } from "@/types/booking-type";
import type { ServiceDto } from "@/types/service-type";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { GymmaxService } from "@/services/gymmax-service.service";
import { toast } from "sonner";
import { BookingService } from "@/services/booking.service";
import { PaidStatus } from "@/enum/app.enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Ticket } from "lucide-react";
import Image from "next/image";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PaymentService } from "@/services/payment.service";
import { type CouponDto, DiscountService } from "@/services/discount.service";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { convertVndToUsd } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceId: number;
  customerId?: number;
}

const BookingWidget = ({ isOpen, onClose, serviceId, customerId }: Props) => {
  const [currentStep, setCurrentStep] = useState<"select" | "confirm">(
    "select"
  );
  const [service, setService] = useState<ServiceDto>();
  const [availableDates, setAvailableDates] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [bookingQuantity, setBookingQuantity] = useState<number>(1);
  const [timeSlot, setTimeSlot] = useState<TimeSlot[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<number>();
  const [bookingSubsId, setBookingSubsId] = useState<number>();
  const [bookingPaidStatus, setBookingPaidStatus] = useState<number>(
    PaidStatus.Unpaid
  );
  const [selectedPayment, setSelectedPayment] = useState("paypalPayment");
  const [discountCouponList, setDiscountCouponList] = useState<CouponDto[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<CouponDto | null>(
    null
  );
  const [discountCode, setDiscountCode] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  useEffect(() => {
    const fetchDiscountCoupon = async () => {
      try {
        if (!customerId || !service?.id) return;
        const response = await DiscountService.filterDiscount({
          customerId,
          serviceId: [service.id],
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
  }, [customerId, service?.id]);

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
            setAppliedDiscount(foundCoupon);
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
      setAppliedDiscount(coupon);
      toast.success("Áp dụng mã giảm giá thành công");
      setIsDiscountModalOpen(false);
    } else {
      toast.error("Mã giảm giá đã được áp dụng");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    toast.success("Đã bỏ chọn mã giảm giá");
  };

  // Tính toán giá tiền
  const calculateSubtotal = () => {
    const price = service?.price ?? 0;
    return price * bookingQuantity;
  };

  const calculateDiscount = () => {
    if (!appliedDiscount) return 0;
    const subtotal = calculateSubtotal();
    if (appliedDiscount.discountType === 1) {
      return (subtotal * (appliedDiscount?.percentage ?? 0)) / 100;
    } else {
      return appliedDiscount?.amount ?? 0;
    }
  };

  const calculateTotal = () => {
    return Math.max(0, calculateSubtotal() - calculateDiscount());
  };

  //========================Payment handle==============================
  const initialOptions = {
    clientId:
      process.env.NEXT_PUBLIC_PAYPAL_CLIENTID ?? "THIS_IS_PAYPAL_CLIENT_ID",
  };

  //Xử lí momo pay
  const handleMomoCheckout = async () => {
    try {
      if (!customerId) return;

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
    const objBooking: any = {
      serviceId: serviceId || 0,
      userId: selectedStaffId,
      quantity: bookingQuantity,
      bookingTypeId: service?.bookingTypeId,
      bookingSubsId: bookingSubsId || undefined,
      customerId: customerId,
      paid: bookingPaidStatus,
      schedules: timeSlot,
      paymentMethod: selectedPayment,
      discountId: appliedDiscount?.id || undefined,
      totalPrice: calculateTotal(),
      isCreateBooking: true, // Đánh dấu là booking
    };
    localStorage.setItem("pendingOrder", JSON.stringify(objBooking));

    const orderInfo = {
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
      const totalVnd = calculateTotal();
      const usdValue = convertVndToUsd(totalVnd);

      const payload = {
        bookingCheckout: true,
        items: [
          {
            name: service?.productTitle,
            description: "",
            quantity: `${bookingQuantity}`,
            currency_code: "USD",
            value: `${convertVndToUsd(service?.price ?? 0)}`,
          },
        ],
        currency_code: "USD",
        value: usdValue,
      };

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

  const handleCreateBooking = useCallback(async () => {
    const objBooking: any = {
      serviceId: serviceId || 0,
      userId: selectedStaffId,
      quantity: bookingQuantity,
      bookingTypeId: service?.bookingTypeId,
      bookingSubsId: bookingSubsId || undefined,
      customerId: customerId,
      paid: bookingPaidStatus,
      schedules: timeSlot,
      paymentMethod: selectedPayment,
      discountId: appliedDiscount?.id || undefined,
      totalPrice: calculateTotal(),
    };

    const result = await BookingService.createBooking(objBooking)
      .then(() => {
        toast.success("Đặt lịch thành công");
        if (selectedPayment === "vnpay") {
          window.location.href = "/payment/vnpay";
        } else if (selectedPayment === "momo") {
          window.location.href = "/payment/momo";
        } else if (selectedPayment === "paypal") {
          window.location.href = "/payment/paypal";
        }
      })
      .catch((e) => {
        toast.error(`Đặt lịch thất bại ${e}`);
      });
    return result;
  }, [
    service,
    selectedStaffId,
    bookingQuantity,
    bookingSubsId,
    timeSlot,
    selectedPayment,
    appliedDiscount,
  ]);

  useEffect(() => {
    if (!service) return;
    if (service.members?.[0]) {
      setSelectedStaffId(service.members[0].id);
    }
  }, [service]);

  useEffect(() => {
    if (!serviceId) {
      return;
    }
    GymmaxService.getServiceDetail(serviceId)
      .then((rs) => {
        if (rs.data) {
          setService(rs.data);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  }, [serviceId]);

  useEffect(() => {
    if (!serviceId || !currentMonth || !selectedStaffId) return;
    async function fetchAvailableDates() {
      const startOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      );
      const fromTime = Math.floor(startOfMonth.getTime() / 1000);
      const toTime = Math.floor(endOfMonth.getTime() / 1000);

      try {
        const result = await BookingService.getAvailableDates({
          serviceId,
          employeeId: selectedStaffId ?? 0,
          fromTime,
          toTime,
        });
        setAvailableDates(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        toast.error("Failed to load available dates");
      }
    }
    fetchAvailableDates();
  }, [serviceId, currentMonth, selectedStaffId]);

  useEffect(() => {
    if (!selectedDate || !serviceId) return;
    async function fetchTimeSlots() {
      const startOfDay = new Date(
        selectedDate?.getFullYear()!,
        selectedDate?.getMonth()!,
        selectedDate?.getDate(),
        0,
        0,
        0
      );
      const endOfDay = new Date(
        selectedDate?.getFullYear()!,
        selectedDate?.getMonth()!,
        selectedDate?.getDate(),
        23,
        59,
        59
      );
      const fromTime = Math.floor(startOfDay.getTime() / 1000);
      const toTime = Math.floor(endOfDay.getTime() / 1000);

      try {
        const result = await BookingService.getAvailableSlots({
          serviceId,
          employeeId: selectedStaffId ?? 0,
          fromTime,
          toTime,
          bookingQuantity: bookingQuantity,
        });
        const slots = result.data.map((slot) => {
          const from = new Date(slot.fromTime * 1000);
          const to = new Date(slot.toTime * 1000);
          return (
            from.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }) +
            " - " +
            to.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          );
        });
        setAvailableTimeSlots(slots);
      } catch (err) {
        toast.error("Failed to load available time slots");
      }
    }
    fetchTimeSlots();
  }, [selectedDate, serviceId, selectedStaffId]);

  useEffect(() => {
    setTimeSlot([]);
  }, [selectedDate]);

  useEffect(() => {
    if (isOpen) setCurrentStep("select");
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-4xl max-h-[100vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentStep === "select" ? (
            <motion.div
              key="select"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6 overflow-auto"
            >
              <DialogHeader className="space-y-4">
                <DialogTitle>Lên lịch hẹn</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Label>Nhân viên</Label>
                <Select
                  value={selectedStaffId?.toString()}
                  onValueChange={(value) => setSelectedStaffId(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2 ">
                      <SelectValue placeholder="Select staff" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {service?.members?.map((member) => (
                      <SelectItem
                        key={member.id}
                        value={member?.id?.toString() ?? ""}
                      >
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <span>Số lượng</span>
                <Input
                  min={1}
                  className="w-full"
                  type="number"
                  value={bookingQuantity}
                  onChange={(e) => setBookingQuantity(e.target.valueAsNumber)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <p className="font-medium">
                    {selectedDate?.toDateString() ?? "No date selected"}
                  </p>
                  <Calendar
                    mode="single"
                    fullWidth={true}
                    selected={selectedDate}
                    onMonthChange={(month) => {
                      setCurrentMonth(month);
                      setTimeSlot([]);
                    }}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const formatted = dayjs(date).format("YYYY-MM-DD");
                      return !availableDates.some(
                        (d) =>
                          dayjs(d * 1000).format("YYYY-MM-DD") === formatted
                      );
                    }}
                  />
                </div>
                <div className="space-y-2 mt-3">
                  <Label>Khung giờ khả thi</Label>
                  {selectedDate ? (
                    availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((slot) => {
                        const [fromStr, toStr] = slot.split(" - ");
                        const [fromHour, fromMinute] = fromStr
                          .split(":")
                          .map(Number);
                        const [toHour, toMinute] = toStr.split(":").map(Number);
                        const selectedDateInfo = selectedDate
                          ? {
                              year: selectedDate.getFullYear(),
                              month: selectedDate.getMonth(),
                              day: selectedDate.getDate(),
                            }
                          : null;
                        const fromTime = selectedDateInfo
                          ? Math.floor(
                              new Date(
                                selectedDateInfo.year,
                                selectedDateInfo.month,
                                selectedDateInfo.day,
                                fromHour,
                                fromMinute
                              ).getTime() / 1000
                            )
                          : 0;
                        const toTime = selectedDateInfo
                          ? Math.floor(
                              new Date(
                                selectedDateInfo.year,
                                selectedDateInfo.month,
                                selectedDateInfo.day,
                                toHour,
                                toMinute
                              ).getTime() / 1000
                            )
                          : 0;
                        const isActive =
                          timeSlot?.[0]?.fromTime === fromTime &&
                          timeSlot?.[0]?.toTime === toTime;

                        return (
                          <Button
                            className={`w-full shadow-md transition hover:bg-black hover:text-white ${
                              isActive
                                ? "bg-black text-white hover:bg-black hover:text-white"
                                : ""
                            }`}
                            key={slot}
                            variant="outline"
                            onClick={() => {
                              setTimeSlot([{ fromTime, toTime }]);
                            }}
                          >
                            {slot}
                          </Button>
                        );
                      })
                    ) : (
                      <p>No available time slots</p>
                    )
                  ) : (
                    <p>Please select a date first</p>
                  )}
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button
                  className="w-full text-white "
                  disabled={timeSlot.length === 0}
                  onClick={() => setCurrentStep("confirm")}
                >
                  Đặt lịch
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <DialogHeader>
                <DialogTitle>Xác nhận đặt lịch</DialogTitle>
              </DialogHeader>

              {/* Thông tin đặt lịch */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg">Thông tin đặt lịch</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Dịch vụ:</strong> {service?.productTitle}
                  </p>
                  <p>
                    <strong>Ngày:</strong>{" "}
                    {dayjs(selectedDate).format("DD/MM/YYYY")}
                  </p>
                  <p>
                    <strong>Thời gian:</strong>{" "}
                    {timeSlot.length > 0
                      ? `${dayjs(timeSlot[0].fromTime * 1000).format(
                          "HH:mm"
                        )} - ${dayjs(timeSlot[0].toTime * 1000).format(
                          "HH:mm"
                        )}`
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Số lượng:</strong> {bookingQuantity}
                  </p>
                  <p>
                    <strong>Nhân viên:</strong>{" "}
                    {
                      service?.members?.find((m) => m.id === selectedStaffId)
                        ?.name
                    }
                  </p>
                </div>
              </div>

              {/* Khuyến mãi */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Ticket className="h-5 w-5 mr-2" />
                    Khuyến Mãi
                  </h3>
                </div>

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
                        Chọn mã giảm giá phù hợp cho đơn hàng của bạn (chỉ được
                        chọn 1 mã)
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
              </div>

              {/* Tổng tiền */}
              <div className="space-y-3 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">Chi tiết thanh toán</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Giá dịch vụ</span>
                    <span>{(service?.price ?? 0).toLocaleString()}₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Số lượng</span>
                    <span>x{bookingQuantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính</span>
                    <span>{calculateSubtotal().toLocaleString()}₫</span>
                  </div>
                  {calculateDiscount() > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá</span>
                      <span>-{calculateDiscount().toLocaleString()}₫</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg text-red-600">
                    <span>Tổng tiền</span>
                    <span>{calculateTotal().toLocaleString()}₫</span>
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">
                  Chọn phương thức thanh toán
                </h3>
                <RadioGroup
                  value={selectedPayment}
                  onValueChange={setSelectedPayment}
                  className="space-y-3"
                >
                  {/* PayPal */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="paypalPayment"
                        id="paypalPayment"
                      />
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-md flex items-center justify-center mr-3">
                          <Image
                            src="/img/paypal.png"
                            alt="paypalPayment"
                            width={20}
                            height={20}
                          />
                        </div>
                        <Label
                          htmlFor="paypalPayment"
                          className="font-medium cursor-pointer"
                        >
                          Thanh toán bằng PayPal
                        </Label>
                      </div>
                    </div>
                  </div>
                  {/* VnPay */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="vnpayPayment" id="vnpayPayment" />
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-md flex items-center justify-center mr-3">
                          <Image
                            src="/img/vnpay.png"
                            alt="vnpayPayment"
                            width={20}
                            height={20}
                          />
                        </div>
                        <Label
                          htmlFor="vnpayPayment"
                          className="font-medium cursor-pointer"
                        >
                          Thanh toán bằng VnPay
                        </Label>
                      </div>
                    </div>
                  </div>
                  {/* MoMo */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="momoPayment" id="momoPayment" />
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-md flex items-center justify-center mr-3">
                          <Image
                            src="/img/momo.png"
                            alt="momoPayment"
                            width={20}
                            height={20}
                          />
                        </div>
                        <Label
                          htmlFor="momoPayment"
                          className="font-medium cursor-pointer"
                        >
                          Thanh toán bằng MoMo
                        </Label>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <DialogFooter className="grid grid-cols-2 ">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("select")}
                  className="flex-1"
                >
                  Quay lại
                </Button>
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
                  <>
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                      onClick={handleMomoCheckout}
                    >
                      Thanh toán bằng MoMo
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="text-white flex-1"
                      onClick={async () => {
                        await handleCreateBooking();
                        onClose();
                      }}
                    >
                      Xác nhận đặt lịch
                    </Button>
                  </>
                )}
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default BookingWidget;
