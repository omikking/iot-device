'use client';

import { SmallChartPieDonut } from '@gsp/ui-banshee';
import { useMemo } from 'react';
import { getStatusColorHex, getStatusLabel } from '@/libs/status-color-utils';

type StatusCount = {
  status: string;
  count: number;
};

type LocationDistribution = {
  locationId: string;
  locationName: string;
  statusCounts: StatusCount[];
};

type DistributionData = {
  statusCounts: StatusCount[];
  byLocation?: LocationDistribution[] | null;
};
type Donut = {
  id: string;
  footerText: string;
  chartData: {
    label: string;
    value: number;
    fill: string;
  }[];
};
export const BansheePageDonuts = ({
  activeDonut,
  setActiveDonut,
  distributionData,
}: {
  activeDonut: string;
  setActiveDonut: (val: string) => void;
  distributionData: DistributionData | null;
}) => {
  const filteredCounts = useMemo(() => {
    return (distributionData?.statusCounts || []).filter(
      (sc) => sc.status && sc.status.toLowerCase() !== 'unmeasured',
    );
  }, [distributionData]);

  const chartConfigDynamic = useMemo(
    () => ({
      status: { label: 'status' },
      ...Object.fromEntries(
        filteredCounts.map((sc) => [
          sc.status,
          {
            label: getStatusLabel(sc.status),
            color: getStatusColorHex(sc.status),
          },
        ]),
      ),
    }),
    [filteredCounts],
  );

  if (!distributionData) return null;

  const totalDonut = {
    id: 'total',
    footerText: 'TOTAL',
    chartData: filteredCounts.map((sc) => ({
      label: sc.status,
      value: sc.count,
      fill: getStatusColorHex(sc.status),
    })),
  };

  const locationDonuts = (distributionData.byLocation || []).map((loc) => ({
    id: loc.locationId,
    footerText: loc.locationName,
    chartData: (loc.statusCounts || [])
      .filter((sc) => sc.status && sc.status.toLowerCase() !== 'unmeasured')
      .map((sc) => ({
        label: sc.status,
        value: sc.count,
        fill: getStatusColorHex(sc.status),
      })),
  }));

  const donuts: Donut[] = [totalDonut, ...locationDonuts];

  return (
    <div className="ui-banshee-flex ui-banshee-max-w-full ui-banshee-overflow-x-auto ui-banshee-gap-6 ui-banshee-mb-8 ui-banshee-pb-4 ui-banshee-scrollbar-thin">
      {donuts?.map((donut) => (
        <div
          key={donut.id}
          onClick={() => setActiveDonut(donut.id)}
          className={`ui-banshee-cursor-pointer ui-banshee-border-2 ui-banshee-transition-all ui-banshee-shrink-0 ${
            activeDonut === donut.id
              ? 'ui-banshee-border-blue-600'
              : 'ui-banshee-border-transparent hover:ui-banshee-border-gray-200'
          }`}
        >
          <SmallChartPieDonut
            footerText={donut.footerText}
            chartData={donut.chartData}
            chartConfig={chartConfigDynamic}
            chartItems={[]}
          />
        </div>
      ))}
    </div>
  );
};
