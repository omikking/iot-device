import * as React from 'react';
import { Text } from '../base/text';
import { cn } from '../../lib/utils';

export interface SpecificationProps {
  title: string;
  text: string;
  className?: string;
}

const Specification = ({ title, text, className }: SpecificationProps) => {
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
      <Text className="ui-max-w-32" variant="small" color="foreground">
        {text}
      </Text>
    </div>
  );
};

export { Specification };
