import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale } from "lucide-react";

const nav = [
  { href: "/#how", label: "So funktioniert's" },
  { href: "/pricing", label: "Preis" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full shrink-0 border-b border-border backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6 md:px-8">
        <Link
          href="/"
          className="text-foreground flex items-center gap-2 font-semibold tracking-tight"
        >
          <Scale className="text-primary size-6" aria-hidden />
          Recht-Klar
        </Link>
        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Hauptnavigation"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm" className="shrink-0">
          <Link href="/pricing">Jetzt prüfen</Link>
        </Button>
      </div>
    </header>
  );
}
