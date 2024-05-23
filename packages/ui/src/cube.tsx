import { type ReactNode } from 'react';

export function Cube({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="ui-w-24 ui-h-24 ui-bg-teal-800 ui-text-white ui-text-center ui-flex ui-items-center ui-justify-center">
      {children}
    </div>
  );
}
