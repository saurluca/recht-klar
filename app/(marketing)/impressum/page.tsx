import Link from "next/link";

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-2xl flex-1 px-6 py-16 md:px-8">
      <h1 className="text-foreground text-3xl font-semibold tracking-tight">
        Impressum
      </h1>
      <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
        Platzhalter für das MVP: Angaben gemäß § 5 TMG / § 18 MStV folgen vor
        dem öffentlichen Launch. Bitte wende dich bis dahin über die in der App
        angegebene Kontaktadresse an uns.
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
