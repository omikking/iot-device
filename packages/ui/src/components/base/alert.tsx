import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle, Info, TriangleAlert, CircleX, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const ICON_SIZE = 18;
const alertVariants = cva(
  'ui-w-[430px] ui-p-4 ui-flex justify-between ui-space-x-3 ui-rounded-lg ',
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

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, children, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
      //@ it should be moved in the tailwind component.
      //@ need to add box shadow in the tailwind config.
      style={{
        boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div className="ui-flex ui-items-center ui-space-x-3">
        <div className="ui-flex h-full ">
          {variant === 'success' && <CheckCircle size={ICON_SIZE} />}
          {variant === 'info' && <Info size={ICON_SIZE} />}
          {variant === 'error' && <CircleX size={ICON_SIZE} />}
          {variant === 'warning' && <TriangleAlert size={ICON_SIZE} />}
        </div>
        <div className="ui-flex-1">
          <div className="ui-flex ui-items-center ui-justify-between">
            <div>{children}</div>
          </div>
        </div>
      </div>

      <button className="flex " type="reset" onClick={handleClose}>
        <div className="ui-bg-white ui-h-fit ui-rounded-lg ui-p-[2px]">
          <X size={14} />
        </div>
      </button>
    </div>
  );
});
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'font-sandvik-sans font-normal text-base leading-20 tracking-tight',
      className,
    )}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('ui-text-sm ui-leading-18', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
