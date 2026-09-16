'use client';

import { SmallChartPieDonut } from '@gsp/ui-banshee';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getStatusColorHex, getStatusLabel } from '@/libs/status-color-utils';

type StatusCount = {
  status: string;
  count: number;
};

type LocationDistribution = {
  locationId: string;
  locationName: string;
  siteName: string;
  levelName: string;
  driveName: string;
  statusCounts: StatusCount[];
};

type DistributionData = {
  statusCounts: StatusCount[];
  byLocation?: LocationDistribution[] | null;
};
type Donut = {
  id: string;
  footerText: string;
  locationInfo: string;
  chartData: {
    label: string;
    value: number;
    fill: string;
  }[];
};

const MIN_THUMB_PX = 24;

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
      (sc) => sc.status && sc.status.toLowerCase() !== 'not_measurable',
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

  const donuts = useMemo<Donut[]>(() => {
    if (!distributionData) return [];
    const totalDonut: Donut = {
      id: 'total',
      footerText: 'TOTAL',
      locationInfo: 'TOTAL',
      chartData: filteredCounts.map((sc) => ({
        label: sc.status,
        value: sc.count,
        fill: getStatusColorHex(sc.status),
      })),
    };
    const locationDonuts: Donut[] = (distributionData.byLocation || []).map(
      (loc) => ({
        id: loc.locationId,
        footerText: loc.locationName,
        locationInfo: [
          loc.siteName,
          loc.levelName,
          loc.driveName,
          loc.locationName,
        ]
          .filter(Boolean)
          .join(' - '),
        chartData: (loc.statusCounts || [])
          .filter(
            (sc) => sc.status && sc.status.toLowerCase() !== 'not_measurable',
          )
          .map((sc) => ({
            label: sc.status,
            value: sc.count,
            fill: getStatusColorHex(sc.status),
          })),
      }),
    );
    return [totalDonut, ...locationDonuts];
  }, [distributionData, filteredCounts]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startScroll: number } | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const updateThumb = useCallback(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    const overflow = sc.scrollWidth - sc.clientWidth > 1;
    setIsOverflowing(overflow);
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!overflow || !track || !thumb) return;
    const trackW = track.clientWidth;
    if (trackW <= 0) return;
    const ratio = Math.min(1, sc.clientWidth / Math.max(sc.scrollWidth, 1));
    const thumbW = Math.max(MIN_THUMB_PX, Math.floor(ratio * trackW));
    const maxScroll = sc.scrollWidth - sc.clientWidth;
    const TRACK_PADDING = 2;
    const range = Math.max(0, trackW - thumbW - TRACK_PADDING * 2);
    const left = maxScroll > 0 ? (sc.scrollLeft / maxScroll) * range : 0;
    thumb.style.width = `${thumbW}px`;
    thumb.style.transform = `translateX(${left}px)`;
  }, []);

  useEffect(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    updateThumb();
    const onScroll = () => updateThumb();
    sc.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(() => updateThumb());
    ro.observe(sc);
    Array.from(sc.children).forEach((c) => ro.observe(c));
    return () => {
      sc.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, [updateThumb, donuts.length]);

  useEffect(() => {
    if (isOverflowing) updateThumb();
  }, [isOverflowing, updateThumb]);

  const onThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const sc = scrollRef.current;
    if (!sc) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startScroll: sc.scrollLeft };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onThumbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    const sc = scrollRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!d || !sc || !track || !thumb) return;
    const maxScroll = sc.scrollWidth - sc.clientWidth;
    const range = track.clientWidth - thumb.clientWidth;
    if (range <= 0 || maxScroll <= 0) return;
    const dx = e.clientX - d.startX;
    sc.scrollLeft = d.startScroll + (dx / range) * maxScroll;
  };

  const onThumbPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const onTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const sc = scrollRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!sc || !track || !thumb) return;
    const rect = track.getBoundingClientRect();
    const maxScroll = sc.scrollWidth - sc.clientWidth;
    const range = track.clientWidth - thumb.clientWidth;
    if (range <= 0 || maxScroll <= 0) return;
    const x = e.clientX - rect.left - thumb.clientWidth / 2;
    const clamped = Math.max(0, Math.min(range, x));
    sc.scrollLeft = (clamped / range) * maxScroll;
  };

  if (!distributionData) return null;

  return (
    <div className="ui-banshee-mb-8">
      <div
        ref={scrollRef}
        className="banshee-donut-scroll ui-banshee-flex ui-banshee-max-w-full ui-banshee-overflow-x-auto ui-banshee-gap-6"
      >
        {donuts.map((donut) => (
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
              locationInfo={donut.locationInfo}
              chartConfig={chartConfigDynamic}
              chartItems={[]}
            />
          </div>
        ))}
      </div>

      {isOverflowing && (
        <div className="ui-banshee-flex ui-banshee-justify-end ui-banshee-mt-3">
          <div
            ref={trackRef}
            onPointerDown={onTrackPointerDown}
            className="ui-banshee-relative ui-banshee-h-[14px] ui-banshee-w-[200px] ui-banshee-border ui-banshee-border-neutral-2 "
          >
            <div
              ref={thumbRef}
              onPointerDown={onThumbPointerDown}
              onPointerMove={onThumbPointerMove}
              onPointerUp={onThumbPointerUp}
              onPointerCancel={onThumbPointerUp}
              className="ui-banshee-absolute ui-banshee-top-[2px] ui-banshee-left-[2px] ui-banshee-h-2 ui-banshee-bg-neutral-5 ui-banshee-rounded-full ui-banshee-cursor-grab active:ui-banshee-cursor-grabbing"
              style={{
                width: `${MIN_THUMB_PX}px`,
                touchAction: 'none',
                userSelect: 'none',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
