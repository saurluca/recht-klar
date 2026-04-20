import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ITEMS = [
  {
    q: "Ist das Rechtsberatung?",
    a: "Nein. Du erhältst eine KI-gestützte Ersteinschätzung und Information, aber keine anwaltliche Rechtsberatung im Sinne des Rechtsdienstleistungsgesetz (§ 2 RDG). Für verbindliche Beratung brauchst du eine Kanzlei.",
  },
  {
    q: "Wo werden meine Angaben gespeichert?",
    a: "Im MVP werden keine Daten dauerhaft auf unseren Servern gespeichert. Der Chat läuft über die aktuelle Sitzung; die Scorecard liegt nur kurz in deinem Browser (sessionStorage), bis du den Tab schließt.",
  },
  {
    q: "Was passiert nach dem Check?",
    a: "Du siehst deine Legal Scorecard mit Handlungsbedarf, Erfolgschance und Kostenrisiko. Wenn es passt, kannst du per E-Mail eine Partnerkanzlei kontaktieren.",
  },
  {
    q: "Gibt es verbindliche Fristen oder Garantien?",
    a: "Nein. Die Einordnung ersetzt keine Prüfung durch eine Kanzlei und beinhaltet keine Prozess- oder Erfolgsgarantie.",
  },
  {
    q: "Welche Rechtsgebiete werden abgedeckt?",
    a: "Mietrecht, Arbeitsrecht, Kauf- & Verbraucherrecht, Verkehrsrecht und Versicherungsrecht. Wir erweitern das Angebot schrittweise.",
  },
  {
    q: "Wer steht hinter Recht-Klar?",
    a: "Recht-Klar ist ein digitales Produkt im Aufbau. Impressum und Anbieterkennzeichnung findest du auf der Seite „Impressum“ (Platzhalter bis zur finalen Freigabe).",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <h2 className="text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
          Häufige Fragen
        </h2>
        <p className="text-muted-foreground mt-2 text-base">
          Kurz und transparent – ohne Kleingedrucktes-Streicheln.
        </p>
        <Accordion type="single" collapsible className="mt-8 w-full">
          {ITEMS.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
