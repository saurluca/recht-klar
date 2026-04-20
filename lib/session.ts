import type { UIMessage } from "ai";
import type { Scorecard } from "@/lib/scorecard-schema";

export const SCORECARD_STORAGE_KEY = "rk_scorecard";

/** SessionStorage: Chat + Metadaten zwischen Kasse und /check/finish */
export const PENDING_SCORECARD_KEY = "rk_pending_scorecard";

export type PendingScorecardPayload = {
  messages: UIMessage[];
  areaSlug: string;
  areaLabel: string;
  transcript: string;
};

export type StoredCheckResult = {
  scorecard: Scorecard;
  areaSlug: string;
  areaLabel: string;
  transcript: string;
  createdAt: string;
};
