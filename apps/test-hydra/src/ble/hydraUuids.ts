const BASE_UUID = "bdeeXXXX-7e07-4e68-85f1-d4d87a014940";
const uuid = (s: string): string => BASE_UUID.replace("XXXX", s);

export const SERVICES = {
  CONFIG: uuid("0001"),
  MEASUREMENT: uuid("0002"),
  STATUS: uuid("0003"),
  DEVICE_INFO: "device_information",
} as const;

export const CHARS = {
  SET_CONFIG: uuid("0011"),
  GET_CONFIG: uuid("0012"),
  CONFIG_VALUE: uuid("0013"),
  RETRIEVE_MEASUREMENTS: uuid("0021"),
  MEASUREMENT_META: uuid("0022"),
  MEASUREMENT_DATA: uuid("0023"),
  DEVICE_STATUS: uuid("0031"),
  COMMAND: uuid("0033"),
} as const;
