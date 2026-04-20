import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const apiKey = process.env.OPENROUTER_API_KEY;

export const openrouterProvider = createOpenRouter({
  apiKey,
  appName: "Recht-Klar",
});

/** Sprachmodell für Chat & Scorecard (OpenRouter-Modell-ID, z. B. anthropic/claude-3.5-sonnet). */
export function getLanguageModel() {
  const modelId =
    process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-sonnet";
  return openrouterProvider.chat(
    modelId as Parameters<typeof openrouterProvider.chat>[0],
  );
}
