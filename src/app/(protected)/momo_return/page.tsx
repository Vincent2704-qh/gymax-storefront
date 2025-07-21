"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import queryString from "query-string";
import { PaymentService } from "@/services/payment.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Home, Loader2, XCircle } from "lucide-react";
import { getItem } from "@/lib/utils";
import { LocalStorageEnum } from "@/enum/app.enums";
import { OrderService } from "@/services/order.service";
import { useRef } from "react";

const MomoReturn = () => {
  const hasVerified = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const userInfo = getItem(LocalStorageEnum.UserInfo);

  const handleRedirectToAccount = useCallback(() => {
    const parsedUserInfo = JSON.parse(userInfo!);
    const id = String(parsedUserInfo?.id);
    if (userInfo) {
      router.push(`/account/${id}/order`);
    } else {
      router.push("/auth");
    }
  }, [userInfo, router]);

  const verifyOrder = async () => {
    if (hasVerified.current) return; // ✅ chỉ chạy 1 lần
    hasVerified.current = true;

    try {
      if (searchParams) {
        const res = await PaymentService.momoCallback(
          queryString.parse(searchParams.toString())
        );

        // resultCode = 0 is checkout successful
        if (res.data.momoData.resultCode == 0 && !orderCreated) {
          const orderPayloadStr = localStorage.getItem("pendingOrder");
          if (orderPayloadStr) {
            const orderPayload = JSON.parse(orderPayloadStr);
            await OrderService.createOrder(orderPayload);
            setOrderCreated(true);
            localStorage.removeItem("pendingOrder");
          }
          setSuccess(true);
        } else {
          setError("Thanh toán không thành công. Vui lòng thử lại.");
        }
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      setError(
        error.response?.data?.message || "Có lỗi xảy ra khi xác thực thanh toán"
      );
    }
  };

  useEffect(() => {
    verifyOrder();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
            <p className="text-lg font-medium text-gray-700">
              Đang xác thực thanh toán...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Vui lòng đợi trong giây lát
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Thanh toán thất bại
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              {error ||
                "Đơn hàng chưa được xác nhận. Vui lòng thử lại hoặc liên hệ hỗ trợ."}
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-green-700 text-center">
              Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi
            </p>
            <Badge
              variant="secondary"
              className="mt-3 bg-green-100 text-green-800"
            >
              <Package className="w-3 h-3 mr-1" />
              Đơn hàng đã được tạo thành công
            </Badge>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Trạng thái đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">
                    Thanh toán thành công
                  </p>
                  <p className="text-sm text-green-600">
                    Đơn hàng của bạn đã được xác nhận và đang được xử lý
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-6">
            <h3 className="font-semibold text-blue-900 mb-3">Bước tiếp theo</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                Chúng tôi sẽ xử lý đơn hàng trong vòng 24 giờ
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                Bạn sẽ nhận được email xác nhận và thông tin vận chuyển
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                Thời gian giao hàng dự kiến: 2-3 ngày làm việc
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => (window.location.href = "/")}
            className="flex-1 text-white"
            size="lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>
          <Button
            variant="outline"
            onClick={handleRedirectToAccount}
            className="flex-1 bg-transparent hover:text-white"
            size="lg"
          >
            <Package className="w-4 h-4 mr-2" />
            Xem đơn hàng
          </Button>
        </div>

        {/* Support Information */}
        <Card className="bg-gray-50">
          <CardContent className="py-4">
            <p className="text-sm text-gray-600 text-center">
              Cần hỗ trợ? Liên hệ với chúng tôi qua{" "}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:underline"
              >
                support@example.com
              </a>{" "}
              hoặc hotline{" "}
              <a
                href="tel:1900123456"
                className="text-blue-600 hover:underline"
              >
                1900 123 456
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MomoReturnWrapper = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
              <p className="text-lg font-medium text-gray-700">Đang tải...</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <MomoReturn />
    </Suspense>
  );
};

export default MomoReturnWrapper;
