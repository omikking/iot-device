import { LucideZap } from 'lucide-react';
import { useMemo } from 'react';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { useOpticbolt } from './hooks/useOpticbolt';
import PwaInstallPrompt from './components/PwaInstallPrompt';
import SpectrumChart from './components/SpectrumChart';
import TimeVsWavelengthChart from './components/TimeVsWavelengthChart';
import StrainVsLoadChart from './components/StrainVsLoadChart';
import { Card, Field, SectionTitle, StyledSelect } from './components/ui';
import { buildSpectrum100Points, buildSpectrum20Points } from './utils/spectrumChart';
import { buildStrainVsLoadChart } from './utils/strainLoadChart';
import { buildTimeVsWavelengthChart } from './utils/timeWavelengthChart';

function formatDate(value?: string | null): string {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
}

function formatNumber(value?: number | null): string {
  if (value == null) return '-';
  return String(value);
}

export default function App() {
  const isOnline = useNetworkStatus();
  const {
    serialOptions,
    selectedSerialNumber,
    selectedResult,
    spectrums,
    firstSpectrum,
    loadingList,
    loadingDetail,
    error,
    handleSerialChange,
    refresh,
  } = useOpticbolt(isOnline);

  const spectrum20Points = useMemo(() => buildSpectrum20Points(spectrums), [spectrums]);
  const spectrum100Points = useMemo(() => buildSpectrum100Points(spectrums), [spectrums]);
  const timeWavelengthChart = useMemo(
    () => buildTimeVsWavelengthChart(spectrums),
    [spectrums],
  );
  const strainLoadChart = useMemo(() => buildStrainVsLoadChart(spectrums), [spectrums]);

  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans text-text">
      <header className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warn-bg text-warn flex items-center justify-center">
            <LucideZap size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text">Optic Bolt Testing</h1>
            <p className="text-xs text-text-muted">Spectrum analysis and test results</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-accent text-white hover:bg-accent-hover"
        >
          Refresh
        </button>
      </header>

      {!isOnline && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-600 text-sm font-medium py-2 px-4 flex items-center justify-center gap-2">
          You are currently offline. Using cached data.
        </div>
      )}

      <div className="px-4 py-3 flex justify-end">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-error bg-error-bg px-3 py-1 rounded-md">
          Must work offline / upon data sync
        </span>
      </div>

      {error && (
        <div className="mx-6 mb-2 rounded-lg border border-error/20 bg-error-bg text-error text-sm px-4 py-3">
          {error}
        </div>
      )}

      <main className="flex-1 p-6 w-full max-w-[1200px] mx-auto grid gap-6 lg:grid-cols-4">
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
            label="Calculated parameter 1"
            value={
              firstSpectrum?.calibrationFactor != null
                ? `Calibration Factor: ${firstSpectrum.calibrationFactor}`
                : '-'
            }
            loading={loadingDetail}
          />
          <Field
            label="Calculated parameter 2"
            value={
              firstSpectrum?.strain20 != null ? `Strain @ 20 PSI: ${firstSpectrum.strain20}` : '-'
            }
            loading={loadingDetail}
          />
          <Field
            label="Calculated parameter 3"
            value={
              firstSpectrum?.strain100 != null ? `Strain @ 100 PSI: ${firstSpectrum.strain100}` : '-'
            }
            loading={loadingDetail}
          />
        </Card>

        <div className="lg:col-span-3 grid gap-4 sm:grid-cols-2">
          <SpectrumChart
            title={`Spectrum 1 (Spectrum_20 / Amplitude_20 — PSI ${selectedResult?.psi20 ?? '-'} step)`}
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
            title={`Spectrum 2 (Spectrum_100 / Amplitude_100 — PSI ${selectedResult?.psi100 ?? '-'} step)`}
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
        </div>
      </main>

      <PwaInstallPrompt />
    </div>
  );
}
