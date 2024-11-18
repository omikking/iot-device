import { Headline } from '@gsp/ui';
import { LucideCircleCheckBig } from 'lucide-react';

interface SuccessMessageProps {
  title?: string;
  isVisible: boolean;
  children?: React.ReactNode;
}

export const SuccessMessage = ({
  isVisible,
  title = 'Successfully saved',
  children,
}: SuccessMessageProps) => {
  return (
    <>
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-32 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-center h-96 gap-4">
          <LucideCircleCheckBig size={30} className="text-success" />
          <Headline as="h3" color="foreground" variant="small" isBold>
            {title}
          </Headline>
        </div>
      </div>

      <div
        className={`transition-all duration-100 ${
          isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </>
  );
};
