import { db } from "@/database/db";
import type { AIMemory } from "./types";

const MEMORY_PREFIX = "perignon_";

export async function saveMemory(key: string, value: string): Promise<void> {
  const memoryKey = MEMORY_PREFIX + key;

  const existing = await db.aiMemory.where("key").equals(memoryKey).first();

  if (existing) {
    await db.aiMemory.update(existing.id, {
      value,
      updatedAt: new Date().toISOString(),
    });
    return;
  }

  await db.aiMemory.add({
    id: crypto.randomUUID(),
    key: memoryKey,
    value,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function getMemory(key: string): Promise<string | null> {
  const memory = await db.aiMemory.where("key").equals(MEMORY_PREFIX + key).first();
  return memory?.value ?? null;
}

export async function getAllMemory(): Promise<AIMemory[]> {
  const memories = await db.aiMemory.where("key").startsWith(MEMORY_PREFIX).toArray();
  return memories ?? [];
}

export async function forgetMemory(key: string): Promise<void> {
  const memory = await db.aiMemory.where("key").equals(MEMORY_PREFIX + key).first();
  if (memory) {
    await db.aiMemory.delete(memory.id);
  }
}
