"use client";

import type React from "react";
import { User, Package, MapPin, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { useCallback, useEffect, useState } from "react";
import { CustomerDto } from "@/types/customer-type";
import { CustomerService } from "@/services/customer.service";
import { toast } from "sonner";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    icon: User,
    label: "Thông tin tài khoản",
    href: "/account/[customerId]/details",
    path: "details",
  },

  {
    icon: Package,
    label: "Quản lý đơn hàng",
    href: "/account/[customerId]/order",
    path: "order",
  },

  {
    icon: MapPin,
    label: "Sổ địa chỉ",
    href: "/account/[customerId]/address",
    path: "address",
  },

  {
    icon: Heart,
    label: "Sản phẩm yêu thích",
    href: "/account/[customerId]/wishlist",
    path: "wishlist",
  },
];

export default function CustomerAccountLayout({
  children,
}: CustomerLayoutProps) {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const customerId = segments[segments.length - 2];
  const [customer, setCustomer] = useState<CustomerDto>();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await CustomerService.getCustomerDetail(
          Number(customerId)
        );
        if (response.data) {
          setCustomer(response.data);
        }
      } catch (err) {
        const errorMessage = "Failed to fetch customer info";
        toast.error(errorMessage, {
          description: (err as Error)?.message,
        });
      }
    };

    fetchCustomer();
  }, [customerId]);

  const renderNavigation = useCallback(() => {
    return (
      <nav className="space-y-1">
        {navigationItems.map((item, index) => {
          const href = item.href.replace("[customerId]", customerId);
          const isActive = pathname.includes(item.path);

          return (
            <Link key={index} href={href}>
              <Button
                variant="ghost"
                className={`w-full justify-start mb-2 text-left h-auto py-3 px-3
                  ${
                    isActive
                      ? "bg-gray-200 font-semibold text-gray-900 hover:text-white"
                      : "hover:bg-red-500 hover:text-white text-gray-700"
                  }
                `}
              >
                <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    );
  }, [customerId, pathname]);

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 mt-40">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={customer?.avatar}
                        alt={customer?.lastName}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-gray-600">Tài khoản của</p>
                      <p className="font-semibold">
                        {customer?.firstName} {customer?.lastName}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">{renderNavigation()}</CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">{children}</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
