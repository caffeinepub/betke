import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRequestWithdrawal, useUserProfile } from "../hooks/useQueries";
import { formatKSh } from "../utils/odds";

export default function QuickWithdrawal() {
  const { data: profile } = useUserProfile();
  const requestWithdrawal = useRequestWithdrawal();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const amountNum = Number.parseFloat(amount) || 0;
  const youReceive = amountNum / 2;
  const balance = profile ? Number(profile.balance) / 100 : 0;

  const handleWithdraw = async () => {
    if (!phone.trim()) {
      toast.error("Enter M-PESA number");
      return;
    }
    if (amountNum <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (amountNum > balance) {
      toast.error("Insufficient balance");
      return;
    }

    try {
      await requestWithdrawal.mutateAsync({
        amount: BigInt(Math.round(amountNum * 100)),
        phoneNumber: phone.trim(),
      });
      toast.success(`Withdrawal of KSh ${youReceive.toFixed(2)} requested!`);
      setPhone("");
      setAmount("");
    } catch (e: any) {
      toast.error(e?.message ?? "Withdrawal failed");
    }
  };

  return (
    <div
      className="rounded-lg border"
      style={{
        background: "oklch(0.16 0.015 230)",
        borderColor: "oklch(0.22 0.015 230)",
      }}
      data-ocid="withdrawal.panel"
    >
      <div
        className="px-4 py-3 border-b flex items-center gap-2"
        style={{ borderColor: "oklch(0.22 0.015 230)" }}
      >
        <Smartphone className="w-4 h-4 text-primary" />
        <h3 className="font-bold text-sm uppercase tracking-wide text-foreground">
          QUICK WITHDRAWAL
        </h3>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Available Balance</span>
          <span className="font-bold text-foreground">
            {formatKSh(Math.round(balance))}
          </span>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">M-PESA NUMBER</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0712345678"
            className="bg-input border-border text-foreground text-sm h-9"
            data-ocid="withdrawal.input"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">AMOUNT (KSh)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="bg-input border-border text-foreground text-sm h-9"
            data-ocid="withdrawal.input"
          />
        </div>

        {amountNum > 0 && (
          <div
            className="rounded p-2 text-xs space-y-1"
            style={{ background: "oklch(0.12 0.012 230)" }}
          >
            <div className="flex justify-between text-muted-foreground">
              <span>Requested Amount</span>
              <span>KSh {amountNum.toFixed(2)}</span>
            </div>
            <div
              className="flex justify-between font-bold"
              style={{ color: "oklch(0.60 0.17 145)" }}
            >
              <span>You will receive (50%)</span>
              <span>KSh {youReceive.toFixed(2)}</span>
            </div>
          </div>
        )}

        <Button
          className="w-full font-bold text-sm"
          style={{ background: "oklch(0.50 0.20 25)", color: "white" }}
          onClick={handleWithdraw}
          disabled={requestWithdrawal.isPending}
          data-ocid="withdrawal.submit_button"
        >
          {requestWithdrawal.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "CONFIRM WITHDRAWAL"
          )}
        </Button>
      </div>
    </div>
  );
}
