import { MatchResult } from "../backend";

// Deterministic pseudo-odds seeded by matchId
export function getOdds(matchId: bigint): Record<MatchResult, number> {
  const seed = Number(matchId % BigInt(1000));
  const homeOdds = 1.5 + ((seed * 37) % 200) / 100;
  const drawOdds = 2.8 + ((seed * 53) % 150) / 100;
  const awayOdds = 1.5 + ((seed * 71) % 250) / 100;
  return {
    [MatchResult.homeWin]: Math.round(homeOdds * 100) / 100,
    [MatchResult.draw]: Math.round(drawOdds * 100) / 100,
    [MatchResult.awayWin]: Math.round(awayOdds * 100) / 100,
    [MatchResult.pending]: 1,
  };
}

export function formatKSh(amount: bigint | number): string {
  const n = typeof amount === "bigint" ? Number(amount) : amount;
  return `KSh ${n.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
