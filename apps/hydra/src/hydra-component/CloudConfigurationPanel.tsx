'use client';

import { useState } from 'react';
import {
  Headline,
  Text,
  Textarea,
  Switch,
  DropdownSearch,
} from '@gsp/ui-core';
import { FormFieldLabel } from './FormFieldLabel';

const DROPDOWN_CLASS =
  'flex w-full h-10 border-neutral-3 rounded border bg-main-white text-sm font-sandvik-text text-main-black placeholder:text-neutral-5 outline-none hover:border-blue-primary focus-visible:border-blue-primary transition ease-in-out duration-200';

const TEMPLATE_OPTIONS = [
  { id: 'template-1', name: 'Template A' },
  { id: 'template-2', name: 'Template B' },
];

const SITE_OPTIONS = [
  { id: 'site-1', name: 'Site Text' },
  { id: 'site-2', name: 'Site B' },
];

const LEVEL_OPTIONS = [
  { id: 'level-1', name: 'Level Text' },
  { id: 'level-2', name: 'Level B' },
];

const LOCATION_OPTIONS = [
  { id: 'location-1', name: 'Location A' },
  { id: 'location-2', name: 'Location B' },
];

export function CloudConfigurationPanel() {
  const [templateId, setTemplateId] = useState('');
  const [siteId, setSiteId] = useState('site-1');
  const [levelId, setLevelId] = useState('level-1');
  const [locationId, setLocationId] = useState('location-1');
  const [locationDetails, setLocationDetails] = useState('');
  const [comment, setComment] = useState('');
  const [remoteModeEnabled, setRemoteModeEnabled] = useState(true);

  return (
    <section className="flex flex-col gap-4 min-w-0">
      <Headline variant="medium" color="foreground" as="h2" isBold>
        Cloud Configuration
      </Headline>

      <div className="space-y-1">
        <Text variant="small" color="foreground" className="font-medium">
          Serial Number
        </Text>
        <Text variant="small" color="foreground">
          Serial Number Text
        </Text>
      </div>

      <FormFieldLabel label="Configuration from Template">
        <DropdownSearch
          id="hydra-cloud-template"
          options={TEMPLATE_OPTIONS}
          selectedId={templateId}
          placeholder="Drop down menu"
          searchPlaceholder="Search..."
          onSelect={(id) => setTemplateId(id ?? '')}
          className={DROPDOWN_CLASS}
        />
      </FormFieldLabel>

      <FormFieldLabel label="Site">
        <DropdownSearch
          id="hydra-cloud-site"
          options={SITE_OPTIONS}
          selectedId={siteId}
          placeholder="Site"
          searchPlaceholder="Search..."
          onSelect={(id) => setSiteId(id ?? '')}
          className={DROPDOWN_CLASS}
        />
      </FormFieldLabel>

      <FormFieldLabel label="Level">
        <DropdownSearch
          id="hydra-cloud-level"
          options={LEVEL_OPTIONS}
          selectedId={levelId}
          placeholder="Level"
          searchPlaceholder="Search..."
          onSelect={(id) => setLevelId(id ?? '')}
          className={DROPDOWN_CLASS}
        />
      </FormFieldLabel>

      <FormFieldLabel label="Location">
        <DropdownSearch
          id="hydra-cloud-location"
          options={LOCATION_OPTIONS}
          selectedId={locationId}
          placeholder="Location"
          searchPlaceholder="Search..."
          onSelect={(id) => setLocationId(id ?? '')}
          className={DROPDOWN_CLASS}
        />
      </FormFieldLabel>

      <FormFieldLabel label="Location Details">
        <Textarea
          placeholder="Location Details"
          value={locationDetails}
          onChange={(e) => setLocationDetails(e.target.value)}
          className="min-h-[120px]"
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

      <div className="flex items-center gap-3">
        <Switch
          checked={remoteModeEnabled}
          onCheckedChange={setRemoteModeEnabled}
        />
        <Text variant="small" color="foreground">
          Remote Mode Enabled
        </Text>
      </div>
    </section>
  );
}
