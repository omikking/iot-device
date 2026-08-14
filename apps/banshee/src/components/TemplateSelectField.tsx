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
  /** Fired on every user pick, including clearing the selection. */
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
    handleGraphQLErrors(detailError);
  }, [detailError]);

  const templates = useMemo(
    () => listData?.getBansheeTemplates ?? [],
    [listData?.getBansheeTemplates],
  );

  // Kept in a ref so an inline parent callback doesn't re-trigger the effect.
  const onApplyTemplateRef = useRef(onApplyTemplate);
  onApplyTemplateRef.current = onApplyTemplate;

  const templateDetail = detailData?.getBansheeTemplateById ?? null;

  useEffect(() => {
    if (!templateToApply || templateDetail?.id !== templateToApply) return;
    onApplyTemplateRef.current(templateDetail as BansheeTemplateDetail);
    // Clearing lets the same template be re-applied on a later pick.
    setTemplateToApply(null);
  }, [templateDetail, templateToApply]);

  const handleSelect = (id: string | null) => {
    const nextId = id || null;
    onSelect(nextId);
    setTemplateToApply(nextId);
  };

  return (
    <div>
      <HierarchyDropdown
        id="template-dropdown"
        label="Configuration from Template"
        placeholder="Select template"
        options={templates.map((t) => ({ id: t.id, name: t.templateName }))}
        selectedId={selectedTemplateId ?? ''}
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
