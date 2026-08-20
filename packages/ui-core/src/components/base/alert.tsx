import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle, Info, TriangleAlert, CircleX } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Text } from './text';

const iconSize = 20;

const alertVariants = cva(
  'ds-w-[430px] ds-p-4 ds-flex ds-justify-between ds-space-x-3 ds-rounded-lg ds-shadow-custom',
  {
    variants: {
      variant: {
        success: 'ds-bg-success-3 ds-text-neutral-6',
        info: 'ds-bg-blue-3 ds-text-blue-primary',
        error: 'ds-bg-error-3 ds-text-error',
        warning: 'ds-bg-warning-3 ds-text-neutral-6',
      },
    },
    defaultVariants: {
      variant: 'success',
    },
  },
);

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant = 'success', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <div className="ds-flex ds-items-center ds-space-x-3">
        <div className="ds-flex ds-h-full ds-pt-[5px]">
          {variant === 'success' && <CheckCircle size={iconSize} />}
          {variant === 'info' && <Info size={iconSize} />}
          {variant === 'error' && <CircleX size={iconSize} />}
          {variant === 'warning' && <TriangleAlert size={iconSize} />}
        </div>
        <div className="ds-flex-1">
          <div className="ds-flex ds-items-center ds-justify-between">
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
});
Alert.displayName = 'Alert';

interface AlertTextProps extends React.HTMLAttributes<HTMLElement> {
  variant: AlertVariant;
  children: React.ReactNode;
}

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTextProps>(
  ({ className, children }, ref) => (
    <Text
      variant="large"
      className={(cn(className), 'ds-mt-0.5')}
      ref={ref}
      as="span"
      color={null}
    >
      {children}
    </Text>
  ),
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertTextProps>(
  ({ className, children }, ref) => (
    <Text
      variant="medium"
      className={cn(className)}
      ref={ref}
      as="p"
      color={null}
    >
      {children}
    </Text>
  ),
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
