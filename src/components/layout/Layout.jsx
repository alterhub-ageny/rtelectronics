import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "../ui/ChatWidget";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.012]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.008) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.008) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div className="fixed top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rt-accent/15 via-cyan-500/5 to-transparent z-50" />
      <Header />
      <main className="flex-1 pt-16 relative z-10">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
