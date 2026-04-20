import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";

export function SiteFooter() {
  return (
    <footer className="border-border mt-auto border-t">
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-12 md:px-8">
        <Disclaimer variant="long" />
        <div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            href="/impressum"
            className="hover:text-foreground transition-colors"
          >
            Impressum
          </Link>
          <Link
            href="/datenschutz"
            className="hover:text-foreground transition-colors"
          >
            Datenschutz
          </Link>
        </div>
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} Recht-Klar. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
