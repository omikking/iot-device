import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  resize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, resize = true, ...props }, ref) => {
    return (
      <div className="ds-flex ds-flex-col ds-gap-2">
        <textarea
          className={cn(
            'ds-flex ds-min-w-[200px] ds-rounded-sm ds-border ds-border-neutral-3 ds-bg-main-white ds-px-4 ds-py-4 ds-text-md ds-ring-offset-0 placeholder:ds-text-neutral-5 hover:ds-border-blue-primary focus-visible:ds-outline-none ds-transition ease-in-out ds-duration-200 disabled:ds-bg-neutral-2 disabled:ds-text-neutral-5 disabled:ds-border-transparent ds-cursor-all-scroll',
            resize ? '' : 'ds-resize-none',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
