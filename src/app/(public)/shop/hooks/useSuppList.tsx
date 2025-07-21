import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { MetaPagination } from "@/types/base-response.type";
import { toast } from "sonner";
import { Brand, Supplier } from "@/types/app-type.type";
import { FilterBrandCategory, BrandService } from "@/services/brand.service";
import {
  FilterSupplierDto,
  SupplierService,
} from "@/services/supplier.service";

interface Props {
  filter?: FilterSupplierDto;
}

export const useSupplierList = ({ filter }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [supplierList, setSupplier] = useState<Supplier[]>([]);
  const [pagination, setPagination] = useState<MetaPagination>();
  const [filters, setFilters] = useState<FilterSupplierDto>({
    ...filter,
    limit: filter?.limit ? filter.limit : 10,
  });

  // Debounce the filters
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await SupplierService.filterSuppliers(
          debouncedFilters
        );
        if (response.data) {
          setSupplier(response.data.body);
          setPagination(response.data.meta.pagination);
        }
      } catch (err) {
        const errorMessage = "Failed to fetch supplier list";
        toast.error(errorMessage, {
          description: (err as Error)?.message,
        });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
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
    supplierList,
    loading,
    error,
    filters,
    updateFilters,
    onChangePage,
    onChangeSearch,
  };
};
