import { Label } from '@gsp/ui';
import React from 'react';
import PullTestLogo from '../../public/pull-test-logo.svg';
import Link from 'next/link';

const SelectApp = ({ labelText }: { labelText: string }) => {
  return (
    <Link href="/api/auth/signout" legacyBehavior>
      <div className="flex flex-col p-md items-center w-56 bg-neutral-1 border-4 border-neutral-2 gap-md cursor-pointer">
        <PullTestLogo />
        <Label>{labelText}</Label>
      </div>
    </Link>
  );
};

export default SelectApp;
