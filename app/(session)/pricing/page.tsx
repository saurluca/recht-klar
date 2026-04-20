import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { startCheckout } from "./actions";
import { Disclaimer } from "@/components/disclaimer";

type PricingPageProps = {
  searchParams?: Promise<{ next?: string }>;
};

const FEATURES = [
  "Geführter Chat-Intake",
  "Legal Scorecard",
  "Erfolgschance & Kostenrisiko",
  "E-Mail an Partnerkanzlei",
  "Keine Abo-Falle",
];

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const sp = searchParams ? await searchParams : {};
  const next = sp.next === "/check/finish" ? "/check/finish" : "/check";
  const afterChat = next === "/check/finish";

  const mock =
    process.env.NEXT_PUBLIC_MOCK_PAYMENT === "1" ||
    process.env.NEXT_PUBLIC_MOCK_PAYMENT === "true";

  return (
    <main className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto overflow-x-hidden px-4 py-3 sm:py-4">
      <div className="w-full max-w-md shrink-0">
        <h1 className="text-foreground text-center text-xl font-semibold tracking-tight sm:text-2xl">
          Ein Preis. Eine klare Orientierung.
        </h1>
        <p className="text-muted-foreground mt-1 text-center text-xs sm:text-sm">
          {afterChat
            ? "Einmalig 40 € – danach siehst du deine Legal Scorecard."
            : "Legal-Check in wenigen Minuten."}
        </p>

        <Card className="mt-4 border-border/80 shadow-sm sm:mt-5">
          <CardHeader className="space-y-1 p-4 pb-2 sm:p-5">
            <Badge variant="secondary" className="w-fit text-[10px]">
              Legal-Check
            </Badge>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <CardTitle className="text-lg sm:text-xl">
                Ersteinschätzung
              </CardTitle>
              <div className="text-right">
                <p className="text-foreground text-3xl font-semibold leading-none tracking-tight sm:text-4xl">
                  40 €
                </p>
                <CardDescription className="text-[11px]">
                  einmalig · inkl. MwSt.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0 sm:p-5 sm:pt-0">
            <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <li
                  key={f}
                  className="text-muted-foreground flex items-start gap-1.5 text-[11px] leading-snug sm:text-xs"
                >
                  <CheckCircle2 className="text-primary mt-0.5 size-3.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Disclaimer
              variant="short"
              asAlert={false}
              className="text-[10px] leading-snug sm:text-[11px]"
            />
            {mock ? (
              <p className="text-muted-foreground text-[10px] leading-snug">
                MVP: Zahlung simuliert, keine echte Abbuchung.
              </p>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t border-border/60 p-4 sm:p-5">
            <form action={startCheckout} className="w-full">
              <input type="hidden" name="next" value={next} />
              <Button
                type="submit"
                size="default"
                className="h-10 w-full text-sm"
              >
                {afterChat
                  ? "40 € zahlen & Auswertung anzeigen"
                  : "Jetzt für 40 € starten"}
              </Button>
            </form>
            <Button
              variant="ghost"
              asChild
              size="sm"
              className="h-8 w-full text-xs"
            >
              <Link href="/">Zurück zur Startseite</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
