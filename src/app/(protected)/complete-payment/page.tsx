"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Home } from "lucide-react";
import { OrderService } from "@/services/order.service";
import { toast } from "sonner";

const CompletePayment = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy thông tin đơn hàng từ localStorage và tạo đơn hàng luôn
    const orderPayloadStr = localStorage.getItem("pendingOrder");
    if (orderPayloadStr) {
      const orderPayload = JSON.parse(orderPayloadStr);
      OrderService.createOrder(orderPayload)
        .then(() => {
          localStorage.removeItem("pendingOrder");
          setLoading(false);
        })
        .catch(() => {
          toast.error("Tạo đơn hàng thất bại!");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-green-700 text-center mb-4">
            Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi
          </p>
          <Badge
            variant="secondary"
            className="mt-3 bg-green-100 text-green-800"
          >
            <Package className="w-3 h-3 mr-1" />
            Đơn hàng đã được tạo thành công
          </Badge>
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-8">
            <Button
              onClick={() => router.push("/")}
              className="flex-1 text-white"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/account")}
              className="flex-1 bg-transparent hover:text-white"
              size="lg"
            >
              <Package className="w-4 h-4 mr-2" />
              Xem đơn hàng
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletePayment;
