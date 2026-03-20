import { ProceqStatus } from '@prisma/client';

export interface ProceqLogEntry {
  type?: string;
  content?: {
    comment?: string;
    attachmentId?: string;
    attachmentName?: string;
  };
  created?: string;
}

export interface ProceqReadingContent {
  indicationSetupFile?: ProceqSetupFile;
  indicationSettings?: {
    toolBarOptions?: ProceqToolBarOptions;
  };
  rawData?: unknown;
}

export interface ProceqSettingContent {
  indicationStatus?: {
    measurementSetupFile?: ProceqSetupFile;
  };
}

export interface ProceqSetupFile {
  name?: string;
  evaluationJSON?: {
    gate1?: ProceqGate1;
  };
  measuringMode?: string;
  zeroOffset?: number;
  analogueFilter?: number;
  damping?: number;
  frequency?: number;
  gain?: number;
  sampleAveraging?: number;
  voltage?: number;
}

export interface ProceqGate1 {
  level?: number;
  measurementLevel?: number;
  referenceSamplingRate?: number;
  start?: number;
  width?: number;
}

export interface ProceqToolBarOptions {
  gate1MaximumAmplitude?: number;
  gate1SoundPathDistance?: number;
  gate1SoundPathDistanceInTimeUnit?: number;
}

export interface ProceqMeasurementContent {
  id?: string;
  name?: string;
  content?: {
    info?: {
      fileName?: string;
      email?: string;
    };
  };
}

export interface ProceqExportPayload {
  data?: {
    measurement?: ProceqMeasurementContent;
    readings?: Array<{ content?: ProceqReadingContent; rawData?: unknown }>;
    settings?: Array<{ content?: ProceqSettingContent }>;
    logs?: ProceqLogEntry[];
  };
  measurement?: ProceqMeasurementContent;
  readings?: Array<{ content?: ProceqReadingContent; rawData?: unknown }>;
  settings?: Array<{ content?: ProceqSettingContent }>;
  logs?: ProceqLogEntry[];
}

export interface UserPhotoEntry {
  attachmentId: string | null;
  attachmentName: string | null;
}

export interface ExtractedProceqReading {
  readingIndex: number;
  indicationSetupFileName: string | null;
  measuringMode: string | null;
  frequency: number | null;
  gain: number | null;
  voltage: number | null;
  sampleAveraging: number | null;
  damping: number | null;
  analogueFilter: number | null;
  zeroOffset: number | null;
  velocity: number | null;
  level: number | null;
  measurementLevel: number | null;
  referenceSamplingRate: number | null;
  start: number | null;
  width: number | null;
  gate1MaximumAmplitude: number | null;
  gate1SoundPathDistance: number | null;
  gate1SoundPathDistanceInTimeUnit: number | null;
  elongation: number | null;
  status: ProceqStatus | null;
}

export interface ExtractedProceqFields {
  measurementId: string;
  fileName: string;
  operatorEmail: string | null;
  comments: string | undefined;
  temperature: number | null;
  userPhoto: UserPhotoEntry[];
  createdTimestamp: Date | null;
  updatedTimestamp: Date | null;
  rawDataZipId: string | null;
  rawDataZipPath: string | null;
  readings: ExtractedProceqReading[];
  status: ProceqStatus | null;
  bansheeRequestId?: string | null;
}

export interface SyncResult {
  success: boolean;
  duration: number;
  totalScanned: number;
  newMeasurements: number;
  updatedMeasurements: number;
  failedBatches: number;
}

export interface BoltConstants {
  boltType: string;
  velocity: number;
  tempCorrectionFactor: number;
  tempCoeff: number;
  quadCoeff1: number;
  linCoeff1: number;
  quadCoeff2: number;
  linCoeff2: number;
  constTerm: number;
  nominalLength: number;
  linearLimit: number;
  elasticLimit: number;
  lowPlasticLimit: number;
}
