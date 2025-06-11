import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle, Info, TriangleAlert, CircleX } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Text } from './text';

const iconSize = 18;

const alertVariants = cva(
  'ui-w-[430px] ui-p-4 ui-flex justify-between ui-space-x-3 ui-rounded-lg ui-shadow-custom',
  {
    variants: {
      variant: {
        success: 'ui-bg-green-100 ui-text-green-800',
        info: 'ui-bg-blue-100 ui-text-blue-800',
        error: 'ui-bg-red-100 ui-text-red-800',
        warning: 'ui-bg-yellow-100 ui-text-yellow-800',
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
        <div className="ui-flex h-full ui-pt-[5px]">
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

type AlertTextProps = React.HTMLAttributes<HTMLElement> & {
  variant: AlertVariant;
  children: React.ReactNode;
};

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTextProps>(
  ({ className, children }, ref) => (
    <Text
      variant="medium"
      className={cn(className)}
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
      variant="small"
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
