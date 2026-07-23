'use client';
import { SidebarInset } from '@gsp/ui-banshee';
import { graphql } from '@/gql';
import { useQuery } from 'urql';
import { useEffect } from 'react';
import { SchedulerOverviewTable } from '@/components/SchedulerOverviewTable';
import { BansheeInfoCard } from '@/components/BansheeInfoCard';
import { StatusDistributionChart } from '@/components/StatusDistributionChart';
import { StatusOverviewChart } from '@/components/StatusOverviewChart';
import { handleGraphQLErrors } from '@/libs/utils';

export default function Page({ params }: { params: { companyId: string } }) {
  const { companyId } = params;
  const bansheeStatusDistributionQuery = graphql(`
    query bansheeStatusDistribution($companyId: String) {
      bansheeStatusDistribution(companyId: $companyId) {
        total
        statusCounts {
          status
          count
        }
      }
    }
  `);
  const bansheeRequestsListQuery = graphql(`
    query overviewBansheeRequestsList($companyId: String) {
      bansheeRequests(limit: 100, companyId: $companyId) {
        results {
          id
          serialNumber
          site {
            siteName
          }
          drive {
            driveName
          }
          level {
            levelName
          }
          location {
            locationName
          }
          comment
          proceqData {
            status
            dueDate
            createdTimestamp
            readings {
              elongation
              status
            }
          }
          eventLogs {
            createdAt
            eventType
            previousStatus
            newStatus
          }
        }
      }
    }
  `);

  const [{ data: data, fetching: bansheeDistFetching, error: distError }] =
    useQuery({
      query: bansheeStatusDistributionQuery,
      variables: { companyId },
    });

  useEffect(() => {
    handleGraphQLErrors(distError);
  }, [distError]);

  const [
    {
      data: bansheeData,
      fetching: bansheeRequestsFetching,
      error: bansheeListError,
    },
  ] = useQuery({
    query: bansheeRequestsListQuery,
    variables: { companyId },
  });

  useEffect(() => {
    handleGraphQLErrors(bansheeListError);
  }, [bansheeListError]);
  const { statusCounts } = data?.bansheeStatusDistribution || {};

  const sanitizedBansheeEntries =
    bansheeData?.bansheeRequests?.results.map((entry) => {
      const latestMeasurement = entry?.proceqData?.at(-1);

      return {
        status: latestMeasurement?.status ?? 'UNKNOWN',
        statusColor: '#FF0000',
        banshee: entry?.serialNumber ?? '',
        location: entry?.location?.locationName ?? '',
        dueDate: latestMeasurement?.dueDate
          ? new Date(latestMeasurement.dueDate).toLocaleDateString('en-GB')
          : '-',
      };
    }) ?? [];

  return (
    <SidebarInset>
      <main className="md:ui-banshee-py-4 md:ui-banshee-pl-4 lg:ui-banshee-py-7 lg:ui-banshee-pl-7 ui-banshee-bg-main-white ui-banshee-box-border">
        <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-6">
          <div className="ui-banshee-grid ui-banshee-grid-cols-1 lg:ui-banshee-grid-cols-5 ui-banshee-gap-6">
            <BansheeInfoCard />

            <StatusDistributionChart
              statusCounts={statusCounts || []}
              fetching={bansheeDistFetching}
            />
          </div>

          <div className="ui-banshee-grid ui-banshee-grid-cols-1 lg:ui-banshee-grid-cols-4 ui-banshee-gap-6">
            <StatusOverviewChart
              bansheeRequests={bansheeData?.bansheeRequests?.results ?? []}
              fetching={bansheeRequestsFetching}
            />
            <SchedulerOverviewTable
              entries={sanitizedBansheeEntries ?? []}
              fetching={bansheeRequestsFetching}
            />
          </div>
        </div>
      </main>
    </SidebarInset>
  );
}
