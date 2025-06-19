import * as React from 'react';
import { Text } from '../base/text';
import { cn } from '../../lib/utils';
import { Badge } from '../base/badge';
import { LucideCheckCircle, LucideSearchX, LucideXCircle } from 'lucide-react';

export interface SpecificationProps {
  title: string;
  text: string;
  className?: string;
}

const Specification = ({ title, text, className }: SpecificationProps) => {
  const getBadge = (
    result: 'Pass' | 'Fail' | 'Abort',
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
        'ui-flex ui-flex-row ui-items-center ui-px-2 ui-border-b ui-border-neutral-3 ui-py-2 ui-break-words',
        className,
      )}
    >
      <Text className="ui-w-32" variant="small" color="muted">
        {title}
      </Text>
      {text === 'Pass' || text === 'Fail' || text === 'Abort' ? (
        <Badge variant={getBadge(text as 'Pass' | 'Fail' | 'Abort').variant}>
          {getBadge(text as 'Pass' | 'Fail' | 'Abort').icon}
          {text}
        </Badge>
      ) : (
        <Text className="ui-max-w-40" variant="small" color="foreground">
          {text}
        </Text>
      )}
    </div>
  );
};

export { Specification };
