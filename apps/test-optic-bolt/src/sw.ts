/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { saveToDB, loadFromDB, CACHE_KEYS } from './hooks/useIndexedDB';
import { fetchHydrabolts, fetchOpticboltTestResults } from './api/graphql';
import type { OpticboltTestResultSummary } from './types';

declare let self: ServiceWorkerGlobalScope & typeof globalThis;

precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event: any) => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(performBackgroundSync());
});

let isSyncing = false;

async function broadcastSyncStatus(status: 'syncing' | 'synced' | 'error') {
  try {
    const clientsList = await self.clients.matchAll({ type: 'window' });
    console.log("clientlist",clientsList);
    for (const client of clientsList) {
      client.postMessage({ type: 'SYNC_STATUS', status });
    }
  } catch (err) {
    console.error('Failed to broadcast sync status:', err);
  }
}

async function performBackgroundSync() {
  if (isSyncing) return;
  isSyncing = true;
  console.log("syncing");
  try {
    await broadcastSyncStatus('syncing');

    // 1. Get latest sync timestamp from IndexedDB
    const since = await loadFromDB<string>(CACHE_KEYS.latestSyncTimestamp);

    // 2. Fetch results updated since this timestamp from the API
    const newOrUpdatedResults = await fetchOpticboltTestResults(since || undefined);
    console.log("newOrUpdatedResults",newOrUpdatedResults);
    
    const newOrUpdatedHydrabolts = await fetchHydrabolts(since || undefined);
    console.log("newOrUpdatedHydrabolts", newOrUpdatedHydrabolts);

    let maxTimestamp = since ? new Date(since).getTime() : 0;

    if (newOrUpdatedResults.length > 0) {
      // 3. Load the existing cached results list from DB
      const existingResults = (await loadFromDB<OpticboltTestResultSummary[]>(CACHE_KEYS.testResults)) || [];

      // Combine existing with new, replacing duplicates with the newer versions
      const resultsMap = new Map<string, OpticboltTestResultSummary>();
      for (const res of existingResults) {
        resultsMap.set(res.serialNumber, res);
      }
      for (const newRes of newOrUpdatedResults) {
        // Cache the spectrum data separately for offline use
        const spectrumCacheKey = CACHE_KEYS.spectrums(newRes.serialNumber);
        await saveToDB(spectrumCacheKey, newRes.spectrums);

        // Save the summary in the map
        const { spectrums, updatedAt, ...summary } = newRes;
        resultsMap.set(summary.serialNumber, summary);
      }

      const combinedResults = Array.from(resultsMap.values());
      // Sort combinedResults by testedAt desc to preserve correct ordering in frontend dropdown
      combinedResults.sort((a, b) => new Date(b.testedAt).getTime() - new Date(a.testedAt).getTime());

      // 4. Save the updated list of results back to DB
      await saveToDB(CACHE_KEYS.testResults, combinedResults);

      for (const res of newOrUpdatedResults) {
        const updatedTime = new Date(res.updatedAt).getTime();
        if (updatedTime > maxTimestamp) {
          maxTimestamp = updatedTime;
        }
      }
    }

    if (newOrUpdatedHydrabolts.length > 0) {
      for (const bolt of newOrUpdatedHydrabolts) {
        const hydraboltCacheKey = CACHE_KEYS.hydrabolt(bolt.partNumber);
        await saveToDB(hydraboltCacheKey, bolt, 'hydraboltStore');

        const updatedTime = new Date(bolt.updatedAt).getTime();
        if (updatedTime > maxTimestamp) {
          maxTimestamp = updatedTime;
        }
      }
    }

    if (maxTimestamp > (since ? new Date(since).getTime() : 0)) {
      await saveToDB(CACHE_KEYS.latestSyncTimestamp, new Date(maxTimestamp).toISOString());
    }

    await broadcastSyncStatus('synced');
  } catch (error) {
    console.error('Background sync failed:', error);
    await broadcastSyncStatus('error');
  } finally {
    isSyncing = false;
  }
}

// Poll every 15 minutes
setInterval(() => {
  void performBackgroundSync();
}, 15 * 60 * 1000);

self.addEventListener('message', (event: any) => {
  // console.log("messageevent",event);
  
  if (event.data && event.data.type === 'START_SYNC') {
    console.log("syncingevnt");
    
    event.waitUntil(performBackgroundSync());
  }
}); 