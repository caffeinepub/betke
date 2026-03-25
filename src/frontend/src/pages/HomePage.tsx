import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BriefcaseIcon,
  CheckCircleIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  MapIcon,
  MenuIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const SUPPORT_PHONE = "0757833315";

interface Account {
  id: string;
  emoji: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  color: string;
}

const accounts: Account[] = [
  {
    id: "prolific",
    emoji: "🔬",
    icon: <StarIcon className="w-6 h-6" />,
    title: "Prolific Account",
    description:
      "Verified Prolific research account ready to earn. Complete surveys and studies from home.",
    badge: "Research",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "outlier",
    emoji: "🤖",
    icon: <SparklesIcon className="w-6 h-6" />,
    title: "Outlier Account",
    description:
      "Active Outlier AI data labeling account. Earn by training AI models remotely.",
    badge: "AI / ML",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "atlas",
    emoji: "📋",
    icon: <LayoutDashboardIcon className="w-6 h-6" />,
    title: "Atlas Account",
    description:
      "Fully set up Atlas work account for remote tasks and microjobs.",
    badge: "Microjobs",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  {
    id: "worldwide-id",
    emoji: "🌍",
    icon: <GlobeIcon className="w-6 h-6" />,
    title: "World Wide ID",
    description:
      "World Wide ID verification account for global remote work access.",
    badge: "Identity",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    id: "ai-training",
    emoji: "⚡",
    icon: <ZapIcon className="w-6 h-6" />,
    title: "AI Training Jobs",
    description:
      "Curated AI training job access — label data, train models, earn from anywhere.",
    badge: "AI Jobs",
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
];

function PurchaseModal({
  account,
  open,
  onClose,
}: {
  account: Account | null;
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md w-full rounded-2xl p-0 overflow-hidden"
        data-ocid="purchase.dialog"
      >
        {/* Modal header */}
        <div className="bg-primary px-6 py-5 text-primary-foreground">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">{account.emoji}</span>
              <DialogTitle className="text-xl font-display font-bold text-primary-foreground">
                {account.title}
              </DialogTitle>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              {account.description}
            </p>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Pricing highlights */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl font-display font-bold text-foreground">
              $70
            </span>
            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-semibold">
              ✓ Active
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs font-semibold">
              1 Year Free Proxy
            </Badge>
          </div>

          {/* Includes */}
          <div className="bg-muted rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-foreground">What's included:</p>
            {[
              "Fully verified & active account",
              "1 year free proxy included",
              "24/7 support via WhatsApp",
              "Instant delivery after payment",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <CheckCircleIcon className="w-4 h-4 text-primary shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Order form */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="buyer-name" className="text-sm font-medium">
                Your Name
              </Label>
              <Input
                id="buyer-name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-ocid="purchase.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="buyer-contact" className="text-sm font-medium">
                Email or Phone
              </Label>
              <Input
                id="buyer-contact"
                placeholder="your@email.com or 07XXXXXXXX"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                data-ocid="purchase.input"
              />
            </div>
          </div>

          {/* Payment instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-amber-800 mb-1">
              💳 Payment Instructions
            </p>
            <p className="text-amber-700">
              Pay <strong>$70 (≈ KES 9,100)</strong> via M-PESA to{" "}
              <strong>{SUPPORT_PHONE}</strong>, then send your M-PESA receipt to
              our support contact below.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-2.5 pt-1">
            <Button
              asChild
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl h-11"
              data-ocid="purchase.primary_button"
            >
              <a
                href={`https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent(`Hi, I'd like to buy the ${account.title} for $70. Name: ${name || "(enter name)"}. Contact: ${contact || "(enter contact)"}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                📲 Order via WhatsApp
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full rounded-xl h-11 border-border"
              data-ocid="purchase.secondary_button"
            >
              <a href={`tel:${SUPPORT_PHONE}`}>
                📞 Call Support: {SUPPORT_PHONE}
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AccountCard({
  account,
  index,
  onBuy,
}: {
  account: Account;
  index: number;
  onBuy: (a: Account) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      data-ocid={`accounts.item.${index + 1}`}
      className="bg-card border border-border rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-200 p-5 flex flex-col gap-4"
    >
      {/* Card top */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{account.emoji}</span>
          <div>
            <h3 className="font-display font-bold text-foreground text-base">
              {account.title}
            </h3>
            <Badge
              variant="outline"
              className={`text-xs font-medium mt-0.5 ${account.color}`}
            >
              {account.badge}
            </Badge>
          </div>
        </div>
        <ShieldCheckIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed flex-1">
        {account.description}
      </p>

      {/* Price & badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-display font-bold text-foreground text-xl">
          $70
        </span>
        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
          Active
        </Badge>
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
          1 Year Proxy
        </Badge>
      </div>

      {/* CTA */}
      <Button
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-10 transition-all"
        onClick={() => onBuy(account)}
        data-ocid={`accounts.item.${index + 1}`}
      >
        Buy Now – $70
      </Button>
    </motion.div>
  );
}

export default function HomePage() {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleBuy = (account: Account) => {
    setSelectedAccount(account);
    setModalOpen(true);
  };

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Marketplace", href: "#marketplace" },
    { label: "AI Jobs", href: "#marketplace" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Support", href: `tel:${SUPPORT_PHONE}` },
  ];

  return (
    <>
      {/* NAVBAR */}
      <header
        className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border shadow-sm"
        data-ocid="nav.section"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-2.5"
            data-ocid="nav.link"
          >
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <MapIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <span className="font-display font-bold text-foreground text-base block">
                WFH
              </span>
              <span className="text-xs text-muted-foreground -mt-0.5 block">
                All Deals
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Support phone */}
          <a
            href={`tel:${SUPPORT_PHONE}`}
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-primary border border-primary/30 rounded-xl px-4 py-1.5 hover:bg-primary/5 transition-colors"
            data-ocid="nav.link"
          >
            <PhoneIcon className="w-4 h-4" />
            {SUPPORT_PHONE}
          </a>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
            data-ocid="nav.toggle"
          >
            {mobileMenuOpen ? (
              <XIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <main>
        {/* HERO */}
        <section
          id="home"
          className="hero-section py-16 sm:py-24"
          data-ocid="hero.section"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left column */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-6"
              >
                <Badge className="bg-primary/10 text-primary border-primary/20 font-medium text-sm">
                  🌐 Verified WFH Accounts Marketplace
                </Badge>
                <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-foreground leading-tight">
                  Your Gateway to{" "}
                  <span className="text-primary">Verified Work-From-Home</span>{" "}
                  Opportunities
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Access premium accounts for{" "}
                  <strong className="text-foreground">Prolific</strong>,{" "}
                  <strong className="text-foreground">Outlier</strong>,{" "}
                  <strong className="text-foreground">Atlas</strong>,{" "}
                  <strong className="text-foreground">World Wide ID</strong>,
                  and{" "}
                  <strong className="text-foreground">AI Training Jobs</strong>{" "}
                  — all at $70 each with 1 year free proxy included.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-6 h-12 shadow-md"
                    data-ocid="hero.primary_button"
                  >
                    <a href="#marketplace">Explore Marketplace</a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl px-6 h-12 font-semibold border-border hover:bg-muted"
                    data-ocid="hero.secondary_button"
                  >
                    <a href={`tel:${SUPPORT_PHONE}`}>
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      Contact Support
                    </a>
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-4 pt-2">
                  {[
                    { icon: "✅", text: "Verified Accounts" },
                    { icon: "🔒", text: "Secure Delivery" },
                    { icon: "💰", text: "M-PESA Payments" },
                  ].map((t) => (
                    <div
                      key={t.text}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground"
                    >
                      <span>{t.icon}</span>
                      <span>{t.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right column — illustration */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="flex justify-center"
              >
                <div className="relative w-full max-w-md">
                  <div className="bg-card border border-border rounded-3xl shadow-card p-8 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="font-display font-bold text-lg text-foreground">
                        WFH Accounts
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200 font-semibold">
                        5 Available
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {accounts.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between bg-muted rounded-xl px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{a.emoji}</span>
                            <span className="font-medium text-sm text-foreground">
                              {a.title}
                            </span>
                          </div>
                          <span className="font-bold text-primary text-sm">
                            $70
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BriefcaseIcon className="w-4 h-4" />
                      <span>Earn from anywhere in the world</span>
                    </div>
                  </div>
                  {/* Decorative blob */}
                  <div className="absolute -z-10 -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
                  <div className="absolute -z-10 -top-6 -left-6 w-32 h-32 bg-primary/8 rounded-full blur-xl" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="py-16 bg-card border-y border-border"
          data-ocid="how_it_works.section"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-display font-bold text-3xl text-foreground mb-2">
              How It Works
            </h2>
            <p className="text-muted-foreground mb-10">
              Get your WFH account in 3 simple steps
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  icon: "🛒",
                  title: "Choose Account",
                  desc: "Browse our marketplace and pick the WFH account you want.",
                },
                {
                  step: "02",
                  icon: "💸",
                  title: "Pay via M-PESA",
                  desc: "Send $70 (≈ KES 9,100) via M-PESA to 0757833315.",
                },
                {
                  step: "03",
                  icon: "📬",
                  title: "Get Delivered",
                  desc: "Send your receipt on WhatsApp and receive your account instantly.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="flex flex-col items-center gap-3"
                  data-ocid="how_it_works.card"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">
                    {s.icon}
                  </div>
                  <div className="text-xs font-bold text-primary tracking-widest uppercase">
                    {s.step}
                  </div>
                  <h3 className="font-display font-bold text-foreground">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MARKETPLACE */}
        <section
          id="marketplace"
          className="py-16 sm:py-20 bg-background"
          data-ocid="marketplace.section"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-1">
                Marketplace
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
                Featured WFH Accounts
              </h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                All accounts are verified, active, and include 1 year of free
                proxy service.
              </p>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="accounts.list"
            >
              {accounts.map((account, i) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  index={i}
                  onBuy={handleBuy}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="bg-primary py-14" data-ocid="cta.section">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-display font-bold text-3xl text-primary-foreground mb-3">
              Ready to Start Earning from Home?
            </h2>
            <p className="text-primary-foreground/80 mb-7">
              Contact our support team and get your verified WFH account today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="bg-white text-primary hover:bg-white/90 font-bold rounded-xl px-8 h-12 shadow"
                data-ocid="cta.primary_button"
              >
                <a
                  href={`https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent("Hi, I want to buy a WFH account!")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📲 WhatsApp Us
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/40 text-primary-foreground hover:bg-white/10 rounded-xl px-8 h-12 font-semibold"
                data-ocid="cta.secondary_button"
              >
                <a href={`tel:${SUPPORT_PHONE}`}>
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  {SUPPORT_PHONE}
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        className="bg-card border-t border-border"
        data-ocid="footer.section"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                  <MapIcon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-display font-bold text-foreground block">
                    WFH All Deals
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Workfromhome All Deals
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Verified work-from-home accounts for global remote earners.
              </p>
            </div>

            {/* Accounts */}
            <div>
              <p className="font-semibold text-foreground mb-3">Accounts</p>
              <ul className="space-y-2">
                {accounts.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => handleBuy(a)}
                      data-ocid="footer.link"
                    >
                      {a.emoji} {a.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <p className="font-semibold text-foreground mb-3">Support</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={`tel:${SUPPORT_PHONE}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    data-ocid="footer.link"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    {SUPPORT_PHONE}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${SUPPORT_PHONE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    data-ocid="footer.link"
                  >
                    📲 WhatsApp Support
                  </a>
                </li>
                <li className="text-muted-foreground">Mon–Sat, 8am–8pm EAT</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              © {new Date().getFullYear()} Workfromhome All Deals. All rights
              reserved.
            </span>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </div>
        </div>
      </footer>

      {/* PURCHASE MODAL */}
      <PurchaseModal
        account={selectedAccount}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
