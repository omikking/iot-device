import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';
import { useFormField } from './form';

const inputStyling = cva(
  'ui-flex ui-h-12 ui-w-full ui-border-neutral-3 ui-rounded ui-border ui-bg-main-white ui-px-4 ui-text-md ui-font-sandvik-text ui-text-main-black placeholder:ui-text-neutral-5 ui-outline-none hover:ui-border-blue-primary focus-visible:ui-border-blue-primary ui-transition ease-in-out ui-duration-200 disabled:ui-bg-neutral-2 disabled:ui-text-neutral-6 disabled:ui-border-none disabled:ui-pointer-events-none',
);

const errorStyling = cva(
  'ui-border-error hover:ui-border-error focus-visible:ui-border-error',
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputStyling> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { error } = useFormField();
    return (
      <input
        type={type}
        className={cn(inputStyling(), error && errorStyling(), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
