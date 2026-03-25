import { Toaster } from "@/components/ui/sonner";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HomePage />
      <Toaster richColors position="top-right" />
    </div>
  );
}
