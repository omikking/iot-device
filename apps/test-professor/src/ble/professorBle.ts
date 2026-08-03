import { SERVICES, CHARS } from "./professorUuids";
import type { DeviceInfo } from "../types";

type BleCharMap = Record<string, BluetoothRemoteGATTCharacteristic>;

const asBuffer = (buf: Uint8Array): BufferSource => buf as unknown as BufferSource;

export class ProfessorBLE {
  device: BluetoothDevice | null = null;
  server: BluetoothRemoteGATTServer | null = null;
  chars: BleCharMap = {};

  async connect(): Promise<void> {
    console.log('connecting to cyclops');
    this.device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
    });
    this.server = await this.device.gatt!.connect();
    await this._cacheChars();
  }


  disconnect(): void {
    if (this.device?.gatt?.connected) this.device.gatt.disconnect();
  }

  getDeviceName(): string {
    return this.device?.name ?? "Unknown";
  }

  // ── Status ────────────────────────────────────────────────────────────────

  async readDeviceStatus(): Promise<DataView> {
    return await this.chars[CHARS.DEVICE_STATUS].readValue();
  }

  // ── Commands ──────────────────────────────────────────────────────────────

  async sendCommand(cmd: number, param: number | null = null): Promise<DataView> {
    const c = this.chars[CHARS.COMMAND];

    let buf: Uint8Array;
    if (param === null) {
      buf = new Uint8Array([cmd]);
    } else {
      buf = new Uint8Array(5);
      buf[0] = cmd;
      new DataView(buf.buffer).setUint32(1, param, true);
    }

    await c.startNotifications();

    return new Promise<DataView>((res) => {
      const h = (e: Event) => {
        c.removeEventListener("characteristicvaluechanged", h);
        res((e.target as BluetoothRemoteGATTCharacteristic).value!);
      };
      c.addEventListener("characteristicvaluechanged", h);
      c.writeValue(asBuffer(buf));
    });
  }

  // ── Configuration ─────────────────────────────────────────────────────────

  async writeConfig(id: number, value: string | Uint8Array | number, timestamp = 0): Promise<void> {
    const enc: Uint8Array = typeof value === "string"
      ? new TextEncoder().encode(value)
      : value instanceof Uint8Array ? value
        : (() => {
          const b = new Uint8Array(4);
          new DataView(b.buffer).setUint32(0, value, true);
          return b;
        })();

    const buf = new Uint8Array(2 + 1 + 4 + enc.length);
    const dv = new DataView(buf.buffer);
    dv.setUint16(0, id, true);
    dv.setUint8(2, enc.length);
    dv.setUint32(3, timestamp, true);
    buf.set(enc, 7);

    await this.chars[CHARS.SET_CONFIG].writeValue(asBuffer(buf));
  }

  async readConfig(id: number): Promise<DataView> {
    const buf = new Uint8Array(2);
    new DataView(buf.buffer).setUint16(0, id, true);

    const c = this.chars[CHARS.CONFIG_VALUE];
    await c.startNotifications();

    return new Promise<DataView>((res) => {
      const h = (e: Event) => {
        c.removeEventListener("characteristicvaluechanged", h);
        res((e.target as BluetoothRemoteGATTCharacteristic).value!);
      };
      c.addEventListener("characteristicvaluechanged", h);
      this.chars[CHARS.GET_CONFIG].writeValue(asBuffer(buf));
    });
  }

  // ── Long Configuration (block transfer for certs/keys) ────────────────────

  async writeLongConfig(id: number, data: Uint8Array, timestamp = 0): Promise<void> {
    const MAX_BLOCK = 188;
    const totalBlocks = Math.max(1, Math.ceil(data.length / MAX_BLOCK));

    for (let i = 0; i < totalBlocks; i++) {
      const start = i * MAX_BLOCK;
      const chunk = data.slice(start, start + MAX_BLOCK);
      const payload = new Uint8Array(2 + 1 + 4 + 2 + chunk.length);
      const dv = new DataView(payload.buffer);

      dv.setUint16(0, id, true);
      dv.setUint8(2, 2 + chunk.length);
      dv.setUint32(3, timestamp, true);
      payload[7] = i;
      payload[8] = totalBlocks;
      payload.set(chunk, 9);

      await this.chars[CHARS.SET_CONFIG].writeValue(asBuffer(payload));
    }
  }

  // ── Device Info ───────────────────────────────────────────────────────────

  async readDeviceInfo(): Promise<DeviceInfo> {
    const svc = await this.server!.getPrimaryService(SERVICES.DEVICE_INFO);
    const read = async (charUuid: number): Promise<string> => {
      try {
        const c = await svc.getCharacteristic(charUuid);
        const v = await c.readValue();
        return new TextDecoder().decode(v.buffer);
      } catch {
        return "";
      }
    };
    return {
      manufacturerName: await read(0x2a29),
      modelNumber:      await read(0x2a24),
      firmwareRevision: await read(0x2a26),
      softwareRevision: await read(0x2a28),
      hardwareRevision: await read(0x2a27),
      serialNumber:     await read(0x2a25),
    };
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  private async _cacheChars(): Promise<void> {
  
    
    for (const su of Object.values(SERVICES)) {
      const svc = await this.server!.getPrimaryService(su);
      const cs = await svc.getCharacteristics();
      cs.forEach((c: BluetoothRemoteGATTCharacteristic) => (this.chars[c.uuid] = c));
    }

    
  }
}
