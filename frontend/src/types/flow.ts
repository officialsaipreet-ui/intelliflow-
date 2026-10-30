export type PortType =
  | "any"
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "binary";

export type NodeCategory =
  | "input"
  | "process"
  | "output"
  | "logic"
  | "data"
  | "ai"
  | "communication"
  | "security"
  | "plugin";

export type NodeStatus = "idle" | "running" | "success" | "error" | "disabled";

export type FlowStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed"
  | "error"
  | "stopped";

export interface PortDefinition {
  id: string;
  name: string;
  type: PortType;
  required?: boolean;
}

export interface Z8NodeData {
  [key: string]: unknown;
  label: string;
  type: string;
  category: NodeCategory;
  icon: string;
  config: Record<string, unknown>;
  status: NodeStatus;
  lastOutput?: unknown;
  inputs: PortDefinition[];
  outputs: PortDefinition[];
}

// Server response types are derived from their runtime schemas.
export type {
  CreateFlowResponse,
  FlowDetail,
  FlowListResponse,
  FlowSummary,
} from "@/lib/schemas";

export interface CreateFlowRequest {
  name: string;
  description?: string;
}

/** Port type color mapping */
export const PORT_COLORS: Record<PortType, string> = {
  any: "#AE957D",
  string: "#9BBF4A",
  number: "#F7823F",
  boolean: "#F9C04A",
  object: "#E0607E",
  array: "#E8956B",
  binary: "#EF4444",
};

/** Node category color mapping (Intelliflow warm palette) */
export const CATEGORY_COLORS: Record<NodeCategory, string> = {
  input: "#9BBF4A",
  process: "#EC6622",
  output: "#F0A92A",
  logic: "#D9467A",
  data: "#C98A5A",
  ai: "#F25C54",
  communication: "#E07A5F",
  security: "#C0392B",
  plugin: "#A89584",
};
