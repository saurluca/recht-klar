"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  PENDING_SCORECARD_KEY,
  SCORECARD_STORAGE_KEY,
  type PendingScorecardPayload,
  type StoredCheckResult,
} from "@/lib/session";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckFinishPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;

    void (async () => {
      const raw = sessionStorage.getItem(PENDING_SCORECARD_KEY);
      if (!raw) {
        toast.error("Kein Chat gefunden. Bitte starte erneut.");
        router.replace("/check");
        return;
      }

      let payload: PendingScorecardPayload;
      try {
        payload = JSON.parse(raw) as PendingScorecardPayload;
      } catch {
        toast.error("Ungültige Sitzungsdaten.");
        router.replace("/check");
        return;
      }

      if (
        !Array.isArray(payload.messages) ||
        !payload.areaSlug ||
        !payload.transcript
      ) {
        router.replace("/check");
        return;
      }

      try {
        const res = await fetch("/api/scorecard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: payload.messages,
            areaSlug: payload.areaSlug,
          }),
          signal: ac.signal,
        });
        const data = (await res.json()) as
          | { scorecard: StoredCheckResult["scorecard"] }
          | { error?: string };

        if (cancelled) return;

        if (!res.ok || !("scorecard" in data)) {
          throw new Error(
            "error" in data && typeof data.error === "string"
              ? data.error
              : "Auswertung fehlgeschlagen",
          );
        }

        const stored: StoredCheckResult = {
          scorecard: data.scorecard,
          areaSlug: payload.areaSlug,
          areaLabel: payload.areaLabel,
          transcript: payload.transcript,
          createdAt: new Date().toISOString(),
        };
        sessionStorage.setItem(SCORECARD_STORAGE_KEY, JSON.stringify(stored));
        sessionStorage.removeItem(PENDING_SCORECARD_KEY);
        router.replace("/check/result");
      } catch (e) {
        if (cancelled || (e instanceof Error && e.name === "AbortError")) {
          return;
        }
        const msg =
          e instanceof Error ? e.message : "Auswertung fehlgeschlagen";
        setError(msg);
        toast.error(msg);
      }
    })();

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [router]);

  return (
    <main className="mx-auto flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-12">
      {error ? (
        <div className="max-w-md space-y-4 text-center">
          <p className="text-destructive text-sm">{error}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild variant="default">
              <Link href="/pricing?next=%2Fcheck%2Ffinish">
                Erneut zur Kasse
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/check">Zur Gebietauswahl</Link>
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" />
          Deine Auswertung wird erstellt…
        </p>
      )}
    </main>
  );
}
