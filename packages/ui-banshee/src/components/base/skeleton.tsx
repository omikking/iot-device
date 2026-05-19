import { cn } from '../../lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'ui-banshee-animate-pulse ui-banshee-rounded-md ui-banshee-bg-muted',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
