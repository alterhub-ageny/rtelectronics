import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "../ui/ChatWidget";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.015]"
        style={{
          backgroundImage: "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Ambient glow top */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-primary)]/3 rounded-full blur-[120px] pointer-events-none z-0" />
      <Header />
      <main className="flex-1 pt-16 relative z-10">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
