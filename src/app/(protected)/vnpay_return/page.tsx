"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import queryString from "query-string";
import { PaymentService } from "@/services/payment.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  Home,
  FileText,
  Loader2,
} from "lucide-react";
import { getItem } from "@/lib/utils";
import { LocalStorageEnum } from "@/enum/app.enums";

interface OrderInfo {
  address: string;
  phone: number;
  email_receiver: string;
  receiver_name: string;
  cart_id: string;
}

interface OrderDetails {
  orderInfo: OrderInfo;
  checked: boolean;
  // Có thể có thêm các trường khác từ API
  amount?: number;
  transactionId?: string;
  paymentTime?: string;
}

const VnPayReturn = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userInfo = getItem(LocalStorageEnum.UserInfo);

  const handleRedireactToAccount = useCallback(() => {
    const parsedUserInfo = JSON.parse(userInfo!);
    const id = String(parsedUserInfo?.id);
    if (userInfo && userInfo) {
      router.push(`/account/${id}/order`);
    } else {
      router.push("/auth");
    }
  }, [userInfo]);

  const verifyOrder = async () => {
    try {
      if (searchParams) {
        const res: any = await PaymentService.verifyCheckout(
          queryString.parse(searchParams.toString())
        );
        console.log("Verification result:", res?.data);
        setOrderDetails(res?.data);
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      setError(
        error.response?.data?.message || "Có lỗi xảy ra khi xác thực thanh toán"
      );
      console.log(error.response?.message);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Thanh toán thất bại
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">{error}</p>
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

  if (!orderDetails || !orderDetails.checked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Thanh toán không thành công
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Đơn hàng chưa được xác nhận. Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2 text-white" />
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
              Mã đơn hàng: {orderDetails.orderInfo.cart_id}
            </Badge>
          </CardContent>
        </Card>

        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Thông tin đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Mã đơn hàng</p>
                <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {orderDetails.orderInfo.cart_id}
                </p>
              </div>
              {orderDetails.transactionId && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">
                    Mã giao dịch
                  </p>
                  <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {orderDetails.transactionId}
                  </p>
                </div>
              )}
            </div>

            {orderDetails.amount && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  Số tiền thanh toán
                </p>
                <p className="text-lg font-bold text-green-600">
                  {orderDetails.amount.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            )}

            {orderDetails.paymentTime && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  Thời gian thanh toán
                </p>
                <p className="text-sm">
                  {new Date(orderDetails.paymentTime).toLocaleString("vi-VN")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Thông tin giao hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">
                  {orderDetails.orderInfo.receiver_name}
                </p>
                <p className="text-sm text-gray-600">Người nhận</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">{orderDetails.orderInfo.phone}</p>
                <p className="text-sm text-gray-600">Số điện thoại</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">
                  {orderDetails.orderInfo.email_receiver}
                </p>
                <p className="text-sm text-gray-600">Email</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">{orderDetails.orderInfo.address}</p>
                <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
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
            onClick={handleRedireactToAccount}
            className="flex-1 hover:text-white"
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

const VnPayReturnWrapper = () => {
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
      <VnPayReturn />
    </Suspense>
  );
};

export default VnPayReturnWrapper;
