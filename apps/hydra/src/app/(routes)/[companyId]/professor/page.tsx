'use client';

import { Button, SidebarInset } from '@gsp/ui-core';
import { ProfessorCloudConfigurationPanel } from '@/hydra-component/ProfessorCloudConfigurationPanel';
import { ProfessorLocalConfigurationPanel } from '@/hydra-component/ProfessorLocalConfigurationPanel';

export default function ProfessorPage() {
  return (
    <SidebarInset className="min-h-0">
      <main className="pr-2 bg-main-white h-full min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 overflow-y-auto">
          <div className="lg:col-span-1 bg-gray-100 md:py-4 md:pl-4 md:pr-4">
            <ProfessorCloudConfigurationPanel />
          </div>
          <div className="lg:col-span-1 md:py-4">
            <ProfessorLocalConfigurationPanel />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 pb-2 border-t border-neutral-3 shrink-0">
          <Button
            variant="outline"
            type="button"
            onClick={() => console.log('Cancel')}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={() => console.log('Save')}
          >
            Save
          </Button>
        </div>
      </main>
    </SidebarInset>
  );
}
