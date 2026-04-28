import { Card, SectionTitle, StatRow } from "../ui";
import type { DeviceInfo } from "../../types";

interface DeviceInfoTabProps {
  connected: boolean;
  deviceInfo: DeviceInfo | null;
}

const FIELDS: { label: string; key: keyof DeviceInfo }[] = [
  { label: "Manufacturer Name", key: "manufacturerName" },
  { label: "Model Number",      key: "modelNumber" },
  { label: "Firmware Revision",  key: "firmwareRevision" },
  { label: "Software Revision",  key: "softwareRevision" },
  { label: "Hardware Revision",  key: "hardwareRevision" },
  { label: "Serial Number",     key: "serialNumber" },
];

export default function DeviceInfoTab({ connected, deviceInfo }: DeviceInfoTabProps) {
  if (!connected) {
    return (
      <Card>
        <div className="text-center px-6 py-12 text-text-muted">
          <div className="text-base font-bold mb-1.5 text-text">No device connected</div>
          <div className="text-[13px] text-text-faint">
            Connect to a device to view its information
          </div>
        </div>
      </Card>
    );
  }

  if (!deviceInfo) {
    return (
      <Card>
        <div className="text-center px-6 py-12 text-text-muted">
          <div className="animate-spin inline-block text-[32px] mb-4">⏳</div>
          <div className="text-[13px] font-semibold">Reading device information…</div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <SectionTitle >Device Information (BLE SIG 0x180A)</SectionTitle>
      {FIELDS.map(f => (
        <StatRow
          key={f.key}
          label={f.label}
          value={deviceInfo[f.key] || "—"}
        />
      ))}
    </Card>
  );
}
