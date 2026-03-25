import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownCircle, Trophy, User, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { BetStatus, MatchResult, WithdrawalStatus } from "../backend";
import {
  useUserBets,
  useUserProfile,
  useUserWithdrawals,
} from "../hooks/useQueries";
import { useMatches } from "../hooks/useQueries";
import { formatKSh } from "../utils/odds";

const BET_STATUS_COLORS: Record<BetStatus, string> = {
  [BetStatus.won]: "oklch(0.60 0.17 145)",
  [BetStatus.lost]: "oklch(0.50 0.20 25)",
  [BetStatus.pending]: "oklch(0.74 0.14 75)",
};

const WD_STATUS_COLORS: Record<WithdrawalStatus, string> = {
  [WithdrawalStatus.approved]: "oklch(0.60 0.17 145)",
  [WithdrawalStatus.rejected]: "oklch(0.50 0.20 25)",
  [WithdrawalStatus.pending]: "oklch(0.74 0.14 75)",
};

const OUTCOME_LABELS: Record<MatchResult, string> = {
  [MatchResult.homeWin]: "Home Win",
  [MatchResult.draw]: "Draw",
  [MatchResult.awayWin]: "Away Win",
  [MatchResult.pending]: "Pending",
};

export default function AccountPage() {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: bets, isLoading: betsLoading } = useUserBets();
  const { data: withdrawals, isLoading: wdLoading } = useUserWithdrawals();
  const { data: matches } = useMatches();

  const balance = profile ? Number(profile.balance) / 100 : 0;
  const wonBets =
    bets?.filter((b) => b.betStatus === BetStatus.won).length ?? 0;
  const pendingBets =
    bets?.filter((b) => b.betStatus === BetStatus.pending).length ?? 0;

  const getMatchName = (matchId: bigint) => {
    const match = matches?.find((m) => m.id === matchId);
    return match
      ? `${match.homeTeam} vs ${match.awayTeam}`
      : `Match #${matchId}`;
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Profile header */}
        <div
          className="rounded-xl p-6 mb-6 border"
          style={{
            background: "oklch(0.16 0.015 230)",
            borderColor: "oklch(0.22 0.015 230)",
          }}
        >
          {profileLoading ? (
            <div className="space-y-3" data-ocid="account.loading_state">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-48" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.60 0.17 145 / 0.2)" }}
                >
                  <User
                    className="w-7 h-7"
                    style={{ color: "oklch(0.60 0.17 145)" }}
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Account
                  </p>
                  <h1 className="text-2xl font-black text-foreground">
                    {profile?.displayName}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Member since{" "}
                    {profile
                      ? new Date(
                          Number(profile.registrationDate) / 1_000_000,
                        ).toLocaleDateString("en-KE")
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    icon: <Wallet className="w-4 h-4" />,
                    label: "Balance",
                    value: formatKSh(Math.round(balance)),
                    color: "oklch(0.60 0.17 145)",
                  },
                  {
                    icon: <Trophy className="w-4 h-4" />,
                    label: "Bets Won",
                    value: wonBets.toString(),
                    color: "oklch(0.74 0.14 75)",
                  },
                  {
                    icon: <ArrowDownCircle className="w-4 h-4" />,
                    label: "Pending",
                    value: pendingBets.toString(),
                    color: "oklch(0.50 0.20 25)",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-3 rounded-lg"
                    style={{ background: "oklch(0.12 0.012 230)" }}
                  >
                    <div
                      className="flex justify-center mb-1"
                      style={{ color: stat.color }}
                    >
                      {stat.icon}
                    </div>
                    <p
                      className="text-lg font-black"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bets" data-ocid="account.tab">
          <TabsList
            className="mb-4"
            style={{ background: "oklch(0.14 0.012 230)" }}
          >
            <TabsTrigger value="bets" data-ocid="account.tab">
              Bet History
            </TabsTrigger>
            <TabsTrigger value="withdrawals" data-ocid="account.tab">
              Withdrawals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bets">
            {betsLoading ? (
              <div className="space-y-3" data-ocid="bets.loading_state">
                {["s1", "s2", "s3"].map((sk) => (
                  <Skeleton key={sk} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : bets && bets.length > 0 ? (
              <div className="space-y-2" data-ocid="bets.list">
                {bets.map((bet, i) => (
                  <div
                    key={bet.id.toString()}
                    className="flex items-center justify-between rounded-lg p-4 border"
                    style={{
                      background: "oklch(0.16 0.015 230)",
                      borderColor: "oklch(0.22 0.015 230)",
                    }}
                    data-ocid={`bets.item.${i + 1}`}
                  >
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {getMatchName(bet.matchId)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {OUTCOME_LABELS[bet.selectedOutcome]} · KSh{" "}
                        {(Number(bet.stake) / 100).toFixed(2)}
                      </p>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-1 rounded capitalize"
                      style={{
                        background: `${BET_STATUS_COLORS[bet.betStatus]} / 0.2`,
                        color: BET_STATUS_COLORS[bet.betStatus],
                      }}
                    >
                      {bet.betStatus}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12" data-ocid="bets.empty_state">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-sm text-muted-foreground">
                  No bets placed yet. Start betting to see your history!
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="withdrawals">
            {wdLoading ? (
              <div className="space-y-3" data-ocid="withdrawals.loading_state">
                {["s1", "s2", "s3"].map((sk) => (
                  <Skeleton key={sk} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : withdrawals && withdrawals.length > 0 ? (
              <div className="space-y-2" data-ocid="withdrawals.list">
                {withdrawals.map((wd, i) => (
                  <div
                    key={wd.id.toString()}
                    className="flex items-center justify-between rounded-lg p-4 border"
                    style={{
                      background: "oklch(0.16 0.015 230)",
                      borderColor: "oklch(0.22 0.015 230)",
                    }}
                    data-ocid={`withdrawals.item.${i + 1}`}
                  >
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {wd.phoneNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Requested: KSh {(Number(wd.amount) / 100).toFixed(2)} ·
                        You receive: KSh {(Number(wd.amount) / 200).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          Number(wd.timestamp) / 1_000_000,
                        ).toLocaleDateString("en-KE")}
                      </p>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-1 rounded capitalize"
                      style={{ color: WD_STATUS_COLORS[wd.status] }}
                    >
                      {wd.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="text-center py-12"
                data-ocid="withdrawals.empty_state"
              >
                <ArrowDownCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-sm text-muted-foreground">
                  No withdrawal requests yet.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}
