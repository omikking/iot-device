import * as React from 'react';
import { Column } from '@tanstack/react-table';
import { LucideArrowDownUp, LucideArrowUpDown } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

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

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
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

Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      // 'ui-banshee-sticky ui-banshee-top-0 ui-banshee-z-10 ui-banshee-bg-neutral-4 ui-banshee-font-bold [&_tr]:ui-banshee-border-b-2 [&_tr]:ui-banshee-border-neutral-3 [&_tr]:ui-banshee-bg-neutral-1 [&_tr]:hover:ui-banshee-bg-transparent ui-banshee-text-sm ui-banshee-font-sandvik-text',
      'ui-banshee-sticky ui-banshee-top-0 ui-banshee-z-10 ui-banshee-bg-neutral-4 ui-banshee-font-bold [&_tr]:ui-banshee-border-b-2 [&_tr]:ui-banshee-border-neutral-3 [&_tr]:ui-banshee-bg-neutral-1 ui-banshee-text-sm ui-banshee-font-sandvik-text',

      className,
    )}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      '[&_tr:last-child]:ui-banshee-border-none [&_tr]:ui-banshee-border-neutral-1 ui-banshee-text-md ui-banshee-font-sandvik-text',
      className,
    )}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('ui-banshee-border-t ui-banshee-bg-neutral-1', className)}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'ui-banshee-bg-neutral-1 ui-banshee-transition-colors ui-banshee-border-b ui-banshee-border-neutral-3 hover:ui-banshee-bg-main-white/50 ui-banshee-duration-100 data-[state=selected]:ui-banshee-neutral-2 ',
      className,
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'ui-banshee-h-9 ui-banshee-sticky ui-banshee-font-bold ui-banshee-p-0 [&:first-child]:ui-banshee-text-center [&:nth-child(2)]:ui-banshee-text-center [&:nth-child(5)]:ui-banshee-text-right [&:last-child]:ui-banshee-flex ui-banshee-text-left [&:last-child]:ui-banshee-text-right ui-banshee-tracking-wide',
      className,
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'ui-banshee-border-b ui-banshee-border-neutral-3 [&:nth-child(2)]:ui-banshee-text-center [&:first-child]:ui-banshee-bg-neutral-2 [&:first-child]:ui-banshee-text-center [&:last-child]:ui-banshee-text-right ui-banshee-text-main-black ',
      className,
    )}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      'ui-banshee-mt-4 ui-banshee-text-sm ui-banshee-text-neutral-5',
      className,
    )}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

interface TableHeadWithSortingProps<TData> {
  column: Column<TData>;
  header: string;
  className?: string;
}

const TableHeadWithSorting = <TData,>({
  header,
  column,
  className,
}: TableHeadWithSortingProps<TData>) => {
  const isSorted = column.getIsSorted();
  const handleClick = () => {
    column.toggleSorting(isSorted === 'asc');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'ui-banshee-cursor-pointer ui-banshee-flex ui-banshee-justify-center',
        className,
      )}
    >
      {header}
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
    </button>
  );
};
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableHeadWithSorting,
  tableVariants,
};
