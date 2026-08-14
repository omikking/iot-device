import HydraboltCard from './HydraboltCard';
import SpectrumChart from './SpectrumChart';
import TimeVsWavelengthChart from './TimeVsWavelengthChart';
import StrainVsLoadChart from './StrainVsLoadChart';
import StrainTable from './StrainTable';
import { HydraboltRecord, SpectrumChartPoint, OpticboltSpectrum, OpticboltTestResultSummary } from '../types';
import type { TimeWavelengthChartData } from '../utils/timeWavelengthChart';
import type { StrainLoadChartData } from '../utils/strainLoadChart';

interface DashboardGridProps {
  selectedSerialNumber: string;
  selectedResult?: OpticboltTestResultSummary | null;
  hydraboltData?: HydraboltRecord | null;
  loadingHydrabolt: boolean;
  loadingDetail: boolean;
  spectrum20Points: SpectrumChartPoint[];
  spectrum100Points: SpectrumChartPoint[];
  timeWavelengthChart: TimeWavelengthChartData;
  strainLoadChart: StrainLoadChartData;
  spectrums: OpticboltSpectrum[];
}

export default function DashboardGrid({
  selectedSerialNumber,
  selectedResult,
  hydraboltData,
  loadingHydrabolt,
  loadingDetail,
  spectrum20Points,
  spectrum100Points,
  timeWavelengthChart,
  strainLoadChart,
  spectrums,
}: DashboardGridProps) {
  return (
    <div className="lg:col-span-3 grid gap-4 sm:grid-cols-2">
      <HydraboltCard data={hydraboltData} loading={loadingHydrabolt} />
      <SpectrumChart
        title="Spectrum 1 (Spectrum_20 / Amplitude_20)"
        points={spectrum20Points}
        loading={loadingDetail}
        strokeColor="#1e3a8a"
        emptyMessage={
          selectedSerialNumber
            ? 'No peak data available for Spectrum 1.'
            : 'Select a serial number to view Spectrum 1.'
        }
      />
      <SpectrumChart
        title="Spectrum 2 (Spectrum_100 / Amplitude_100)"
        points={spectrum100Points}
        loading={loadingDetail}
        strokeColor="#c2410c"
        emptyMessage={
          selectedSerialNumber
            ? 'No peak data available for Spectrum 2.'
            : 'Select a serial number to view Spectrum 2.'
        }
      />
      <TimeVsWavelengthChart
        chartData={timeWavelengthChart}
        loading={loadingDetail}
        emptyMessage={
          selectedSerialNumber
            ? 'No peak wavelength time-series data for this serial number.'
            : 'Select a serial number to view Time vs Wavelength.'
        }
      />
      <StrainVsLoadChart
        chartData={strainLoadChart}
        loading={loadingDetail}
        emptyMessage={
          selectedSerialNumber
            ? 'No strain vs load data for this serial number.'
            : 'Select a serial number to view Strain vs Load.'
        }
      />
      <StrainTable spectrums={spectrums} loading={loadingDetail} />
    </div>
  );
}
