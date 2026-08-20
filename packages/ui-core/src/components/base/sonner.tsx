'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner> & {
  duration?: number;
};

const Toaster = ({ duration = 5000, ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="ds-toaster ds-group ds-w-full"
      toastOptions={{
        classNames: {
          toast:
            'ds-group ds-toast ds-group-[.toaster]:ds-bg-background ds-group-[.toaster]:ds-text-foreground ds-group-[.toaster]:ds-border-border ds-group-[.toaster]:ds-shadow-lg',

          description:
            'ds-group-[.toast]:ds-text-muted-foreground',

          actionButton:
            'ds-group-[.toast]:ds-bg-primary ds-group-[.toast]:ds-text-primary-foreground',

          cancelButton:
            'ds-group-[.toast]:ds-bg-muted ds-group-[.toast]:ds-text-muted-foreground',
        },
        duration,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
