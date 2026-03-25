import type { MatchResult } from "../backend";

export interface BetSlipItem {
  matchId: bigint;
  homeTeam: string;
  awayTeam: string;
  outcome: MatchResult;
  odds: number;
}
