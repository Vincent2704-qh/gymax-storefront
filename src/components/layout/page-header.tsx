"use client";

import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  isCartHeader?: boolean;
}

const PageHeader = ({ title, isCartHeader }: PageHeaderProps) => {
  const router = useRouter();

  return (
    <header
      className={`py-4 border-b ${
        isCartHeader
          ? "bg-black text-red-500 border-red-500"
          : "bg-white text-blue-500 border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 ${
                isCartHeader ? "cursor-pointer hover:opacity-80" : ""
              }`}
              onClick={isCartHeader ? () => router.push("/") : undefined}
            >
              <div
                className={`text-2xl font-bold ${
                  isCartHeader ? "text-red-500" : "text-blue-500"
                }`}
              >
                GYMMAX
              </div>
              <div
                className={`text-sm ${
                  isCartHeader ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Tốt & Nhanh
              </div>
            </div>
            <div
              className={`h-6 w-px ${
                isCartHeader ? "bg-red-500" : "bg-gray-300"
              }`}
            ></div>
            <h1
              className={`text-xl font-medium ${
                isCartHeader ? "text-red-500" : "text-blue-500"
              }`}
            >
              {title}
            </h1>
          </div>

          <div
            className={`rounded-full px-4 py-2 flex items-center gap-3 ${
              isCartHeader ? "bg-red-100" : "bg-blue-100"
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isCartHeader ? "bg-red-600" : "bg-blue-600"
              }`}
            >
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div
                className={`text-lg font-semibold ${
                  isCartHeader ? "text-red-600" : "text-blue-500"
                }`}
              >
                1900-6035
              </div>
              <div
                className={`text-sm ${
                  isCartHeader ? "text-gray-600" : "text-gray-600"
                }`}
              >
                8h - 21h, cả T7 & CN
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
