'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@gsp/ui-banshee';
import { Menu } from 'lucide-react';

type BansheeExportMenuProps = {
  onDownloadCsv: () => void;
  onDownloadPng: () => void;
};

export function BansheeExportMenu({
  onDownloadCsv,
  onDownloadPng,
}: BansheeExportMenuProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Export options"
          aria-haspopup="true"
          aria-expanded={open}
          className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-px-3 ui-banshee-py-1 ui-banshee-bg-white ui-banshee-border ui-banshee-border-neutral-300 ui-banshee-rounded"
        >
          <Menu className="ui-banshee-h-5 ui-banshee-w-5 ui-banshee-text-neutral-700" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="ui-banshee-w-40 ui-banshee-p-1">
        <button
          type="button"
          className="ui-banshee-w-full ui-banshee-text-left ui-banshee-px-3 ui-banshee-py-2 ui-banshee-text-sm ui-banshee-rounded hover:ui-banshee-bg-neutral-1"
          onClick={() => handleSelect(onDownloadCsv)}
        >
          Download CSV
        </button>
        <button
          type="button"
          className="ui-banshee-w-full ui-banshee-text-left ui-banshee-px-3 ui-banshee-py-2 ui-banshee-text-sm ui-banshee-rounded hover:ui-banshee-bg-neutral-1"
          onClick={() => handleSelect(onDownloadPng)}
        >
          Download PNG
        </button>
      </PopoverContent>
    </Popover>
  );
}
