import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchOpticboltSpectrumsBySerialNumber,
  fetchOpticboltTestResults,
} from '../api/graphql';
import { CACHE_KEYS, loadFromDB, saveToDB } from './useIndexedDB';
import type { OpticboltSpectrum, OpticboltTestResultSummary, SerialOption } from '../types';

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
  const [error, setError] = useState<string | null>(null);

  const serialOptions = useMemo(() => toSerialOptions(testResults), [testResults]);
  const selectedResult = useMemo(
    () => testResults.find((result) => result.serialNumber === selectedSerialNumber) ?? null,
    [testResults, selectedSerialNumber],
  );
  const firstSpectrum = spectrums[0] ?? null;

  const loadTestResults = useCallback(async () => {
    setLoadingList(true);
    setError(null);

    const cached = await loadFromDB<OpticboltTestResultSummary[]>(CACHE_KEYS.testResults);
    if (cached?.length) {
      setTestResults(cached);
    }

    if (!isOnline) {
      setLoadingList(false);
      if (!cached?.length) {
        setError('No cached test results available offline.');
      }
      return;
    }

    try {
      const results = await fetchOpticboltTestResults();
      setTestResults(results);
      await saveToDB(CACHE_KEYS.testResults, results);
    } catch (err) {
      if (!cached?.length) {
        setError(err instanceof Error ? err.message : 'Failed to load test results');
      }
    } finally {
      setLoadingList(false);
    }
  }, [isOnline]);

  const loadSpectrums = useCallback(
    async (serialNumber: string) => {
      if (!serialNumber) {
        setSpectrums([]);
        return;
      }

      setLoadingDetail(true);
      setError(null);

      const cacheKey = CACHE_KEYS.spectrums(serialNumber);
      const cached = await loadFromDB<OpticboltSpectrum[]>(cacheKey);
      if (cached?.length) {
        setSpectrums(cached);
      }

      if (!isOnline) {
        setLoadingDetail(false);
        if (!cached?.length) {
          setError('No cached spectrum data for this serial number.');
        }
        return;
      }

      try {
        const nextSpectrums = await fetchOpticboltSpectrumsBySerialNumber(serialNumber);
        setSpectrums(nextSpectrums);
        await saveToDB(cacheKey, nextSpectrums);
      } catch (err) {
        if (!cached?.length) {
          setError(err instanceof Error ? err.message : 'Failed to load spectrum data');
        }
      } finally {
        setLoadingDetail(false);
      }
    },
    [isOnline],
  );

  useEffect(() => {
    void loadTestResults();
  }, [loadTestResults]);

  useEffect(() => {
    void loadSpectrums(selectedSerialNumber);
  }, [selectedSerialNumber, loadSpectrums]);

  const handleSerialChange = (serialNumber: string) => {
    setSelectedSerialNumber(serialNumber);
  };

  return {
    serialOptions,
    selectedSerialNumber,
    selectedResult,
    spectrums,
    firstSpectrum,
    loadingList,
    loadingDetail,
    error,
    handleSerialChange,
    refresh: loadTestResults,
  };
}
