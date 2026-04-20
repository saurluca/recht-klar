"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-foreground text-2xl font-semibold">
        Etwas ist schiefgelaufen
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Bitte versuche es erneut oder kehre zur Startseite zurück.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={() => reset()}>
          Erneut versuchen
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Startseite</Link>
        </Button>
      </div>
    </main>
  );
}
