import * as React from 'react';
import { Headline } from './headline';
import { Badge } from './badge';
import {
  LucideCircleCheckBig,
  LucideClipboardList,
  LucideOctagonAlert,
} from 'lucide-react';

import { Textarea } from './textarea';
import { Text } from './text';
import { Button } from './button';
import { Specification } from './specification';

interface HazardCardProps {
  dateTitle: string;
  isHazard: boolean;
  boltDescription: string;
  boltInfoItems: { title: string; text: string }[];
}

export const HazardCard = ({
  dateTitle,
  isHazard,
  boltDescription,
  boltInfoItems,
}: HazardCardProps) => {
  return (
    <div className="ui-w-[644px] ui-flex ui-flex-col ui-border-2 ui-border-neutral-2">
      <div className="ui-flex ui-flex-row ui-border-b ui-border-neutral-2 ui-p-6 ui-items-center ui-justify-between">
        <Headline variant="smallBold" as="h3" color="foreground">
          {dateTitle}
        </Headline>
        {isHazard && (
          <Badge variant="destructive">
            <LucideOctagonAlert />
            Hazard
          </Badge>
        )}
      </div>

      <div className="ui-w-full ui-flex ui-flex-row ui-gap-6 ui-py-4 ui-px-6">
        <div className="ui-pt-6">
          {boltInfoItems.map((item) => (
            <Specification
              key={`${item.title}-${item.text}`}
              title={item.title}
              text={item.text}
            />
          ))}
        </div>

        <div className="ui-w-1/2 ui-flex ui-flex-col ui-gap-2">
          <Text variant="small" color="foreground">
            Description
          </Text>
          <Textarea value={boltDescription} className="ui-min-h-32" disabled />
        </div>
      </div>

      <div className="ui-flex flex-row ui-justify-end ui-py-4 ui-px-6 ui-gap-4">
        {isHazard && (
          <Button variant="primary" size="small">
            <LucideCircleCheckBig />
            Complete
          </Button>
        )}
        <Button variant="outline" size="small">
          <LucideClipboardList />
          View more
        </Button>
      </div>
    </div>
  );
};
