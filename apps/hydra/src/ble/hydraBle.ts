import { SERVICES, CHARS } from "./hydraUuids";
import { CONFIG_HEADER_BYTES } from "./hydraLocalConfig";
import { hex, logInfo } from "./hydraLog";

// ─── Hydra Domain Types (D0010553 §4) — subset needed by the BLE transport ──

export interface DeviceInfo {
  manufacturerName: string;
  modelNumber: string;
  firmwareRevision: string;
  softwareRevision: string;
  hardwareRevision: string;
  serialNumber: string;
}

type BleCharacteristicMap = Record<string, BluetoothRemoteGATTCharacteristic>;
type MeasurementHandler = (v: DataView) => void;

const asBuffer = (buf: Uint8Array): BufferSource => buf as unknown as BufferSource;

const normUuid = (u: string): string => u.toLowerCase();

/**
 * Low-level GATT transport for the Hydra data logger (D0010553 §4).
 * Ported from apps/test-hydra/src/ble/hydraBle.ts so both apps share the
 * same wire protocol implementation.
 */
export class HydraBLE {
  device: BluetoothDevice | null = null;
  server: BluetoothRemoteGATTServer | null = null;
  characteristics: BleCharacteristicMap = {};
  private measurementHandlers = new Set<MeasurementHandler>();
  private measurementSubActive = false;

  async connect(): Promise<void> {
    this.device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
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
    this.measurementSubActive = false;
    this.measurementHandlers.clear();
  }

  isConnected(): boolean {
    return this.device?.gatt?.connected === true;
  }

  /**
   * Fires when the device drops the link — out of range, power off, or the
   * Disconnect command (10). Returns an unsubscribe function.
   */
  onDisconnected(cb: () => void): () => void {
    const device = this.device;
    if (!device) return () => {};
    device.addEventListener("gattserverdisconnected", cb);
    return () => device.removeEventListener("gattserverdisconnected", cb);
  }

  getDeviceName(): string {
    return this.device?.name ?? "Unknown";
  }

  /**
   * Characteristics are cached on connect; a missing one means we are talking
   * to something that is not a Hydra (or the service was not discoverable).
   */
  private char(uuid: string): BluetoothRemoteGATTCharacteristic {
    const c = this.characteristics[normUuid(uuid)];
    if (!c) {
      throw new Error(
        `Characteristic ${uuid} is not available on this device — is it a Hydra data logger?`,
      );
    }
    return c;
  }

  async subscribeMeasurementMeta(cb: (v: DataView) => void): Promise<void> {
    const c = this.char(CHARS.MEASUREMENT_META);
    await c.startNotifications();
    c.addEventListener("characteristicvaluechanged", (e) =>
      cb((e.target as BluetoothRemoteGATTCharacteristic).value!),
    );
  }

  async readDeviceStatus(): Promise<DataView> {
    return await this.char(CHARS.DEVICE_STATUS).readValue();
  }

  async readMeta(): Promise<DataView> {
    return await this.char(CHARS.MEASUREMENT_META).readValue();
  }

  /**
   * §4.3.6 — writes a command to 0033 and resolves with its result
   * notification. Command 10 (Disconnect) never replies, so it resolves null.
   */
  async sendCommand(
    cmd: number,
    param: number | null = null,
    timeoutMs = 10_000,
  ): Promise<DataView | null> {
    const c = this.char(CHARS.COMMAND);
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
    return new Promise<DataView>((resolve, reject) => {
      const handler = (e: Event) => {
        finish();
        resolve((e.target as BluetoothRemoteGATTCharacteristic).value!);
      };
      const timer = setTimeout(() => {
        finish();
        reject(new Error(`Timed out after ${timeoutMs}ms waiting for command ${cmd} result`));
      }, timeoutMs);

      function finish() {
        clearTimeout(timer);
        c.removeEventListener("characteristicvaluechanged", handler);
      }

      c.addEventListener("characteristicvaluechanged", handler);
      c.writeValue(asBuffer(buf)).catch((err: unknown) => {
        finish();
        reject(err instanceof Error ? err : new Error(String(err)));
      });
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
    // id(2) length(1) timestamp(4) value(n) — §4.1.1 validates all four, so the
    // whole packet is worth seeing, not just the value.
    logInfo(`GATT 0011 SetConfig id=${id} len=${enc.length}: ${hex(buf)}`);
    await this.char(CHARS.SET_CONFIG).writeValue(asBuffer(buf));
  }

  async writeLongConfig(id: number, data: Uint8Array, timestamp = 0, oneBased = true): Promise<void> {
    const MAX_BLOCK = 148;
    const totalBlocks = Math.max(1, Math.ceil(data.length / MAX_BLOCK));

    for (let i = 0; i < totalBlocks; i++) {
      const start = i * MAX_BLOCK;
      const chunk = data.slice(start, start + MAX_BLOCK);
      const payload = new Uint8Array(2 + 1 + 4 + 2 + chunk.length);
      const dv = new DataView(payload.buffer);
      dv.setUint16(0, id, true);
      dv.setUint8(2, 2 + chunk.length);
      dv.setUint32(3, timestamp, true);
      // String long configs (28/29/30) → 1-based block index
      // Certificate configs (209/210/211) → 0-based block index
      payload[7] = oneBased ? i + 1 : i;
      payload[8] = totalBlocks;
      payload.set(chunk, 9);

      logInfo(
        `GATT 0011 SetConfig id=${id} block ${payload[7]}/${totalBlocks} ` +
          `(${chunk.length} bytes): ${hex(payload.slice(0, 16))}${
            payload.length > 16 ? ' …' : ''
          }`,
      );
      await this.char(CHARS.SET_CONFIG).writeValue(asBuffer(payload));

      if (totalBlocks > 1) {
        await new Promise((r) => setTimeout(r, 50));
      }
    }
  }

  /**
   * §4.1.2 — writes `id` to Get Configuration (0012) and resolves with the
   * matching notification from the Configuration characteristic (0013).
   *
   * 0013 is shared by every read AND every accepted write (§4.1.1), so the
   * notification MUST be matched on its config id — otherwise a concurrent or
   * previous operation's notification resolves the wrong read. Callers must
   * still serialise reads: Web Bluetooth allows only one GATT operation at a
   * time.
   */
  async readConfig(id: number, timeoutMs = 5000): Promise<DataView> {
    const buf = new Uint8Array(2);
    new DataView(buf.buffer).setUint16(0, id, true);
    const value = this.char(CHARS.CONFIG_VALUE);
    const getConfig = this.char(CHARS.GET_CONFIG);
    await value.startNotifications();

    return new Promise<DataView>((resolve, reject) => {
      const handler = (e: Event) => {
        const dv = (e.target as BluetoothRemoteGATTCharacteristic).value;
        if (!dv || dv.byteLength < 2 || dv.getUint16(0, true) !== id) return;
        finish();
        resolve(dv);
      };
      const timer = setTimeout(() => {
        finish();
        reject(new Error(`Timed out after ${timeoutMs}ms reading config ID ${id}`));
      }, timeoutMs);

      function finish() {
        clearTimeout(timer);
        value.removeEventListener("characteristicvaluechanged", handler);
      }

      value.addEventListener("characteristicvaluechanged", handler);
      getConfig.writeValue(asBuffer(buf)).catch((err: unknown) => {
        finish();
        reject(err instanceof Error ? err : new Error(String(err)));
      });
    });
  }

  /**
   * §2.4 — reads a Long Configuration value, reassembling its blocks.
   *
   * The device answers a Get Configuration write with one notification per
   * block, each carrying a 2-byte reassembly header (block index, total
   * blocks) ahead of its payload, so anything longer than one block has to be
   * collected before it means anything. Blocks are ordered by the index the
   * device reports rather than by arrival, which also makes this agnostic to
   * whether that index is 0- or 1-based.
   *
   * `timeoutMs` is per block, not for the whole transfer: a 1200-character
   * config 28 arrives as nine notifications, and one deadline across all of
   * them would be a race against link quality.
   *
   * §2.4 gives a completed *write* the same shape as an empty read response — a
   * zero-length packet on the same characteristic — so a write-ack still in
   * flight would otherwise be read back as "this config is empty". Zero-length
   * packets are therefore ignored until our own Get Configuration write has
   * gone out. Blocks carrying data are always accepted, so nothing real is ever
   * dropped by that gate.
   */
  async readLongConfig(
    id: number,
    timeoutMs = 5000,
  ): Promise<{ data: Uint8Array; timestamp: number }> {
    const buf = new Uint8Array(2);
    new DataView(buf.buffer).setUint16(0, id, true);
    const value = this.char(CHARS.CONFIG_VALUE);
    const getConfig = this.char(CHARS.GET_CONFIG);
    await value.startNotifications();

    return new Promise<{ data: Uint8Array; timestamp: number }>((resolve, reject) => {
      const blocks = new Map<number, Uint8Array>();
      let timer: ReturnType<typeof setTimeout>;
      let requested = false;

      const finish = () => {
        clearTimeout(timer);
        value.removeEventListener("characteristicvaluechanged", handler);
      };

      const armTimeout = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          finish();
          reject(
            new Error(
              `Timed out after ${timeoutMs}ms reading long config ID ${id}` +
                (blocks.size > 0 ? ` (${blocks.size} block(s) received)` : ""),
            ),
          );
        }, timeoutMs);
      };

      /** Concatenates the collected blocks in the order the device numbered them. */
      const assemble = (): Uint8Array => {
        const numbered: { index: number; chunk: Uint8Array }[] = [];
        blocks.forEach((chunk, index) => numbered.push({ index, chunk }));
        const ordered = numbered
          .sort((a, b) => a.index - b.index)
          .map(({ chunk }) => chunk);
        const out = new Uint8Array(
          ordered.reduce((sum, chunk) => sum + chunk.length, 0),
        );
        let offset = 0;
        ordered.forEach((chunk) => {
          out.set(chunk, offset);
          offset += chunk.length;
        });
        return out;
      };

      const handler = (e: Event) => {
        const dv = (e.target as BluetoothRemoteGATTCharacteristic).value;
        if (!dv || dv.byteLength < CONFIG_HEADER_BYTES) return;
        if (dv.getUint16(0, true) !== id) return;

        const valueLength = dv.getUint8(2);
        const timestamp = dv.getUint32(3, true);

        // §4.1.1 — a value-less notification. Also how an empty Long
        // Configuration value comes back, and how the device acknowledges a
        // completed write, which is why it only counts once we have asked.
        if (valueLength === 0 || dv.byteLength <= CONFIG_HEADER_BYTES) {
          if (!requested) return;
          finish();
          resolve({ data: assemble(), timestamp });
          return;
        }

        // Without room for the 2-byte block header this is a plain value
        // rather than a block transfer — take it as the whole thing.
        if (dv.byteLength < CONFIG_HEADER_BYTES + 2) {
          finish();
          resolve({
            data: new Uint8Array(
              dv.buffer.slice(
                dv.byteOffset + CONFIG_HEADER_BYTES,
                dv.byteOffset + CONFIG_HEADER_BYTES + valueLength,
              ),
            ),
            timestamp,
          });
          return;
        }

        const blockIndex = dv.getUint8(CONFIG_HEADER_BYTES);
        const totalBlocks = dv.getUint8(CONFIG_HEADER_BYTES + 1);
        const payloadStart = CONFIG_HEADER_BYTES + 2;
        // Trust the smaller of declared and received, so a truncated
        // notification cannot read past the view into unrelated memory.
        const chunkLength = Math.max(
          0,
          Math.min(dv.byteLength - payloadStart, valueLength - 2),
        );
        blocks.set(
          blockIndex,
          new Uint8Array(
            dv.buffer.slice(
              dv.byteOffset + payloadStart,
              dv.byteOffset + payloadStart + chunkLength,
            ),
          ),
        );

        if (blocks.size >= Math.max(1, totalBlocks)) {
          finish();
          resolve({ data: assemble(), timestamp });
          return;
        }
        armTimeout();
      };

      armTimeout();
      value.addEventListener("characteristicvaluechanged", handler);
      getConfig.writeValue(asBuffer(buf)).then(
        () => {
          requested = true;
        },
        (err: unknown) => {
          finish();
          reject(err instanceof Error ? err : new Error(String(err)));
        },
      );
    });
  }

  private dispatchMeasurement(v: DataView): void {
    this.measurementHandlers.forEach((handler) => handler(v));
  }

  async ensureMeasurementNotifications(): Promise<void> {
    if (this.measurementSubActive) return;
    const c = this.char(CHARS.MEASUREMENT_DATA);
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
    await this.char(CHARS.RETRIEVE_MEASUREMENTS).writeValue(asBuffer(buf));
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
