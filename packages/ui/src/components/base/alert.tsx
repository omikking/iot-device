import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle, Info, TriangleAlert, CircleX } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Text } from './text';

const iconSize = 20;

const alertVariants = cva(
  'ui-w-[430px] ui-p-4 ui-flex justify-between ui-space-x-3 ui-rounded-lg ui-shadow-custom',
  {
    variants: {
      variant: {
        success: 'ui-bg-success-3 ui-text-neutral-6',
        info: 'ui-bg-blue-3 ui-text-blue-primary',
        error: 'ui-bg-error-3 ui-text-error',
        warning: 'ui-bg-warning-3 ui-text-neutral-6',
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
      <div className="ui-flex ui-items-center ui-space-x-3">
        <div className="ui-flex ui-h-full ui-pt-[5px]">
          {variant === 'success' && <CheckCircle size={iconSize} />}
          {variant === 'info' && <Info size={iconSize} />}
          {variant === 'error' && <CircleX size={iconSize} />}
          {variant === 'warning' && <TriangleAlert size={iconSize} />}
        </div>
        <div className="ui-flex-1">
          <div className="ui-flex ui-items-center ui-justify-between">
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
      className={(cn(className), 'ui-mt-0.5')}
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
