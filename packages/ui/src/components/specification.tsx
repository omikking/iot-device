import * as React from 'react';
import { Text } from './text';
import { cn } from '../lib/utils';

export interface SpecificationProps {
  title: string;
  text: string;
  className?: string;
}

const Specification = ({ title, text, className }: SpecificationProps) => {
  return (
    <div
      className={cn(
        'flex flex-row items-center px-2 border-b border-neutral-3 py-2 break-words',
        className,
      )}
    >
      <Text className="w-32" variant="small" color="muted">
        {title}
      </Text>
      <Text className="max-w-32" variant="small" color="foreground">
        {text}
      </Text>
    </div>
  );
};

export { Specification };
