'use client';

import { useState } from 'react';
import { Headline, Textarea, DropdownSearch } from '@gsp/ui-core';
import { FormFieldLabel } from './FormFieldLabel';

const DROPDOWN_CLASS =
  'flex w-full h-10 border-neutral-3 rounded border bg-main-white text-sm font-sandvik-text text-main-black placeholder:text-neutral-5 outline-none hover:border-blue-primary focus-visible:border-blue-primary transition ease-in-out duration-200';

const inputClassName =
  'flex w-full h-10 border-neutral-3 rounded border bg-main-white px-4 text-sm font-sandvik-text text-main-black placeholder:text-neutral-5 outline-none hover:border-blue-primary focus-visible:border-blue-primary transition ease-in-out duration-200';

const TEMPLATE_OPTIONS = [
  { id: 'template-1', name: 'Template A' },
  { id: 'template-2', name: 'Template B' },
];

export function ProfessorCloudConfigurationPanel() {
  const [templateId, setTemplateId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [comment, setComment] = useState('');

  return (
    <section className="flex flex-col gap-4 min-w-0">
      <Headline variant="medium" color="foreground" as="h2" isBold>
        Cloud Configuration
      </Headline>

      <FormFieldLabel label="Configuration from Template">
        <DropdownSearch
          id="professor-cloud-template"
          options={TEMPLATE_OPTIONS}
          selectedId={templateId}
          placeholder="Drop down menu"
          searchPlaceholder="Search..."
          onSelect={(id) => setTemplateId(id ?? '')}
          className={DROPDOWN_CLASS}
        />
      </FormFieldLabel>

      <FormFieldLabel label="Vehicle ID">
        <input
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          placeholder="Vehicle ID"
          className={inputClassName}
        />
      </FormFieldLabel>

      <FormFieldLabel label="Comment">
        <Textarea
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[120px]"
        />
      </FormFieldLabel>
    </section>
  );
}
