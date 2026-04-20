import type { Scorecard } from "@/lib/scorecard-schema";

export function buildKanzleiMailto(options: {
  email: string;
  areaLabel: string;
  scorecard: Scorecard;
}): string {
  const { email, areaLabel, scorecard } = options;
  const subject = encodeURIComponent(
    `Recht-Klar Legal-Check – ${areaLabel}`,
  );
  const body = encodeURIComponent(
    [
      "Hallo,",
      "",
      "ich habe über Recht-Klar eine Ersteinschätzung erhalten und möchte einen Beratungstermin.",
      "",
      `Rechtsgebiet: ${areaLabel}`,
      `Handlungsbedarf: ${scorecard.handlungsbedarf}`,
      `Erfolgschance: ${scorecard.erfolgschance.prozent} %`,
      `Streitwert (geschätzt): ${scorecard.kostenrisiko.streitwertEuro} €`,
      `Kosten (geschätzt): ${scorecard.kostenrisiko.geschaetzteKostenEuro} €`,
      "",
      "Rechtliche Einordnung (KI, unverbindlich):",
      scorecard.rechtlicherCheck,
      "",
      "Empfehlung (KI, unverbindlich):",
      scorecard.empfehlung,
      "",
      "Bitte um Rückmeldung für einen Termin.",
    ].join("\n"),
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}
