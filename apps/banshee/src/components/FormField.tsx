'use client';
import React from 'react';
import { Text } from '@gsp/ui-banshee';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="ui-banshee-space-y-2">
      <Text variant="medium" color="foreground">
        {label}
      </Text>
      {children}
    </div>
  );
}

interface StaticFieldProps {
  label: string;
  value?: string | number | null;
}

export function StaticField({ label, value }: StaticFieldProps) {
  return (
    <div className="ui-banshee-space-y-1">
      <Text variant="medium" color="foreground">
        {label}
      </Text>
      <Text variant="medium" color="foreground">
        {value ?? '—'}
      </Text>
    </div>
  );
}
