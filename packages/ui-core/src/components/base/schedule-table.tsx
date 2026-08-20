import * as React from 'react';
import { Column } from '@tanstack/react-table';
import { cva, type VariantProps } from 'class-variance-authority';
import { LucideArrowDownUp, LucideArrowUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const tableVariants = cva(
  'ds-relative ds-w-full ds-bg-neutral-1',
  {
    variants: {
      variant: {
        border: 'ds-border-neutral-2',
        noBorder: 'ds-border-none',
      },
    },
    defaultVariants: {
      variant: 'border',
    },
  },
);

export interface ScheduleTableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {}

const ScheduleTable = React.forwardRef<HTMLTableElement, ScheduleTableProps>(
  ({ className, variant = 'border', ...props }, ref) => (
    <div className={cn(tableVariants({ variant }))}>
      <table
        ref={ref}
        className={cn(
          'ds-w-full ds-caption-bottom ds-table',
          className,
        )}
        {...props}
      />
    </div>
  ),
);

ScheduleTable.displayName = 'ScheduleTable';

const ScheduleTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      // 'ds-sticky ds-top-0 ds-border-y-2 ds-z-10 ds-bg-neutral-4 ds-font-bold [&_tr]:ds-border-b-2 [&_tr]:ds-border-neutral-3 [&_tr]:ds-bg-neutral-1 [&_tr]:hover:ds-bg-transparent ds-text-sm ds-font-sandvik-text',
      'ds-sticky ds-top-0 ds-border-y-2 ds-z-10 ds-bg-neutral-4 ds-font-bold [&_tr]:ds-border-b-2 [&_tr]:ds-border-neutral-3 [&_tr]:ds-bg-neutral-1 ds-text-sm ds-font-sandvik-text',
      className,
    )}
    {...props}
  />
));

ScheduleTableHeader.displayName = 'ScheduleTableHeader';

const ScheduleTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'ds-h-9 ds-sticky ds-font-bold ds-p-0 ds-text-left ds-tracking-wide',
      className,
    )}
    {...props}
  />
));

ScheduleTableHead.displayName = 'ScheduleTableHead';

const ScheduleTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'ds-bg-neutral-1 ds-transition-colors ds-border-b ds-border-neutral-3 hover:ds-bg-main-white/50 ds-duration-100',
      className,
    )}
    {...props}
  />
));

ScheduleTableRow.displayName = 'ScheduleTableRow';

const ScheduleTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'ds-border-b ds-border-neutral-3 ds-text-main-black ',
      className,
    )}
    {...props}
  />
));
ScheduleTableCell.displayName = 'ScheduleTableCell';

interface ScheduleTableHeadWithSortingProps<TData> {
  column: Column<TData>;
  header: string;
  className?: string;
}

const ScheduleTableHeadWithSorting = <TData,>({
  header,
  column,
  className,
}: ScheduleTableHeadWithSortingProps<TData>) => {
  const isSorted = column.getIsSorted();
  const handleClick = () => {
    column.toggleSorting(isSorted === 'asc');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'ds-cursor-pointer ds-flex ds-justify-center ds-gap-1',
        className,
      )}
    >
      {!isSorted && (
        <LucideArrowUpDown
          size="16"
          className="ds-ml-1 ds-mt-0.5 ds-text-neutral-4"
        />
      )}
      {isSorted === 'asc' && (
        <LucideArrowUpDown
          size="16"
          className="ds-ml-1 ds-mt-0.5"
        />
      )}
      {isSorted === 'desc' && (
        <LucideArrowDownUp
          size="16"
          className="ds-ml-1 ds-mt-0.5"
        />
      )}
      {header}
    </button>
  );
};

export {
  ScheduleTable,
  ScheduleTableHead,
  ScheduleTableHeader,
  ScheduleTableRow,
  ScheduleTableCell,
  ScheduleTableHeadWithSorting,
};
