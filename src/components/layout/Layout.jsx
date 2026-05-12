import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "../ui/ChatWidget";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.012]">
          <defs>
            <pattern id="neural-lattice" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 0 L40 11.5 L40 34.5 L20 46 L0 34.5 L0 11.5 Z" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-rt-accent" opacity="0.4" />
              <circle cx="20" cy="20" r="1" fill="currentColor" className="text-rt-accent" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-lattice)" />
        </svg>
      </div>
      <div className="fixed top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rt-accent/10 to-transparent z-50" />
      <Header />
      <main className="flex-1 pt-16 relative z-10">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
