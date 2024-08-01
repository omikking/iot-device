import * as React from 'react';

import { cn } from '../lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'ui-flex ui-min-h-[100px] ui-min-w-[200px] ui-rounded-sm ui-border ui-border-neutral-3 ui-bg-main-white ui-px-4 ui-py-4 ui-text-md ui-ring-offset-0 placeholder:ui-text-neutral-5 hover:ui-border-blue-primary focus-visible:ui-outline-none ui-transition ease-in-out ui-duration-200 disabled:ui-bg-neutral-2 disabled:ui-text-neutral-5 disabled:ui-border-none disabled:ui-pointer-events-none',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
