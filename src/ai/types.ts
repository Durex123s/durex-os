// src/ai/types.ts

export type Intent =
  | "FINANCE"
  | "PLANNING"
  | "STUDY"
  | "DISCIPLINE"
  | "GOAL"
  | "ANALYSIS"
  | "CHAT"
  | "UNKNOWN";


export type AIIntent = Intent;


export interface AIResponse {
  intent: Intent;
  message: string;
  confidence: number;
  action?: string;
  data?: unknown;
}


export interface AIMemory {
  id: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt?: string;
}


export interface AIContext {
  userName?: string;
  currentPage?: string;
  date?: string;
  memories?: AIMemory[];
}


export interface AIToolResult {
  success: boolean;
  message: string;
  data?: unknown;
}


export interface AIAction {
  name: string;
  description: string;
  execute: () => Promise<AIToolResult>;
}
