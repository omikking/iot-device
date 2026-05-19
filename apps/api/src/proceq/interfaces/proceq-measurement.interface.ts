export interface ProceqMeasurement {
  id: string;
  name: string;
  date: string;
  operator: string;
  serial: string;
  logs?: ProceqLog[];
  readings?: ProceqReading[];
  attachments?: ProceqAttachment[];
  exportZip?: ProceqExportZip;
}

export interface ProceqLog {
  id: string;
  timestamp: string;
  comment: string;
  temperature?: number;
  isBroken?: boolean;
  isNotMeasurable?: boolean;
}

export interface ProceqReading {
  id: string;
  timestamp: string;
  value: number;
  gateIndication: string;
  isMeasured: boolean;
}

export interface ProceqAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface ProceqExportZip {
  id: string;
  name: string;
  url: string;
}
