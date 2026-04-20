/** KI-Signal am Ende jeder Assistenten-Nachricht (siehe Systemprompt). */
export type IntakeStatusToken = "MEHR_INFO" | "BEREIT";

const STATUS_LINE = /\n\[\[STATUS:(MEHR_INFO|BEREIT)\]\]\s*$/u;

/** Entfernt die Status-Zeile für die Anzeige und für Transkripte. */
export function stripIntakeStatusFooter(text: string): string {
  return text.replace(STATUS_LINE, "").trimEnd();
}

/** Liest das letzte Status-Token aus dem Rohtext einer Assistenten-Nachricht. */
export function parseIntakeStatusFooter(text: string): IntakeStatusToken | null {
  const m = text.match(/\[\[STATUS:(MEHR_INFO|BEREIT)\]\]/u);
  if (!m) return null;
  return m[1] as IntakeStatusToken;
}
