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
import { useForm, SubmitHandler } from 'react-hook-form';
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
import { useHierarchySelections } from '@/components/Usehierarchyselections';
import {
  buildInstallationDateTime,
  handleGraphQLErrors,
  parseCoordinates,
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
  siteId: '',
  levelId: '',
  driveId: '',
  locationId: '',
  activateNotifications: false,
  coordinates: { x: '0', y: '0', z: '0' },
  ringPosition: null,
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
      installationTime: installDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      locationDetails: request.locationDetails ?? '',
      comment: request.comment ?? '',
      siteId: request.site?.id ?? '',
      levelId: request.level?.id ?? '',
      driveId: request.drive?.id ?? '',
      locationId: request.location?.id ?? '',
      activateNotifications: request.activateNotifications ?? false,
      coordinates: parseCoordinates(request.coordinates),
      ringPosition: (request.ringPosition as RingPosition) ?? null,
    });
  }, [request]);

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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <main className="ui-banshee-p-6 md:ui-banshee-p-10 ui-banshee-w-100 lg:ui-banshee-w-3/4 ui-banshee-bg-neutral-50 ui-banshee-min-h-screen">
            <div className="ui-banshee-grid ui-banshee-grid-cols-1 xl:ui-banshee-grid-cols-12 ui-banshee-gap-10">
              <div className="xl:ui-banshee-col-span-5 ui-banshee-space-y-6">
                <FormField label="Name">
                  <Input placeholder="banshee01" {...form.register('name')} />
                </FormField>

                <StaticField label="Bolt Type" value={request.boltType} />

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
                  label="Serial Number"
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
                    form.setValue('levelId', '');
                    form.setValue('driveId', '');
                    form.setValue('locationId', '');
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
                    form.setValue('driveId', '');
                    form.setValue('locationId', '');
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
                    form.setValue('locationId', '');
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

                <FormField label="Location Details">
                  <Textarea rows={4} {...form.register('locationDetails')} />
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

                {/* Alarm Trigger */}
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
                    className="!ui-banshee-bg-[#E6E6E6]"
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
