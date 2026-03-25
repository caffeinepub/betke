import { Trophy, Zap } from "lucide-react";
import { type Match, MatchResult, MatchStatus } from "../backend";
import type { BetSlipItem } from "../types/betting";
import { getOdds } from "../utils/odds";

const SPORT_LABELS: Record<string, string> = {
  football: "⚽ Football",
  basketball: "🏀 Basketball",
  rugby: "🏉 Rugby",
};

interface MatchCardProps {
  match: Match;
  selectedOutcome?: MatchResult;
  onSelectOdds: (item: BetSlipItem) => void;
  index: number;
}

export default function MatchCard({
  match,
  selectedOutcome,
  onSelectOdds,
  index,
}: MatchCardProps) {
  const odds = getOdds(match.id);
  const isLive = match.status === MatchStatus.live;
  const isSettled = match.status === MatchStatus.settled;

  const matchDate = new Date(Number(match.matchDate) / 1_000_000);
  const dateStr = matchDate.toLocaleDateString("en-KE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleSelect = (outcome: MatchResult) => {
    if (isSettled) return;
    onSelectOdds({
      matchId: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      outcome,
      odds: odds[outcome],
    });
  };

  return (
    <div
      className="rounded-lg p-4 border transition-all hover:border-primary/40"
      style={{
        background: "oklch(0.16 0.015 230)",
        borderColor: "oklch(0.22 0.015 230)",
      }}
      data-ocid={`match.item.${index}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {SPORT_LABELS[match.sport] ?? match.sport}
          </span>
          {isLive && <span className="live-badge">● LIVE</span>}
          {isSettled && (
            <span
              className="text-xs px-2 py-0.5 rounded-sm uppercase font-bold"
              style={{
                background: "oklch(0.22 0.015 230)",
                color: "oklch(0.72 0.01 230)",
              }}
            >
              Settled
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{dateStr}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 text-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-1">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
          <p className="font-semibold text-sm text-foreground">
            {match.homeTeam}
          </p>
        </div>
        <div className="px-4">
          <span
            className="text-xs font-bold text-muted-foreground px-2 py-1 rounded"
            style={{ background: "oklch(0.12 0.012 230)" }}
          >
            VS
          </span>
        </div>
        <div className="flex-1 text-center">
          <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-1">
            <Zap className="w-4 h-4 text-destructive" />
          </div>
          <p className="font-semibold text-sm text-foreground">
            {match.awayTeam}
          </p>
        </div>
      </div>

      {!isSettled ? (
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { outcome: MatchResult.homeWin, label: "1", sublabel: "Home" },
              { outcome: MatchResult.draw, label: "X", sublabel: "Draw" },
              { outcome: MatchResult.awayWin, label: "2", sublabel: "Away" },
            ] as const
          ).map(({ outcome, label, sublabel }) => (
            <button
              type="button"
              key={outcome}
              className={`btn-odds ${selectedOutcome === outcome ? "selected" : ""}`}
              onClick={() => handleSelect(outcome)}
              data-ocid="match.toggle"
            >
              <span className="font-bold text-sm">
                {label} {sublabel}
              </span>
              <span className="mt-0.5 font-mono font-bold">
                {odds[outcome].toFixed(2)}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground">
          Result:{" "}
          <span className="font-bold text-gold">
            {match.result === MatchResult.homeWin
              ? `${match.homeTeam} Win`
              : match.result === MatchResult.draw
                ? "Draw"
                : match.result === MatchResult.awayWin
                  ? `${match.awayTeam} Win`
                  : "Pending"}
          </span>
        </div>
      )}
    </div>
  );
}
