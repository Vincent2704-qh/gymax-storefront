"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useCallback, useState } from "react";
import { useServiceList } from "./hooks/useServiceList";
import ServiceItem from "./components/ServiceItem";
import { PaginationTable } from "@/components/pagination-table";
import { useBrandList } from "./hooks/useBrandList";
import { useCategoryList } from "./hooks/useCategoryList";
import BrandFilter from "./components/BrandFilter";
import CategoryFilter from "./components/CategoryFilter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { getItem } from "@/lib/utils";
import Cookies from "js-cookie";
import { CookieStorageEnum, LocalStorageEnum } from "@/enum/app.enums";
import { WishlistService } from "@/services/wishlist.service";
import { toast } from "sonner";
import { CartService } from "@/services/cart.service";

const ShopPage = () => {
  const {
    filters,
    serviceList,
    loading,
    pagination,
    onChangePage,
    onChangeSearch,
    redirectToServiceDetail,
  } = useServiceList({
    filter: {
      limit: 12,
    },
  });

  const router = useRouter();
  const { brandList } = useBrandList({});
  const { categoryList } = useCategoryList({});
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);

  const handleCategoryChange = (categoryIds: number[]) => {
    setSelectedCategories(categoryIds);
    onChangePage(1);
  };

  const handleBrandChange = (brandIds: number[]) => {
    setSelectedBrands(brandIds);
    onChangePage(1);
  };

  const handleAddToWishlist = useCallback(async (serviceId: number) => {
    const userInfoStr = getItem(LocalStorageEnum.UserInfo);
    const accessToken = Cookies.get(CookieStorageEnum.AccessToken);
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    const userId = userInfo?.id;

    if (!userInfoStr || !accessToken) {
      return router.push("/auth");
    }

    try {
      await WishlistService.addToWishlist({
        customerId: userId,
        serviceId,
      });
      toast.success("Đã thêm vào danh sách yêu thích!");
    } catch (err) {
      toast.error("Thêm vào wishlist thất bại!");
    }
  }, []);

  const handleAddToCart = useCallback(async (serviceId: number) => {
    const userInfoStr = getItem(LocalStorageEnum.UserInfo);
    const accessToken = Cookies.get(CookieStorageEnum.AccessToken);
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    const userId = userInfo?.id;

    if (!userInfoStr || !accessToken) {
      return router.push("/auth");
    }

    try {
      await CartService.addItemToCart({
        customerId: userId,
        items: [
          {
            serviceId,
            quantity: 1,
            selected: 0, // Mặc định chọn
          },
        ],
      });
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (err) {
      toast.error("Thêm vào giỏ hàng thất bại!");
    }
  }, []);

  const handleBuyNow = useCallback((serviceId: number) => {
    const userInfo = getItem(LocalStorageEnum.UserInfo);
    const accessToken = Cookies.get(CookieStorageEnum.AccessToken);

    if (!userInfo || !accessToken) {
      return router.push("/auth");
    }

    router.push(`/checkout`);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 pt-[140px]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-4">
          <CategoryFilter
            categoryList={categoryList}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
          <BrandFilter
            brandList={brandList}
            selectedBrands={selectedBrands}
            onBrandChange={handleBrandChange}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên tên quần áo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              /> */}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {serviceList.map((item) => (
              <ServiceItem
                key={item.id}
                id={item.id!}
                sImgUrl={item.sImage ?? ""}
                sTitle={item.productTitle}
                sDescription={item.productDesc ?? ""}
                price={item.price}
                currencyCode={item.currencyCode}
                redirectToDetail={() => redirectToServiceDetail(item.id!)}
                onAddToWishlist={() => handleAddToWishlist(item.id!)}
                onAddToCart={() => handleAddToCart(item.id!)}
                onBuyNow={() => handleBuyNow(item.id!)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="pt-2">
            <PaginationTable
              currentPage={pagination?.currentPage ?? 1}
              totalPage={pagination?.totalPages ?? 1}
              onChange={(page) => onChangePage(page)}
              isLoading={loading}
              limit={serviceList?.length}
              total={pagination?.total ?? 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
