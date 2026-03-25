import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MatchResult, MatchStatus } from "../backend";
import AuthModal from "../components/AuthModal";
import BetSlip from "../components/BetSlip";
import MatchCard from "../components/MatchCard";
import QuickWithdrawal from "../components/QuickWithdrawal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMatches } from "../hooks/useQueries";
import { useUserProfile } from "../hooks/useQueries";
import type { BetSlipItem } from "../types/betting";

interface HomePageProps {
  onLoginRequest: () => void;
}

// Static sample matches for display when no matches from backend
const SAMPLE_MATCHES = [
  {
    id: BigInt(1),
    homeTeam: "AFC Leopards",
    awayTeam: "Gor Mahia",
    sport: "football" as any,
    status: MatchStatus.live,
    result: MatchResult.pending,
    matchDate: BigInt(Date.now() * 1_000_000),
    createdBy: null as any,
  },
  {
    id: BigInt(2),
    homeTeam: "Tusker FC",
    awayTeam: "Bandari FC",
    sport: "football" as any,
    status: MatchStatus.upcoming,
    result: MatchResult.pending,
    matchDate: BigInt((Date.now() + 3600000) * 1_000_000),
    createdBy: null as any,
  },
  {
    id: BigInt(3),
    homeTeam: "Ulinzi Stars",
    awayTeam: "KCB FC",
    sport: "football" as any,
    status: MatchStatus.upcoming,
    result: MatchResult.pending,
    matchDate: BigInt((Date.now() + 7200000) * 1_000_000),
    createdBy: null as any,
  },
  {
    id: BigInt(4),
    homeTeam: "Mathare United",
    awayTeam: "Posta Rangers",
    sport: "football" as any,
    status: MatchStatus.live,
    result: MatchResult.pending,
    matchDate: BigInt(Date.now() * 1_000_000),
    createdBy: null as any,
  },
  {
    id: BigInt(5),
    homeTeam: "Kenya Simbas",
    awayTeam: "Impala RFC",
    sport: "rugby" as any,
    status: MatchStatus.upcoming,
    result: MatchResult.pending,
    matchDate: BigInt((Date.now() + 10800000) * 1_000_000),
    createdBy: null as any,
  },
  {
    id: BigInt(6),
    homeTeam: "Thunder Hawks",
    awayTeam: "Lakers Kenya",
    sport: "basketball" as any,
    status: MatchStatus.upcoming,
    result: MatchResult.pending,
    matchDate: BigInt((Date.now() + 14400000) * 1_000_000),
    createdBy: null as any,
  },
];

export default function HomePage({ onLoginRequest }: HomePageProps) {
  const { data: matches, isLoading } = useMatches();
  const { identity } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const [betSlipItems, setBetSlipItems] = useState<BetSlipItem[]>([]);
  const [heroSlide, setHeroSlide] = useState(0);

  const isLoggedIn = !!identity && !!profile;
  const displayMatches =
    matches && matches.length > 0 ? matches : SAMPLE_MATCHES;
  const liveMatches = displayMatches.filter(
    (m) => m.status === MatchStatus.live,
  );
  const upcomingMatches = displayMatches.filter(
    (m) => m.status === MatchStatus.upcoming,
  );

  const heroSlides = [
    {
      title: "WELCOME TO PATABEAT",
      subtitle: "BEST ODDS ON KPL & MORE!",
      cta: "BET NOW",
      color: "oklch(0.60 0.17 145)",
    },
    {
      title: "KPL SEASON 2025",
      subtitle: "LIVE MATCHES EVERY WEEKEND!",
      cta: "VIEW MATCHES",
      color: "oklch(0.74 0.14 75)",
    },
    {
      title: "WIN BIG TODAY",
      subtitle: "JACKPOT: KSH 5,000,000",
      cta: "JOIN NOW",
      color: "oklch(0.50 0.20 25)",
    },
  ];

  const handleSelectOdds = (item: BetSlipItem) => {
    setBetSlipItems((prev) => {
      const exists = prev.find((b) => b.matchId === item.matchId);
      if (exists) {
        if (exists.outcome === item.outcome) {
          return prev.filter((b) => b.matchId !== item.matchId);
        }
        return prev.map((b) => (b.matchId === item.matchId ? item : b));
      }
      return [...prev, item];
    });
  };

  const handleRemove = (matchId: bigint) => {
    setBetSlipItems((prev) => prev.filter((b) => b.matchId !== matchId));
  };

  return (
    <main>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "oklch(0.12 0.012 230)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              minHeight: 280,
              background: "oklch(0.14 0.012 230)",
              border: "1px solid oklch(0.22 0.015 230)",
            }}
          >
            <img
              src="/assets/generated/hero-football.dim_1200x500.jpg"
              alt="BetKE Hero"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div
              className="relative z-10 flex items-center h-full p-8 md:p-12"
              style={{ minHeight: 280 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroSlide}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-lg"
                >
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: heroSlides[heroSlide].color }}
                  >
                    🏆 Kenya's #1 Betting Platform
                  </p>
                  <h1 className="text-3xl md:text-4xl font-black text-foreground mb-1 leading-tight">
                    {heroSlides[heroSlide].title}
                  </h1>
                  <p className="text-lg font-bold text-gold mb-6">
                    {heroSlides[heroSlide].subtitle}
                  </p>
                  <Button
                    className="font-black text-sm px-8 py-5 uppercase tracking-wide"
                    style={{
                      background: heroSlides[heroSlide].color,
                      color: "white",
                    }}
                    onClick={() => !isLoggedIn && onLoginRequest()}
                    data-ocid="hero.primary_button"
                  >
                    {heroSlides[heroSlide].cta}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide controls */}
            <button
              type="button"
              onClick={() =>
                setHeroSlide(
                  (s) => (s - 1 + heroSlides.length) % heroSlides.length,
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "oklch(0.22 0.015 230 / 0.8)" }}
              data-ocid="hero.toggle"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <button
              type="button"
              onClick={() => setHeroSlide((s) => (s + 1) % heroSlides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "oklch(0.22 0.015 230 / 0.8)" }}
              data-ocid="hero.toggle"
            >
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroSlides.map((_, i) => (
                <button
                  type="button"
                  key={`dot-${_}`}
                  onClick={() => setHeroSlide(i)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    background:
                      i === heroSlide
                        ? "oklch(0.60 0.17 145)"
                        : "oklch(0.40 0.01 230)",
                  }}
                  data-ocid="hero.toggle"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: matches */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live */}
            {liveMatches.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Zap
                    className="w-4 h-4"
                    style={{ color: "oklch(0.60 0.17 145)" }}
                  />
                  <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
                    LIVE NOW
                  </h2>
                  <span className="live-badge ml-1">{liveMatches.length}</span>
                </div>
                <div className="space-y-3" data-ocid="live.list">
                  {isLoading
                    ? ["s1", "s2"].map((sk) => (
                        <Skeleton key={sk} className="h-36 rounded-lg" />
                      ))
                    : liveMatches.map((m, i) => (
                        <MatchCard
                          key={m.id.toString()}
                          match={m}
                          selectedOutcome={
                            betSlipItems.find((b) => b.matchId === m.id)
                              ?.outcome
                          }
                          onSelectOdds={handleSelectOdds}
                          index={i + 1}
                        />
                      ))}
                </div>
              </motion.section>
            )}

            {/* Upcoming */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
                  UPCOMING EVENTS
                </h2>
              </div>
              <div className="space-y-3" data-ocid="upcoming.list">
                {isLoading
                  ? ["s1", "s2", "s3"].map((sk) => (
                      <Skeleton key={sk} className="h-36 rounded-lg" />
                    ))
                  : upcomingMatches.map((m, i) => (
                      <MatchCard
                        key={m.id.toString()}
                        match={m}
                        selectedOutcome={
                          betSlipItems.find((b) => b.matchId === m.id)?.outcome
                        }
                        onSelectOdds={handleSelectOdds}
                        index={i + 1}
                      />
                    ))}
                {!isLoading && upcomingMatches.length === 0 && (
                  <div
                    className="text-center py-10"
                    data-ocid="upcoming.empty_state"
                  >
                    <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                    <p className="text-sm text-muted-foreground">
                      No upcoming matches scheduled
                    </p>
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          {/* Right: sidebar */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <BetSlip
              items={betSlipItems}
              onRemove={handleRemove}
              onClear={() => setBetSlipItems([])}
              isLoggedIn={isLoggedIn}
              onLoginRequest={onLoginRequest}
            />
            {isLoggedIn && <QuickWithdrawal />}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
