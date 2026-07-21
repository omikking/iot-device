import { SerialOption, OpticboltTestResultSummary, OpticboltSpectrum } from '../types';
import { Card, Field, SectionTitle, StyledSelect } from './ui';
import { formatDate, formatNumber, formatBoolean } from '../utils/format';

interface ParameterSidebarProps {
  loadingList: boolean;
  loadingDetail: boolean;
  selectedSerialNumber: string;
  handleSerialChange: (value: string) => void;
  serialOptions: SerialOption[];
  selectedResult?: OpticboltTestResultSummary | null;
  firstSpectrum?: OpticboltSpectrum | null;
}

export default function ParameterSidebar({
  loadingList,
  loadingDetail,
  selectedSerialNumber,
  handleSerialChange,
  serialOptions,
  selectedResult,
  firstSpectrum,
}: ParameterSidebarProps) {
  return (
    <Card className="lg:col-span-1 flex flex-col gap-4">
      <SectionTitle>Parameters</SectionTitle>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-text-muted">Serial number</span>
        {loadingList ? (
          <div className="rounded-lg border border-border bg-surface-alt px-3 py-2.5 min-h-[40px] flex items-center">
            <span className="inline-block w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-[spin_0.8s_linear_infinite]" />
          </div>
        ) : (
          <StyledSelect
            value={selectedSerialNumber}
            onChange={handleSerialChange}
            placeholder="Select SN"
            options={serialOptions.map((option) => ({
              value: option.serialNumber,
              label: option.label,
            }))}
            disabled={serialOptions.length === 0}
          />
        )}
      </div>

      <Field label="Bolt type" value={selectedResult?.boltType ?? '-'} loading={loadingDetail} />
      <Field label="FBG number" value={formatNumber(firstSpectrum?.fbgIndex)} loading={loadingDetail} />
      <Field label="Test date" value={formatDate(selectedResult?.testedAt)} loading={loadingDetail} />
      <Field
        label="Fiber check 1"
        value={formatBoolean(selectedResult?.fibreCheck1)}
        loading={loadingDetail}
      />
      <Field
        label="Fiber check 2"
        value={formatBoolean(selectedResult?.fibreCheck2)}
        loading={loadingDetail}
      />
      <Field
        label="Fiber check 3"
        value={formatBoolean(selectedResult?.fibreCheck3)}
        loading={loadingDetail}
      />
    </Card>
  );
}
