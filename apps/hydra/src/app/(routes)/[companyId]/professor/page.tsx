'use client';

import { Headline, SidebarInset } from '@gsp/ui-core';

export default function ProfessorPage() {
  return (
    <SidebarInset>
      <main className="flex flex-1 flex-col gap-8 bg-neutral-1 p-10">
        <Headline as="h1" variant="large" color="foreground" isBold>
          Professor
        </Headline>
      </main>
    </SidebarInset>
  );
}
