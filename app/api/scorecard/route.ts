import { generateObject, type UIMessage } from "ai";
import { cookies } from "next/headers";
import { scorecardSchema } from "@/lib/scorecard-schema";
import { getAreaBySlug } from "@/lib/legal-areas";
import { getLanguageModel } from "@/lib/openrouter";
import { stripIntakeStatusFooter } from "@/lib/intake-status";

export const maxDuration = 60;

function transcriptFromMessages(messages: UIMessage[]): string {
  return messages
    .map((m) => {
      const raw =
        m.parts
          ?.filter((p) => p.type === "text")
          .map((p) => (p.type === "text" ? p.text : ""))
          .join("") ?? "";
      const text =
        m.role === "assistant"
          ? stripIntakeStatusFooter(raw)
          : raw;
      return `${m.role.toUpperCase()}: ${text.trim()}`;
    })
    .filter((line) => line.length > 3)
    .join("\n\n");
}

export async function POST(req: Request) {
  const jar = await cookies();
  if (jar.get("rk_paid")?.value !== "1") {
    return new Response(
      JSON.stringify({
        error:
          "Die Auswertung ist nach dem Kauf freigeschaltet. Bitte schließe zuerst die Zahlung ab.",
      }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }

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

  const userTurns = Array.isArray(messages)
    ? messages.filter((m) => m.role === "user").length
    : 0;

  if (!messages || !Array.isArray(messages) || userTurns < 3) {
    return new Response(
      JSON.stringify({
        error:
          "Mindestens drei deiner Antworten werden für die Auswertung benötigt.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const area = getAreaBySlug(areaSlug ?? "");
  if (!area) {
    return new Response(
      JSON.stringify({ error: "Unbekanntes Rechtsgebiet" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const transcript = transcriptFromMessages(messages);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const { object } = await generateObject({
      model: getLanguageModel(),
      schema: scorecardSchema,
      abortSignal: controller.signal,
      prompt: `Du erstellst eine „Legal Scorecard" für einen Laien auf Deutsch.

WICHTIG:
- Keine Rechtsberatung: Formulierung durchgängig vorsichtig (z. B. „kann", „häufig", „Orientierung").
- Erfolgschance und Kosten sind Schätzungen auf Basis des Chats – keine Garantie.
- Wenn du Prozentzahlen oder Statistiken nennst, kennzeichne sie im Fließtext als ungefähre Markt-/Praxis-Orientierung, keine zitierten Studien erfinden.
- ampel: gruen wenn sinnvoller nächster Schritt oft eine anwaltliche Klärung ist; gelb wenn viele Unbekannte; rot wenn eher kein Handlungsbedarf oder nur Beobachtung.
- handlungsbedarf: ja | nein | beobachten – konsistent zu ampel und Text.

Rechtsgebiet: ${area.label}

Chat-Verlauf:
${transcript}
`,
    });

    return Response.json({ scorecard: object });
  } catch (e) {
    const message =
      e instanceof Error && e.name === "AbortError"
        ? "Zeitüberschreitung bei der Auswertung."
        : "Auswertung fehlgeschlagen.";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    clearTimeout(timeout);
  }
}
