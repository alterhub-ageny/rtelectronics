import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "../ui/ChatWidget";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <main className="flex-1 pt-20 relative z-10">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
