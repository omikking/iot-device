const BASE_UUID = "bdeeXXXX-7e07-4e68-85f1-d4d87a014940";
const uuid = (s: string): string => BASE_UUID.replace("XXXX", s);

export const SERVICES = {
  CONFIG:      uuid("0101"),
  STATUS:      uuid("0102"),
  DEVICE_INFO: "device_information",
} as const;

export const CHARS = {
  SET_CONFIG:    uuid("0111"),
  GET_CONFIG:    uuid("0112"),
  CONFIG_VALUE:  uuid("0113"),
  DEVICE_STATUS: uuid("0121"),
  COMMAND:       uuid("0122"),
} as const;

