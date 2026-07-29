import { useMemo } from 'react';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { useOpticbolt } from './hooks/useOpticbolt';
import PwaInstallPrompt from './components/PwaInstallPrompt';
import Header from './components/Header';
import OfflineBanner from './components/OfflineBanner';
import ParameterSidebar from './components/ParameterSidebar';
import DashboardGrid from './components/DashboardGrid';
import { buildSpectrum100Points, buildSpectrum20Points } from './utils/spectrumChart';
import { buildStrainVsLoadChart } from './utils/strainLoadChart';
import { buildTimeVsWavelengthChart } from './utils/timeWavelengthChart';

export default function App() {
  const isOnline = useNetworkStatus();
  const {
    serialOptions,
    selectedSerialNumber,
    selectedResult,
    spectrums,
    firstSpectrum,
    hydraboltData,
    loadingList,
    loadingDetail,
    loadingHydrabolt,
    error,
    syncStatus,
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
      <Header isOnline={isOnline} syncStatus={syncStatus} onRefresh={refresh} />
      
      <OfflineBanner isOnline={isOnline} />

      {error && (
        <div className="mx-6 mb-2 rounded-lg border border-error/20 bg-error-bg text-error text-sm px-4 py-3">
          {error}
        </div>
      )}

      <main className="flex-1 p-6 w-full max-w-[1200px] mx-auto grid gap-6 lg:grid-cols-4">
        <ParameterSidebar
          loadingList={loadingList}
          loadingDetail={loadingDetail}
          selectedSerialNumber={selectedSerialNumber}
          handleSerialChange={handleSerialChange}
          serialOptions={serialOptions}
          selectedResult={selectedResult}
          firstSpectrum={firstSpectrum}
        />

        <DashboardGrid
          selectedSerialNumber={selectedSerialNumber}
          selectedResult={selectedResult}
          hydraboltData={hydraboltData}
          loadingHydrabolt={loadingHydrabolt}
          loadingDetail={loadingDetail}
          spectrum20Points={spectrum20Points}
          spectrum100Points={spectrum100Points}
          timeWavelengthChart={timeWavelengthChart}
          strainLoadChart={strainLoadChart}
          spectrums={spectrums}
        />
      </main>

      <PwaInstallPrompt />
    </div>
  );
}

