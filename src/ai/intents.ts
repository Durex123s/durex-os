import { Intent } from "./types";

export function detectIntent(message: string): Intent {

  const text = message.toLowerCase();

  if (
    text.includes("argent") ||
    text.includes("dépense") ||
    text.includes("budget") ||
    text.includes("finance")
  ) {
    return "FINANCE";
  }

  if (
    text.includes("planning") ||
    text.includes("journée") ||
    text.includes("programme") ||
    text.includes("tâche")
  ) {
    return "PLANNING";
  }

  if (
    text.includes("étude") ||
    text.includes("cours") ||
    text.includes("examen") ||
    text.includes("réviser")
  ) {
    return "STUDY";
  }

  if (
    text.includes("discipline") ||
    text.includes("habitude") ||
    text.includes("sport")
  ) {
    return "DISCIPLINE";
  }

  if (
    text.includes("objectif") ||
    text.includes("but") ||
    text.includes("projet")
  ) {
    return "GOAL";
  }

  if (
    text.includes("analyse") ||
    text.includes("rapport")
  ) {
    return "ANALYSIS";
  }

  if (text.length > 0) {
    return "CHAT";
  }

  return "UNKNOWN";
}
