import { describe, expect, it } from "vitest";
import {
  CONFIG_VALUE_OFFSET,
  decodeConfigNotification,
  decodeConfigValue,
  parseLongConfigBlockNotification,
  reassembleLongConfigBlocks,
} from "./hydraParser";

function configNotify(id: number, valueBytes: Uint8Array): DataView {
  const buf = new Uint8Array(CONFIG_VALUE_OFFSET + valueBytes.length);
  const dv = new DataView(buf.buffer);
  dv.setUint16(0, id, true);
  dv.setUint8(2, valueBytes.length);
  dv.setUint32(3, 0, true);
  buf.set(valueBytes, CONFIG_VALUE_OFFSET);
  return dv;
}

describe("parseLongConfigBlockNotification", () => {
  it("extracts block header and payload", () => {
    const payload = new TextEncoder().encode("abc");
    const v = configNotify(28, new Uint8Array([0, 1, ...payload]));
    const block = parseLongConfigBlockNotification(v);
    expect(block).toEqual({
      blockIndex: 0,
      totalBlocks: 1,
      payload: payload,
    });
  });
});

describe("reassembleLongConfigBlocks", () => {
  it("concatenates blocks in order", () => {
    const map = new Map<number, Uint8Array>([
      [0, new TextEncoder().encode("ab")],
      [1, new TextEncoder().encode("cd")],
    ]);
    const out = reassembleLongConfigBlocks(map, 2);
    expect(new TextDecoder().decode(out)).toBe("abcd");
  });
});

describe("decodeConfigValue", () => {
  it("decodes uint32 little-endian", () => {
    const bytes = new Uint8Array(4);
    new DataView(bytes.buffer).setUint32(0, 5000, true);
    expect(decodeConfigValue({ type: "uint32" }, bytes)).toBe("5000");
  });

  it("decodes short string", () => {
    const bytes = new TextEncoder().encode("wifi");
    expect(decodeConfigValue({ type: "string" }, bytes)).toBe("wifi");
  });
});

describe("decodeConfigNotification", () => {
  it("decodes uint8 at offset 7", () => {
    const v = configNotify(1, new Uint8Array([1]));
    expect(decodeConfigNotification({ type: "uint8", longConfig: false }, v)).toBe("1");
  });

  it("strips long-config block header for single block", () => {
    const payload = new TextEncoder().encode("DauSe,0>");
    const v = configNotify(28, new Uint8Array([0, 1, ...payload]));
    expect(decodeConfigNotification({ type: "string", longConfig: true }, v)).toBe("DauSe,0>");
  });
});
