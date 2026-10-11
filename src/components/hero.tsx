"use client";

import { motion } from "framer-motion";
import { Search, ShieldCheck, Activity, DoorOpen } from "lucide-react";
import { SsoLoginButton } from "@/components/sso-login-button";
import { AnimatedHeadline } from "@/components/interactive/animated-headline";
import { openCommandPalette } from "@/hooks/use-command-palette";
import { useSsoSession } from "@/hooks/use-sso-session";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Hero() {
  const { session } = useSsoSession();

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex w-full max-w-5xl flex-col px-6 pt-36 pb-20 sm:pt-44 sm:pb-28"
    >
      {/* Headline - asymmetric: left column of text, generous space to the right */}
      <div className="max-w-3xl">
        <h1 className="font-serif text-5xl leading-[1.08] tracking-tight text-foreground sm:text-6xl md:text-7xl">
          <motion.span variants={item} className="block font-bold">
            <AnimatedHeadline text="One" delay={100} className="inline-block" />{" "}
            <AnimatedHeadline text="roof." delay={220} className="inline-block italic" />
          </motion.span>
          <motion.span variants={item} className="mt-1 block font-sans text-4xl font-light text-foreground/75 sm:text-5xl md:text-6xl">
            Every service welcome.
          </motion.span>
        </h1>

        {/* Tagline: kanji as a small focal mark alongside the romanized reading */}
        <motion.div variants={item} className="mt-8 flex items-baseline gap-3">
          <span className="font-jp text-3xl text-moss sm:text-4xl">宿</span>
          <span className="text-xs uppercase tracking-[0.2em] text-foreground/45 sm:text-sm">
            (yado) - a place to stay.
          </span>
        </motion.div>
      </div>

      {/* Subtext */}
      <motion.p variants={item} className="mt-10 max-w-xl text-balance text-base leading-relaxed text-foreground/60">
        Entry point to every self-hosted service, portal, and project running under the Yado roof.
      </motion.p>

      {/* Quick Search */}
      <motion.div variants={item} className="mt-10 w-full max-w-md">
        <button
          onClick={openCommandPalette}
          className="group flex w-full items-center justify-between border border-hairline px-5 py-3.5 text-left text-sm text-foreground/50 transition-colors hover:border-foreground/30"
        >
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-foreground/40 group-hover:text-foreground/80 transition-colors" />
            <span className="group-hover:text-foreground/80 transition-colors">
              Search services or portals...
            </span>
          </div>
          <div className="flex items-center gap-1 border border-hairline px-2 py-0.5 text-[11px] font-mono text-foreground/50">
            <span>Ctrl + K</span>
          </div>
        </button>
      </motion.div>

      {/* Actions */}
      <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-6">
        {!session && <SsoLoginButton />}
        <a
          href="#services"
          className="group inline-flex items-center gap-2 text-base font-medium text-foreground/75 transition-colors hover:text-foreground"
        >
          <span className="border-b border-transparent pb-0.5 group-hover:border-foreground/40">
            Browse services
          </span>
          <DoorOpen className="h-4 w-4 text-foreground/40 transition-transform group-hover:translate-x-0.5" />
        </a>
      </motion.div>

      {/* Quiet feature strip */}
      <motion.div
        variants={item}
        className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-hairline pt-8 text-xs text-foreground/50"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-indigo" strokeWidth={1.5} />
          <span>Single sign-on across every room</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-moss" strokeWidth={1.5} />
          <span>Live health, checked continuously</span>
        </div>
      </motion.div>
    </motion.section>
  );
}
