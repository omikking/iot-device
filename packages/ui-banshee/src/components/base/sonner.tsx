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
      className="ui-banshee-toaster ui-banshee-group ui-banshee-w-full"
      toastOptions={{
        classNames: {
          toast:
            'ui-banshee-group ui-banshee-toast ui-banshee-group-[.toaster]:ui-banshee-bg-background ui-banshee-group-[.toaster]:ui-banshee-text-foreground ui-banshee-group-[.toaster]:ui-banshee-border-border ui-banshee-group-[.toaster]:ui-banshee-shadow-lg',

          description:
            'ui-banshee-group-[.toast]:ui-banshee-text-muted-foreground',

          actionButton:
            'ui-banshee-group-[.toast]:ui-banshee-bg-primary ui-banshee-group-[.toast]:ui-banshee-text-primary-foreground',

          cancelButton:
            'ui-banshee-group-[.toast]:ui-banshee-bg-muted ui-banshee-group-[.toast]:ui-banshee-text-muted-foreground',
        },
        duration,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
