"use client";
import { useCallback, useState } from "react";
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
import {
  CookieStorageEnum,
  LocalStorageEnum,
  ServiceBookingTypeEnum,
  ServiceType,
} from "@/enum/app.enums";
import { WishlistService } from "@/services/wishlist.service";
import { toast } from "sonner";
import { CartService } from "@/services/cart.service";
import { useSupplierList } from "./hooks/useSuppList";
import SupplierFilter from "./components/SupplierFilter";

const ShopPage = () => {
  const {
    filters,
    serviceList,
    loading,
    pagination,
    onChangePage,
    onChangeSearch,
    redirectToServiceDetail,
    updateFilters,
  } = useServiceList({
    filter: {
      limit: 12,
    },
  });

  const router = useRouter();
  const { brandList } = useBrandList({});
  const { categoryList } = useCategoryList({});
  const { supplierList } = useSupplierList({});

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);

  const handleSupplierChange = (supplierIds: number[]) => {
    setSelectedSuppliers(supplierIds);
    updateFilters({ supplierId: supplierIds, page: 1 }); // <-- truyền lên filter
  };

  const handleCategoryChange = (categoryIds: number[]) => {
    setSelectedCategories(categoryIds);
    updateFilters({ categoryId: categoryIds, page: 1 }); // <-- truyền lên filter
  };

  const handleBrandChange = (brandIds: number[]) => {
    setSelectedBrands(brandIds);
    updateFilters({ brandId: brandIds, page: 1 }); // <-- truyền lên filter
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

  // Cập nhật logic handleAddToCart - chỉ dành cho product type = 1 không có variant
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
            selected: 0,
          },
        ],
      });
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (err) {
      toast.error("Thêm vào giỏ hàng thất bại!");
    }
  }, []);

  // Logic xử lý click vào service item
  const handleServiceItemClick = useCallback(
    (item: any) => {
      // Nếu là product type = 1 và không có variants thì add to cart
      if (
        item.productType === ServiceType.Product &&
        (!item.variants || item.variants.length === 0)
      ) {
        handleAddToCart(item.id);
      } else {
        // Nếu có variants hoặc là workout type = 2 thì redirect đến detail
        redirectToServiceDetail(item.id);
      }
    },
    [handleAddToCart, redirectToServiceDetail]
  );

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
          <SupplierFilter
            supplierList={supplierList.filter((s) => typeof s.id === "number")}
            selectedSuppliers={selectedSuppliers}
            onSupplierChange={handleSupplierChange}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên dịch vụ"
                className="pl-10"
                onChange={(e) => onChangeSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {serviceList.map((item) => (
              <ServiceItem
                key={item.id}
                id={item.id!}
                productType={item.productType ?? ServiceType.Product}
                sImgUrl={item.sImage ?? ""}
                sTitle={item.productTitle}
                sDescription={item.productDesc ?? ""}
                price={item.price}
                currencyCode={item.currencyCode}
                bookingTypeId={
                  item.bookingTypeId ?? ServiceBookingTypeEnum.Regular
                }
                hasVariants={item.variants && item.variants.length > 0}
                onItemClick={() => handleServiceItemClick(item)}
                onAddToWishlist={() => handleAddToWishlist(item.id!)}
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
