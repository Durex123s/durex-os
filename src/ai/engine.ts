import { AIResponse } from "./types";
import { detectIntent } from "./intents";

export async function askPerignon(
  message: string
): Promise<AIResponse> {

  const intent = detectIntent(message);

  switch (intent) {

    case "FINANCE":
      return {
        intent,
        confidence: 0.9,
        message:
          "💰 Je suis en mode Finance. Je peux analyser tes revenus, tes dépenses, ton budget et t'aider à économiser."
      };


    case "PLANNING":
      return {
        intent,
        confidence: 0.9,
        message:
          "📅 Je suis en mode Planning. Je peux organiser ta journée, tes tâches et tes priorités."
      };


    case "STUDY":
      return {
        intent,
        confidence: 0.9,
        message:
          "📚 Je suis en mode Études. Je peux t'aider avec tes cours, révisions et exercices."
      };


    case "DISCIPLINE":
      return {
        intent,
        confidence: 0.9,
        message:
          "🔥 Je suis en mode Discipline. Je peux suivre tes habitudes et t'aider à rester constant."
      };


    case "GOAL":
      return {
        intent,
        confidence: 0.9,
        message:
          "🎯 Je suis en mode Objectifs. Construisons un plan pour atteindre tes ambitions."
      };


    case "ANALYSIS":
      return {
        intent,
        confidence: 0.8,
        message:
          "📊 Je suis en mode Analyse. Je vais examiner tes données pour trouver des améliorations."
      };


    default:
      return {
        intent: "CHAT",
        confidence: 0.5,
        message:
          "🤖 Je suis Pérignon AI, ton assistant personnel intégré dans Veyrion. Comment puis-je t'aider ?"
      };
  }
}	

