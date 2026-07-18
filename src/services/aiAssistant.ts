import { askPerignon } from "@/ai/engine";
import type { AIResponse } from "@/ai/types";

export async function askAssistant(
  message: string
): Promise<AIResponse> {
  return await askPerignon(message);
}
