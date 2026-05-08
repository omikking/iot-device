import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle, Info, TriangleAlert, CircleX } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Text } from './text';

const iconSize = 20;

const alertVariants = cva(
  'ui-banshee-w-[430px] ui-banshee-p-4 ui-banshee-flex ui-banshee-justify-between ui-banshee-space-x-3 ui-banshee-rounded-lg ui-banshee-shadow-custom',
  {
    variants: {
      variant: {
        success: 'ui-banshee-bg-success-3 ui-banshee-text-neutral-6',
        info: 'ui-banshee-bg-blue-3 ui-banshee-text-blue-primary',
        error: 'ui-banshee-bg-error-3 ui-banshee-text-error',
        warning: 'ui-banshee-bg-warning-3 ui-banshee-text-neutral-6',
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
      <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-space-x-3">
        <div className="ui-banshee-flex ui-banshee-h-full ui-banshee-pt-[5px]">
          {variant === 'success' && <CheckCircle size={iconSize} />}
          {variant === 'info' && <Info size={iconSize} />}
          {variant === 'error' && <CircleX size={iconSize} />}
          {variant === 'warning' && <TriangleAlert size={iconSize} />}
        </div>
        <div className="ui-banshee-flex-1">
          <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-between">
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
      className={(cn(className), 'ui-banshee-mt-0.5')}
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
