import { SERVICES, CHARS } from "./hydraUuids";
import {
  configValueBytesFromNotification,
  parseLongConfigBlockNotification,
  reassembleLongConfigBlocks,
} from "./hydraParser";
import type { DeviceInfo } from "../types";

type BleCharacteristicMap = Record<string, BluetoothRemoteGATTCharacteristic>;
type MeasurementHandler = (v: DataView) => void;

const asBuffer = (buf: Uint8Array): BufferSource => buf as unknown as BufferSource;

const normUuid = (u: string): string => u.toLowerCase();

/** §4 config table — items 28-30 (interrogator init strings) and 209-211 (AtPKI blobs)
 * must be read/written using the §2.4 "Long Configuration" block-transfer protocol. */
const isLongConfigId = (id: number): boolean => (id >= 28 && id <= 30) || (id >= 209 && id <= 211);

export class HydraBLE {
  device: BluetoothDevice | null = null;
  server: BluetoothRemoteGATTServer | null = null;
  characteristics: BleCharacteristicMap = {};
  private measurementHandlers = new Set<MeasurementHandler>();
  private measurementSubActive = false;


  async connect(): Promise<void> {
    console.log('connecting to hydra');
    this.device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      // filters:[{namePrefix:"SVK"}],
      optionalServices: Object.values(SERVICES),
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

  /**
   * Write a configuration item (§3.1.1 / §4.1.1). IDs 28-30 and 209-211 are
   * automatically sent using the §2.4 Long Configuration block-transfer
   * protocol; every other ID is sent as a single packet.
   */
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

    if (!isLongConfigId(id)) {
      const buf = new Uint8Array(2 + 1 + 4 + enc.length);
      const dv = new DataView(buf.buffer);
      dv.setUint16(0, id, true);
      dv.setUint8(2, enc.length);
      dv.setUint32(3, timestamp, true);
      buf.set(enc, 7);
      await this.characteristics[normUuid(CHARS.SET_CONFIG)].writeValue(asBuffer(buf));
      return;
    }

    // §2.4 Long Configuration block-transfer: blocks are 0-indexed, every
    // block but the last is a fixed 188 bytes (multiple of 4), and the
    // final block carries whatever remains (0-191 bytes, empty for "").
    const MAX_INTERMEDIATE_BLOCK_SIZE = 188;
    const chunks: Uint8Array[] = [];
    if (enc.length === 0) {
      chunks.push(new Uint8Array(0));
    } else {
      let offset = 0;
      while (offset < enc.length) {
        const remaining = enc.length - offset;
        if (remaining <= 191) {
          chunks.push(enc.slice(offset));
          break;
        }
        chunks.push(enc.slice(offset, offset + MAX_INTERMEDIATE_BLOCK_SIZE));
        offset += MAX_INTERMEDIATE_BLOCK_SIZE;
      }
    }

    const totalBlocks = chunks.length;
    for (let blockIndex = 0; blockIndex < totalBlocks; blockIndex++) {
      const chunk = chunks[blockIndex];
      const payload = new Uint8Array(2 + 1 + 4 + 2 + chunk.length);
      const dv = new DataView(payload.buffer);
      dv.setUint16(0, id, true);
      dv.setUint8(2, 2 + chunk.length);
      dv.setUint32(3, timestamp, true);
      payload[7] = blockIndex & 0xff;
      payload[8] = totalBlocks & 0xff;
      payload.set(chunk, 9);

      await this.characteristics[normUuid(CHARS.SET_CONFIG)].writeValue(asBuffer(payload));
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  /**
   * Read a configuration item (§3.1.2 / §4.1.2). IDs 28-30 and 209-211 are
   * automatically reassembled from the §2.4 Long Configuration block-transfer
   * protocol (accumulating notifications until all blocks arrive); every
   * other ID resolves on the first matching notification.
   */
  async readConfig(id: number, timeoutMs = 5000): Promise<{ data: Uint8Array; timestamp: number }> {
    const buf = new Uint8Array(2);
    new DataView(buf.buffer).setUint16(0, id, true);
    const c = this.characteristics[normUuid(CHARS.CONFIG_VALUE)];
    await c.startNotifications();

    const isLong = isLongConfigId(id);

    return new Promise<{ data: Uint8Array; timestamp: number }>((resolve, reject) => {
      const blocks = new Map<number, Uint8Array>();
      let timer: ReturnType<typeof setTimeout>;

      const cleanup = () => {
        clearTimeout(timer);
        c.removeEventListener("characteristicvaluechanged", handler);
      };

      const resetTimer = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          cleanup();
          reject(new Error(`Read config timeout (${timeoutMs}ms) for ID ${id}`));
        }, timeoutMs);
      };

      const handler = (e: Event) => {
        const dv = (e.target as BluetoothRemoteGATTCharacteristic).value;
        if (!dv || dv.byteLength < 7) return;
        if (dv.getUint16(0, true) !== id) return;

        const timestamp = dv.getUint32(3, true);

        if (!isLong) {
          cleanup();
          resolve({ data: configValueBytesFromNotification(dv), timestamp });
          return;
        }

        const block = parseLongConfigBlockNotification(dv);
        if (!block) {
          cleanup();
          resolve({ data: new Uint8Array(0), timestamp });
          return;
        }

        blocks.set(block.blockIndex, block.payload);
        resetTimer();

        if (blocks.size >= block.totalBlocks) {
          cleanup();
          resolve({ data: reassembleLongConfigBlocks(blocks, block.totalBlocks), timestamp });
        }
      };

      c.addEventListener("characteristicvaluechanged", handler);
      resetTimer();
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
 