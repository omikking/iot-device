import React from 'react';
import { Button, Text } from '@gsp/ui';
import { LucideArrowLeft, LucideArrowRight } from 'lucide-react';

type PaginationProps = {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        disabled={currentPage <= 1}
        variant="outline"
        size="large"
        className="mt-4 mr-6"
        onClick={handlePreviousPage}
      >
        <LucideArrowLeft />
        Previous
      </Button>

      <Text color="foreground" variant="medium" className="mt-4">
        Page {currentPage}
      </Text>

      <Text color="muted" variant="small" className="mt-[18px]">
        / {totalPages}
      </Text>

      <Button
        disabled={currentPage === totalPages}
        variant="outline"
        size="large"
        className="mt-4 ml-6"
        onClick={handleNextPage}
      >
        <LucideArrowRight />
        Next
      </Button>
    </div>
  );
};
