import { Skeleton } from "./ui/skeleton";
import { PaginationTab } from "./pagination-tab";

type PaginationTableProps = {
  isLoading: boolean;
  currentPage: number;
  limit: number;
  total: number;
  totalPage: number;
  delta?: number;
  className?: string;
  onChange: (page: number) => void;
};

export const PaginationTable = ({
  isLoading,
  currentPage,
  limit,
  total,
  totalPage,
  delta,
  className,
  onChange,
}: PaginationTableProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {isLoading ? (
          <Skeleton className="h-4 w-40" />
        ) : (
          `Showing ${limit} of ${total} results`
        )}
      </div>
      <div className="flex gap-2">
        <PaginationTab
          currentPage={currentPage}
          totalPage={totalPage}
          onChange={onChange}
          delta={delta}
          className={className}
        />
      </div>
    </div>
  );
};
