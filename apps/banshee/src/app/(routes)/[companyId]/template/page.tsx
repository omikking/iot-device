'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  SidebarInset,
  Text,
  Input,
  Textarea,
  Button,
  Switch,
  BoltLocator,
  Form,
  SingleDateCalendar,
  showAlertToast,
  LoadingSpinner,
} from '@gsp/ui-core';
import { TimePicker } from '@/components/TimePicker';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useQuery, useMutation } from 'urql';
import { graphql } from '@/gql';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BansheeTemplateFormValues,
  bansheeTemplateSchema,
} from '@/components/schemas/BansheeTemplateSchema';
import { FormField } from '@/components/FormField';
import { HierarchyDropdown } from '@/components/HierarchyDropdown';
import { useHierarchySelections } from '@/components/Usehierarchyselections';
import {
  buildInstallationDateTime,
  handleGraphQLErrors,
  parseCoordinates,
} from '@/libs/utils';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@gsp/ui-core';
import { Headline } from '@gsp/ui-core';
import { CircleX, Menu } from 'lucide-react';
import { RingPosition } from '@/gql/graphql';

const hierarchyQuery = graphql(`
  query TemplateHierarchy($companyId: String!) {
    company(id: $companyId) {
      id
      sites {
        id
        siteName
        levels {
          id
          levelName
          drives {
            id
            driveName
            locations {
              id
              locationName
            }
          }
        }
      }
    }
  }
`);

// Lean list query — only what the table needs
const getBansheeTemplatesQuery = graphql(`
  query GetBansheeTemplates($companyId: String!) {
    getBansheeTemplates(companyId: $companyId) {
      id
      templateName
    }
  }
`);

// Full detail query — fetched on demand when a template is selected
const getBansheeTemplateByIdQuery = graphql(`
  query GetBansheeTemplateById($id: String!) {
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

const createBansheeTemplateMutation = graphql(`
  mutation CreateBansheeTemplate(
    $createBansheeTemplateInput: BansheeTemplateInput!
  ) {
    createBansheeTemplate(
      createBansheeTemplateInput: $createBansheeTemplateInput
    ) {
      id
      templateName
    }
  }
`);

const updateBansheeTemplateMutation = graphql(`
  mutation UpdateBansheeTemplate(
    $id: String!
    $updateBansheeTemplateInput: BansheeTemplateInput!
  ) {
    updateBansheeTemplate(
      id: $id
      updateBansheeTemplateInput: $updateBansheeTemplateInput
    ) {
      id
      templateName
    }
  }
`);

const deleteBansheeTemplateMutation = graphql(`
  mutation DeleteBansheeTemplate($id: String!) {
    deleteBansheeTemplate(id: $id) {
      id
    }
  }
`);

const COORDINATE_AXES = ['x', 'y', 'z'] as const;

const DEFAULT_VALUES: BansheeTemplateFormValues = {
  templateName: '',
  period: 1,
  installationDate: new Date(),
  installationTime: '12:00 PM',
  locationDetails: '',
  ringPosition: null,
  comment: '',
  siteId: null,
  levelId: null,
  driveId: null,
  locationId: null,
  activateNotifications: false,
  coordinates: { x: '0', y: '0', z: '0' },
};

function buildTemplateFormValues(template: {
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
}): BansheeTemplateFormValues {
  const installDate = template.boltInstallationDateTime
    ? new Date(template.boltInstallationDateTime)
    : new Date();

  return {
    templateName: template.templateName ?? '',
    period: template.period ?? 1,
    installationDate: installDate,
    installationTime: installDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    locationDetails: template.locationDetails ?? '',
    comment: template.comment ?? '',
    siteId: template.siteId ?? null,
    levelId: template.levelId ?? null,
    driveId: template.driveId ?? null,
    locationId: template.locationId ?? null,
    activateNotifications: template.activateNotifications ?? false,
    coordinates: parseCoordinates(template.coordinates),
    ringPosition: template.ringPosition ?? null,
  };
}

export default function TemplatePage({
  params,
}: {
  params: { companyId: string };
}) {
  const { companyId } = params;

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );

  const [{ data: hierarchyData, error: hierarchyError }] = useQuery({
    query: hierarchyQuery,
    variables: { companyId },
  });

  useEffect(() => {
    handleGraphQLErrors(hierarchyError);
  }, [hierarchyError]);

  // additionalTypenames tells cacheExchange that these queries return BansheeTemplate
  // objects, so it can invalidate them when a BansheeTemplate mutation completes.
  const templateListContext = useMemo(
    () => ({ additionalTypenames: ['BansheeTemplate'] }),
    [],
  );

  const [
    { data: templatesData, fetching: templatesFetching, error: templatesError },
  ] = useQuery({
    query: getBansheeTemplatesQuery,
    variables: { companyId },
    context: templateListContext,
  });

  useEffect(() => {
    handleGraphQLErrors(templatesError);
  }, [templatesError]);

  const [
    { data: templateDetailData, fetching: detailFetching, error: detailError },
  ] = useQuery({
    query: getBansheeTemplateByIdQuery,
    variables: { id: selectedTemplateId ?? '' },
    pause: !selectedTemplateId,
    context: templateListContext,
  });

  useEffect(() => {
    handleGraphQLErrors(detailError);
  }, [detailError]);

  const [, createTemplate] = useMutation(createBansheeTemplateMutation);
  const [, updateTemplate] = useMutation(updateBansheeTemplateMutation);
  const [, deleteTemplate] = useMutation(deleteBansheeTemplateMutation);

  const sites = useMemo(
    () => hierarchyData?.company?.sites || [],
    [hierarchyData?.company?.sites],
  );

  const templates = useMemo(
    () => templatesData?.getBansheeTemplates || [],
    [templatesData?.getBansheeTemplates],
  );

  const templateDetail = templateDetailData?.getBansheeTemplateById ?? null;

  // Derive title from the list so the heading updates instantly on row click,
  // before the detail query returns.
  const selectedTemplateName = useMemo(
    () =>
      templates.find((t) => t.id === selectedTemplateId)?.templateName ??
      'New Template',
    [templates, selectedTemplateId],
  );

  const form = useForm<BansheeTemplateFormValues>({
    resolver: zodResolver(bansheeTemplateSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { levels, drives, locations } = useHierarchySelections(
    sites,
    form.watch,
  );

  useEffect(() => {
    if (!selectedTemplateId) {
      form.reset(DEFAULT_VALUES);
      return;
    }
    if (templateDetail) {
      form.reset(buildTemplateFormValues(templateDetail));
    }
  }, [templateDetail, selectedTemplateId]);

  const onSubmit: SubmitHandler<BansheeTemplateFormValues> = async (values) => {
    const { installationDate, installationTime, ringPosition, ...restValues } =
      values;
    const boltInstallationDateTime =
      installationDate && installationTime
        ? buildInstallationDateTime(installationDate, installationTime)
        : null;
    const input = {
      ...restValues,
      boltInstallationDateTime,
      companyId,
      ringPosition: ringPosition ?? null,
    };

    // additionalTypenames causes cacheExchange to auto-invalidate GetBansheeTemplates
    // and GetBansheeTemplateById after the mutation — no manual refetch needed.
    const mutationContext = { additionalTypenames: ['BansheeTemplate'] };

    let result;
    if (selectedTemplateId) {
      result = await updateTemplate(
        { id: selectedTemplateId, updateBansheeTemplateInput: input },
        mutationContext,
      ).catch(() => null);
    } else {
      result = await createTemplate(
        { createBansheeTemplateInput: input },
        mutationContext,
      ).catch(() => null);
    }

    if (handleGraphQLErrors(result?.error)) return;

    if (!result || result.error) {
      showAlertToast({
        title: 'Failed to save template',
        description: 'Please try again or contact support.',
        variant: 'error',
      });
      return;
    }

    showAlertToast({
      title: 'Template saved successfully',
      variant: 'success',
    });

    if (
      !selectedTemplateId &&
      result.data &&
      'createBansheeTemplate' in result.data
    ) {
      // After create, switch to the new template — detail query activates automatically
      const newId = result.data.createBansheeTemplate?.id;
      if (newId) setSelectedTemplateId(newId);
    }
  };

  const handleDeleteTemplate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const result = await deleteTemplate(
      { id },
      { additionalTypenames: ['BansheeTemplate'] },
    ).catch(() => null);

    if (handleGraphQLErrors(result?.error)) return;

    if (!result || result.error) {
      showAlertToast({
        title: 'Failed to delete template',
        description: 'Please try again or contact support.',
        variant: 'error',
      });
      return;
    }

    showAlertToast({ title: 'Template deleted', variant: 'success' });

    if (selectedTemplateId === id) setSelectedTemplateId(null);
  };

  const handleNewTemplate = () => {
    setSelectedTemplateId(null);
    form.reset(DEFAULT_VALUES);
  };

  const handleCancel = () => {
    if (templateDetail) {
      form.reset(buildTemplateFormValues(templateDetail));
    } else {
      form.reset(DEFAULT_VALUES);
    }
  };

  return (
    <SidebarInset>
      <main className="ui-banshee-min-h-screen">
        <div className="ui-banshee-p-3 md:ui-banshee-p-4 lg:ui-banshee-p-6 ui-banshee-border-b">
          <Headline
            as="h1"
            variant="large"
            color="foreground"
            className="ui-banshee-m-0 ui-banshee-mb-1"
          >
            {selectedTemplateName}
          </Headline>
          <Text variant="small" color="muted">
            Description
          </Text>
        </div>

        <div className="ui-banshee-border-b ui-banshee-flex ui-banshee-flex-col ui-banshee-py-7 ui-banshee-pl-7 ui-banshee-gap-7">
          <div className="ui-banshee-max-h-[14vh] ui-banshee-overflow-auto">
            <Table variant="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="!ui-banshee-text-left ui-banshee-px-3 ui-banshee-py-2">
                    <Text
                      variant="small"
                      color="foreground"
                      className="ui-banshee-font-semibold"
                    >
                      Banshee Template Library
                    </Text>
                  </TableHead>
                  <TableHead className="ui-banshee-justify-end !ui-banshee-align-center ui-banshee-w-auto ui-banshee-px-3 ui-banshee-py-2">
                    <Menu size={20} />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templatesFetching && (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="ui-banshee-text-center ui-banshee-py-4"
                    >
                      <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-2">
                        <LoadingSpinner size={16} />
                        <Text variant="small" color="muted">
                          Loading templates...
                        </Text>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!templatesFetching && templates.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="ui-banshee-text-center ui-banshee-py-4"
                    >
                      <Text
                        variant="small"
                        color="muted"
                        className="ui-banshee-text-center"
                      >
                        No templates found
                      </Text>
                    </TableCell>
                  </TableRow>
                )}
                {templates.map((template) => (
                  <TableRow
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className="ui-banshee-cursor-pointer"
                  >
                    <TableCell className="!ui-banshee-text-left !ui-banshee-bg-neutral-1 ui-banshee-px-3">
                      <Text variant="small" color="foreground">
                        {template.templateName}
                      </Text>
                    </TableCell>
                    <TableCell
                      style={{ width: '1%' }}
                      className="!ui-banshee-text-right ui-banshee-w-auto ui-banshee-px-3"
                    >
                      <button
                        type="button"
                        onClick={(e) => handleDeleteTemplate(e, template.id)}
                        className="ui-banshee-text-neutral-400 hover:ui-banshee-text-red-500 ui-banshee-transition-colors ui-banshee-flex ui-banshee-m-auto"
                      >
                        <CircleX size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="ui-banshee-flex ui-banshee-justify-end">
            <Button type="button" onClick={handleNewTemplate}>
              New template
            </Button>
          </div>
        </div>

        {detailFetching ? (
          <div className="ui-banshee-p-10 ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-3">
            <LoadingSpinner />
            <Text variant="small" color="muted">
              Loading template...
            </Text>
          </div>
        ) : (
          <div className="ui-banshee-p-6 md:ui-banshee-p-10 ui-banshee-w-100 lg:ui-banshee-w-3/4 ui-banshee-bg-neutral-50">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="ui-banshee-grid ui-banshee-grid-cols-1 xl:ui-banshee-grid-cols-12 ui-banshee-gap-10">
                  <div className="xl:ui-banshee-col-span-5 ui-banshee-space-y-6">
                    <FormField label="Template Name">
                      <Input
                        placeholder="Template Name"
                        {...form.register('templateName')}
                      />
                    </FormField>

                    <FormField label="Period for automatic service reminder (months)">
                      <Input
                        type="number"
                        {...form.register('period', { valueAsNumber: true })}
                      />
                    </FormField>

                    <FormField label="Bolt installation date">
                      <SingleDateCalendar
                        selectedDate={form.watch('installationDate')}
                        onDateChange={(date) => {
                          if (date) form.setValue('installationDate', date);
                        }}
                      />
                    </FormField>

                    <FormField label="Bolt installation time">
                      <TimePicker
                        selectedTime={form.watch('installationTime')}
                        onTimeChange={(time) =>
                          form.setValue('installationTime', time)
                        }
                      />
                    </FormField>

                    <div className="ui-banshee-flex ui-banshee-justify-center ui-banshee-bg-neutral-1 ui-banshee-p-8 ui-banshee-rounded-lg ui-banshee-border ui-banshee-border-neutral-2">
                      <div className="ui-banshee-scale-[0.7] ui-banshee-origin-center">
                        <BoltLocator
                          onChange={(key) =>
                            form.setValue('ringPosition', key as RingPosition)
                          }
                          activeBolt={form.watch('ringPosition')}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="xl:ui-banshee-col-span-7 ui-banshee-space-y-6">
                    <HierarchyDropdown
                      id="site-dropdown"
                      label="Site"
                      placeholder="Select site"
                      options={sites.map((s) => ({
                        id: s.id,
                        name: s.siteName,
                      }))}
                      selectedId={form.watch('siteId') ?? ''}
                      onSelect={(id) => {
                        form.setValue('siteId', id);
                        form.setValue('levelId', null);
                        form.setValue('driveId', null);
                        form.setValue('locationId', null);
                      }}
                    />

                    <HierarchyDropdown
                      id="level-dropdown"
                      label="Level"
                      placeholder="Select level"
                      options={levels.map((l) => ({
                        id: l.id,
                        name: l.levelName,
                      }))}
                      selectedId={form.watch('levelId') ?? ''}
                      onSelect={(id) => {
                        form.setValue('levelId', id);
                        form.setValue('driveId', null);
                        form.setValue('locationId', null);
                      }}
                    />

                    <HierarchyDropdown
                      id="drive-dropdown"
                      label="Drive"
                      placeholder="Select drive"
                      options={drives.map((d) => ({
                        id: d.id,
                        name: d.driveName,
                      }))}
                      selectedId={form.watch('driveId') ?? ''}
                      onSelect={(id) => {
                        form.setValue('driveId', id);
                        form.setValue('locationId', null);
                      }}
                    />

                    <HierarchyDropdown
                      id="location-dropdown"
                      label="Location"
                      placeholder="Select location"
                      options={locations.map((l) => ({
                        id: l.id,
                        name: l.locationName,
                      }))}
                      selectedId={form.watch('locationId') ?? ''}
                      onSelect={(id) => form.setValue('locationId', id)}
                    />

                    <FormField label="Location Details">
                      <Textarea
                        rows={4}
                        {...form.register('locationDetails')}
                      />
                    </FormField>

                    <FormField label="Coordinates">
                      <div className="ui-banshee-flex ui-banshee-gap-4">
                        {COORDINATE_AXES.map((axis) => (
                          <div key={axis} className="ui-banshee-flex-1">
                            <Text
                              variant="small"
                              color="muted"
                              className="ui-banshee-text-center ui-banshee-mb-1"
                            >
                              {axis.toUpperCase()}
                            </Text>
                            <Input {...form.register(`coordinates.${axis}`)} />
                          </div>
                        ))}
                      </div>
                    </FormField>

                    <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-between ui-banshee-bg-neutral-1 ui-banshee-p-6 ui-banshee-rounded-lg">
                      <div className="ui-banshee-flex ui-banshee-flex-col">
                        <Text
                          variant="small"
                          color="muted"
                          className="ui-banshee-font-bold ui-banshee-mb-2"
                        >
                          Alarm Trigger
                        </Text>
                        <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-3">
                          <Switch
                            checked={form.watch('activateNotifications')}
                            onCheckedChange={(val) =>
                              form.setValue('activateNotifications', val)
                            }
                          />
                          <Text variant="small" color="foreground">
                            Activate Notifications
                          </Text>
                        </div>
                      </div>
                    </div>

                    <FormField label="Comment">
                      <Textarea
                        rows={4}
                        placeholder="Previously input by operator"
                        {...form.register('comment')}
                      />
                    </FormField>

                    <div className="ui-banshee-flex ui-banshee-justify-end ui-banshee-gap-4 ui-banshee-mt-10">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button variant="primary" type="submit">
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        )}
      </main>
    </SidebarInset>
  );
}
