"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { toast } from "sonner";
import type { LegalArea } from "@/lib/legal-areas";
import {
  parseIntakeStatusFooter,
  stripIntakeStatusFooter,
} from "@/lib/intake-status";
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
import {
  PENDING_SCORECARD_KEY,
  type PendingScorecardPayload,
} from "@/lib/session";
import { ArrowLeft, ArrowUp, Loader2 } from "lucide-react";

function rawMessageText(m: UIMessage): string {
  return (
    m.parts
      ?.filter((p) => p.type === "text")
      .map((p) => (p.type === "text" ? p.text : ""))
      .join("") ?? ""
  );
}

function messageTextForTranscript(m: UIMessage): string {
  const raw = rawMessageText(m);
  return m.role === "assistant" ? stripIntakeStatusFooter(raw) : raw;
}

export function ChatIntake({ area }: { area: LegalArea }) {
  const router = useRouter();
  const [input, setInput] = useState("");

  const welcome: UIMessage = useMemo(
    () => ({
      id: "welcome",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: `${area.chatIntro}\n\n[[STATUS:MEHR_INFO]]`,
        },
      ],
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
  const canStartScorecard = userTurns >= 3;
  const busy = status === "submitted" || status === "streaming";
  const sendDisabled = !input.trim() || status !== "ready" || busy;

  let lastAssistantStatus: ReturnType<typeof parseIntakeStatusFooter> = null;
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "assistant") continue;
    lastAssistantStatus = parseIntakeStatusFooter(rawMessageText(m));
    break;
  }

  async function submitMessage() {
    const t = input.trim();
    if (!t || status !== "ready") return;
    await sendMessage({ text: t });
    setInput("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await submitMessage();
  }

  function onComposerKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.shiftKey) return;
    if (e.nativeEvent.isComposing) return;
    e.preventDefault();
    void submitMessage();
  }

  function goToCheckoutForScorecard() {
    if (userTurns < 3) {
      toast.error("Bitte beantworte mindestens drei Fragen.");
      return;
    }
    if (busy) return;

    const transcript = messages
      .map((m) => `${m.role}: ${messageTextForTranscript(m)}`)
      .join("\n\n");
    const payload: PendingScorecardPayload = {
      messages,
      areaSlug: area.slug,
      areaLabel: area.label,
      transcript,
    };
    try {
      sessionStorage.setItem(PENDING_SCORECARD_KEY, JSON.stringify(payload));
    } catch {
      toast.error(
        "Der Chat konnte nicht zwischengespeichert werden. Bitte erlaube lokale Speicherung im Browser.",
      );
      return;
    }
    router.push("/pricing?next=%2Fcheck%2Ffinish");
  }

  return (
    <div className="bg-background flex min-h-0 min-w-0 flex-1 flex-col">
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
            {userTurns} Nutzerantworten · mindestens 3 für die Auswertung
          </p>
        </div>
      </header>

      <Conversation className="bg-muted/15 min-h-0 flex-1">
        <ConversationContent className="mx-auto max-w-3xl gap-5 px-3 py-4 sm:gap-6 sm:px-4 md:px-6">
          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent>
                {m.parts?.map((part, i) =>
                  part.type === "text" ? (
                    m.role === "assistant" ? (
                      <MessageResponse key={i}>
                        {stripIntakeStatusFooter(part.text)}
                      </MessageResponse>
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

      <div className="border-border bg-background/95 supports-backdrop-filter:bg-background/80 shrink-0 border-t px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-4 sm:py-3">
        <div className="mx-auto max-w-3xl space-y-2">
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
              disabled={status !== "ready"}
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

          <div className="space-y-1.5 px-0.5">
            {!canStartScorecard ? (
              <p className="text-muted-foreground text-center text-[10px] sm:text-xs">
                Noch {3 - userTurns}{" "}
                {3 - userTurns === 1 ? "Antwort" : "Antworten"} bis die
                Auswertung freigeschaltet ist.
              </p>
            ) : lastAssistantStatus === "BEREIT" ? (
              <p className="text-success text-center text-[10px] sm:text-xs">
                Der Assistent hat genug Infos für eine erste Einordnung – du
                kannst zur Kasse gehen und die Auswertung freischalten.
              </p>
            ) : lastAssistantStatus === "MEHR_INFO" ? (
              <p className="text-warning text-center text-[10px] sm:text-xs">
                Der Assistent schlägt vor, noch Details zu klären – du kannst
                trotzdem zur Kasse gehen.
              </p>
            ) : (
              <p className="text-muted-foreground text-center text-[10px] sm:text-xs">
                Warte auf die nächste Assistenten-Antwort für die Empfehlung
                (mehr Infos vs. bereit).
              </p>
            )}

            <Button
              type="button"
              variant="default"
              size="default"
              className="h-10 w-full text-sm font-medium"
              disabled={!canStartScorecard || busy}
              onClick={goToCheckoutForScorecard}
            >
              Weiter zur Auswertung (Kasse)
            </Button>
          </div>

          <p className="text-muted-foreground px-1 text-center text-[10px] leading-tight">
            Enter sendet die Nachricht, Shift+Enter neue Zeile. Keine
            Rechtsberatung – nur Information (§ 2 RDG).
          </p>
        </div>
      </div>
    </div>
  );
}
