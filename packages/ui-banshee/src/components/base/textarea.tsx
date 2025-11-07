import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  resize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, resize = true, ...props }, ref) => {
    return (
      <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-2">
        <textarea
          className={cn(
            'ui-banshee-flex ui-banshee-min-w-[200px] ui-banshee-rounded-sm ui-banshee-border ui-banshee-border-neutral-3 ui-banshee-bg-main-white ui-banshee-px-4 ui-banshee-py-4 ui-banshee-text-md ui-banshee-ring-offset-0 placeholder:ui-banshee-text-neutral-5 hover:ui-banshee-border-blue-primary focus-visible:ui-banshee-outline-none ui-banshee-transition ease-in-out ui-banshee-duration-200 disabled:ui-banshee-bg-neutral-2 disabled:ui-banshee-text-neutral-5 disabled:ui-banshee-border-transparent ui-banshee-cursor-all-scroll',
            resize ? '' : 'ui-banshee-resize-none',
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
