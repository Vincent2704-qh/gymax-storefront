import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { MetaPagination } from "@/types/base-response.type";
import { toast } from "sonner";
import { FilterCategoryDto } from "@/services/category.service";
import { Category } from "@/types/app-type.type";
import { CategoryService } from "@/services/category.service";

interface Props {
  filter?: FilterCategoryDto;
}

export const useCategoryList = ({ filter }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<MetaPagination>();
  const [filters, setFilters] = useState<FilterCategoryDto>({
    ...filter,
    limit: filter?.limit ? filter.limit : 10,
  });

  // Debounce the filters
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await CategoryService.filterCategory(debouncedFilters);
        if (response.data) {
          setCategoryList(response.data.body);
          setPagination(response.data.meta.pagination);
        }
      } catch (err) {
        const errorMessage = "Failed to fetch category list";
        toast.error(errorMessage, {
          description: (err as Error)?.message,
        });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [debouncedFilters]);

  const updateFilters = useCallback(
    (newFilters: Partial<FilterCategoryDto>) => {
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
    categoryList,
    loading,
    error,
    filters,
    updateFilters,
    onChangePage,
    onChangeSearch,
  };
};
