import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { useFormField } from './form';

const inputStyling = cva(
  'ds-flex ds-w-full ds-h-12 ds-border-neutral-3 ds-rounded ds-border ds-bg-main-white ds-px-4 ds-text-md ds-font-sandvik-text ds-text-main-black placeholder:ds-text-neutral-5 ds-outline-none hover:ds-border-blue-primary focus-visible:ds-border-blue-primary ds-transition ease-in-out ds-duration-200 disabled:ds-bg-neutral-2 disabled:ds-text-neutral-5 disabled:ds-border-transparent disabled:ds-pointer-events-none',
);

const errorStyling = cva(
  'ds-border-error hover:ds-border-error focus-visible:ds-border-error',
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
