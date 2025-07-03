import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { MetaPagination } from "@/types/base-response.type";
import { toast } from "sonner";
import {
  FilterServiceDto,
  GymmaxService,
} from "@/services/gymmax-service.service";
import { ServiceDto } from "@/types/service-type";

interface Props {
  filter?: FilterServiceDto;
}

export const useServiceList = ({ filter }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [serviceList, setServiceList] = useState<ServiceDto[]>([]);
  const [pagination, setPagination] = useState<MetaPagination>();
  const [filters, setFilters] = useState<FilterServiceDto>({
    ...filter,
    limit: filter?.limit ? filter.limit : 10,
  });

  // Debounce the filters
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await GymmaxService.filterService(debouncedFilters);
        if (response.data) {
          setServiceList(response.data.body);
          setPagination(response.data.meta.pagination);
        }
      } catch (err) {
        const errorMessage = "Failed to fetch service list";
        toast.error(errorMessage, {
          description: (err as Error)?.message,
        });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [debouncedFilters]);

  const updateFilters = useCallback((newFilters: Partial<FilterServiceDto>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const onChangePage = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  const onChangeSearch = useCallback(
    (title?: string) => {
      updateFilters({ title });
    },
    [updateFilters]
  );

  const onChangeStatus = useCallback(
    (status?: number) => {
      updateFilters({ status: status != undefined ? [status] : undefined });
    },
    [updateFilters]
  );

  const redirectToServiceDetail = useCallback(
    (id: number) => {
      return router.push(`/service/${id}`);
    },
    [router]
  );

  return {
    pagination,
    serviceList,
    loading,
    error,
    filters,
    updateFilters,
    onChangePage,
    onChangeSearch,
    redirectToServiceDetail,
  };
};
