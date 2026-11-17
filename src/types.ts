export type MapObjectType =
  | "pole"
  | "transformer"
  | "house"
  | "tree";

export type MapObjectData = {
  id: string;
  type: MapObjectType;
  name: string;
  x: number;
  y: number;
};

export type MapAreaData = {
  id: string;
  type: "road" | "water";
  points: { x: number; y: number }[];
};

export type VoltageType = "low" | "medium" | "high";

export type PowerLineData = {
  id: string;
  startId: string;
  endId: string;
  voltage: VoltageType;
};

export type ToolType =
  | "select"
  | "pole"
  | "transformer"
  | "house"
  | "tree"
  | "road"
  | "water"
  | "line"
  | "delete";

export type NetworkStats = {
  poles: number;
  lines: number;
  length: number;
  transformers: number;
};