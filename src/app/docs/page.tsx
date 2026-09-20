"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, ShieldCheck, Sparkles, Terminal, Code2, ExternalLink, Bot, Activity } from "lucide-react";
import { useSsoSession } from "@/hooks/use-sso-session";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function DocsPage() {
  const { session } = useSsoSession();
  const isAdmin = !!session && /owner|admin|sysadmin/i.test(session.role);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-4xl px-6 pt-28 pb-20"
    >
      {/* Breadcrumb / Back Link */}
      <motion.div variants={item} className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-foreground/50 transition-colors hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      {/* Header */}
      <motion.header variants={item} className="mb-12 border-b border-hairline pb-8">
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/45 mb-3 flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-indigo" strokeWidth={1.5} />
          <span>Documentation</span>
        </div>
        <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
          Yado Ecosystem Architecture
        </h1>
        <p className="mt-3 text-base text-foreground/60 leading-relaxed">
          Yado is an interconnected ecosystem of self-hosted microservices deployed under the{" "}
          <code className="bg-foreground/10 px-1.5 py-0.5 font-mono text-xs text-foreground">*.yado.my.id</code>{" "}
          domain on private homelab infrastructure with centralized identity and access control.
        </p>
      </motion.header>

      {/* Content Sections */}
      <div className="space-y-12 text-sm leading-relaxed text-foreground/80">
        {/* Section 1: Service Overview */}
        <motion.section variants={item}>
          <h2 className="font-serif text-xl tracking-tight text-foreground mb-4">
            1. Service Registry & Status
          </h2>
          <div className="border border-hairline">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-hairline text-foreground/50 font-mono uppercase">
                <tr>
                  <th className="p-4 font-medium">Service</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Repository</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                <tr>
                  <td className="p-4 font-medium text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-indigo" strokeWidth={1.5} />
                    SSO
                  </td>
                  <td className="p-4 text-foreground/60">Centralized OAuth2 identity and session provider</td>
                  <td className="p-4">
                    <span className="border border-moss/30 bg-moss-soft px-2 py-0.5 font-mono text-[11px] text-moss">Live</span>
                  </td>
                  <td className="p-4">
                    <a href="https://github.com/samsmon/sso.yado" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-foreground/50 hover:text-foreground">
                      samsmon/sso <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-moss" strokeWidth={1.5} />
                    Malas
                  </td>
                  <td className="p-4 text-foreground/60">Digital catalog and library reader</td>
                  <td className="p-4">
                    <span className="border border-moss/30 bg-moss-soft px-2 py-0.5 font-mono text-[11px] text-moss">Live</span>
                  </td>
                  <td className="p-4">
                    <a href="https://github.com/samsmon/malas" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-foreground/50 hover:text-foreground">
                      samsmon/malas <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-foreground flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-ochre" strokeWidth={1.5} />
                    libs
                  </td>
                  <td className="p-4 text-foreground/60">Agent/relay tunnel connection platform & content aggregator</td>
                  <td className="p-4">
                    <span className="border border-ochre/30 bg-ochre-soft px-2 py-0.5 font-mono text-[11px] text-ochre">Draft / RFC</span>
                  </td>
                  <td className="p-4 font-mono text-foreground/40">samsmon/libs</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-indigo" strokeWidth={1.5} />
                    Pore.js
                  </td>
                  <td className="p-4 text-foreground/60">Browser digital reader engine (manga, novels, EPUB, and PDF)</td>
                  <td className="p-4">
                    <span className="border border-indigo/30 bg-indigo-soft px-2 py-0.5 font-mono text-[11px] text-indigo">Development</span>
                  </td>
                  <td className="p-4 font-mono text-foreground/40">samsmon/pore.js</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Section 2: Reader Architecture */}
        <motion.section variants={item}>
          <h2 className="font-serif text-xl tracking-tight text-foreground mb-4">
            2. Digital Reader Architecture (Reader Effort)
          </h2>
          <p className="text-foreground/70 mb-4 leading-relaxed">
            The reader effort is engineered with a multi-tenant model, enabling users to link their personal
            Komga or Kavita instances. The architecture is decoupled across two independent repositories communicating through standardized API contracts:
          </p>

          <div className="grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
            <div className="bg-background p-5">
              <div className="flex items-center gap-2 text-foreground font-semibold mb-2">
                <Terminal className="h-4 w-4 text-ochre" strokeWidth={1.5} />
                <span>Backend: libs (Go)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-foreground/60 list-disc list-inside">
                <li>SSO authentication integration</li>
                <li>Outbound agent and tunnel relay (yamux)</li>
                <li>Catalog synchronization and metadata indexing</li>
                <li>Media proxying, format transcoding, and caching</li>
                <li>Normalized Read API endpoints (<code className="font-mono">/api/v1</code>)</li>
              </ul>
            </div>

            <div className="bg-background p-5">
              <div className="flex items-center gap-2 text-foreground font-semibold mb-2">
                <Code2 className="h-4 w-4 text-indigo" strokeWidth={1.5} />
                <span>Frontend: Pore.js (TypeScript)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-foreground/60 list-disc list-inside">
                <li>Image rendering engine for comics and manga</li>
                <li>Text pagination engine for EPUB and PDF</li>
                <li>Source-agnostic adapters (Yado, LocalFile, and Demo)</li>
                <li>Operates standalone in browser without strict backend dependency</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Section 3: SSO Authentication */}
        <motion.section variants={item}>
          <h2 className="font-serif text-xl tracking-tight text-foreground mb-4">
            3. Single Sign-On (SSO) Authentication Flow
          </h2>
          <div className="border border-hairline p-6 space-y-4">
            <p className="text-foreground/70 leading-relaxed">
              All Yado web services implement standard OAuth2 authentication flows. Each client application registers its <code className="font-mono text-xs bg-foreground/10 px-1 py-0.5">client_id</code> and <code className="font-mono text-xs bg-foreground/10 px-1 py-0.5">redirect_uri</code> with the centralized SSO provider.
            </p>
            <div className="bg-foreground/5 p-4 font-mono text-xs text-foreground/70 overflow-x-auto">
              GET https://sso.yado.my.id/oauth/authorize?client_id=yado-landing&amp;response_type=code
            </div>
            <p className="text-xs text-foreground/50">
              Upon successful verification on the SSO portal, session credentials grant immediate access across target microservices without repeated logins.
            </p>
          </div>
        </motion.section>

        {/* Section 4: Telemetry & Incident Management (admin-only, fully hidden otherwise) */}
        {isAdmin && (
        <motion.section variants={item}>
          <h2 className="font-serif text-xl tracking-tight text-foreground mb-4">
            4. Telemetry & Incident Reporting (AI & Homelab Workflows)
          </h2>
          <p className="text-foreground/70 mb-6 leading-relaxed">
            Incident post-mortems, 90-day downtime records, and scheduled maintenance announcements displayed on the{" "}
            <Link href="/status" className="underline underline-offset-4 hover:text-foreground">
              /status telemetry portal
            </Link>{" "}
            are driven from <code className="font-mono text-xs bg-foreground/10 px-1 py-0.5">src/data/incidents.json</code>.
          </p>

          <div className="grid gap-6">
            {/* AI Assistant Prompts Box */}
            <div className="border border-indigo/25 bg-indigo-soft p-6 space-y-4">
              <div className="flex items-center gap-2 font-semibold text-indigo">
                <Bot className="h-4 w-4" strokeWidth={1.5} />
                <span>Method A: Natural Language via AI (Claude Code, Gemini CLI, Antigravity)</span>
              </div>
              <p className="text-xs text-foreground/70 leading-relaxed">
                When working inside this repository with an AI assistant, you can simply issue conversational instructions. The AI automatically consults <code className="font-mono text-[11px] bg-foreground/10 px-1 py-0.5">AGENTS.md</code>, formats the incident, calculates UTC timestamps, and commits the entry:
              </p>
              <div className="space-y-2 font-mono text-xs">
                <div className="border border-hairline bg-background/80 p-3 text-foreground/80">
                  <span className="text-indigo font-bold">&gt; Prompt: </span>
                  &quot;Service malas tadi crash 20 menit karena memory leak, tolong catat insidennya.&quot;
                </div>
                <div className="border border-hairline bg-background/80 p-3 text-foreground/80">
                  <span className="text-indigo font-bold">&gt; Prompt: </span>
                  &quot;Besok jam 2 pagi ada maintenance restart homelab buat pasang RAM 30 menit. Masukkan ke status page.&quot;
                </div>
                <div className="border border-hairline bg-background/80 p-3 text-foreground/80">
                  <span className="text-indigo font-bold">&gt; Prompt: </span>
                  &quot;Insiden libs kemarin udah selesai investigasinya, update statusnya ke resolved.&quot;
                </div>
              </div>
            </div>

            {/* Terminal CLI Commands Box */}
            <div className="border border-hairline p-6 space-y-4">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Terminal className="h-4 w-4 text-moss" strokeWidth={1.5} />
                <span>Method B: Interactive CLI Commands</span>
              </div>
              <p className="text-xs text-foreground/60 leading-relaxed">
                For direct terminal execution or scripted automation in your homelab environment:
              </p>
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="text-foreground/50 text-[11px] mb-1 font-sans">1. View active & past incidents:</div>
                  <div className="bg-foreground/5 p-3 text-foreground/80 overflow-x-auto">npm run incident:list</div>
                </div>
                <div>
                  <div className="text-foreground/50 text-[11px] mb-1 font-sans">2. Create a new incident or maintenance announcement:</div>
                  <div className="bg-foreground/5 p-3 text-foreground/80 overflow-x-auto">
                    npm run incident:create -- --title=&quot;SSO Key Rotation&quot; --service=sso --severity=maintenance --duration=&quot;15 minutes&quot; --message=&quot;Rotating active JWT signing keys.&quot;
                  </div>
                </div>
                <div>
                  <div className="text-foreground/50 text-[11px] mb-1 font-sans">3. Add an investigation update to an active incident:</div>
                  <div className="bg-foreground/5 p-3 text-foreground/80 overflow-x-auto">
                    npm run incident:update -- --id=inc-01 --status=Monitoring --message=&quot;Patch applied, tracking response latency.&quot;
                  </div>
                </div>
                <div>
                  <div className="text-foreground/50 text-[11px] mb-1 font-sans">4. Mark incident as resolved:</div>
                  <div className="bg-foreground/5 p-3 text-foreground/80 overflow-x-auto">
                    npm run incident:resolve -- --id=inc-01 --message=&quot;Root cause mitigated. Normal latency restored.&quot;
                  </div>
                </div>
              </div>
            </div>

            {/* Direct JSON Edit Box */}
            <div className="border border-hairline p-6 space-y-3">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Activity className="h-4 w-4 text-indigo" strokeWidth={1.5} />
                <span>Method C: Direct GitOps / JSON Edit</span>
              </div>
              <p className="text-xs text-foreground/60 leading-relaxed">
                You can also directly edit <code className="font-mono text-xs bg-foreground/10 px-1 py-0.5">src/data/incidents.json</code> in VS Code or via the GitHub web editor. Modifying the file triggers instant hot-reloading in development. The <Link href="/status" className="underline underline-offset-4 hover:text-foreground">status page</Link> derives its 90-day uptime bars and percentages directly from these records - a new entry updates the graph immediately, nothing there is precomputed.
              </p>
            </div>
          </div>
        </motion.section>
        )}
      </div>

      {/* Footer Nav */}
      <motion.div variants={item} className="mt-16 pt-8 border-t border-hairline flex items-center justify-between text-xs text-foreground/40">
        <span>Yado &copy; {new Date().getFullYear()}</span>
        <Link href="/" className="hover:text-foreground transition-colors">
          Back to Launcher
        </Link>
      </motion.div>
    </motion.div>
  );
}
