"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  XCircle,
  RefreshCw,
  ShoppingCart,
  CreditCard,
  Phone,
  Mail,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface CancelReason {
  code: string;
  message: string;
  description: string;
}

const CancelPaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cancelReason, setCancelReason] = useState<CancelReason | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Get error details from URL params
  const errorCode = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  useEffect(() => {
    // Determine cancel reason based on URL params or error codes
    const determineCancelReason = () => {
      if (errorCode) {
        // Map PayPal error codes to user-friendly messages
        const errorMap: Record<string, CancelReason> = {
          PAYMENT_CANCELLED: {
            code: "PAYMENT_CANCELLED",
            message: "Thanh toán đã bị hủy",
            description: "Bạn đã hủy giao dịch thanh toán trên PayPal.",
          },
          PAYMENT_FAILED: {
            code: "PAYMENT_FAILED",
            message: "Thanh toán thất bại",
            description:
              "Giao dịch không thể hoàn tất. Vui lòng kiểm tra thông tin thanh toán và thử lại.",
          },
          INSUFFICIENT_FUNDS: {
            code: "INSUFFICIENT_FUNDS",
            message: "Số dư không đủ",
            description:
              "Tài khoản của bạn không có đủ số dư để hoàn tất giao dịch.",
          },
          CARD_DECLINED: {
            code: "CARD_DECLINED",
            message: "Thẻ bị từ chối",
            description:
              "Thẻ tín dụng/ghi nợ của bạn đã bị từ chối. Vui lòng liên hệ ngân hàng hoặc thử thẻ khác.",
          },
        };

        return (
          errorMap[errorCode] || {
            code: "UNKNOWN_ERROR",
            message: "Lỗi không xác định",
            description:
              errorDescription ||
              "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.",
          }
        );
      }

      // Default cancel reason
      return {
        code: "USER_CANCELLED",
        message: "Thanh toán đã bị hủy",
        description:
          "Bạn đã hủy giao dịch thanh toán. Đơn hàng của bạn chưa được xử lý.",
      };
    };

    setCancelReason(determineCancelReason());

    // Track retry attempts from localStorage
    const retryCountStr = localStorage.getItem("payment_retry_count");
    if (retryCountStr) {
      setRetryCount(Number.parseInt(retryCountStr, 10));
    }
  }, [errorCode, errorDescription]);

  const handleRetryPayment = () => {
    const newRetryCount = retryCount + 1;
    setRetryCount(newRetryCount);
    localStorage.setItem("payment_retry_count", newRetryCount.toString());

    if (newRetryCount >= 3) {
      toast.error("Bạn đã thử quá nhiều lần. Vui lòng liên hệ hỗ trợ.");
      return;
    }

    toast.info("Đang chuyển hướng đến trang thanh toán...");
    router.push("/checkout");
  };

  const handleBackToCart = () => {
    // Clear retry count when going back to cart
    localStorage.removeItem("payment_retry_count");
    router.push("/cart");
  };

  const handleContactSupport = () => {
    // You can implement a support modal or redirect to support page
    toast.info("Đang chuyển hướng đến trang hỗ trợ...");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {cancelReason?.message || "Thanh toán không thành công"}
          </h1>
          <p className="text-gray-600">
            Đừng lo lắng, bạn có thể thử lại hoặc chọn phương thức thanh toán
            khác.
          </p>
        </div>

        {/* Error Details */}
        {cancelReason && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              <strong>Chi tiết lỗi:</strong> {cancelReason.description}
              {cancelReason.code !== "USER_CANCELLED" && (
                <span className="block mt-1 text-sm">
                  Mã lỗi: {cancelReason.code}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Retry Warning */}
        {retryCount > 0 && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-700">
              Bạn đã thử {retryCount} lần.
              {retryCount >= 2 &&
                " Nếu vẫn gặp lỗi, vui lòng liên hệ hỗ trợ khách hàng."}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Cards */}
        <div className="space-y-4 mb-8">
          {/* Retry Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-500" />
                Thử lại thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Quay lại trang thanh toán và thử với phương thức thanh toán khác
                hoặc kiểm tra lại thông tin.
              </p>
              <Button
                onClick={handleRetryPayment}
                className="w-full hover:text-white text-white"
                disabled={retryCount >= 3}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {retryCount >= 3
                  ? "Đã thử quá nhiều lần"
                  : "Thử lại thanh toán"}
              </Button>
            </CardContent>
          </Card>

          {/* Back to Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-500" />
                Quay lại giỏ hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Xem lại sản phẩm trong giỏ hàng, áp dụng mã giảm giá hoặc chỉnh
                sửa đơn hàng.
              </p>
              <Button
                onClick={handleBackToCart}
                variant="outline"
                className="w-full bg-transparent hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại giỏ hàng
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-8">
          <Link href="/shop">
            <Button variant="ghost" className="text-blue-500 hover:bg-white">
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CancelPaymentPage;
