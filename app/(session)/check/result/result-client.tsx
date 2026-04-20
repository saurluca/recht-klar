"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LegalScorecardView } from "@/components/legal-scorecard";
import { Disclaimer } from "@/components/disclaimer";
import { buildKanzleiMailto } from "@/lib/mailto";
import { SCORECARD_STORAGE_KEY, type StoredCheckResult } from "@/lib/session";

export function ResultClient() {
  const router = useRouter();
  const [data] = useState<StoredCheckResult | null>(() => {
    try {
      const raw = sessionStorage.getItem(SCORECARD_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as StoredCheckResult;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (data === null) {
      router.replace("/check");
    }
  }, [data, router]);

  if (!data) {
    return null;
  }

  const mailto = buildKanzleiMailto({
    email: process.env.NEXT_PUBLIC_KANZLEI_EMAIL ?? "kanzlei@recht-klar.de",
    areaLabel: data.areaLabel,
    scorecard: data.scorecard,
  });

  const showCta =
    data.scorecard.ampel === "gruen" || data.scorecard.ampel === "gelb";

  return (
    <main className="mx-auto max-w-4xl flex-1 px-6 py-12 md:px-8">
      <LegalScorecardView
        scorecard={data.scorecard}
        areaLabel={data.areaLabel}
        createdAt={data.createdAt}
      />

      <div className="mt-10 space-y-4">
        {showCta ? (
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <a href={mailto}>An Partnerkanzlei übergeben (E-Mail)</a>
          </Button>
        ) : (
          <p className="text-muted-foreground text-sm leading-relaxed">
            Nach dieser Orientierung ist ein Anwaltsgang vermutlich nicht der
            erste Schritt – du kannst trotzdem eine zweite Meinung einholen.
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/check">Neuen Check starten</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/">Zur Startseite</Link>
          </Button>
        </div>
      </div>

      <Disclaimer variant="long" className="mt-10" />
    </main>
  );
}
