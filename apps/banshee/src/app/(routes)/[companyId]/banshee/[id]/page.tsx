'use client';
import React, { useEffect, useMemo } from 'react';
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
} from '@gsp/ui-banshee';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { useQuery, useMutation } from 'urql';
import { graphql } from '@/gql';
import { useParams } from 'next/navigation';
import { useCompanyRouter } from '@/libs/hooks/useCompanyRouter';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BansheeConfigFormValues,
  updateBansheeConfigSchema,
} from '@/components/schemas/BansheeConfigSchema';
import { FormField, StaticField } from '@/components/FormField';
import { HierarchyDropdown } from '@/components/HierarchyDropdown';
import {
  BansheeTemplateDetail,
  TemplateSelectField,
} from '@/components/TemplateSelectField';
import { useHierarchySelections } from '@/components/Usehierarchyselections';
import {
  buildInstallationDateTime,
  formatDateTimeOfDay,
  handleGraphQLErrors,
  parseCoordinates,
  formatBoltType,
} from '@/libs/utils';
import { TimePicker } from '@/components/TimePicker';
import { RingPosition } from '@/gql/graphql';

const bansheeConfigQuery = graphql(`
  query BansheeRequestConfig($id: String!) {
    bansheeRequest(id: $id) {
      id
      serialNumber
      name
      boltInstallationDateTime
      period
      coordinates
      boltType
      locationDetails
      comment
      activateNotifications
      ringPosition
      companyId
      templateId
      boltTypeConstant {
        lowPlasticLimit
        elasticLimit
      }
      site {
        id
        siteName
      }
      level {
        id
        levelName
      }
      drive {
        id
        driveName
      }
      location {
        id
        locationName
      }
    }
  }
`);

const updateBansheeRequestMutation = graphql(`
  mutation UpdateBansheeRequest(
    $id: String!
    $updateBansheeRequestInput: UpdateBansheeRequestInput!
  ) {
    updateBansheeRequest(
      id: $id
      updateBansheeRequestInput: $updateBansheeRequestInput
    ) {
      id
    }
  }
`);

const hierarchyQuery = graphql(`
  query Hierarchy($companyId: String!) {
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

const COORDINATE_AXES = ['x', 'y', 'z'] as const;

const DEFAULT_VALUES: BansheeConfigFormValues = {
  name: '',
  period: 1,
  installationDate: new Date(),
  installationTime: '12:00 PM',
  locationDetails: '',
  comment: '',
  siteId: null,
  levelId: null,
  driveId: null,
  locationId: null,
  activateNotifications: false,
  coordinates: { x: '0', y: '0', z: '0' },
  ringPosition: null,
  templateId: null,
};

export default function BansheeConfigPage() {
  const { id } = useParams();
  const router = useCompanyRouter();

  const [{ data, fetching, error: bansheeConfigError }] = useQuery({
    query: bansheeConfigQuery,
    variables: { id: id as string },
  });

  useEffect(() => {
    handleGraphQLErrors(bansheeConfigError);
  }, [bansheeConfigError]);

  const [, updateBansheeRequest] = useMutation(updateBansheeRequestMutation);

  const form = useForm<BansheeConfigFormValues>({
    resolver: zodResolver(updateBansheeConfigSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const request = data?.bansheeRequest;

  const [{ data: hierarchyData, error: hierarchyError }] = useQuery({
    query: hierarchyQuery,
    variables: { companyId: request?.companyId ?? '' },
    pause: !request?.companyId,
  });

  useEffect(() => {
    handleGraphQLErrors(hierarchyError);
  }, [hierarchyError]);

  const sites = useMemo(
    () => hierarchyData?.company?.sites || [],
    [hierarchyData?.company?.sites],
  );

  const { levels, drives, locations } = useHierarchySelections(
    sites,
    form.watch,
  );

  useEffect(() => {
    if (!request) return;
    const installDate = request.boltInstallationDateTime
      ? new Date(request.boltInstallationDateTime)
      : new Date();

    form.reset({
      name: request.name ?? '',
      period: request.period ?? 1,
      installationDate: installDate,
      installationTime: formatDateTimeOfDay(installDate),
      locationDetails: request.locationDetails ?? '',
      comment: request.comment ?? '',
      siteId: request.site?.id ?? null,
      levelId: request.level?.id ?? null,
      driveId: request.drive?.id ?? null,
      locationId: request.location?.id ?? null,
      activateNotifications: request.activateNotifications ?? false,
      coordinates: parseCoordinates(request.coordinates),
      ringPosition: (request.ringPosition as RingPosition) ?? null,
      templateId: request.templateId ?? null,
    });
  }, [request]);

  /**
   * Copies a template onto the form. Every field the template models is applied,
   * and the template always wins — an empty value on the template clears the
   * corresponding value here. Fields the template does not model at all (name,
   * serial number, bolt type) are never touched.
   *
   * Where this form cannot represent "empty" — the period and the installation
   * date/time are required — an empty template value falls back to what the form
   * shows for a banshee request that has no value either.
   */
  const applyTemplate = (template: BansheeTemplateDetail) => {
    form.setValue('period', template.period ?? DEFAULT_VALUES.period);

    const installDate = template.boltInstallationDateTime
      ? new Date(template.boltInstallationDateTime)
      : new Date();
    const validInstallDate = Number.isNaN(installDate.getTime())
      ? new Date()
      : installDate;
    form.setValue('installationDate', validInstallDate);
    form.setValue('installationTime', formatDateTimeOfDay(validInstallDate));

    form.setValue('siteId', template.siteId ?? null);
    form.setValue('levelId', template.levelId ?? null);
    form.setValue('driveId', template.driveId ?? null);
    form.setValue('locationId', template.locationId ?? null);

    form.setValue('locationDetails', template.locationDetails ?? '');
    form.setValue('coordinates', parseCoordinates(template.coordinates));
    form.setValue(
      'activateNotifications',
      template.activateNotifications ?? false,
    );
    form.setValue('ringPosition', template.ringPosition ?? null);
    form.setValue('comment', template.comment ?? '');
  };

  const onSubmit: SubmitHandler<BansheeConfigFormValues> = async (values) => {
    const { installationDate, installationTime, ringPosition, ...restValues } =
      values;
    const boltInstallationDateTime = buildInstallationDateTime(
      installationDate,
      installationTime,
    );

    const result = await updateBansheeRequest({
      id: id as string,
      updateBansheeRequestInput: {
        ...restValues,
        boltInstallationDateTime,
        ringPosition: ringPosition ?? null,
      },
    }).catch(() => null);

    if (handleGraphQLErrors(result?.error)) return;

    showAlertToast(
      result?.error || !result
        ? {
            title: 'Failed to save configuration',
            description: 'Please try again or contact support.',
            variant: 'error',
          }
        : { title: 'Configuration saved successfully', variant: 'success' },
    );
  };

  // Without this, anything the form rejects — a cleared site, a template
  // carrying period 0 — would block Save with no feedback at all, since no
  // field renders its own error.
  const onInvalid: SubmitErrorHandler<BansheeConfigFormValues> = (errors) => {
    const details = Object.entries(errors).map(
      ([field, error]) => (error as { message?: string })?.message || field,
    );

    showAlertToast({
      title: 'Configuration cannot be saved',
      description: details.join(', '),
      variant: 'error',
    });
  };

  if (fetching) {
    return (
      <SidebarInset>
        <div className="ui-banshee-p-8 ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-3 ui-banshee-text-neutral-500">
          <LoadingSpinner />
          <Text variant="medium" color="muted">
            Loading configuration...
          </Text>
        </div>
      </SidebarInset>
    );
  }

  if (!request) {
    return (
      <SidebarInset>
        <div className="ui-banshee-p-8 ui-banshee-text-center">
          Banshee unit not found.
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          <main className="ui-banshee-p-6 md:ui-banshee-p-10 ui-banshee-w-100 lg:ui-banshee-w-3/4 ui-banshee-bg-neutral-50 ui-banshee-min-h-screen">
            <div className="ui-banshee-grid ui-banshee-grid-cols-1 xl:ui-banshee-grid-cols-12 ui-banshee-gap-10">
              <div className="xl:ui-banshee-col-span-5 ui-banshee-space-y-6">
                <FormField label="Name">
                  <Input placeholder="banshee01" {...form.register('name')} />
                </FormField>

                <TemplateSelectField
                  companyId={request.companyId}
                  selectedTemplateId={form.watch('templateId')}
                  onSelect={(templateId) =>
                    form.setValue('templateId', templateId)
                  }
                  onApplyTemplate={applyTemplate}
                />

                <StaticField
                  label="Bolt type"
                  value={formatBoltType(request.boltType)}
                />

                <FormField label="Period for automatic service reminder (months)">
                  <Input type="number" {...form.register('period')} />
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

              {/* ── Right Column ── */}
              <div className="xl:ui-banshee-col-span-7 ui-banshee-space-y-6">
                <StaticField
                  label="Serial number"
                  value={request.serialNumber}
                />

                <HierarchyDropdown
                  id="site-dropdown"
                  label="Site"
                  placeholder="Select site"
                  options={sites.map((s) => ({ id: s.id, name: s.siteName }))}
                  selectedId={form.watch('siteId')}
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
                  options={levels.map((l) => ({ id: l.id, name: l.levelName }))}
                  selectedId={form.watch('levelId')}
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
                  options={drives.map((d) => ({ id: d.id, name: d.driveName }))}
                  selectedId={form.watch('driveId')}
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
                  selectedId={form.watch('locationId')}
                  onSelect={(id) => form.setValue('locationId', id)}
                />

                <FormField label="Location details">
                  <Textarea rows={4} {...form.register('locationDetails')} />
                </FormField>

                <FormField label="Coordinates">
                  <div className="ui-banshee-flex ui-banshee-gap-4">
                    {COORDINATE_AXES.map((axis) => (
                      <div key={axis} className="ui-banshee-flex-1">
                        <Text
                          variant="medium"
                          color="foreground"
                          className="ui-banshee-text-center ui-banshee-mb-1"
                        >
                          {axis.toUpperCase()}
                        </Text>
                        <Input {...form.register(`coordinates.${axis}`)} />
                      </div>
                    ))}
                  </div>
                </FormField>

                {/* Alarm Trigger */}
                  <div className="ui-banshee-flex ui-banshee-flex-col">
                    <Text
                      variant="medium"
                      color="foreground"
                      className="ui-banshee-mb-2"
                    >
                      Alarm trigger
                    </Text>
                    <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-3">
                      <Switch
                        checked={form.watch('activateNotifications')}
                        onCheckedChange={(val) =>
                          form.setValue('activateNotifications', val)
                        }
                      />
                      <Text variant="medium" color="foreground">
                        Activate notifications
                      </Text>
                    </div>
                </div>

                {form.watch('activateNotifications') && (
                  <div className="ui-banshee-grid ui-banshee-grid-cols-1 ui-banshee-gap-6">
                    <StaticField
                      label="Low plastic threshold (mm)"
                      value={request.boltTypeConstant?.elasticLimit}
                    />
                    <StaticField
                      label="High plastic threshold (mm)"
                      value={request.boltTypeConstant?.lowPlasticLimit}
                    />
                  </div>
                )}

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
                    className="!ui-banshee-bg-neutral-2"
                    onClick={() => router.push(`/banshee`)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </div>
            </div>
          </main>
        </form>
      </Form>
    </SidebarInset>
  );
}
