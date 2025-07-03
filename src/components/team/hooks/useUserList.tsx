import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { MetaPagination } from "@/types/base-response.type";
import { UserDto } from "@/types/user-type";
import { FilterUserDto, UserService } from "@/services/user.service";
import { toast } from "sonner";

interface Props {
  filter?: FilterUserDto;
}

export const useUserList = ({ filter }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [userList, setUserList] = useState<UserDto[]>([]);
  const [pagination, setPagination] = useState<MetaPagination>();
  const [filters, setFilters] = useState<FilterUserDto>({
    ...filter,
    limit: 4,
  });

  // Debounce the filters
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await UserService.filterUsers(debouncedFilters);
        if (response.data) {
          setUserList(response.data.body);
          setPagination(response.data.meta.pagination);
        }
      } catch (err) {
        const errorMessage = "Failed to fetch users list";
        toast.error(errorMessage, {
          description: (err as Error)?.message,
        });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedFilters]);

  const updateFilters = useCallback((newFilters: Partial<FilterUserDto>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

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

  const onChangeRole = useCallback(
    (role?: number) => {
      updateFilters({ role: role != undefined ? [role] : undefined });
    },
    [updateFilters]
  );

  const redirectToUserDetail = useCallback(
    (id: number) => {
      return router.push(`/user/${id}`);
    },
    [router]
  );

  return {
    pagination,
    userList,
    loading,
    error,
    filters,
    updateFilters,
    onChangePage,
    onChangeSearch,
    redirectToUserDetail,
  };
};
