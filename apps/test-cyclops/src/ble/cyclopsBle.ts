import { SERVICES, CHARS } from "./cyclopsUuids";
import type { DeviceInfo } from "../types";

// ─── BLE Driver ─────────────────────────────────────────────────────────────

type BleCharacteristicMap = Record<string, BluetoothRemoteGATTCharacteristic>;

// Uint8Array.buffer is `ArrayBufferLike` which includes SharedArrayBuffer,
// but Web Bluetooth's writeValue expects `BufferSource` backed by plain ArrayBuffer.
// At runtime BLE buffers are always ArrayBuffer, so a cast is safe.
const asBufferSource = (buf: Uint8Array): BufferSource => buf as unknown as BufferSource;

export class CyclopsBLE {
  device: BluetoothDevice | null = null;
  server: BluetoothRemoteGATTServer | null = null;
  characteristics: BleCharacteristicMap = {};

    async connect(): Promise<void> {
    this.device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
    });
    this.server = await this.device.gatt!.connect();
    await this._cacheCharacteristics();
  }

  disconnect(): void {
    if (this.device?.gatt?.connected) this.device.gatt.disconnect();
  }

  getDeviceName(): string { return this.device?.name ?? "Unknown"; }

  async subscribeButtonPress(cb: (v: DataView) => void): Promise<void> {
    const c = this.characteristics[CHARS.BUTTON];
    await c.startNotifications();
    c.addEventListener("characteristicvaluechanged", (e) =>
      cb((e.target as BluetoothRemoteGATTCharacteristic).value!),
    );
  }

  async subscribeMeasurementMeta(cb: (v: DataView) => void): Promise<void> {
    const c = this.characteristics[CHARS.MEASUREMENT_META];
    await c.startNotifications();
    c.addEventListener("characteristicvaluechanged", (e) =>
      cb((e.target as BluetoothRemoteGATTCharacteristic).value!),
    );
  }

  async readDeviceStatus(): Promise<DataView> {
    return await this.characteristics[CHARS.DEVICE_STATUS].readValue();
  }

  async readMeta(): Promise<DataView> {
    return await this.characteristics[CHARS.MEASUREMENT_META].readValue();
  }

  async sendCommand(cmd: number, param: number | null = null): Promise<DataView | null> {
    const c = this.characteristics[CHARS.COMMAND];
    let buf: Uint8Array;
    if (param === null) {
      buf = new Uint8Array([cmd]);
    } else {
      buf = new Uint8Array(5);
      buf[0] = cmd;
      new DataView(buf.buffer).setUint32(1, param, true);
    }
    if (cmd === 10) {
      await c.writeValue(asBufferSource(buf));
      return null;
    }
    await c.startNotifications();
    return new Promise<DataView>((res) => {
      const h = (e: Event) => {
        c.removeEventListener("characteristicvaluechanged", h);
        res((e.target as BluetoothRemoteGATTCharacteristic).value!);
      };
      c.addEventListener("characteristicvaluechanged", h);
      c.writeValue(asBufferSource(buf));
    });
  }

  // ── Configuration Read/Write ──────────────────────────────────────────────

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

    await this.characteristics[CHARS.SET_CONFIG].writeValue(asBufferSource(buf));
  }

  async readConfig(id: number): Promise<DataView> {
    const buf = new Uint8Array(2);
    new DataView(buf.buffer).setUint16(0, id, true);

    const c = this.characteristics[CHARS.CONFIG_VALUE];
    await c.startNotifications();

    return new Promise<DataView>((res) => {
      const h = (e: Event) => {
        c.removeEventListener("characteristicvaluechanged", h);
        res((e.target as BluetoothRemoteGATTCharacteristic).value!);
      };
      c.addEventListener("characteristicvaluechanged", h);
      this.characteristics[CHARS.GET_CONFIG].writeValue(asBufferSource(buf));
    });
  }

  async subscribeMeasurementData(cb: (v: DataView) => void): Promise<void> {
    const c = this.characteristics[CHARS.MEASUREMENT_DATA];
    await c.startNotifications();
    c.addEventListener("characteristicvaluechanged", (e) =>
      cb((e.target as BluetoothRemoteGATTCharacteristic).value!),
    );
  }

  async requestHistoryPackets(count = 10, ackIds: number[] = []): Promise<void> {
    const buf = new Uint8Array(2 + ackIds.length);
    buf[0] = 1;
    buf[1] = count;
    ackIds.forEach((id, i) => { buf[2 + i] = id; });
    await this.characteristics[CHARS.RETRIEVE_MEASUREMENTS].writeValue(asBufferSource(buf));
  }

  async ackPackets(packetIds: number[]): Promise<void> {
    const buf = new Uint8Array(2 + packetIds.length);
    buf[0] = 2;
    buf[1] = packetIds.length;
    packetIds.forEach((id, i) => { buf[2 + i] = id; });
    await this.characteristics[CHARS.RETRIEVE_MEASUREMENTS].writeValue(asBufferSource(buf));
  }

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

  private async _cacheCharacteristics(): Promise<void> {
    for (const su of Object.values(SERVICES)) {
      const svc = await this.server!.getPrimaryService(su);
      const cs = await svc.getCharacteristics();
      cs.forEach((c) => (this.characteristics[c.uuid] = c));
    }
  }
}
