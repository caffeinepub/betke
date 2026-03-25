import { Phone, Shield } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer
      style={{
        background: "oklch(0.10 0.01 230)",
        borderTop: "1px solid oklch(0.18 0.012 230)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "oklch(0.60 0.17 145)" }}
              >
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-lg text-foreground">BetKE</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Kenya's premier sports betting platform. Bet responsibly.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
              About
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  About Us
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  How It Works
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  Responsible Gaming
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  Terms &amp; Conditions
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  Betting Rules
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
              Support
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone
                  className="w-3 h-3 flex-shrink-0"
                  style={{ color: "oklch(0.60 0.17 145)" }}
                />
                <a
                  href="tel:+254757833315"
                  className="hover:text-foreground transition-colors font-semibold"
                  style={{ color: "oklch(0.74 0.14 75)" }}
                >
                  0757 833 315
                </a>
              </li>
              <li className="text-xs" style={{ color: "oklch(0.50 0.01 230)" }}>
                Available 24/7 for support
              </li>
              <li className="flex items-center gap-3 pt-1">
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  <SiFacebook className="w-4 h-4" />
                </span>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  <SiX className="w-4 h-4" />
                </span>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  <SiInstagram className="w-4 h-4" />
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{ borderTop: "1px solid oklch(0.18 0.012 230)" }}
          className="pt-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">
                Payment Methods
              </p>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-bold px-3 py-1 rounded"
                  style={{ background: "oklch(0.60 0.17 145)", color: "white" }}
                >
                  M-PESA
                </span>
                <span
                  className="text-xs font-bold px-3 py-1 rounded"
                  style={{ background: "oklch(0.50 0.20 25)", color: "white" }}
                >
                  Airtel Money
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              © {year}. Built with ❤️ using{" "}
              <a
                href={utmLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground underline transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
