"use client";

import { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}

const statusConfig = {
  pending: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
  shipping: {
    label: "Đang giao",
    color: "bg-purple-100 text-purple-800",
    icon: Truck,
  },
  delivered: {
    label: "Đã giao",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

export default function OrderPage() {
  const [orders] = useState<Order[]>([
    {
      id: "1",
      orderNumber: "DH001234567",
      date: "2024-01-15",
      status: "delivered",
      total: 1250000,
      items: [
        {
          id: "1",
          name: "Áo thun nam basic",
          image: "/placeholder.svg?height=80&width=80",
          price: 299000,
          quantity: 2,
          variant: "Size M, Màu đen",
        },
        {
          id: "2",
          name: "Quần jeans slim fit",
          image: "/placeholder.svg?height=80&width=80",
          price: 650000,
          quantity: 1,
          variant: "Size 30, Màu xanh",
        },
      ],
      shippingAddress: "123 Đường ABC, Phường 1, Quận 1, TP.HCM",
      paymentMethod: "COD",
    },
    {
      id: "2",
      orderNumber: "DH001234568",
      date: "2024-01-20",
      status: "shipping",
      total: 850000,
      items: [
        {
          id: "3",
          name: "Giày sneaker nam",
          image: "/placeholder.svg?height=80&width=80",
          price: 850000,
          quantity: 1,
          variant: "Size 42, Màu trắng",
        },
      ],
      shippingAddress: "456 Đường DEF, Phường 2, Quận 3, TP.HCM",
      paymentMethod: "Chuyển khoản",
    },
    {
      id: "3",
      orderNumber: "DH001234569",
      date: "2024-01-25",
      status: "pending",
      total: 450000,
      items: [
        {
          id: "4",
          name: "Áo polo nam",
          image: "/placeholder.svg?height=80&width=80",
          price: 450000,
          quantity: 1,
          variant: "Size L, Màu xanh navy",
        },
      ],
      shippingAddress: "789 Đường GHI, Phường 3, Quận 5, TP.HCM",
      paymentMethod: "COD",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getOrdersByStatus = (status: string) => {
    if (status === "all") return filteredOrders;
    return filteredOrders.filter((order) => order.status === status);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Quản lý đơn hàng</CardTitle>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả đơn hàng</SelectItem>
                <SelectItem value="pending">Chờ xác nhận</SelectItem>
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="shipping">Đang giao</SelectItem>
                <SelectItem value="delivered">Đã giao</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">
                Tất cả ({filteredOrders.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Chờ xác nhận ({getOrdersByStatus("pending").length})
              </TabsTrigger>
              <TabsTrigger value="confirmed">
                Đã xác nhận ({getOrdersByStatus("confirmed").length})
              </TabsTrigger>
              <TabsTrigger value="shipping">
                Đang giao ({getOrdersByStatus("shipping").length})
              </TabsTrigger>
              <TabsTrigger value="delivered">
                Đã giao ({getOrdersByStatus("delivered").length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Đã hủy ({getOrdersByStatus("cancelled").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <OrderList orders={getOrdersByStatus("all")} />
            </TabsContent>
            <TabsContent value="pending" className="mt-6">
              <OrderList orders={getOrdersByStatus("pending")} />
            </TabsContent>
            <TabsContent value="confirmed" className="mt-6">
              <OrderList orders={getOrdersByStatus("confirmed")} />
            </TabsContent>
            <TabsContent value="shipping" className="mt-6">
              <OrderList orders={getOrdersByStatus("shipping")} />
            </TabsContent>
            <TabsContent value="delivered" className="mt-6">
              <OrderList orders={getOrdersByStatus("delivered")} />
            </TabsContent>
            <TabsContent value="cancelled" className="mt-6">
              <OrderList orders={getOrdersByStatus("cancelled")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  function OrderList({ orders }: { orders: Order[] }) {
    if (orders.length === 0) {
      return (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Không có đơn hàng nào</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => {
          const StatusIcon = statusConfig[order.status].icon;
          return (
            <Card key={order.id} className="border">
              <CardContent className="p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <h3 className="font-semibold">
                      Đơn hàng #{order.orderNumber}
                    </h3>
                    <Badge className={statusConfig[order.status].color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig[order.status].label}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    Ngày đặt: {formatDate(order.date)}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        {item.variant && (
                          <p className="text-sm text-gray-500">
                            {item.variant}
                          </p>
                        )}
                        <p className="text-sm">
                          {formatPrice(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Order Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                    <p>Địa chỉ: {order.shippingAddress}</p>
                    <p>Thanh toán: {order.paymentMethod}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Tổng tiền:</p>
                      <p className="text-lg font-bold text-red-600">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Chi tiết
                      </Button>
                      {order.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                        >
                          Hủy đơn
                        </Button>
                      )}
                      {order.status === "delivered" && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Mua lại
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }
}
