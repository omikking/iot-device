import * as React from 'react';
import { Column } from '@tanstack/react-table';
import { cva, type VariantProps } from 'class-variance-authority';
import { LucideArrowDownUp, LucideArrowUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const tableVariants = cva(
  'ui-banshee-relative ui-banshee-w-full ui-banshee-bg-neutral-1',
  {
    variants: {
      variant: {
        border: 'ui-banshee-border-neutral-2',
        noBorder: 'ui-banshee-border-none',
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
    <div className={cn(tableVariants({ variant }), className)} ref={ref}>
      <table
        ref={ref}
        className={cn(
          'ui-banshee-w-full ui-banshee-caption-bottom ui-banshee-table',
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
      // 'ui-banshee-sticky ui-banshee-top-0 ui-banshee-border-y-2 ui-banshee-z-10 ui-banshee-bg-neutral-4 ui-banshee-font-bold [&_tr]:ui-banshee-border-b-2 [&_tr]:ui-banshee-border-neutral-3 [&_tr]:ui-banshee-bg-neutral-1 [&_tr]:hover:ui-banshee-bg-transparent ui-banshee-text-sm ui-banshee-font-sandvik-text',
      'ui-banshee-sticky ui-banshee-top-0 ui-banshee-border-y-2 ui-banshee-z-10 ui-banshee-bg-neutral-4 ui-banshee-font-bold [&_tr]:ui-banshee-border-b-2 [&_tr]:ui-banshee-border-neutral-3 [&_tr]:ui-banshee-bg-neutral-1 ui-banshee-text-sm ui-banshee-font-sandvik-text',
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
      'ui-banshee-h-9 ui-banshee-sticky ui-banshee-font-bold ui-banshee-p-0 ui-banshee-text-left ui-banshee-tracking-wide',
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
      'ui-banshee-bg-neutral-1 ui-banshee-transition-colors ui-banshee-border-b ui-banshee-border-neutral-3 hover:ui-banshee-bg-main-white/50 ui-banshee-duration-100',
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
      'ui-banshee-border-b ui-banshee-border-neutral-3 ui-banshee-text-main-black ',
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
        'ui-banshee-cursor-pointer ui-banshee-flex ui-banshee-justify-center ui-banshee-gap-1',
        className,
      )}
    >
      {!isSorted && (
        <LucideArrowUpDown
          size="16"
          className="ui-banshee-ml-1 ui-banshee-mt-0.5 ui-banshee-text-neutral-4"
        />
      )}
      {isSorted === 'asc' && (
        <LucideArrowUpDown
          size="16"
          className="ui-banshee-ml-1 ui-banshee-mt-0.5"
        />
      )}
      {isSorted === 'desc' && (
        <LucideArrowDownUp
          size="16"
          className="ui-banshee-ml-1 ui-banshee-mt-0.5"
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
