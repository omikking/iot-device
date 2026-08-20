'use client';

import React from 'react';
import { Text } from '@gsp/ui-core';

interface FormFieldLabelProps {
  label: string;
  children: React.ReactNode;
}

export function FormFieldLabel({ label, children }: FormFieldLabelProps) {
  return (
    <div className="space-y-1">
      <Text variant="small" color="foreground" >
        {label}
      </Text>
      {children}
    </div>
  );
}
