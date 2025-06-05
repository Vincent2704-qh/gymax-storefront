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
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 ${
                isCartHeader ? "cursor-pointer hover:opacity-80" : ""
              }`}
              onClick={isCartHeader ? () => router.push("/") : undefined}
            >
              <div className="text-2xl font-bold text-blue-500">GYMMAX</div>
              <div className="text-sm text-gray-600">Tốt & Nhanh</div>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-medium text-blue-500">{title}</h1>
          </div>

          <div className="bg-blue-100 rounded-full px-4 py-2 flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold text-blue-500">
                1900-6035
              </div>
              <div className="text-sm text-gray-600">8h - 21h, cả T7 & CN</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
