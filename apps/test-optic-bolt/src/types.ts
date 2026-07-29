export interface OpticboltSpectrum {
  id: string;
  testResultId: string;
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
  createdAt: string;
}

export interface OpticboltTestResultSummary {
  id: string;
  serialNumber: string;
  boltType?: string | null;
  testedAt: string;
  psi20?: number | null;
  psi100?: number | null;
  fibreCheck1: boolean;
  fibreCheck2: boolean;
  fibreCheck3: boolean;
}

export interface SerialOption {
  serialNumber: string;
  label: string;
}

export interface SpectrumChartPoint {
  fbgIndex: number;
  wavelength: number;
  amplitude: number;
}

export interface HydraboltRecord {
  id: string;
  partNumber: string;
  drawingNumber?: string | null;
  boltLength: number;
  description?: string | null;
  numberOfFBG: number;
  positionOfFBGs: number[];
  initialWavelength: number[];
  elasticLimit: number;
  lowPlasticLimit: number;
  highPlasticLimit: number;
  maxCalibrationFactor: number;
  minCalibrationFactor: number;
  createdAt: string;
  updatedAt: string;
}
