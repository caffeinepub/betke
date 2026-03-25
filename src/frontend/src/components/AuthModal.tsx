import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveProfile, useUserProfile } from "../hooks/useQueries";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const saveProfile = useSaveProfile();
  const [displayName, setDisplayName] = useState("");

  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async () => {
    await login();
  };

  const handleRegister = async () => {
    if (!identity || !displayName.trim()) return;
    try {
      await saveProfile.mutateAsync({
        id: identity.getPrincipal(),
        displayName: displayName.trim(),
        balance: BigInt(0),
        registrationDate: BigInt(Date.now()) * BigInt(1_000_000),
      });
      toast.success("Account created! Welcome to BetKE");
      onClose();
    } catch {
      toast.error("Failed to create account");
    }
  };

  const showRegister = identity && !profile && loginStatus === "success";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-sm"
        style={{
          background: "oklch(0.16 0.015 230)",
          border: "1px solid oklch(0.22 0.015 230)",
        }}
        data-ocid="auth.modal"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Shield className="w-5 h-5 text-primary" />
            {showRegister ? "Create Your Account" : "Sign In to BetKE"}
          </DialogTitle>
        </DialogHeader>

        {!showRegister ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect with Internet Identity to place bets and manage your
              account.
            </p>
            <Button
              className="w-full bg-primary text-primary-foreground hover:opacity-90"
              onClick={handleLogin}
              disabled={isLoggingIn}
              data-ocid="auth.submit_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Sign In / Register"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose a display name for your account.
            </p>
            <div className="space-y-2">
              <Label className="text-foreground">Display Name</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. JohnKE"
                className="bg-input border-border text-foreground"
                data-ocid="auth.input"
              />
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground hover:opacity-90"
              onClick={handleRegister}
              disabled={!displayName.trim() || saveProfile.isPending}
              data-ocid="auth.submit_button"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
