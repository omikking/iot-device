'use client';
import React from 'react';
import { DropdownSearch } from '@gsp/ui-banshee';
import { FormField } from './FormField';

interface Option {
  id: string;
  name: string;
}

interface HierarchyDropdownProps {
  id: string;
  label: string;
  options: Option[];
  selectedId: string;
  placeholder: string;
  onSelect: (id: string) => void;
}

export function HierarchyDropdown({
  id,
  label,
  options,
  selectedId,
  placeholder,
  onSelect,
}: HierarchyDropdownProps) {
  return (
    <FormField label={label}>
      <DropdownSearch
        id={id}
        options={options}
        selectedId={selectedId}
        placeholder={placeholder}
        searchPlaceholder="..."
        onSelect={(selectedId) => onSelect(selectedId ?? '')}
        className='ui-banshee-flex ui-banshee-w-full ui-banshee-h-12 ui-banshee-border-neutral-3 ui-banshee-rounded ui-banshee-border ui-banshee-bg-main-white ui-banshee-text-md ui-banshee-font-sandvik-text ui-banshee-text-main-black placeholder:ui-banshee-text-neutral-5 ui-banshee-outline-none hover:ui-banshee-border-blue-primary focus-visible:ui-banshee-border-blue-primary ui-banshee-transition ease-in-out ui-banshee-duration-200 disabled:ui-banshee-bg-neutral-2 disabled:ui-banshee-text-neutral-5 disabled:ui-banshee-border-transparent disabled:ui-banshee-pointer-events-none'
      />
    </FormField>
  );
}
