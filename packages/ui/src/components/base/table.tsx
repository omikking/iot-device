import * as React from 'react';

import { cn } from '../../lib/utils';

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="ui-relative ui-w-full ui-min-w-[1320px] ui-border-2 ui-border-neutral-2 ui-py-12 ui-px-8 ui-bg-neutral-1 ui-overflow-auto">
    <table
      ref={ref}
      className={cn('ui-w-full ui-caption-bottom', className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      '[&_tr]:ui-border-b [&_tr]:ui-border-neutral-1 [&_tr]:ui-bg-neutral-1 [&_tr]:hover:ui-bg-transparent ui-text-sm ui-font-sandvik-text',
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
      '[&_tr:last-child]:ui-border-none [&_tr]:ui-border-b-[6px] [&_tr]:ui-border-neutral-1 ui-text-md ui-font-sandvik-text',
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
    className={cn(
      'ui-border-t ui-bg-neutral-1 [&>tr]:last:ui-border-b-0',
      className,
    )}
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
      'ui-py-6 ui-bg-main-white ui-transition-colors hover:ui-bg-main-white/50 data-[state=selected]:ui-neutral-2',
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
      'ui-h-12 ui-px-2 [&:first-child]:ui-pl-6 [&:last-child]:ui-flex [&:last-child]:ui-justify-end [&:last-child]:ui-items-center [&:last-child]:ui-pr-6 ui-text-left ui-align-middle ui-font-regular ui-tracking-wide ui-text-neutral-5 [&:has([role=checkbox])]:ui-pr-0',
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
      'ui-px-2 ui-py-4 [&:first-child]:ui-pl-6 [&:last-child]:ui-flex [&:last-child]:ui-justify-end [&:last-child]:ui-items-center [&:last-child]:ui-pr-6 ui-align-middle ui-text-main-black [&:has([role=checkbox])]:ui-pr-0',
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
    className={cn('ui-mt-4 ui-text-sm ui-text-neutral-5', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
