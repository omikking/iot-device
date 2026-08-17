'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from 'urql';
import { LoadingSpinner, Text } from '@gsp/ui-banshee';
import { graphql } from '@/gql';
import { HierarchyDropdown } from './HierarchyDropdown';
import { handleGraphQLErrors } from '@/libs/utils';
import { RingPosition } from '@/gql/graphql';

// Named differently from the template page's own operations — codegen requires
// unique operation names across the app.
const templateOptionsQuery = graphql(`
  query BansheeConfigTemplateOptions($companyId: String!) {
    getBansheeTemplates(companyId: $companyId) {
      id
      templateName
    }
  }
`);

const templateDetailQuery = graphql(`
  query BansheeConfigTemplateDetail($id: String!) {
    getBansheeTemplateById(id: $id) {
      id
      templateName
      period
      boltInstallationDateTime
      siteId
      levelId
      driveId
      locationId
      locationDetails
      coordinates
      comment
      activateNotifications
      ringPosition
    }
  }
`);

export interface BansheeTemplateDetail {
  id: string;
  templateName: string;
  period?: number | null;
  boltInstallationDateTime?: string | null;
  siteId?: string | null;
  levelId?: string | null;
  driveId?: string | null;
  locationId?: string | null;
  locationDetails?: string | null;
  coordinates?: unknown;
  comment?: string | null;
  activateNotifications?: boolean | null;
  ringPosition?: RingPosition | null;
}

interface TemplateSelectFieldProps {
  companyId: string;
  /** Currently persisted/selected template id, or null when none. */
  selectedTemplateId: string | null;
  /**
   * Fired once a pick is safe to commit: immediately when the selection is
   * cleared, and for a template only after its details have loaded, in the same
   * tick as `onApplyTemplate`. Deferring keeps the committed template id and the
   * configuration values it implies from ever disagreeing — a save that lands
   * mid-fetch, or a detail query that fails, leaves the previous pair intact.
   */
  onSelect: (templateId: string | null) => void;
  /**
   * Fired once the picked template's details have loaded. Only user picks
   * trigger this — hydrating `selectedTemplateId` from a saved record does not,
   * so a saved configuration is never overwritten by its template on load.
   */
  onApplyTemplate: (template: BansheeTemplateDetail) => void;
}

export function TemplateSelectField({
  companyId,
  selectedTemplateId,
  onSelect,
  onApplyTemplate,
}: TemplateSelectFieldProps) {
  // Set only by a user pick — this is what gates the populate effect.
  const [templateToApply, setTemplateToApply] = useState<string | null>(null);
  // The pick the dropdown shows while its details are still in flight. Held here
  // rather than pushed to the parent so an in-flight pick cannot be saved.
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(
    null,
  );

  const templateContext = useMemo(
    () => ({ additionalTypenames: ['BansheeTemplate'] }),
    [],
  );

  const [{ data: listData, error: listError }] = useQuery({
    query: templateOptionsQuery,
    variables: { companyId },
    pause: !companyId,
    context: templateContext,
  });

  useEffect(() => {
    handleGraphQLErrors(listError);
  }, [listError]);

  const [{ data: detailData, fetching: detailFetching, error: detailError }] =
    useQuery({
      query: templateDetailQuery,
      variables: { id: templateToApply ?? '' },
      pause: !templateToApply,
      context: templateContext,
    });

  useEffect(() => {
    if (!detailError) return;
    handleGraphQLErrors(detailError);
    // Nothing was applied, so drop the pick entirely — committing it would pair
    // the new template id with the old configuration values.
    setTemplateToApply(null);
    setPendingTemplateId(null);
  }, [detailError]);

  const templates = useMemo(
    () => listData?.getBansheeTemplates ?? [],
    [listData?.getBansheeTemplates],
  );

  // Kept in refs so inline parent callbacks don't re-trigger the effect.
  const onApplyTemplateRef = useRef(onApplyTemplate);
  onApplyTemplateRef.current = onApplyTemplate;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const templateDetail = detailData?.getBansheeTemplateById ?? null;

  useEffect(() => {
    if (!templateToApply || templateDetail?.id !== templateToApply) return;
    // Values and the association are committed together, so the two can never be
    // persisted out of step.
    onApplyTemplateRef.current(templateDetail as BansheeTemplateDetail);
    onSelectRef.current(templateToApply);
    // Clearing lets the same template be re-applied on a later pick.
    setTemplateToApply(null);
    setPendingTemplateId(null);
  }, [templateDetail, templateToApply]);

  const handleSelect = (id: string | null) => {
    const nextId = id || null;

    // Clearing models no configuration to load, so it commits straight away.
    if (!nextId) {
      setTemplateToApply(null);
      setPendingTemplateId(null);
      onSelect(null);
      return;
    }

    // Show the pick immediately, but leave the parent form untouched until the
    // details arrive — see `onSelect`.
    setPendingTemplateId(nextId);
    setTemplateToApply(nextId);
  };

  return (
    <div>
      <HierarchyDropdown
        id="template-dropdown"
        label="Configuration from Template"
        placeholder="Select template"
        options={templates.map((t) => ({ id: t.id, name: t.templateName }))}
        selectedId={pendingTemplateId ?? selectedTemplateId ?? ''}
        onSelect={handleSelect}
      />
      {detailFetching && (
        <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-2 ui-banshee-mt-2">
          <LoadingSpinner size={14} />
          <Text variant="small" color="muted">
            Applying template...
          </Text>
        </div>
      )}
    </div>
  );
}
