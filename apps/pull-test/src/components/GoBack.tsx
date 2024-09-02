'use client';
import * as React from 'react';
import { LucideMoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Text } from '@gsp/ui';

// Moving this to shared folder causes unexpected css bugs. I have created one for each project.

export const GoBack = () => {
  const router = useRouter();

  return (
    <Text
      variant="medium"
      color="foreground"
      className="ui-absolute ui-top-28 ui-left-10 ui-flex ui-gap-2.5 ui-cursor-pointer group"
      onClick={() => {
        router.back();
      }}
    >
      <LucideMoveLeft className="ui-transition-all ui-ease-in-out ui-opacity-50 group-hover:opacity-100 group-hover:translate-x-[-4px]" />
      Go back
    </Text>
  );
};
