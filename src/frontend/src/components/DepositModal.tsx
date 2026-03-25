import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeposit } from "../hooks/useQueries";

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DepositModal({ open, onClose }: DepositModalProps) {
  const deposit = useDeposit();
  const [amount, setAmount] = useState("");

  const handleDeposit = async () => {
    const num = Number.parseFloat(amount);
    if (!num || num <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      await deposit.mutateAsync(BigInt(Math.round(num * 100)));
      toast.success(`KSh ${num.toFixed(2)} deposited successfully!`);
      setAmount("");
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Deposit failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-sm"
        style={{
          background: "oklch(0.16 0.015 230)",
          border: "1px solid oklch(0.22 0.015 230)",
        }}
        data-ocid="deposit.modal"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Wallet className="w-5 h-5 text-primary" />
            Deposit Funds
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add funds to your BetKE wallet via M-PESA.
          </p>
          <div className="space-y-2">
            <Label className="text-foreground">Amount (KSh)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1000"
              className="bg-input border-border text-foreground"
              data-ocid="deposit.input"
            />
          </div>
          <Button
            className="w-full font-bold"
            style={{ background: "oklch(0.50 0.20 25)", color: "white" }}
            onClick={handleDeposit}
            disabled={deposit.isPending}
            data-ocid="deposit.submit_button"
          >
            {deposit.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "DEPOSIT"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
