import { Button } from "@/components/ui/button";
import { LogOut, Search, Shield, User } from "lucide-react";
import { useState } from "react";
import { UserRole } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserProfile, useUserRole } from "../hooks/useQueries";
import { formatKSh } from "../utils/odds";
import AuthModal from "./AuthModal";
import DepositModal from "./DepositModal";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { identity, clear } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const { data: userRole } = useUserRole();
  const [authOpen, setAuthOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);

  const isLoggedIn = !!identity && !!profile;
  const isAdmin = userRole === UserRole.admin;
  const balance = profile ? Number(profile.balance) / 100 : 0;

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "live", label: "Live Betting" },
    { id: "sports", label: "Sports" },
    ...(isAdmin ? [{ id: "admin", label: "Admin" }] : []),
    ...(isLoggedIn ? [{ id: "account", label: "My Account" }] : []),
  ];

  return (
    <header>
      {/* Utility bar */}
      <div
        className="w-full"
        style={{
          background: "oklch(0.10 0.01 230)",
          borderBottom: "1px solid oklch(0.18 0.012 230)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "oklch(0.50 0.01 230)" }}
          >
            Main Navigation
          </span>
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <>
                <div
                  className="flex items-center gap-2 px-3 py-1 rounded"
                  style={{ background: "oklch(0.14 0.012 230)" }}
                >
                  <span className="text-xs text-muted-foreground">
                    Balance:
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "oklch(0.60 0.17 145)" }}
                  >
                    {formatKSh(Math.round(balance))}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="h-7 text-xs font-bold px-3"
                  style={{ background: "oklch(0.60 0.17 145)", color: "white" }}
                  onClick={() => onNavigate("withdrawal")}
                  data-ocid="header.secondary_button"
                >
                  Withdraw
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs font-bold px-3"
                  style={{ background: "oklch(0.50 0.20 25)", color: "white" }}
                  onClick={() => setDepositOpen(true)}
                  data-ocid="header.primary_button"
                >
                  Deposit
                </Button>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{profile.displayName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => clear()}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                  data-ocid="header.toggle"
                >
                  <LogOut className="w-3 h-3" />
                  Logout
                </button>
              </>
            )}
            {!isLoggedIn && (
              <Button
                size="sm"
                className="h-7 text-xs font-bold px-4"
                style={{ background: "oklch(0.60 0.17 145)", color: "white" }}
                onClick={() => setAuthOpen(true)}
                data-ocid="header.primary_button"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Primary nav */}
      <div
        className="w-full"
        style={{
          background: "oklch(0.14 0.012 230)",
          borderBottom: "1px solid oklch(0.22 0.015 230)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-3 cursor-pointer bg-transparent border-0 p-0"
            onClick={() => onNavigate("home")}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "oklch(0.60 0.17 145)" }}
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-foreground">
                Pata
              </span>
              <span
                className="text-xl font-black tracking-tight"
                style={{ color: "oklch(0.60 0.17 145)" }}
              >
                Bet
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate(link.id)}
                className={`px-4 py-2 text-sm font-semibold transition-all rounded-sm relative ${
                  currentPage === link.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="nav.link"
              >
                {link.label}
                {currentPage === link.id && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "oklch(0.60 0.17 145)" }}
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="w-4 h-4" />
            <span className="hidden md:inline text-sm">Search</span>
          </div>
        </div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} />
    </header>
  );
}
