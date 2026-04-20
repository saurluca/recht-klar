import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { buildChatSystemPrompt, getAreaBySlug } from "@/lib/legal-areas";
import { getLanguageModel } from "@/lib/openrouter";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({
        error: "Server-Konfiguration: OPENROUTER_API_KEY fehlt.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Ungültiger JSON-Body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, areaSlug } = body as {
    messages?: UIMessage[];
    areaSlug?: string;
  };

  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "messages fehlt" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const area = getAreaBySlug(areaSlug ?? "");
  if (!area) {
    return new Response(
      JSON.stringify({ error: "Unbekanntes Rechtsgebiet" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const result = streamText({
    model: getLanguageModel(),
    system: buildChatSystemPrompt(area),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
