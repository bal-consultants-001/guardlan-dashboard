// src/types.ts

// Device Lists
export type DeviceList = {
  comment: string | null;
  groups: string[]; // assuming this is an array of strings
  type: string;
};

// Device Groups
export type DeviceGroup = {
  name: string;
  comment: string | null;
  pi_id: number; // adjust to string if it's a UUID
};

// Device Clients
export type DeviceClient = {
  name: string | null;
  client: string; // assuming this is a MAC address or similar
  groups: string[]; // assuming array
  cli_id: number; // adjust if it's a UUID
};

export type DeviceWithLog = Device & {
  taID: string
  latestLog?: LogEntry | null
};