import * as React from 'react';
import { Text } from '../base/text';
import { cn } from '../../lib/utils';
import { Badge } from '../base/badge';
import { LucideCheckCircle, LucideSearchX, LucideXCircle } from 'lucide-react';

export interface SpecificationProps {
  title: string;
  text: string;
  isWide?: boolean;
  isFullWidth?: boolean;
  className?: string;
}

type ResultType = 'Pass' | 'Fail' | 'Abort';

const Specification = ({
  title,
  text,
  className,
  isWide = false,
  isFullWidth = false,
}: SpecificationProps) => {
  const getBadge = (
    result: ResultType,
  ): {
    variant: 'success' | 'destructive' | 'warning';
    icon: React.ReactNode;
  } => {
    switch (result) {
      case 'Pass':
        return { variant: 'success', icon: <LucideCheckCircle /> };
      case 'Fail':
        return { variant: 'destructive', icon: <LucideXCircle /> };
      case 'Abort':
        return { variant: 'warning', icon: <LucideSearchX /> };
    }
  };

  return (
    <div
      className={cn(
        'ui-flex ui-flex-row ui-items-center ui-px-2 ui-border-b ui-border-neutral-3 ui-py-2',
        className,
      )}
    >
      <Text
        variant="small"
        color="muted"
        className={cn(
          isWide ? 'ui-w-36' : 'ui-w-32',
          'ui-flex-shrink-0 ui-break-words ui-pr-4',
        )}
      >
        {title}
      </Text>
      {text === 'Pass' || text === 'Fail' || text === 'Abort' ? (
        <Badge variant={getBadge(text as ResultType).variant}>
          {getBadge(text as ResultType).icon}
          {text}
        </Badge>
      ) : (
        <Text
          className={isFullWidth ? 'ui-max-w-full' : 'ui-max-w-52'}
          variant="small"
          color="foreground"
        >
          {text}
        </Text>
      )}
    </div>
  );
};

export { Specification };
