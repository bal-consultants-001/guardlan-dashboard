// src/types.ts

// Device Lists
export type DeviceList = {
  comment: string | null;
  groups: number[] | string[]; // assuming this is an array of strings
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
  groups: number[] | string[]; // assuming array
  cli_id: number; // adjust if it's a UUID
};

export type Device = {
  "Hostname": string
  "OS": string
  "Model": string
  Q_Total: string
  Q_Perc: string
  taID: string
  // Add more fields as needed
  
};
export type LogEntry = {
  UniID: string
  Date: string
  Q_Total?: string
  Q_Perc?: string
};
export type DeviceWithLog = Device & {
  taID: string
  latestLog?: LogEntry | null
};