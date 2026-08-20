import * as React from 'react';
import { Column } from '@tanstack/react-table';
import {
  LucideArrowDownUp,
  LucideArrowUpDown,
  LucideFilter,
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Text } from './text';

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

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant = 'border', ...props }, ref) => (
    <div className={cn(tableVariants({ variant }), className)} ref={ref}>
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

Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      // 'ds-sticky ds-top-0 ds-z-10 ds-bg-neutral-4 ds-font-bold [&_tr]:ds-border-b-2 [&_tr]:ds-border-neutral-3 [&_tr]:ds-bg-neutral-1 [&_tr]:hover:ds-bg-transparent ds-text-sm ds-font-sandvik-text',
      'ds-sticky ds-top-0 ds-z-10 ds-bg-neutral-4 ds-font-bold [&_tr]:ds-border-b-2 [&_tr]:ds-border-neutral-3 [&_tr]:ds-bg-neutral-1 ds-text-sm ds-font-sandvik-text',

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
      '[&_tr:last-child]:ds-border-none [&_tr]:ds-border-neutral-1 ds-text-md ds-font-sandvik-text',
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
    className={cn('ds-border-t ds-bg-neutral-1', className)}
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
      'ds-bg-neutral-1 ds-transition-colors ds-border-b ds-border-neutral-3 ds-duration-100 data-[state=selected]:ds-neutral-2 ',
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
      'ds-h-9 ds-sticky ds-font-bold ds-p-0 [&:first-child]:ds-text-center [&:nth-child(2)]:ds-text-center [&:nth-child(5)]:ds-text-right [&:last-child]:ds-flex ds-text-left [&:last-child]:ds-text-right ds-tracking-wide',
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
      'ds-border-b ds-border-neutral-3 [&:nth-child(2)]:ds-text-center [&:first-child]:ds-bg-neutral-2 [&:first-child]:ds-text-center [&:last-child]:ds-text-right ds-text-main-black ',
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
      'ds-mt-4 ds-text-sm ds-text-neutral-5',
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
        'ds-cursor-pointer ds-flex ds-justify-center ds-items-center',
        className,
      )}
    >
      {header}
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
    </button>
  );
};

interface TableHeadWithFilterProps {
  header: string;
  className?: string;
  children?: React.ReactNode;
}

const TableHeadWithFilter = ({
  header,
  className,
  children,
}: TableHeadWithFilterProps) => {
  return (
    <div
      className={cn(
        'ds-flex ds-items-center ds-gap-1.5 ds-px-3',
        className,
      )}
    >
      <LucideFilter size={11} className="ds-text-neutral-5" />
      {children || (
        <Text
          variant="small"
          color="foreground"
          className="ds-font-bold"
        >
          {header}
        </Text>
      )}
    </div>
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
  TableHeadWithFilter,
  tableVariants,
};
