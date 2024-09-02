'use client';
import * as React from 'react';
import { Text } from '../base/text';
import { LucideMoveLeft } from 'lucide-react';
// eslint-disable-next-line import/no-relative-packages, import/no-cycle -- Can we solve this using relative path?
import { useRouter } from '../../../../../apps/web/src/components/NavBar';

export const GoBack = () => {
  const router = useRouter();

  return (
    <Text
      variant="medium"
      color="foreground"
      className="absolute ui-top-28 ui-left-10 group ui-flex ui-gap-2.5 ui-cursor-pointer"
      onClick={() => {
        router.back();
      }}
    >
      <LucideMoveLeft className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-[-4px]" />
      Go back
    </Text>
  );
};
