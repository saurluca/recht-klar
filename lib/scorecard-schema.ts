import { z } from "zod";

export const scorecardSchema = z.object({
  handlungsbedarf: z
    .enum(["ja", "nein", "beobachten"])
    .describe("Ob der Nutzer aktiv werden sollte."),
  handlungsbedarfBegruendung: z.string().min(20).max(240),
  erfolgschance: z.object({
    prozent: z.number().int().min(0).max(100),
    begruendung: z.string().min(20).max(300),
  }),
  kostenrisiko: z.object({
    streitwertEuro: z.number().int().min(0),
    geschaetzteKostenEuro: z.number().int().min(0),
    rechtsschutzHinweis: z.string().min(10).max(200),
  }),
  rechtlicherCheck: z
    .string()
    .min(60)
    .max(800)
    .describe(
      "Kurze rechtliche Einordnung in Laiensprache; Paragrafen nur wenn sicher.",
    ),
  empfehlung: z
    .string()
    .min(20)
    .max(300)
    .describe("Konkreter nächster Schritt ohne verbindliche Rechtsberatung."),
  ampel: z
    .enum(["gruen", "gelb", "rot"])
    .describe(
      "gruen=Anwalt sinnvoll, gelb=unklar, rot=kein oder wenig Handlungsbedarf.",
    ),
});

export type Scorecard = z.infer<typeof scorecardSchema>;
