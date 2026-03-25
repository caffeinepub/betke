import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Ticket, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MatchResult } from "../backend";
import { usePlaceBet } from "../hooks/useQueries";
import type { BetSlipItem } from "../types/betting";

interface BetSlipProps {
  items: BetSlipItem[];
  onRemove: (matchId: bigint) => void;
  onClear: () => void;
  isLoggedIn: boolean;
  onLoginRequest: () => void;
}

const OUTCOME_LABELS: Record<MatchResult, string> = {
  [MatchResult.homeWin]: "Home Win",
  [MatchResult.draw]: "Draw",
  [MatchResult.awayWin]: "Away Win",
  [MatchResult.pending]: "Pending",
};

export default function BetSlip({
  items,
  onRemove,
  onClear,
  isLoggedIn,
  onLoginRequest,
}: BetSlipProps) {
  const [stake, setStake] = useState("");
  const placeBet = usePlaceBet();

  const stakeNum = Number.parseFloat(stake) || 0;
  const totalOdds = items.reduce((acc, i) => acc * i.odds, 1);
  const potentialReturn = stakeNum * totalOdds;
  const yourShare = potentialReturn / 2;

  const handlePlaceBet = async () => {
    if (!isLoggedIn) {
      onLoginRequest();
      return;
    }
    if (items.length === 0) {
      toast.error("Add selections to your bet slip");
      return;
    }
    if (stakeNum <= 0) {
      toast.error("Enter a valid stake");
      return;
    }

    try {
      for (const item of items) {
        await placeBet.mutateAsync({
          matchId: item.matchId,
          outcome: item.outcome,
          stake: BigInt(Math.round(stakeNum * 100)),
        });
      }
      toast.success("Bets placed successfully!");
      onClear();
      setStake("");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to place bet");
    }
  };

  return (
    <div
      className="rounded-lg border"
      style={{
        background: "oklch(0.16 0.015 230)",
        borderColor: "oklch(0.22 0.015 230)",
      }}
      data-ocid="betslip.panel"
    >
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: "oklch(0.22 0.015 230)" }}
      >
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm uppercase tracking-wide text-foreground">
            MY BET SLIP
          </h3>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-6" data-ocid="betslip.empty_state">
            <Ticket className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-xs text-muted-foreground">
              Click on odds to add selections
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2" data-ocid="betslip.list">
              {items.map((item, i) => (
                <div
                  key={item.matchId.toString()}
                  className="flex items-center justify-between rounded p-2 text-xs"
                  style={{ background: "oklch(0.12 0.012 230)" }}
                  data-ocid={`betslip.item.${i + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {item.homeTeam} vs {item.awayTeam}
                    </p>
                    <p className="text-muted-foreground">
                      {OUTCOME_LABELS[item.outcome]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <span className="text-gold font-bold font-mono">
                      {item.odds.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemove(item.matchId)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      data-ocid={`betslip.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                STAKE (KSh)
              </Label>
              <Input
                type="number"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="Enter amount"
                className="bg-input border-border text-foreground text-sm h-9"
                data-ocid="betslip.input"
              />
            </div>

            <div
              className="space-y-1 text-xs p-3 rounded"
              style={{ background: "oklch(0.12 0.012 230)" }}
            >
              <div className="flex justify-between text-muted-foreground">
                <span>Total Odds</span>
                <span className="text-gold font-mono font-bold">
                  {totalOdds.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Potential Return</span>
                <span className="text-foreground font-mono">
                  KSh {potentialReturn.toFixed(2)}
                </span>
              </div>
              <div
                className="flex justify-between font-bold"
                style={{ color: "oklch(0.60 0.17 145)" }}
              >
                <span>Your Share (50%)</span>
                <span className="font-mono">KSh {yourShare.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full font-bold text-sm"
              style={{ background: "oklch(0.60 0.17 145)", color: "white" }}
              onClick={handlePlaceBet}
              disabled={placeBet.isPending}
              data-ocid="betslip.submit_button"
            >
              {placeBet.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Placing...
                </>
              ) : (
                "PLACE BET"
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
