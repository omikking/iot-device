import {
  Exchange,
  Operation,
  OperationResult,
} from 'urql';
import { BoltResult } from '@/gql/graphql';
import {
  fromPromise,
  fromValue,
  map,
  mergeMap,
  pipe,
} from 'wonka';
import {
  queryOfflineBoltResults,
  queryOfflineCompanyHierarchy,
  saveOfflineBoltResultSnapshot,
} from '@/libs/offline/offlineBoltResultsIdb';
import {
  queryOfflineHazardsByCompany,
  saveOfflineHazardsSnapshots,
} from '@/libs/offline/offlineReportedHazardsIdb';

const OFFLINE_BOLT_RESULTS_SYNC_QUERY = `
  query OfflineBoltResultsSync($siteId: String, $startDate: DateTime, $endDate: DateTime) {
    boltResults(siteId: $siteId, startDate: $startDate, endDate: $endDate) {
      results {
        id
        createdAt
        updatedAt
        measuredAt
        boltNumber
        boltType
        peakLoad
        peakDisplacement
        positionInRing
        result
        isHazard
        hazardCompletedDate
        abortReason
        comment
        image
        siteId
        levelId
        driveId
        locationId
        userId
        site {
          siteName
        }
        drive {
          driveName
        }
        location {
          locationName
        }
        level {
          levelName
        }
      }
    }
  }
`;

const inFlightSnapshotSync = new Set<string>();

type BoltResultsVariables = {
  siteId?: string;
  levelId?: string;
  driveId?: string;
  locationId?: string;
  result?: Array<'PASS' | 'FAIL' | 'ABORT'>;
  isHazard?: boolean;
  withImage?: boolean;
  withComment?: boolean;
  startDate?: string | Date;
  endDate?: string | Date;
  offset?: number;
  limit?: number;
};

function toValidDate(value: unknown): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function resolveCompanyIdFromPath(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const match = window.location.pathname.match(
    /^\/(bolt-results|reported-hazards|overview)\/([^/]+)/,
  );
  if (match?.[2]) {
    return match[2];
  }

  const menuMatch = window.location.pathname.match(/^\/menu\/([^/]+)/);
  if (menuMatch?.[1]) {
    return menuMatch[1];
  }

  // Fallback: use the second segment as company id for company-scoped routes.
  const segments = window.location.pathname.split('/').filter(Boolean);
  if (segments.length >= 2) {
    return segments[1];
  }

  return null;
}

function getCompanyIdFromVariables(operation: Operation): string | null {
  const rawId = (operation.variables as { id?: unknown } | undefined)?.id;
  return typeof rawId === 'string' && rawId.length > 0 ? rawId : null;
}

function extractHazardsFromResult(result: OperationResult): BoltResult[] {
  const hazards = (result.data as { hazards?: unknown[] } | undefined)?.hazards;
  return Array.isArray(hazards) ? (hazards as BoltResult[]) : [];
}

function isPaginatedBoltResultsQuery(operation: Operation): boolean {
  if (operation.kind !== 'query') {
    return false;
  }

  const vars = (operation.variables ?? {}) as Record<string, unknown>;
  return (
    typeof vars.siteId === 'string' &&
    ('offset' in vars || 'limit' in vars)
  );
}

function isCompanyQueryOperation(operation: Operation): boolean {
  if (operation.kind !== 'query') {
    return false;
  }

  const queryDoc = operation.query as { loc?: { source?: { body?: string } } };
  const operationBody = queryDoc.loc?.source?.body ?? '';
  return operationBody.includes('company(');
}

function isHazardsQueryOperation(operation: Operation): boolean {
  if (operation.kind !== 'query') {
    return false;
  }

  const queryDoc = operation.query as { loc?: { source?: { body?: string } } };
  const operationBody = queryDoc.loc?.source?.body ?? '';
  return operationBody.includes('hazards(');
}

function shouldUseOfflineFallback(result: OperationResult): boolean {
  const hasOfflineGraphQlError = result.error?.graphQLErrors?.some(
    (entry) => entry.extensions?.code === 'OFFLINE',
  );
  
  const hasNetworkError = result.error?.networkError;

  const isBrowserOffline = typeof navigator !== 'undefined' && !navigator.onLine;

  return Boolean(hasOfflineGraphQlError || hasNetworkError || isBrowserOffline);
}

function buildEmptyBoltResultsResult(operation: Operation): OperationResult {
  return {
    operation,
    stale: false,
    hasNext: false,
    data: {
      boltResults: {
        totalRecords: 0,
        failedCount: 0,
        hazardCount: 0,
        passedCount: 0,
        averageTons: 0,
        results: [],
      },
    },
  };
}

function buildEmptyCompanyResult(operation: Operation): OperationResult {
  return {
    operation,
    stale: false,
    hasNext: false,
    data: {
      company: null,
    },
  };
}

function buildEmptyHazardsResult(operation: Operation): OperationResult {
  return {
    operation,
    stale: false,
    hasNext: false,
    data: {
      hazards: [],
    },
  };
}

function resolveOperationUrl(operation: Operation): string | undefined {
  if (typeof operation.context.url === 'string') {
    return operation.context.url;
  }

  return undefined;
}

function resolveFetchOptions(operation: Operation): RequestInit {
  const options =
    typeof operation.context.fetchOptions === 'function'
      ? operation.context.fetchOptions()
      : (operation.context.fetchOptions ?? {});

  return {
    ...(options as RequestInit),
  };
}

function syncBoltResultsSnapshotInBackground(
  operation: Operation,
  companyId: string,
  variables: BoltResultsVariables,
): void {
  const siteId = variables.siteId;
  if (!siteId) {
    return;
  }

  const syncKey = `${companyId}::${siteId}::${variables.startDate ?? 'none'}::${variables.endDate ?? 'none'}`;
  if (inFlightSnapshotSync.has(syncKey)) {
    return;
  }

  const url = resolveOperationUrl(operation);
  if (!url) {
    return;
  }

  inFlightSnapshotSync.add(syncKey);

  const baseFetchOptions = resolveFetchOptions(operation);
  const headers = new Headers(baseFetchOptions.headers as HeadersInit | undefined);
  headers.set('Content-Type', 'application/json');

  fetch(url, {
    ...baseFetchOptions,
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: OFFLINE_BOLT_RESULTS_SYNC_QUERY,
      variables: {
        siteId: variables.siteId,
        startDate: variables.startDate,
        endDate: variables.endDate,
      },
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as {
        data?: { boltResults?: { results?: unknown[] } };
      };
      const results = payload?.data?.boltResults?.results;
      if (!Array.isArray(results) || results.length === 0) {
        return;
      }

      await saveOfflineBoltResultSnapshot(
        {
          companyId,
          siteId,
          startDate: toValidDate(variables.startDate),
          endDate: toValidDate(variables.endDate),
        },
        results as BoltResult[],
      );
    })
    .finally(() => {
      inFlightSnapshotSync.delete(syncKey);
    });
}

async function buildOfflineBoltResultsFallbackResult(
  operation: Operation,
): Promise<OperationResult> {
  const companyId = resolveCompanyIdFromPath();
  if (!companyId) {
    return buildEmptyBoltResultsResult(operation);
  }

  const variables = (operation.variables ?? {}) as BoltResultsVariables;
  if (!variables.siteId) {
    return buildEmptyBoltResultsResult(operation);
  }

  const offlineResponse = await queryOfflineBoltResults({
    companyId,
    siteId: variables.siteId,
    levelId: variables.levelId,
    driveId: variables.driveId,
    locationId: variables.locationId,
    isHazard: variables.isHazard,
    withImage: variables.withImage,
    withComment: variables.withComment,
    startDate: toValidDate(variables.startDate),
    endDate: toValidDate(variables.endDate),
    result: variables.result,
    offset: variables.offset,
    limit: variables.limit,
  });

  return {
    operation,
    stale: false,
    hasNext: false,
    data: {
      boltResults: {
        totalRecords: offlineResponse?.totalRecords ?? 0,
        failedCount: offlineResponse?.failedCount ?? 0,
        hazardCount: offlineResponse?.hazardCount ?? 0,
        passedCount: offlineResponse?.passedCount ?? 0,
        averageTons: offlineResponse?.averageTons ?? 0,
        results: offlineResponse?.results ?? [],
      },
    },
  };
}

async function buildOfflineCompanyFallbackResult(
  operation: Operation,
): Promise<OperationResult> {
  const companyId =
    getCompanyIdFromVariables(operation) ?? resolveCompanyIdFromPath();
  if (!companyId) {
    return buildEmptyCompanyResult(operation);
  }

  const offlineCompany = await queryOfflineCompanyHierarchy(companyId);
  if (!offlineCompany) {
    return buildEmptyCompanyResult(operation);
  }

  return {
    operation,
    stale: false,
    hasNext: false,
    data: offlineCompany,
  };
}

async function buildOfflineHazardsFallbackResult(
  operation: Operation,
): Promise<OperationResult> {
  const companyId =
    getCompanyIdFromVariables(operation) ?? resolveCompanyIdFromPath();
  if (!companyId) {
    return buildEmptyHazardsResult(operation);
  }

  const offlineHazards = await queryOfflineHazardsByCompany(companyId);
  if (!offlineHazards) {
    return buildEmptyHazardsResult(operation);
  }

  return {
    operation,
    stale: false,
    hasNext: false,
    data: offlineHazards,
  };
}

export const offlineBoltResultsExchange: Exchange =
  ({ forward }) =>
  (ops$) =>
    pipe(
      forward(ops$),
      mergeMap((result: OperationResult) => {
        const operation = result.operation;
        const handlesBoltResults = isPaginatedBoltResultsQuery(operation);
        const handlesCompanyHierarchy = isCompanyQueryOperation(operation);
        const handlesHazards = isHazardsQueryOperation(operation);

        if (!handlesBoltResults && !handlesCompanyHierarchy && !handlesHazards) {
          return fromValue(result);
        }

        const companyId = resolveCompanyIdFromPath();
        const variables = (operation.variables ?? {}) as BoltResultsVariables;

        if (
          handlesBoltResults &&
          companyId &&
          variables.siteId &&
          result.data &&
          !result.error &&
          Array.isArray((result.data as { boltResults?: { results?: unknown[] } }).boltResults?.results)
        ) {
          const results = (result.data as { boltResults?: { results?: unknown[] } }).boltResults?.results;
          if (Array.isArray(results) && results.length > 0) {
            saveOfflineBoltResultSnapshot(
              {
                companyId,
                siteId: variables.siteId,
                startDate: toValidDate(variables.startDate),
                endDate: toValidDate(variables.endDate),
              },
              results as BoltResult[],
            );
          }

          syncBoltResultsSnapshotInBackground(operation, companyId, variables);
        }

        if (handlesHazards && result.data && !result.error) {
          const hazards = extractHazardsFromResult(result);
          const hazardCompanyId =
            getCompanyIdFromVariables(operation) ?? resolveCompanyIdFromPath();

          if (hazardCompanyId && hazards.length > 0) {
            saveOfflineHazardsSnapshots(hazardCompanyId, hazards);
          }
        }

        if (!shouldUseOfflineFallback(result)) {
          return fromValue(result);
        }

        if (handlesCompanyHierarchy) {
          return pipe(
            fromPromise(buildOfflineCompanyFallbackResult(operation)),
            map((offlineResult: OperationResult) => offlineResult),
          );
        }

        if (handlesHazards) {
          return pipe(
            fromPromise(buildOfflineHazardsFallbackResult(operation)),
            map((offlineResult: OperationResult) => offlineResult),
          );
        }

        return pipe(
          fromPromise(buildOfflineBoltResultsFallbackResult(operation)),
          map((offlineResult: OperationResult) => offlineResult),
        );
      }),
    );
