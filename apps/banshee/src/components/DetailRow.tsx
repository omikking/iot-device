'use client';

import React, { memo } from 'react';
import { Text } from '@gsp/ui-banshee';

export interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

/** Label/value row used by the banshee detail modal and dashboard detail panel. */
export const DetailRow = memo(({ label, value }: DetailRowProps) => (
  <div className="ui-banshee-flex ui-banshee-items-start ui-banshee-py-2 ui-banshee-border-b ui-banshee-border-neutral-2 ui-banshee-text-base">
    <Text
      variant="medium"
      color="foreground"
      className="ui-banshee-w-1/2 ui-banshee-pr-4"
    >
      {label}
    </Text>
    <Text
      variant="medium"
      color="foreground"
      className="ui-banshee-text-main-black ui-banshee-w-1/2 ui-banshee-break-words"
    >
      {value ?? 'N/A'}
    </Text>
  </div>
));
DetailRow.displayName = 'DetailRow';
