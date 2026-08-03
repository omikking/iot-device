import { SERVICES, CHARS } from "./hydraUuids";
import type { DeviceInfo } from "../types";

type BleCharacteristicMap = Record<string, BluetoothRemoteGATTCharacteristic>;
type MeasurementHandler = (v: DataView) => void;

const asBuffer = (buf: Uint8Array): BufferSource => buf as unknown as BufferSource;

const normUuid = (u: string): string => u.toLowerCase();

export class HydraBLE {
  device: BluetoothDevice | null = null;
  server: BluetoothRemoteGATTServer | null = null;
  characteristics: BleCharacteristicMap = {};
  private measurementHandlers = new Set<MeasurementHandler>();
  private measurementSubActive = false;


  async connect(): Promise<void> {
    console.log('connecting to cyclops');
    this.device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
    });
    this.server = await this.device.gatt!.connect();
    await this._cacheCharacteristics();
  }

  disconnect(): void {
    if (this.device?.gatt?.connected) this.device.gatt.disconnect();
    this.device = null;
    this.server = null;
    this.characteristics = {};
  }

  getDeviceName(): string {
    return this.device?.name ?? "Unknown";
  }

  async subscribeMeasurementMeta(cb: (v: DataView) => void): Promise<void> {
    const c = this.characteristics[normUuid(CHARS.MEASUREMENT_META)];
    await c.startNotifications();
    c.addEventListener("characteristicvaluechanged", (e) =>
      cb((e.target as BluetoothRemoteGATTCharacteristic).value!),
    );
  }

  async readDeviceStatus(): Promise<DataView> {
    return await this.characteristics[normUuid(CHARS.DEVICE_STATUS)].readValue();
  }

  async readMeta(): Promise<DataView> {
    return await this.characteristics[normUuid(CHARS.MEASUREMENT_META)].readValue();
  }

  async sendCommand(cmd: number, param: number | null = null): Promise<DataView | null> {
    const c = this.characteristics[normUuid(CHARS.COMMAND)];
    let buf: Uint8Array;
    if (param === null) {
      buf = new Uint8Array([cmd]);
    } else {
      buf = new Uint8Array(5);
      buf[0] = cmd;
      new DataView(buf.buffer).setUint32(1, param, true);
    }
    if (cmd === 10) {
      await c.writeValue(asBuffer(buf));
      return null;
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

  async writeConfig(id: number, value: string | Uint8Array | number, timestamp = 0): Promise<void> {
    const enc: Uint8Array =
      typeof value === "string"
        ? new TextEncoder().encode(value)
        : value instanceof Uint8Array
          ? value
          : (() => {
              const b = new Uint8Array(value <= 0xffff ? 2 : 4);
              const dv = new DataView(b.buffer);
              if (b.length === 2) dv.setUint16(0, value, true);
              else dv.setUint32(0, value, true);
              return b;
            })();

    const buf = new Uint8Array(2 + 1 + 4 + enc.length);
    const dv = new DataView(buf.buffer);
    dv.setUint16(0, id, true);
    dv.setUint8(2, enc.length);
    dv.setUint32(3, timestamp, true);
    buf.set(enc, 7);
    await this.characteristics[normUuid(CHARS.SET_CONFIG)].writeValue(asBuffer(buf));
  }

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
      await this.characteristics[normUuid(CHARS.SET_CONFIG)].writeValue(asBuffer(payload));
    }
  }

  async readConfig(id: number): Promise<DataView> {
    const buf = new Uint8Array(2);
    new DataView(buf.buffer).setUint16(0, id, true);
    const c = this.characteristics[normUuid(CHARS.CONFIG_VALUE)];
    await c.startNotifications();
    return new Promise<DataView>((res) => {
      const h = (e: Event) => {
        c.removeEventListener("characteristicvaluechanged", h);
        res((e.target as BluetoothRemoteGATTCharacteristic).value!);
      };
      c.addEventListener("characteristicvaluechanged", h);
      this.characteristics[normUuid(CHARS.GET_CONFIG)].writeValue(asBuffer(buf));
    });
  }

  private dispatchMeasurement(v: DataView): void {
    for (const handler of this.measurementHandlers) handler(v);
  }

  async ensureMeasurementNotifications(): Promise<void> {
    if (this.measurementSubActive) return;
    const c = this.characteristics[normUuid(CHARS.MEASUREMENT_DATA)];
    await c.startNotifications();
    c.addEventListener("characteristicvaluechanged", (e) => {
      this.dispatchMeasurement(
        (e.target as BluetoothRemoteGATTCharacteristic).value!,
      );
    });
    this.measurementSubActive = true;
  }

  addMeasurementListener(cb: MeasurementHandler): void {
    this.measurementHandlers.add(cb);
  }

  removeMeasurementListener(cb: MeasurementHandler): void {
    this.measurementHandlers.delete(cb);
  }

  /** Subscribe to measurement notifications (0023); safe to call multiple times. */
  async subscribeMeasurementData(cb: (v: DataView) => void): Promise<void> {
    await this.ensureMeasurementNotifications();
    this.addMeasurementListener(cb);
  }

  /**
   * Wait for the next non-empty measurement notification (e.g. after cmd 2).
   * Register before sending the command — notification may arrive before or after cmd ack.
   */
  async waitForMeasurementNotification(timeoutMs = 20_000): Promise<DataView> {
    await this.ensureMeasurementNotifications();
    return new Promise<DataView>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.removeMeasurementListener(handler);
        reject(new Error(`Measurement notification timeout (${timeoutMs}ms)`));
      }, timeoutMs);

      const handler: MeasurementHandler = (v) => {
        if (v.byteLength === 0) return;
        clearTimeout(timer);
        this.removeMeasurementListener(handler);
        resolve(v);
      };
      this.addMeasurementListener(handler);
    });
  }

  /** §4.3.1 — cmd 4=new samples, 5=all samples; ack uses uint32 sample IDs. */
  async requestMeasurements(
    cmd: 4 | 5,
    count: number,
    ackSampleIds: number[] = [],
  ): Promise<void> {
    const buf = new Uint8Array(2 + ackSampleIds.length * 4);
    buf[0] = cmd;
    buf[1] = count;
    let o = 2;
    for (const id of ackSampleIds) {
      new DataView(buf.buffer).setUint32(o, id, true);
      o += 4;
    }
    await this.characteristics[normUuid(CHARS.RETRIEVE_MEASUREMENTS)].writeValue(asBuffer(buf));
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
      modelNumber: await read(0x2a24),
      firmwareRevision: await read(0x2a26),
      softwareRevision: await read(0x2a28),
      hardwareRevision: await read(0x2a27),
      serialNumber: await read(0x2a25),
    };
  }

  private async _cacheCharacteristics(): Promise<void> {
    for (const su of Object.values(SERVICES)) {
      const svc = await this.server!.getPrimaryService(su);
      const cs = await svc.getCharacteristics();
      cs.forEach((c) => {
        this.characteristics[normUuid(c.uuid)] = c;
      });
    }
  }
}
