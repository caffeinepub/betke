import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Loader2,
  Plus,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  BetStatus,
  MatchResult,
  MatchStatus,
  Sport,
  WithdrawalStatus,
} from "../backend";
import {
  useAllBets,
  useAllWithdrawals,
  useApproveWithdrawal,
  useCreateMatch,
  useMatches,
  usePlatformStats,
  useRejectWithdrawal,
  useSettleMatch,
} from "../hooks/useQueries";
import { formatKSh } from "../utils/odds";

export default function AdminPage() {
  const { data: matches, isLoading: matchesLoading } = useMatches();
  const { data: allBets } = useAllBets();
  const { data: allWithdrawals, isLoading: wdLoading } = useAllWithdrawals();

  const { data: stats } = usePlatformStats();

  const createMatch = useCreateMatch();
  const settleMatch = useSettleMatch();
  const approveWd = useApproveWithdrawal();
  const rejectWd = useRejectWithdrawal();

  const [form, setForm] = useState({
    homeTeam: "",
    awayTeam: "",
    sport: Sport.football,
    matchDate: "",
  });
  const [settleForm, setSettleForm] = useState<{
    matchId: string;
    result: MatchResult;
  }>({
    matchId: "",
    result: MatchResult.homeWin,
  });

  const handleCreateMatch = async () => {
    if (!form.homeTeam || !form.awayTeam || !form.matchDate) {
      toast.error("Fill all fields");
      return;
    }
    try {
      await createMatch.mutateAsync({
        homeTeam: form.homeTeam,
        awayTeam: form.awayTeam,
        sport: form.sport,
        matchDate:
          BigInt(new Date(form.matchDate).getTime()) * BigInt(1_000_000),
      });
      toast.success("Match created!");
      setForm({
        homeTeam: "",
        awayTeam: "",
        sport: Sport.football,
        matchDate: "",
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create match");
    }
  };

  const handleSettleMatch = async () => {
    if (!settleForm.matchId) {
      toast.error("Select a match");
      return;
    }
    try {
      await settleMatch.mutateAsync({
        matchId: BigInt(settleForm.matchId),
        result: settleForm.result,
      });
      toast.success("Match settled!");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to settle match");
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.60 0.17 145 / 0.2)" }}
          >
            <Trophy
              className="w-5 h-5"
              style={{ color: "oklch(0.60 0.17 145)" }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage matches, bets & withdrawals
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              icon: <Trophy className="w-5 h-5" />,
              label: "Total Matches",
              value: stats?.totalMatches?.toString() ?? "—",
              color: "oklch(0.60 0.17 145)",
            },
            {
              icon: <TrendingUp className="w-5 h-5" />,
              label: "Total Bets",
              value: stats?.totalBets?.toString() ?? "—",
              color: "oklch(0.74 0.14 75)",
            },
            {
              icon: <Users className="w-5 h-5" />,
              label: "Total Users",
              value: stats?.totalUsers?.toString() ?? "—",
              color: "oklch(0.488 0.243 264)",
            },
            {
              icon: <Wallet className="w-5 h-5" />,
              label: "Withdrawn",
              value: stats
                ? formatKSh(Number(stats.totalWithdrawn) / 100)
                : "—",
              color: "oklch(0.50 0.20 25)",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg p-4 border"
              style={{
                background: "oklch(0.16 0.015 230)",
                borderColor: "oklch(0.22 0.015 230)",
              }}
            >
              <div
                className="flex items-center gap-2 mb-2"
                style={{ color: stat.color }}
              >
                {stat.icon}
              </div>
              <p className="text-xl font-black" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="matches" data-ocid="admin.tab">
          <TabsList
            className="mb-4"
            style={{ background: "oklch(0.14 0.012 230)" }}
          >
            <TabsTrigger value="matches" data-ocid="admin.tab">
              Matches
            </TabsTrigger>
            <TabsTrigger value="settle" data-ocid="admin.tab">
              Settle
            </TabsTrigger>
            <TabsTrigger value="withdrawals" data-ocid="admin.tab">
              Withdrawals
            </TabsTrigger>
            <TabsTrigger value="bets" data-ocid="admin.tab">
              All Bets
            </TabsTrigger>
          </TabsList>

          {/* Create Match */}
          <TabsContent value="matches">
            <div className="grid md:grid-cols-2 gap-6">
              <div
                className="rounded-lg p-5 border space-y-4"
                style={{
                  background: "oklch(0.16 0.015 230)",
                  borderColor: "oklch(0.22 0.015 230)",
                }}
              >
                <h3 className="font-bold text-sm uppercase tracking-wide text-foreground">
                  Create New Match
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Home Team
                    </Label>
                    <Input
                      value={form.homeTeam}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, homeTeam: e.target.value }))
                      }
                      placeholder="AFC Leopards"
                      className="bg-input border-border text-foreground text-sm h-9"
                      data-ocid="admin.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Away Team
                    </Label>
                    <Input
                      value={form.awayTeam}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, awayTeam: e.target.value }))
                      }
                      placeholder="Gor Mahia"
                      className="bg-input border-border text-foreground text-sm h-9"
                      data-ocid="admin.input"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Sport</Label>
                  <Select
                    value={form.sport}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, sport: v as Sport }))
                    }
                  >
                    <SelectTrigger
                      className="bg-input border-border text-foreground h-9"
                      data-ocid="admin.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        background: "oklch(0.18 0.015 230)",
                        borderColor: "oklch(0.22 0.015 230)",
                      }}
                    >
                      <SelectItem value={Sport.football}>
                        ⚽ Football
                      </SelectItem>
                      <SelectItem value={Sport.basketball}>
                        🏀 Basketball
                      </SelectItem>
                      <SelectItem value={Sport.rugby}>🏉 Rugby</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Match Date & Time
                  </Label>
                  <Input
                    type="datetime-local"
                    value={form.matchDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, matchDate: e.target.value }))
                    }
                    className="bg-input border-border text-foreground text-sm h-9"
                    data-ocid="admin.input"
                  />
                </div>
                <Button
                  className="w-full font-bold"
                  style={{ background: "oklch(0.60 0.17 145)", color: "white" }}
                  onClick={handleCreateMatch}
                  disabled={createMatch.isPending}
                  data-ocid="admin.submit_button"
                >
                  {createMatch.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create Match
                </Button>
              </div>

              <div
                className="rounded-lg p-5 border"
                style={{
                  background: "oklch(0.16 0.015 230)",
                  borderColor: "oklch(0.22 0.015 230)",
                }}
              >
                <h3 className="font-bold text-sm uppercase tracking-wide text-foreground mb-4">
                  All Matches
                </h3>
                {matchesLoading ? (
                  <div className="space-y-2" data-ocid="admin.loading_state">
                    <Skeleton className="h-12 rounded" />
                    <Skeleton className="h-12 rounded" />
                  </div>
                ) : matches && matches.length > 0 ? (
                  <div
                    className="space-y-2 max-h-80 overflow-y-auto"
                    data-ocid="matches.list"
                  >
                    {matches.map((m, i) => (
                      <div
                        key={m.id.toString()}
                        className="flex items-center justify-between text-sm p-3 rounded"
                        style={{ background: "oklch(0.12 0.012 230)" }}
                        data-ocid={`matches.item.${i + 1}`}
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {m.homeTeam} vs {m.awayTeam}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {m.status} · {m.sport}
                          </p>
                        </div>
                        {m.status === MatchStatus.live && (
                          <span className="live-badge">LIVE</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="text-center py-8"
                    data-ocid="matches.empty_state"
                  >
                    <p className="text-sm text-muted-foreground">
                      No matches created yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Settle Match */}
          <TabsContent value="settle">
            <div
              className="max-w-md rounded-lg p-5 border space-y-4"
              style={{
                background: "oklch(0.16 0.015 230)",
                borderColor: "oklch(0.22 0.015 230)",
              }}
            >
              <h3 className="font-bold text-sm uppercase tracking-wide text-foreground">
                Settle a Match
              </h3>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Select Match
                </Label>
                <Select
                  value={settleForm.matchId}
                  onValueChange={(v) =>
                    setSettleForm((f) => ({ ...f, matchId: v }))
                  }
                >
                  <SelectTrigger
                    className="bg-input border-border text-foreground"
                    data-ocid="settle.select"
                  >
                    <SelectValue placeholder="Choose match..." />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "oklch(0.18 0.015 230)",
                      borderColor: "oklch(0.22 0.015 230)",
                    }}
                  >
                    {matches
                      ?.filter((m) => m.status !== MatchStatus.settled)
                      .map((m) => (
                        <SelectItem
                          key={m.id.toString()}
                          value={m.id.toString()}
                        >
                          {m.homeTeam} vs {m.awayTeam}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Result</Label>
                <Select
                  value={settleForm.result}
                  onValueChange={(v) =>
                    setSettleForm((f) => ({ ...f, result: v as MatchResult }))
                  }
                >
                  <SelectTrigger
                    className="bg-input border-border text-foreground"
                    data-ocid="settle.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "oklch(0.18 0.015 230)",
                      borderColor: "oklch(0.22 0.015 230)",
                    }}
                  >
                    <SelectItem value={MatchResult.homeWin}>
                      Home Win
                    </SelectItem>
                    <SelectItem value={MatchResult.draw}>Draw</SelectItem>
                    <SelectItem value={MatchResult.awayWin}>
                      Away Win
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full font-bold"
                style={{
                  background: "oklch(0.74 0.14 75)",
                  color: "oklch(0.12 0.012 230)",
                }}
                onClick={handleSettleMatch}
                disabled={settleMatch.isPending}
                data-ocid="settle.submit_button"
              >
                {settleMatch.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Settle Match
              </Button>
            </div>
          </TabsContent>

          {/* Withdrawals */}
          <TabsContent value="withdrawals">
            {wdLoading ? (
              <div className="space-y-3" data-ocid="admin_wd.loading_state">
                {["s1", "s2", "s3"].map((sk) => (
                  <Skeleton key={sk} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : allWithdrawals && allWithdrawals.length > 0 ? (
              <div className="space-y-3" data-ocid="admin_wd.list">
                {allWithdrawals.map((wd, i) => (
                  <div
                    key={wd.id.toString()}
                    className="flex flex-col md:flex-row md:items-center justify-between rounded-lg p-4 border gap-3"
                    style={{
                      background: "oklch(0.16 0.015 230)",
                      borderColor: "oklch(0.22 0.015 230)",
                    }}
                    data-ocid={`admin_wd.item.${i + 1}`}
                  >
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {wd.phoneNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Amount: KSh {(Number(wd.amount) / 100).toFixed(2)} ·
                        They receive: KSh {(Number(wd.amount) / 200).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          Number(wd.timestamp) / 1_000_000,
                        ).toLocaleDateString("en-KE")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold px-2 py-1 rounded capitalize"
                        style={{ color: WD_STATUS_COLORS[wd.status] }}
                      >
                        {wd.status}
                      </span>
                      {wd.status === WithdrawalStatus.pending && (
                        <>
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            style={{
                              background: "oklch(0.60 0.17 145)",
                              color: "white",
                            }}
                            onClick={() => approveWd.mutate(wd.id)}
                            data-ocid={`admin_wd.confirm_button.${i + 1}`}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            style={{
                              background: "oklch(0.50 0.20 25)",
                              color: "white",
                            }}
                            onClick={() => rejectWd.mutate(wd.id)}
                            data-ocid={`admin_wd.delete_button.${i + 1}`}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="text-center py-12"
                data-ocid="admin_wd.empty_state"
              >
                <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-sm text-muted-foreground">
                  No withdrawal requests
                </p>
              </div>
            )}
          </TabsContent>

          {/* All Bets */}
          <TabsContent value="bets">
            {allBets && allBets.length > 0 ? (
              <div
                className="space-y-2 max-h-96 overflow-y-auto"
                data-ocid="admin_bets.list"
              >
                {allBets.map((bet, i) => (
                  <div
                    key={bet.id.toString()}
                    className="flex items-center justify-between rounded-lg p-3 border text-sm"
                    style={{
                      background: "oklch(0.16 0.015 230)",
                      borderColor: "oklch(0.22 0.015 230)",
                    }}
                    data-ocid={`admin_bets.item.${i + 1}`}
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        Match #{bet.matchId.toString()}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {bet.selectedOutcome} · KSh{" "}
                        {(Number(bet.stake) / 100).toFixed(2)}
                      </p>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-1 rounded capitalize"
                      style={{ color: BET_STATUS_COLORS[bet.betStatus] }}
                    >
                      {bet.betStatus}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="text-center py-12"
                data-ocid="admin_bets.empty_state"
              >
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-sm text-muted-foreground">
                  No bets placed yet
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}

const WD_STATUS_COLORS: Record<WithdrawalStatus, string> = {
  [WithdrawalStatus.approved]: "oklch(0.60 0.17 145)",
  [WithdrawalStatus.rejected]: "oklch(0.50 0.20 25)",
  [WithdrawalStatus.pending]: "oklch(0.74 0.14 75)",
};

const BET_STATUS_COLORS: Record<BetStatus, string> = {
  [BetStatus.won]: "oklch(0.60 0.17 145)",
  [BetStatus.lost]: "oklch(0.50 0.20 25)",
  [BetStatus.pending]: "oklch(0.74 0.14 75)",
};
