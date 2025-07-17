'use client';
import * as React from 'react';
import { LucideMoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Text } from '@gsp/ui';

export const GoBack = () => {
  const router = useRouter();

  return (
    <Text
      variant="medium"
      color="foreground"
      className="absolute top-28 left-10 flex gap-2.5 cursor-pointer group"
      onClick={() => {
        router.back();
      }}
    >
      <LucideMoveLeft className="transition-all ease-in-out opacity-30 group-hover:opacity-100 group-hover:translate-x-[-4px]" />
      Go back
    </Text>
  );
};
