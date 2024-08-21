import * as React from 'react';
import { Text } from './text';

export interface SpecificationProps {
  title: string;
  text: string;
}

const Specification = ({ title, text }: SpecificationProps) => {
  return (
    <div className="ui-flex ui-flex-row ui-px-2 ui-border-b ui-border-neutral-3  ui-py-2">
      <div className="ui-w-32">
        <Text variant="small" color="muted">
          {title}
        </Text>
      </div>
      <div className="ui-max-w-32">
        <Text variant="small" color="foreground">
          {text}
        </Text>
      </div>
    </div>
  );
};

export { Specification };
