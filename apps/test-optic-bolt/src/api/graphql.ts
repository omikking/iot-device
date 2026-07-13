import type { OpticboltSpectrum, OpticboltTestResultSummary } from '../types';

const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL?.trim() || 'http://localhost:3333/graphql';

const GET_TEST_RESULTS = `
  query GetOpticboltTestResults($since: DateTime) {
    opticboltTestResults(since: $since) {
      id
      serialNumber
      boltType
      testedAt
      psi20
      psi100
      fibreCheck1
      fibreCheck2
      fibreCheck3
      updatedAt
      spectrums {
        id
        testResultId
        fbgIndex
        amplitude20
        wavelength20
        amplitude100
        wavelength100
        peakInitialNm
        peak20Nm
        peak100Nm
        strain20
        strain100
        load20
        load100
        time20Ms
        time100Ms
        calibrationFactor
        createdAt
      }
    }
  }
`;

const GET_SPECTRUMS_BY_SERIAL_NUMBER = `
  query GetOpticboltSpectrumsBySerialNumber($serialNumber: String!) {
    opticboltSpectrumsBySerialNumber(serialNumber: $serialNumber) {
      id
      testResultId
      fbgIndex
      amplitude20
      wavelength20
      amplitude100
      wavelength100
      peakInitialNm
      peak20Nm
      peak100Nm
      strain20
      strain100
      load20
      load100
      time20Ms
      time100Ms
      calibrationFactor
      createdAt
    }
  }
`;

async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const token = import.meta.env.VITE_API_ACCESS_TOKEN?.trim();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const payload = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  if (!response.ok || payload.errors?.length) {
    const message =
      payload.errors?.map((error) => error.message).join(', ') ||
      `GraphQL request failed (${response.status})`;
    throw new Error(message);
  }

  if (!payload.data) {
    throw new Error('GraphQL response did not include data');
  }

  return payload.data;
}

export interface OpticboltTestResultWithSpectrums extends OpticboltTestResultSummary {
  updatedAt: string;
  spectrums: OpticboltSpectrum[];
}

export async function fetchOpticboltTestResults(since?: string): Promise<OpticboltTestResultWithSpectrums[]> {
  const data = await graphqlRequest<{
    opticboltTestResults: OpticboltTestResultWithSpectrums[];
  }>(GET_TEST_RESULTS, { since });
  return data.opticboltTestResults;
}

export async function fetchOpticboltSpectrumsBySerialNumber(
  serialNumber: string,
): Promise<OpticboltSpectrum[]> {
  const data = await graphqlRequest<{
    opticboltSpectrumsBySerialNumber: OpticboltSpectrum[];
  }>(GET_SPECTRUMS_BY_SERIAL_NUMBER, { serialNumber });
  return data.opticboltSpectrumsBySerialNumber;
}


 