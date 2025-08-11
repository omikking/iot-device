import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { LoadingSpinner } from './loading-spinner';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'ui-font-sandvik-text ui-inline-flex ui-items-center ui-justify-center ui-whitespace-nowrap ui-rounded-sm ui-transition ui-duration-200 disabled:ui-bg-neutral-2 disabled:ui-text-neutral-5 disabled:ui-cursor-not-allowed disabled:ui-pointer-events-none disabled:ui-border-neutral-2',
  {
    variants: {
      variant: {
        primary:
          'ui-bg-blue-primary ui-text-main-white hover:ui-bg-blue-2 focus:ui-bg-blue-1',
        secondary:
          'ui-bg-gold-primary ui-text-main-white hover:ui-bg-gold-3 hover:ui-text-main-black focus:ui-bg-gold-1 focus:ui-text-main-white',
        outline:
          'ui-bg-main-white ui-border ui-border-neutral-3 ui-text-main-black hover:ui-border-blue-2 focus:ui-border-blue-1',
        destructive:
          'ui-bg-main-white ui-text-error ui-border-opacity-30 ui-border ui-border-error hover:ui-border-opacity-100 focus:ui-bg-error focus:ui-text-main-white',
      },
      size: {
        small:
          'ui-h-9 ui-px-5 ui-text-sm ui-tracking-wide ui-gap-2 [&>svg]:ui-w-[18px] [&>svg]:ui-h-[18px]',
        large:
          'ui-h-[46px] ui-px-7 ui-text-md ui-gap-3 ui-pt-[1px] [&>svg]:ui-mb-0.5 [&>svg]:ui-w-5 [&>svg]:ui-h-5',
      },
      isWide: {
        true: 'ui-w-full',
        false: 'ui-size-fit',
      },
    },
    defaultVariants: {
      isWide: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Required<Pick<VariantProps<typeof buttonVariants>, 'variant' | 'size'>> {
  isWide?: boolean;
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isWide,
      asChild = false,
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'button';
    const childProps = asChild
      ? { className: cn(buttonVariants({ variant, size, isWide }), className) }
      : {};

    return (
      <Component
        className={cn(buttonVariants({ variant, size, isWide }), className)}
        ref={ref}
        {...props}
      >
        <>
          {isLoading && <LoadingSpinner className="ui-animate-spin" />}
          {React.isValidElement(children) && asChild
            ? React.cloneElement(children as React.ReactElement, childProps)
            : children}
        </>
      </Component>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
