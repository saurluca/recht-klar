"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { toast } from "sonner";
import type { LegalArea } from "@/lib/legal-areas";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { SCORECARD_STORAGE_KEY, type StoredCheckResult } from "@/lib/session";
import { ArrowLeft, ArrowUp, Loader2 } from "lucide-react";

function messageText(m: UIMessage): string {
  return (
    m.parts
      ?.filter((p) => p.type === "text")
      .map((p) => (p.type === "text" ? p.text : ""))
      .join("") ?? ""
  );
}

export function ChatIntake({ area }: { area: LegalArea }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [scoring, setScoring] = useState(false);

  const welcome: UIMessage = useMemo(
    () => ({
      id: "welcome",
      role: "assistant",
      parts: [{ type: "text", text: area.chatIntro }],
    }),
    [area.chatIntro],
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { areaSlug: area.slug },
      }),
    [area.slug],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: `rk-${area.slug}`,
    messages: [welcome],
    transport,
  });

  const userTurns = messages.filter((m) => m.role === "user").length;
  const canScore = userTurns >= 2;
  const busy = status === "submitted" || status === "streaming";
  const sendDisabled = !input.trim() || status !== "ready" || scoring || busy;

  async function submitMessage() {
    const t = input.trim();
    if (!t || status !== "ready" || scoring) return;
    await sendMessage({ text: t });
    setInput("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await submitMessage();
  }

  function onComposerKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submitMessage();
    }
  }

  async function runScorecard() {
    setScoring(true);
    try {
      const res = await fetch("/api/scorecard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, areaSlug: area.slug }),
      });
      const data = (await res.json()) as
        | { scorecard: StoredCheckResult["scorecard"] }
        | { error?: string };
      if (!res.ok || !("scorecard" in data)) {
        throw new Error(
          "error" in data && typeof data.error === "string"
            ? data.error
            : "Auswertung fehlgeschlagen",
        );
      }
      const transcript = messages
        .map((m) => `${m.role}: ${messageText(m)}`)
        .join("\n\n");
      const payload: StoredCheckResult = {
        scorecard: data.scorecard,
        areaSlug: area.slug,
        areaLabel: area.label,
        transcript,
        createdAt: new Date().toISOString(),
      };
      sessionStorage.setItem(SCORECARD_STORAGE_KEY, JSON.stringify(payload));
      router.push("/check/result");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Auswertung fehlgeschlagen",
      );
    } finally {
      setScoring(false);
    }
  }

  return (
    <div className="bg-background flex min-h-0 min-w-0 flex-1 flex-col">
      {/* Obere Leiste — kompakt wie ChatGPT */}
      <header className="border-border flex shrink-0 items-center gap-2 border-b px-2 py-2 sm:px-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground size-9 shrink-0 rounded-lg"
          asChild
        >
          <Link href="/check" aria-label="Anderes Rechtsgebiet wählen">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-foreground truncate text-sm font-medium sm:text-base">
            {area.label}
          </h1>
          <Progress
            value={Math.min((userTurns / 6) * 100, 100)}
            className="mt-1 h-0.5"
          />
          <p className="text-muted-foreground mt-0.5 text-[10px] sm:text-xs">
            {userTurns} / ~6 Antworten
            {!canScore ? " · noch etwas Geduld" : " · Auswertung möglich"}
          </p>
        </div>
      </header>

      {/* Nachrichten — scrollt nur hier */}
      <Conversation className="bg-muted/15 min-h-0 flex-1">
        <ConversationContent className="mx-auto max-w-3xl gap-5 px-3 py-4 sm:gap-6 sm:px-4 md:px-6">
          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent>
                {m.parts?.map((part, i) =>
                  part.type === "text" ? (
                    m.role === "assistant" ? (
                      <MessageResponse key={i}>{part.text}</MessageResponse>
                    ) : (
                      <p key={i} className="whitespace-pre-wrap text-sm">
                        {part.text}
                      </p>
                    )
                  ) : null,
                )}
              </MessageContent>
            </Message>
          ))}
          {busy ? (
            <p className="text-muted-foreground flex items-center gap-2 text-xs">
              <Loader2 className="size-3.5 animate-spin" />
              Assistent schreibt…
            </p>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton className="bottom-24" />
      </Conversation>

      {error ? (
        <p className="text-destructive px-4 py-1 text-center text-xs">
          Etwas ist schiefgelaufen. Bitte kurz warten und erneut versuchen.
        </p>
      ) : null}

      {/* Composer — fixiert unten im Panel */}
      <div className="border-border bg-background/95 supports-backdrop-filter:bg-background/80 shrink-0 border-t px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-4 sm:py-3">
        <div className="mx-auto max-w-3xl space-y-2">
          {canScore ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-9 w-full text-xs sm:text-sm"
              disabled={busy || scoring}
              onClick={() => void runScorecard()}
            >
              {scoring ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Auswertung läuft…
                </>
              ) : (
                "Auswertung erstellen"
              )}
            </Button>
          ) : (
            <p className="text-muted-foreground text-center text-[10px] sm:text-xs">
              Mindestens zwei Antworten – dann erscheint die Auswertung.
            </p>
          )}

          <form
            onSubmit={(e) => void onSubmit(e)}
            className="border-border flex items-end gap-2 rounded-3xl border bg-muted/50 px-2 py-1.5 shadow-sm sm:px-3 sm:py-2"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onComposerKeyDown}
              placeholder="Nachricht an Recht-Klar…"
              rows={1}
              disabled={status !== "ready" || scoring}
              className="max-h-[min(30dvh,8rem)] min-h-[44px] flex-1 resize-none border-0 bg-transparent px-2 py-2.5 text-sm shadow-none focus-visible:ring-0"
            />
            <Button
              type="submit"
              size="icon"
              disabled={sendDisabled}
              className="size-9 shrink-0 rounded-full"
              aria-label="Senden"
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowUp className="size-4" />
              )}
            </Button>
          </form>
          <p className="text-muted-foreground px-1 text-center text-[10px] leading-tight">
            Keine Rechtsberatung – nur unverbindliche Information (§ 2 RDG).
          </p>
        </div>
      </div>
    </div>
  );
}
