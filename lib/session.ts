import type { Scorecard } from "@/lib/scorecard-schema";

export const SCORECARD_STORAGE_KEY = "rk_scorecard";

export type StoredCheckResult = {
  scorecard: Scorecard;
  areaSlug: string;
  areaLabel: string;
  transcript: string;
  createdAt: string;
};
