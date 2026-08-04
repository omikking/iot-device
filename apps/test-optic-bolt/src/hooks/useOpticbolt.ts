import { useCallback, useEffect, useMemo, useState } from 'react';
import { CACHE_KEYS, loadFromDB } from './useIndexedDB';
import type { HydraboltRecord, OpticboltSpectrum, OpticboltTestResultSummary, SerialOption } from '../types';

function toSerialOptions(results: OpticboltTestResultSummary[]): SerialOption[] {
  return Array.from(new Set(results.map((result) => result.serialNumber)))
    .sort()
    .map((serialNumber) => ({
      serialNumber,
      label: serialNumber,
    }));
}

export function useOpticbolt(isOnline: boolean) {
  const [testResults, setTestResults] = useState<OpticboltTestResultSummary[]>([]);
  const [selectedSerialNumber, setSelectedSerialNumber] = useState('');
  const [spectrums, setSpectrums] = useState<OpticboltSpectrum[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [hydraboltData, setHydraboltData] = useState<HydraboltRecord | null>(null);
  const [loadingHydrabolt, setLoadingHydrabolt] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'error' | null>('synced');

  const serialOptions = useMemo(() => toSerialOptions(testResults), [testResults]);
  const selectedResult = useMemo(
    () => testResults.find((result) => result.serialNumber === selectedSerialNumber) ?? null,
    [testResults, selectedSerialNumber],
  );
  const firstSpectrum = spectrums[0] ?? null;

  const loadTestResults = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      const cached = await loadFromDB<OpticboltTestResultSummary[]>(CACHE_KEYS.testResults);
      if (cached?.length) {
        setTestResults(cached);
      } else {
        setTestResults([]);
        setError('No cached test results available offline.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load test results');
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadSpectrums = useCallback(
    async (serialNumber: string) => {
      if (!serialNumber) {
        setSpectrums([]);
        return;
      }

      setLoadingDetail(true);
      setError(null);

      try {
        const cacheKey = CACHE_KEYS.spectrums(serialNumber);
        const cached = await loadFromDB<OpticboltSpectrum[]>(cacheKey);
        if (cached?.length) {
          setSpectrums(cached);
        } else {
          setSpectrums([]);
          setError('No cached spectrum data for this serial number.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load spectrum data');
      } finally {
        setLoadingDetail(false);
      }
    },
    [],
  );

  const loadHydrabolt = useCallback(async (boltType: string | null | undefined) => {
    if (!boltType) {
      setHydraboltData(null);
      return;
    }
    setLoadingHydrabolt(true);
    try {
      const cached = await loadFromDB<HydraboltRecord>(CACHE_KEYS.hydrabolt(boltType), 'hydraboltStore');
      setHydraboltData(cached);
    } catch (err) {
      console.error('Failed to load hydrabolt data', err);
      setHydraboltData(null);
    } finally {
      setLoadingHydrabolt(false);
    }
  }, []);

  // Listen for sync messages from the Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      console.log("service worker in navigator");
      
      const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'SYNC_STATUS') {
          console.log("useopticevent",event);
          
          setSyncStatus(event.data.status);
          if (event.data.status === 'synced') {
            void loadTestResults();
            if (selectedSerialNumber) {
              void loadSpectrums(selectedSerialNumber);
            }
            if (selectedResult?.boltType) {
              void loadHydrabolt(selectedResult.boltType);
            }
          }
        }
      };

      navigator.serviceWorker.addEventListener('message', handleMessage);

      // Trigger sync on load once service worker is active
      void navigator.serviceWorker.ready.then((registration) => {
        console.log("service worker is ready",registration);
        
        if (registration.active) {
          registration.active.postMessage({ type: 'START_SYNC' });
        }
      });

      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
  }, [loadTestResults, loadSpectrums, loadHydrabolt,isOnline]);

  // Load initial results
  useEffect(() => {
    void loadTestResults();
  }, [loadTestResults]);

  // Load spectrums when selected serial number changes
  useEffect(() => {
    void loadSpectrums(selectedSerialNumber);
  }, [selectedSerialNumber, loadSpectrums]);

  // Load hydrabolt data when selected result changes
  useEffect(() => {
    void loadHydrabolt(selectedResult?.boltType);
  }, [selectedResult?.boltType, loadHydrabolt]);

  const handleSerialChange = (serialNumber: string) => {
    setSelectedSerialNumber(serialNumber);
  };

  return {
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
    refresh: () => {
      // Trigger a manual sync request to the Service Worker
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'START_SYNC' });
      } else {
        void loadTestResults();
        if (selectedResult?.boltType) {
          void loadHydrabolt(selectedResult.boltType);
        }
      }
    },
  };
} 