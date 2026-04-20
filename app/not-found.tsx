import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-foreground text-2xl font-semibold">
        Seite nicht gefunden
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Diese Adresse existiert nicht oder wurde verschoben.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Zur Startseite</Link>
      </Button>
    </main>
  );
}
