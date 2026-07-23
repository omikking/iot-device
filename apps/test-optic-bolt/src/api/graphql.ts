import type { HydraboltRecord, OpticboltSpectrum, OpticboltTestResultSummary } from '../types';

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

const GET_HYDRABOLTS = `
  query GetHydrabolts($since: DateTime) {
    hydrabolts(since: $since) {
      id
      partNumber
      drawingNumber
      boltLength
      description
      numberOfFBG
      positionOfFBGs
      initialWavelength
      elasticLimit
      lowPlasticLimit
      highPlasticLimit
      maxCalibrationFactor
      minCalibrationFactor
      createdAt
      updatedAt
    }
  }
`;

export async function fetchHydrabolts(since?: string): Promise<HydraboltRecord[]> {
  const data = await graphqlRequest<{
    hydrabolts: HydraboltRecord[];
  }>(GET_HYDRABOLTS, { since });
  return data.hydrabolts;
}

export interface UpdateOpticboltSpectrumInput {
  fbgIndex: number;
  amplitude20?: number | null;
  wavelength20?: number | null;
  amplitude100?: number | null;
  wavelength100?: number | null;
  peakInitialNm?: number | null;
  peak20Nm?: number | null;
  peak100Nm?: number | null;
  strain20?: number | null;
  strain100?: number | null;
  load20?: number | null;
  load100?: number | null;
  time20Ms?: number | null;
  time100Ms?: number | null;
  calibrationFactor?: number | null;
}

export interface UpdateOpticboltTestResultInput {
  serialNumber?: string;
  drawingNumber?: string | null;
  boltType?: string | null;
  description?: string | null;
  testedAt?: string;
  testedBy?: string;
  result?: string;
  fibreCheck1?: boolean;
  fibreCheck2?: boolean;
  fibreCheck3?: boolean;
  psi20?: number | null;
  psi100?: number | null;
  spectrums?: UpdateOpticboltSpectrumInput[];
}

export interface UpdateHydraboltInput {
  partNumber?: string;
  drawingNumber?: string | null;
  boltLength?: number;
  description?: string | null;
  numberOfFBG?: number;
  positionOfFBGs?: number[];
  initialWavelength?: number[];
  elasticLimit?: number;
  lowPlasticLimit?: number;
  highPlasticLimit?: number;
  maxCalibrationFactor?: number;
  minCalibrationFactor?: number;
}

const UPDATE_OPTICBOLT_TEST_RESULT = `
  mutation UpdateOpticboltTestResult($serialNumber: String!, $input: UpdateOpticboltTestResultInput!) {
    updateOpticboltTestResult(serialNumber: $serialNumber, input: $input) {
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

const UPDATE_OPTICBOLT_SPECTRUM = `
  mutation UpdateOpticboltSpectrum($serialNumber: String!, $fbgIndex: Int!, $input: UpdateOpticboltSpectrumInput!) {
    updateOpticboltSpectrum(serialNumber: $serialNumber, fbgIndex: $fbgIndex, input: $input) {
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

const UPDATE_HYDRABOLT = `
  mutation UpdateHydrabolt($partNumber: String!, $input: UpdateHydraboltInput!) {
    updateHydrabolt(partNumber: $partNumber, input: $input) {
      id
      partNumber
      drawingNumber
      boltLength
      description
      numberOfFBG
      positionOfFBGs
      initialWavelength
      elasticLimit
      lowPlasticLimit
      highPlasticLimit
      maxCalibrationFactor
      minCalibrationFactor
      createdAt
      updatedAt
    }
  }
`;

export async function updateOpticboltTestResult(
  serialNumber: string,
  input: UpdateOpticboltTestResultInput,
): Promise<OpticboltTestResultWithSpectrums> {
  const data = await graphqlRequest<{
    updateOpticboltTestResult: OpticboltTestResultWithSpectrums;
  }>(UPDATE_OPTICBOLT_TEST_RESULT, { serialNumber, input });
  return data.updateOpticboltTestResult;
}

export async function updateOpticboltSpectrum(
  serialNumber: string,
  fbgIndex: number,
  input: UpdateOpticboltSpectrumInput,
): Promise<OpticboltSpectrum> {
  const data = await graphqlRequest<{
    updateOpticboltSpectrum: OpticboltSpectrum;
  }>(UPDATE_OPTICBOLT_SPECTRUM, { serialNumber, fbgIndex, input:{...input, fbgIndex} });
  return data.updateOpticboltSpectrum;
}

export async function updateHydrabolt(
  partNumber: string,
  input: UpdateHydraboltInput,
): Promise<HydraboltRecord> {
  const data = await graphqlRequest<{
    updateHydrabolt: HydraboltRecord;
  }>(UPDATE_HYDRABOLT, { partNumber, input });
  return data.updateHydrabolt;
} 