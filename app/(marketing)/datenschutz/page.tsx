import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-2xl flex-1 px-6 py-16 md:px-8">
      <h1 className="text-foreground text-3xl font-semibold tracking-tight">
        Datenschutz
      </h1>
      <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
        Platzhalter für das MVP: Vollständige Datenschutzerklärung inkl.
        Auftragsverarbeitung, Hosting und KI-Anbieter (OpenRouter) wird vor
        Produktivgang ergänzt. Im aktuellen MVP werden keine Scorecard-Daten
        serverseitig dauerhaft gespeichert; Chat-Inhalte werden zur Antwort an
        den Modellanbieter übermittelt.
      </p>
      <Link
        href="/"
        className="text-primary mt-8 inline-block text-sm font-medium hover:underline"
      >
        ← Zur Startseite
      </Link>
    </main>
  );
}
