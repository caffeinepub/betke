import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { UserRole } from "./backend";
import AuthModal from "./components/AuthModal";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useUserRole } from "./hooks/useQueries";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";

type Page = "home" | "live" | "sports" | "account" | "admin" | "withdrawal";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [authOpen, setAuthOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: userRole } = useUserRole();

  const isAdmin = userRole === UserRole.admin;

  const navigate = (target: string) => {
    const valid: Page[] = [
      "home",
      "live",
      "sports",
      "account",
      "admin",
      "withdrawal",
    ];
    if (valid.includes(target as Page)) {
      setPage(target as Page);
    }
  };

  const renderPage = () => {
    if (page === "account") {
      return identity ? (
        <AccountPage />
      ) : (
        <HomePage onLoginRequest={() => setAuthOpen(true)} />
      );
    }
    if (page === "admin") {
      return isAdmin ? (
        <AdminPage />
      ) : (
        <HomePage onLoginRequest={() => setAuthOpen(true)} />
      );
    }
    return <HomePage onLoginRequest={() => setAuthOpen(true)} />;
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.12 0.012 230)" }}
    >
      <Header currentPage={page} onNavigate={navigate} />
      <div className="flex-1">{renderPage()}</div>
      <Footer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <Toaster richColors position="top-right" />
    </div>
  );
}
