import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { MetaPagination } from "@/types/base-response.type";
import { toast } from "sonner";
import { Brand } from "@/types/app-type.type";
import { FilterBrandCategory, BrandService } from "@/services/brand.service";

interface Props {
  filter?: FilterBrandCategory;
}

export const useBrandList = ({ filter }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [brandList, setBrandList] = useState<Brand[]>([]);
  const [pagination, setPagination] = useState<MetaPagination>();
  const [filters, setFilters] = useState<FilterBrandCategory>({
    ...filter,
    limit: filter?.limit ? filter.limit : 10,
  });

  // Debounce the filters
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await BrandService.filterBrand(debouncedFilters);
        if (response.data) {
          setBrandList(response.data.body);
          setPagination(response.data.meta.pagination);
        }
      } catch (err) {
        const errorMessage = "Failed to fetch brand list";
        toast.error(errorMessage, {
          description: (err as Error)?.message,
        });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [debouncedFilters]);

  const updateFilters = useCallback(
    (newFilters: Partial<FilterBrandCategory>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const onChangePage = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  const onChangeSearch = useCallback(
    (search?: string) => {
      updateFilters({ search });
    },
    [updateFilters]
  );

  return {
    pagination,
    brandList,
    loading,
    error,
    filters,
    updateFilters,
    onChangePage,
    onChangeSearch,
  };
};
