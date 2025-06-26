import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { MetaPagination } from "@/types/base-response.type";
import { toast } from "sonner";
import { CartService, FilterCart } from "@/services/cart.service";
import { CartItem } from "@/types/app-type.type";

interface Props {
  filter?: FilterCart;
}

export const useFilterCartItem = ({ filter }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [pagination, setPagination] = useState<MetaPagination>();
  const [filters, setFilters] = useState<FilterCart>({
    ...filter,
    limit: filter?.limit ? filter.limit : 10,
    customerId: filter?.customerId,
  });

  // Debounce the filters
  const debouncedFilters = useDebounce(filters, 500);

  console.log("filter cart", filter);

  // Effect to update filters when props change
  useEffect(() => {
    if (filter) {
      setFilters((prev) => ({
        ...prev,
        ...filter,
        limit: filter.limit || prev.limit || 10,
      }));
    }
  }, [filter?.customerId, filter?.limit, filter?.page]); // Watch specific properties

  const fetchCartItems = useCallback(async (fetchFilters: FilterCart) => {
    // Chỉ gọi API khi customerId đã có giá trị
    if (!fetchFilters.customerId) {
      console.log("No customerId, skipping API call");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching cart items with filters:", fetchFilters);
      const response = await CartService.filterCartItem(fetchFilters);
      if (response.data) {
        setCartItems(response.data.body);
        setPagination(response.data.meta.pagination);
      }
    } catch (err) {
      const errorMessage = "Failed to fetch cart items";
      toast.error(errorMessage, {
        description: (err as Error)?.message,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartItems(debouncedFilters);
  }, [debouncedFilters, fetchCartItems]);

  const updateFilters = useCallback((newFilters: Partial<FilterCart>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const onChangePage = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  const refetch = useCallback(() => {
    fetchCartItems(filters);
  }, [filters, fetchCartItems]);

  return {
    pagination,
    cartItems,
    loading,
    error,
    filters,
    updateFilters,
    onChangePage,
    refetch,
  };
};
