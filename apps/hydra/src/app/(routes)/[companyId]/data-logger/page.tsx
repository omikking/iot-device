'use client';

import { Button, SidebarInset } from '@gsp/ui-core';
import { CloudConfigurationPanel } from '@/hydra-component/CloudConfigurationPanel';
import { LocalConfigurationPanel } from '@/hydra-component/LocalConfigurationPanel';
import { InterrogatorConfigurationPanel } from '@/hydra-component/InterrogatorConfigurationPanel';
import { useHydraLocalConfig } from '@/hydra-component/hooks/useHydraLocalConfig';

export default function HydraDataLoggerPage() {
  const localConfig = useHydraLocalConfig();
  const { connected, saving, isDirty, save, reset } = localConfig;

  return (
    <SidebarInset>
      <main className="pr-2 bg-main-white min-h-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 pb-8">
          <div className='lg:col-span-1 bg-gray-100 md:py-4 md:pl-4 md:pr-4'>
            <CloudConfigurationPanel />
          </div>
          <div className='lg:col-span-2 md:py-4'>
            <LocalConfigurationPanel config={localConfig} />
          </div>

        </div>

        <div className="pb-8">
          <InterrogatorConfigurationPanel config={localConfig} />
        </div>

        <div className="flex justify-end gap-3 pb-8">
          <Button
            variant="outline"
            type="button"
            disabled={!isDirty || saving}
            onClick={reset}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="button"
            disabled={!connected || saving}
            onClick={save}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </main>
    </SidebarInset>
  );
}
