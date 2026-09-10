import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { useSite } from "@/context/SiteContext";
import { storeName } from "@/lib/catalog";

export function Layout() {
  const location = useLocation();
  const { settings } = useSite();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    if (settings?.favicon) {
      const link =
        document.querySelector<HTMLLinkElement>("link[rel='icon']") ||
        document.head.appendChild(document.createElement("link"));
      link.rel = "icon";
      link.href = settings.favicon;
    }
    if (settings) {
      const name = storeName(settings);
      if (!document.title.includes(name) && document.title === "EthicWear") {
        document.title = name;
      }
    }
  }, [settings]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SmoothScroll />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
