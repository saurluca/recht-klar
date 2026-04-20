import type { Scorecard } from "@/lib/scorecard-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const handlungsLabels: Record<Scorecard["handlungsbedarf"], string> = {
  ja: "Ja",
  nein: "Nein",
  beobachten: "Beobachten",
};

function AmpelIcon({ ampel }: { ampel: Scorecard["ampel"] }) {
  if (ampel === "gruen") {
    return <CheckCircle2 className="text-success size-14" aria-hidden />;
  }
  if (ampel === "gelb") {
    return <AlertTriangle className="text-warning size-14" aria-hidden />;
  }
  return <XCircle className="text-destructive size-14" aria-hidden />;
}

function ErfolgCircle({ pct }: { pct: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="relative mx-auto flex size-32 items-center justify-center">
      <svg className="size-32 -rotate-90" viewBox="0 0 100 100" aria-hidden>
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          className="stroke-muted"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          className="stroke-primary transition-all duration-500"
          strokeWidth="8"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-foreground font-mono absolute text-3xl font-semibold">
        {pct}%
      </span>
    </div>
  );
}

type LegalScorecardProps = {
  scorecard: Scorecard;
  areaLabel: string;
  createdAt: string;
  className?: string;
};

export function LegalScorecardView({
  scorecard,
  areaLabel,
  createdAt,
  className,
}: LegalScorecardProps) {
  const date = new Date(createdAt).toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const kostenRatio = Math.min(
    scorecard.kostenrisiko.streitwertEuro > 0
      ? Math.min(
          scorecard.kostenrisiko.geschaetzteKostenEuro /
            scorecard.kostenrisiko.streitwertEuro,
          1,
        )
      : 0,
    1,
  );

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <p className="text-muted-foreground text-sm">
          {areaLabel} · {date}
        </p>
        <h2 className="text-foreground mt-1 text-2xl font-semibold tracking-tight">
          Deine Legal Scorecard
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Handlungsbedarf</CardTitle>
            <CardDescription>
              {handlungsLabels[scorecard.handlungsbedarf]}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <AmpelIcon ampel={scorecard.ampel} />
            <p className="text-muted-foreground text-center text-sm leading-relaxed">
              {scorecard.handlungsbedarfBegruendung}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Erfolgschance</CardTitle>
            <CardDescription>Orientierung, keine Garantie</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ErfolgCircle pct={scorecard.erfolgschance.prozent} />
            <p className="text-muted-foreground text-center text-sm leading-relaxed">
              {scorecard.erfolgschance.begruendung}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kostenrisiko</CardTitle>
            <CardDescription>Streitwert vs. geschätzte Kosten</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Streitwert (geschätzt)
                </span>
                <span className="font-mono">
                  {scorecard.kostenrisiko.streitwertEuro.toLocaleString(
                    "de-DE",
                  )}{" "}
                  €
                </span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Kosten (geschätzt)
                </span>
                <span className="font-mono">
                  {scorecard.kostenrisiko.geschaetzteKostenEuro.toLocaleString(
                    "de-DE",
                  )}{" "}
                  €
                </span>
              </div>
              <Progress value={kostenRatio * 100} className="h-2" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {scorecard.kostenrisiko.rechtsschutzHinweis}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rechtlicher Check</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
            {scorecard.rechtlicherCheck}
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/40 bg-accent/30">
        <CardHeader>
          <CardTitle className="text-base">
            Empfehlung (nächster Schritt)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
            {scorecard.empfehlung}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
