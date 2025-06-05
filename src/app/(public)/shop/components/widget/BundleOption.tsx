"use client";

import type { ServiceDto } from "@/types/service-type";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CalendarPlus,
  CheckCircle,
  User,
  Package,
} from "lucide-react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import BookingWidget from "./BookingWidget";

const options = [
  {
    value: "new",
    label: "Book a new bundle",
    description:
      "Book a package of appointments and receive bundle code for future scheduling.",
    icon: CalendarPlus,
  },
  {
    value: "manage",
    label: "Manage your booked bundle",
    description:
      "Already booked? Enter your bundle code to schedule and manage your appointments.",
    icon: Calendar,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceId: number;
  customerId?: number;
}

interface BundleInfo {
  code: string;
  capacity: number;
  bookedCount: number;
  customerName: string;
  bookedDate: string;
}

const BundleBookingDialog = ({
  isOpen,
  onClose,
  serviceId,
  customerId,
}: Props) => {
  const [currentStep, setCurrentStep] = useState<
    "select" | "confirm" | "validate" | "manage"
  >("select");
  const [selectedOption, setSelectedOption] = useState<string>("new");
  const [service, setService] = useState<ServiceDto>();
  const [selectedVariantId, setSelectedVariantId] = useState<number>();

  // Validation step states
  const [bundleCode, setBundleCode] = useState("");
  const [email, setEmail] = useState("");
  const [bundleInfo, setBundleInfo] = useState<BundleInfo | null>(null);

  // Booking widget state
  const [showBookingWidget, setShowBookingWidget] = useState(false);

  const handleContinue = () => {
    if (selectedOption === "new") {
      setCurrentStep("confirm");
    } else if (selectedOption === "manage") {
      setCurrentStep("validate");
    }
  };

  const handleConfirmNewBundle = () => {
    // Redirect to checkout page
    window.location.href = "/checkout";
    onClose();
  };

  const handleValidateBundle = async () => {
    if (!bundleCode.trim() || !email.trim()) {
      toast.error("Please enter both bundle code and email");
      return;
    }

    try {
      // Simulate API call to validate bundle
      // Replace this with your actual API call
      const response = await fetch("/api/validate-bundle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bundleCode: bundleCode.trim(),
          email: email.trim(),
        }),
      });

      if (!response.ok) {
        toast.error("Bundle not found or invalid credentials");
        return;
      }

      const data = await response.json();
      setBundleInfo(data);
      setCurrentStep("manage");
    } catch (error) {
      // For demo purposes, simulate a successful validation
      setBundleInfo({
        code: bundleCode,
        capacity: 10,
        bookedCount: 0,
        customerName: "DINH HUY",
        bookedDate: "Jun 5, 2025",
      });
      setCurrentStep("manage");
    }
  };

  const handleMakeNewBooking = () => {
    onClose();
    setShowBookingWidget(true);
  };

  const handleUseAnotherBundle = () => {
    setBundleCode("");
    setEmail("");
    setBundleInfo(null);
    setCurrentStep("validate");
  };

  const resetDialog = () => {
    setCurrentStep("select");
    setSelectedOption("new");
    setBundleCode("");
    setEmail("");
    setBundleInfo(null);
  };

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white max-w-2xl">
          <AnimatePresence mode="wait">
            {currentStep === "select" && (
              <motion.div
                key="select"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <DialogHeader className="space-y-4">
                  <DialogTitle className="text-xl">
                    Bundle booking options
                  </DialogTitle>
                  <p className="text-gray-600">Select an option to continue:</p>
                </DialogHeader>

                <RadioGroup.Root
                  value={selectedOption}
                  onValueChange={setSelectedOption}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {options.map((option) => (
                    <RadioGroup.Item
                      key={option.value}
                      value={option.value}
                      className="group relative border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-black data-[state=checked]:border-black transition-all"
                    >
                      <div className="flex flex-col items-start gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-200 group-data-[state=checked]:bg-gray-300">
                            <option.icon className="w-5 h-5" />
                          </div>
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full group-data-[state=checked]:border-black group-data-[state=checked]:bg-black relative">
                            <div className="absolute inset-1 bg-white rounded-full group-data-[state=checked]:bg-black"></div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {option.label}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </RadioGroup.Item>
                  ))}
                </RadioGroup.Root>

                <DialogFooter>
                  <Button
                    onClick={handleContinue}
                    className="w-full text-white"
                  >
                    Continue
                  </Button>
                </DialogFooter>
              </motion.div>
            )}

            {currentStep === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-xl">Confirm booking</DialogTitle>
                  <p className="text-sm text-gray-600">bundle_variant | 10</p>
                </DialogHeader>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <div className="bg-blue-600 rounded-full p-1 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900 mb-1">
                      Booking will be confirmed after checkout.
                    </p>
                    <p className="text-sm text-blue-700">
                      You will receive an email on how to book your bundle
                      bookings after checking out.
                    </p>
                  </div>
                </div>

                <DialogFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    className="hover:text-white"
                    onClick={() => setCurrentStep("select")}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleConfirmNewBundle}
                    className="text-white"
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </motion.div>
            )}

            {currentStep === "validate" && (
              <motion.div
                key="validate"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Manage your purchased bundle
                  </DialogTitle>
                </DialogHeader>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <div className="bg-blue-600 rounded-full p-1 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-blue-700">
                    To manage your bundle, we need to verify bundle code that
                    was sent to your email and your email address for secure
                    access.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bundleCode" className="text-sm font-medium">
                      Bundle code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bundleCode"
                      placeholder="Enter your bundle code"
                      value={bundleCode}
                      onChange={(e) => setBundleCode(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Your email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <DialogFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    className="hover:text-white"
                    onClick={() => setCurrentStep("select")}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleValidateBundle}
                    className=" text-white"
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </motion.div>
            )}

            {currentStep === "manage" && bundleInfo && (
              <motion.div
                key="manage"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-xl text-blue-600">
                    Manage your purchased bundle
                  </DialogTitle>
                  <p className="text-sm text-gray-600">bundle_variant | 10</p>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-blue-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      Bundle code {bundleInfo.code}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Package className="w-4 h-4" />
                      <span className="text-sm">
                        Capacity: {bundleInfo.capacity}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{bundleInfo.customerName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Booked {bundleInfo.bookedDate}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 mb-2">
                      This bundle has a total of {bundleInfo.capacity} bookings.
                    </p>
                    <p className="text-sm">
                      You have{" "}
                      <span className="text-green-600 font-medium">
                        {bundleInfo.bookedCount}/{bundleInfo.capacity} booked
                      </span>
                    </p>
                  </div>
                </div>

                <DialogFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleUseAnotherBundle}>
                    Use another bundle
                  </Button>
                  <Button
                    onClick={handleMakeNewBooking}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Make new booking
                  </Button>
                </DialogFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Booking Widget Dialog */}
      <BookingWidget
        isOpen={showBookingWidget}
        onClose={() => setShowBookingWidget(false)}
        serviceId={serviceId}
        customerId={customerId}
      />
    </>
  );
};

export default BundleBookingDialog;
