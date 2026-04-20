import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaqSection } from "@/components/faq";
import { Disclaimer } from "@/components/disclaimer";
import { ArrowRight, Euro, Search, ShieldOff, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-32">
        <Badge variant="secondary" className="mb-6">
          KI-gestützte Ersteinschätzung · 40 €
        </Badge>
        <h1 className="text-foreground max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          Rechtssicherheit in 5 Minuten. Zum Festpreis.
        </h1>
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
          Beschreibe dein Anliegen im geführten Chat. Du erhältst eine klare
          Orientierung: Handlungsbedarf, Erfolgschance und Kostenrisiko – ohne
          Vorlesen von Paragraphen-Textwänden.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button asChild size="lg">
            <Link href="/check" className="inline-flex items-center gap-2">
              Kostenlos starten
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#how">So funktioniert&apos;s</Link>
          </Button>
        </div>
        <p className="text-muted-foreground mt-6 max-w-xl text-sm">
          Keine Rechtsberatung. Reine Information gemäß § 2 RDG.
        </p>
      </section>

      <section className="bg-card/40 border-y border-border">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3 md:px-8 md:py-24">
          <Card className="border-border bg-background/60">
            <CardHeader>
              <Euro className="text-primary size-8" />
              <CardTitle className="text-lg">Erstberatung ist teuer</CardTitle>
              <CardDescription>
                Anwaltliche Erstberatung kostet häufig 190–500 € – bevor klar
                ist, ob sich ein Schritt überhaupt lohnt.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border bg-background/60">
            <CardHeader>
              <ShieldOff className="text-primary size-8" />
              <CardTitle className="text-lg">Rechtsschutz hakt oft</CardTitle>
              <CardDescription>
                Deckung und Streitwert sind nicht immer klar – viele scheuen
                deshalb den ersten Schritt.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border bg-background/60">
            <CardHeader>
              <Search className="text-primary size-8" />
              <CardTitle className="text-lg">Dr. Google ist riskant</CardTitle>
              <CardDescription>
                Foren und Suchtreffer sind selten zu deinem konkreten
                Sachverhalt passend – und emotional aufgeladen.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section id="how" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <h2 className="text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
            So funktioniert&apos;s
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Drei klare Schritte – du bleibst im Flow, wir strukturieren die
            Fakten.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Rechtsgebiet wählen",
                body: "Miete, Arbeit, Kauf, Verkehr oder Versicherung – was am nächsten dran ist.",
              },
              {
                step: "2",
                title: "Chat-Intake (~5 Min.)",
                body: "Der Assistent fragt gezielt nach Fakten, Fristen und Beweisen – ein Thema pro Nachricht.",
              },
              {
                step: "3",
                title: "Legal Scorecard",
                body: "Nach einmaliger Zahlung: Handlungsbedarf, Erfolgschance und Kostenrisiko – plus nächster Schritt.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-xl border border-border bg-card/50 p-6"
              >
                <span className="text-primary font-mono text-sm font-semibold">
                  {item.step}
                </span>
                <h3 className="text-foreground mt-2 text-lg font-medium">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card/30 border-y border-border py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
              Beispiel: Eigenbedarfskündigung
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              „Mein Vermieter hat mir wegen Eigenbedarf gekündigt, weil seine
              Nichte einziehen will. Ist das rechtens?“ – eine typische Frage,
              die viele Mieter beschäftigt.
            </p>
            <Separator className="my-6" />
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <strong className="text-foreground">Rechtlicher Check:</strong>{" "}
                Enge familiäre Bindung und nachvollziehbare Begründung sind
                zentrale Punkte – ohne Einzelfallbetrachtung keine Gewissheit.
              </li>
              <li>
                <strong className="text-foreground">Orientierung:</strong> Viele
                Verfahren enden in Vergleichen; exakte Prozentangaben sind im
                Chat nur als grobe Einordnung möglich.
              </li>
            </ul>
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary size-5" />
                <CardTitle className="text-base">
                  Scorecard (vereinfacht)
                </CardTitle>
              </div>
              <CardDescription>
                Illustration – keine echte Auswertung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Handlungsbedarf</span>
                <span className="text-success font-medium">Ja / prüfen</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Erfolgschance</span>
                <span className="font-mono font-medium">ca. 75 %</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Kostenrisiko</span>
                <span className="font-mono text-right">
                  z. B. 1.200 € bei Streitwert 5.000 €
                </span>
              </div>
              <p className="text-muted-foreground border-border border-t pt-4 text-xs leading-relaxed">
                So oder ähnlich kann dein Ergebnis aussehen – abhängig von
                deinen Antworten und dem gewählten Rechtsgebiet.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-xl px-6 md:px-8">
          <h2 className="text-foreground text-center text-2xl font-semibold tracking-tight">
            Festpreis, fair und klar
          </h2>
          <Card className="mt-8">
            <CardHeader>
              <Badge variant="secondary">Legal-Check</Badge>
              <CardTitle className="text-3xl">40 €</CardTitle>
              <CardDescription>einmalig · inkl. MwSt.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Geführter Chat, Legal Scorecard und optionaler Schritt zur
                Partnerkanzlei.
              </p>
              <Disclaimer variant="short" />
              <Button asChild className="w-full" size="lg">
                <Link href="/check">
                  Chat starten – Kasse vor der Auswertung
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <FaqSection />

      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-8">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Bereit für deine Ersteinschätzung?
          </h2>
          <p className="mt-3 text-sm opacity-90">
            Transparent, schnell, ohne Abo – mit klarem Hinweis auf die Grenzen
            von KI-Information.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link href="/check">Jetzt Legal-Check starten</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
