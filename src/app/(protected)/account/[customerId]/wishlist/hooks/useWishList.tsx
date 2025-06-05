import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { MetaPagination } from "@/types/base-response.type";
import { toast } from "sonner";
import {
  WishlistService,
  FilterWishlistDto,
} from "@/services/wishlist.service";
import { Wishlist } from "@/types/app-type.type";

interface Props {
  filter?: FilterWishlistDto;
}

export const useWishlist = ({ filter }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [pagination, setPagination] = useState<MetaPagination>();
  const [filters, setFilters] = useState<FilterWishlistDto>({
    ...filter,
    limit: filter?.limit ? filter.limit : 10,
  });

  // Debounce the filters
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await WishlistService.filterWishlist(debouncedFilters);
        if (response.data) {
          setWishlist(response.data.body);
          setPagination(response.data.meta.pagination);
        }
      } catch (err) {
        const errorMessage = "Failed to fetch wishlist";
        toast.error(errorMessage, {
          description: (err as Error)?.message,
        });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [debouncedFilters]);

  const updateFilters = useCallback(
    (newFilters: Partial<FilterWishlistDto>) => {
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
    wishlist,
    loading,
    error,
    filters,
    updateFilters,
    onChangePage,
    onChangeSearch,
  };
};
