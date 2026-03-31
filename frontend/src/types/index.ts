export type Vendor = "unknown" | "cisco" | "huawei" | "fortigate";
export type TargetVendor = "cisco" | "huawei" | "fortigate";
export type Severity = "info" | "warning" | "error";

export interface WarningModel {
  code: string;
  message: string;
  severity: Severity;
}

export interface InterfaceModel {
  name: string;
  description: string;
  ip: string;
  mask: string;
  prefix: number;
  vlan: string;
  shutdown: boolean;
  original_name?: string | null;
}

export interface StaticRouteModel {
  destination: string;
  mask: string;
  prefix: number;
  gateway: string;
}

export interface DeviceIntent {
  hostname: string;
  interfaces: InterfaceModel[];
  static_routes: StaticRouteModel[];
  warnings: WarningModel[];
}

export interface AnalyzeRequest {
  raw_config: string;
  source_vendor: Vendor;
}

export interface AnalyzeResponse {
  detected_vendor: Vendor;
  confidence: number;
  data: DeviceIntent;
}

export interface ConvertRequest {
  raw_config: string;
  source_vendor: Vendor;
  target_vendor: TargetVendor;
}

export interface ConvertResponse {
  detected_vendor: Vendor;
  confidence: number;
  target_vendor: string;
  data: DeviceIntent;
  generated_config: string;
}