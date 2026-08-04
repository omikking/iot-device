import { type ReactNode } from 'react';

export interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className = 'text-right',...props }: TableCellProps) {
  return (
    <td className={`py-2.5 px-4 text-text ${className}`} {...props}>
      {children}
    </td>
  );
}
