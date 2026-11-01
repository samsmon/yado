"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { Search } from "lucide-react";
import { openCommandPalette } from "@/hooks/use-command-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { SsoProfileWidget } from "@/components/sso-profile-widget";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = (e: React.MouseEvent) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleSmoothScroll = (targetId: string) => (e: React.MouseEvent) => {
    if (window.location.pathname !== "/") return;

    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(targetId, { offset: -30, duration: 1.2 });
    } else {
      const el = document.querySelector(targetId);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? "border-b border-hairline bg-background/85 backdrop-blur-md" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        {/* Left: Brand & page navigation */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            onClick={handleScrollToTop}
            className="flex items-baseline gap-2 text-foreground transition-opacity hover:opacity-75"
          >
            <span className="font-jp text-lg text-moss">宿</span>
            <span className="font-serif text-base font-semibold tracking-tight">Yado</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium uppercase tracking-[0.12em] text-foreground/55">
            <Link href="/#services" onClick={handleSmoothScroll("#services")} className="border-b border-transparent pb-0.5 transition-colors hover:border-foreground/40 hover:text-foreground">
              Services
            </Link>
            <Link href="/status" className="border-b border-transparent pb-0.5 transition-colors hover:border-foreground/40 hover:text-foreground">
              Status
            </Link>
            <Link href="/docs" className="border-b border-transparent pb-0.5 transition-colors hover:border-foreground/40 hover:text-foreground">
              Docs
            </Link>
          </nav>
        </div>

        {/* Right: Search Trigger, SSO Profile Widget, and Theme Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={openCommandPalette}
            className="sm:hidden flex h-8 w-8 items-center justify-center border border-hairline text-foreground/55 transition-colors hover:border-foreground/30 hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <button
            onClick={openCommandPalette}
            className="hidden sm:flex items-center gap-2 border border-hairline px-3 py-1.5 text-xs text-foreground/55 transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            <Search className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>Search</span>
            <kbd className="border border-hairline px-1.5 py-0.5 text-[10px] font-mono text-foreground/45">Ctrl K</kbd>
          </button>

          <SsoProfileWidget />

          <div className="border-l border-hairline pl-3">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
