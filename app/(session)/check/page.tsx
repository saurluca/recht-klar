import Link from "next/link";
import { LEGAL_AREAS, type LegalArea } from "@/lib/legal-areas";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Briefcase,
  Car,
  Home,
  ShieldCheck,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<LegalArea["icon"], LucideIcon> = {
  home: Home,
  briefcase: Briefcase,
  shopping: ShoppingBag,
  car: Car,
  shield: ShieldCheck,
};

export default function CheckAreaSelectPage() {
  return (
    <main className="mx-auto max-w-5xl min-h-0 flex-1 overflow-y-auto px-6 py-8 md:px-8">
      <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
        Worum geht es?
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl text-base">
        Wähle den Bereich, der am besten passt. Du wirst anschließend Schritt
        für Schritt durch gezielte Fragen geführt.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {LEGAL_AREAS.map((area) => {
          const Icon = ICON_MAP[area.icon];
          return (
            <Link
              key={area.slug}
              href={`/check/${area.slug}`}
              className="group"
            >
              <Card className="border-border bg-card/50 h-full transition-colors group-hover:border-primary">
                <CardHeader>
                  <Icon className="text-primary mb-2 size-8" aria-hidden />
                  <CardTitle className="text-lg">{area.label}</CardTitle>
                  <CardDescription>{area.examples}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
