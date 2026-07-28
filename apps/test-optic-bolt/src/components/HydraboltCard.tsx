import type { HydraboltRecord } from '../types';
import { Card, Field, SectionTitle } from './ui';

interface HydraboltCardProps {
  data: HydraboltRecord | null | undefined;
  loading: boolean;
  className?: string;
}

export default function HydraboltCard({ data, loading, className = '' }: HydraboltCardProps) {
  if (loading) {
    return (
      <Card className={`sm:col-span-2 ${className}`}>
        <SectionTitle>Hydra Bolt Specifications</SectionTitle>
        <div className="flex items-center justify-center py-8">
          <span className="inline-block w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-[spin_0.8s_linear_infinite]" />
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className={`sm:col-span-2 flex items-center justify-center py-8 text-text-muted text-sm border-dashed ${className}`}>
        No Hydra Bolt specifications available for this bolt type.
      </Card>
    );
  }

  return (
    <Card className={`sm:col-span-2 flex flex-col gap-4 ${className}`}>
      <SectionTitle>Hydra Bolt Specifications: {data.partNumber}</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Field label="Part number" value={data.partNumber} />
        <Field label="Drawing number" value={data.drawingNumber ?? '-'} />
        <Field label="Bolt length" value={data.boltLength != null ? `${data.boltLength}` : '-'} />
        <Field label="Number of FBGs" value={data.numberOfFBG != null ? String(data.numberOfFBG) : '-'} />
        <Field label="Elastic limit" value={data.elasticLimit != null ? String(data.elasticLimit) : '-'} />
        <Field label="Low plastic limit" value={data.lowPlasticLimit != null ? String(data.lowPlasticLimit) : '-'} />
        <Field label="High plastic limit" value={data.highPlasticLimit != null ? String(data.highPlasticLimit) : '-'} />
        <Field label="Calibration (min / max)" value={`${data.minCalibrationFactor ?? '-'} / ${data.maxCalibrationFactor ?? '-'}`} />
      </div>
      {data.description && (
        <div className="flex flex-col gap-1.5 mt-2">
          <span className="text-xs font-medium text-text-muted">Description</span>
          <div className="rounded-lg border border-border bg-surface-alt px-3 py-2.5 min-h-[40px] text-sm text-text">
            {data.description}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">FBG Positions</span>
          <div className="rounded-lg border border-border bg-surface-alt px-3 py-2.5 text-sm text-text font-mono">
            {data.positionOfFBGs?.length ? data.positionOfFBGs.join(', ') : '-'}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">Initial Wavelengths</span>
          <div className="rounded-lg border border-border bg-surface-alt px-3 py-2.5 text-sm text-text font-mono">
            {data.initialWavelength?.length ? data.initialWavelength.join(', ') : '-'}
          </div>
        </div>
      </div>
    </Card>
  );
}
