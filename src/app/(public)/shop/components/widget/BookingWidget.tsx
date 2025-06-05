import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimeSlot } from "@/types/booking-type";
import { ServiceDto } from "@/types/service-type";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { GymmaxService } from "@/services/gymmax-service.service";
import { toast } from "sonner";
import { BookingService } from "@/services/booking.service";
import { PaidStatus, ServiceBookingTypeEnum } from "@/enum/app.enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

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
  const [selectedVariantId, setSelectedVariantId] = useState<number>();
  const [bookingSubsId, setBookingSubsId] = useState<number>();
  const [bookingPaidStatus, setBookingPaidStatus] = useState<number>(
    PaidStatus.Unpaid
  );

  const handleCreateBooking = useCallback(async () => {
    const selectedVariant = service?.variants?.find(
      (variant) => variant.id === selectedVariantId
    );

    const objBooking: any = {
      serviceId: serviceId || 0,
      sVariantId: selectedVariantId,
      userId: selectedStaffId,
      quantity: bookingQuantity,
      bookingTypeId:
        (selectedVariant?.bookingTypeId ?? service?.bookingTypeId) ===
        ServiceBookingTypeEnum.Bundle
          ? selectedVariant?.bookingTypeId ?? service?.bookingTypeId
          : service?.bookingTypeId,
      bookingSubsId: bookingSubsId || undefined,
      customerId: customerId,
      paid: bookingPaidStatus,
      schedules: timeSlot,
    };

    const result = await BookingService.createBooking(objBooking)
      .then(() => {
        toast.success("Create booking successfully");
        // router.push("/booking");
      })
      .catch((e) => {
        toast.error(`Failed to create booking ${e}`);
      });

    return result;
  }, [
    service,
    selectedVariantId,
    selectedStaffId,
    bookingQuantity,
    bookingSubsId,
    timeSlot,
  ]);

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
    if (!serviceId || !currentMonth) return;

    async function fetchAvailableDates() {
      // Lấy ngày đầu và cuối của tháng đang chọn
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
          sVariantId: `${selectedVariantId}`,
          fromTime,
          toTime,
        });

        setAvailableDates(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        toast.error("Failed to load available dates");
      }
    }

    fetchAvailableDates();
  }, [serviceId, currentMonth, selectedVariantId, selectedVariantId]);

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
          employeeId: selectedStaffId ?? 0, // hoặc dynamic từ select staff
          fromTime,
          toTime,
          sVariantId: `${selectedVariantId}`, // nếu có thể chọn biến thể dịch vụ
          bookingQuantity: bookingQuantity, // có thể thay đổi theo người dùng nhập
        });

        // convert slots to something readable

        const slots = result.data.map((slot) => {
          // Nếu backend trả về giây:
          const from = new Date(slot.fromTime * 1000);
          const to = new Date(slot.toTime * 1000);

          // Hiển thị dạng 24h: HH:mm - HH:mm
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
  }, [selectedDate, serviceId, selectedStaffId, selectedVariantId]);

  useEffect(() => {
    if (!service) return;

    if (service.variants?.[0]) {
      setSelectedVariantId(service.variants[0].id);
    }

    if (service.members?.[0]) {
      setSelectedStaffId(service.members[0].id);
    }
  }, [service]);

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
                <DialogTitle>Schedule your booking</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Label>Variants</Label>
                <Select
                  value={selectedVariantId?.toString()}
                  onValueChange={(value) => setSelectedVariantId(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2 ">
                      <SelectValue placeholder="Select variants" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white hover:bg-white">
                    {service?.variants?.map((variant) => (
                      <SelectItem
                        className="bg-white aria-selected:hover:bg-gray-200 aria-selected:bg-white"
                        key={variant.id}
                        value={variant.id?.toString() ?? ""}
                      >
                        {variant.title}
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

                <div className="space-y-8 mt-3">
                  <Label>Available Time Slots</Label>
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
                            className={`w-full shadow-md  transition hover:bg-black hover:text-white ${
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
                  Book Now
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
              <h2 className="text-lg font-semibold ">Confirm your booking</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Date:</strong>{" "}
                  {dayjs(selectedDate).format("DD/MM/YYYY")}
                </p>
                <p>
                  <strong>Time Slot:</strong>{" "}
                  {timeSlot.length > 0
                    ? `${dayjs(timeSlot[0].fromTime * 1000).format(
                        "HH:mm"
                      )} - ${dayjs(timeSlot[0].toTime * 1000).format("HH:mm")}`
                    : "N/A"}
                </p>
                <p>
                  <strong>Quantity:</strong> {bookingQuantity}
                </p>
                <p>
                  <strong>Total:</strong>{" "}
                  {(() => {
                    const selectedVariant = service?.variants?.find(
                      (v) => v.id === selectedVariantId
                    );
                    const price = selectedVariant?.price ?? 0;
                    return (price * bookingQuantity).toLocaleString() + "đ";
                  })()}
                </p>
              </div>
              <DialogFooter className="pt-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("select")}
                >
                  Back
                </Button>
                <Button
                  className="text-white"
                  onClick={async () => {
                    await handleCreateBooking();
                    onClose();
                    window.location.href = "/checkout";
                  }}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default BookingWidget;
