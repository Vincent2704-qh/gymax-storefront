import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { pagination } from '@/lib/utils';

type PaginationTabProps = {
  currentPage: number;
  totalPage: number;
  delta?: number;
  className?: string;
  onChange: (page: number) => void;
};

export const PaginationTab = ({
  className,
  currentPage,
  totalPage,
  delta = 2,
  onChange,
}: PaginationTabProps) => {
  const pages = useMemo(() => {
    return pagination(currentPage, totalPage, delta);
  }, [currentPage, delta, totalPage]);

  return (
    <Pagination className={className}>
      <PaginationContent>
        {currentPage > 1 ? (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled
              onClick={() =>
                onChange && currentPage > 1 && onChange(currentPage - 1)
              }
            />
          </PaginationItem>
        ) : (
          <Button
            variant="outline"
            className="border-0"
            size="sm"
            disabled={true}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
        )}

        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {typeof page === 'number' ? (
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={() => onChange && onChange(page)}
              >
                {page}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}

        {currentPage < totalPage ? (
          <PaginationItem>
            <PaginationNext
              // href="#"
              onClick={() => onChange(currentPage + 1)}
            />
          </PaginationItem>
        ) : (
          <Button
            variant="outline"
            className="border-0"
            size="sm"
            disabled={true}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </PaginationContent>
    </Pagination>
  );
};
