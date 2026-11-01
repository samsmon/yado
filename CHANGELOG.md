# Changelog - Yado

Record of code changes, architecture, added components, and rollback procedures.

## Rollback

To restore the code to the baseline commit (v0.1.0):
```bash
git checkout 5cc6c5d
# or discard local changes:
git restore .
```

## Change History

### v0.4.0 - 2026-09-19

Full "Digital Ryokan" visual redesign and a fix for the fake telemetry data source:

#### Design: Color System and Typography
- `src/app/globals.css`:
  - Replaced all dark-dashboard color tokens (`#ffffff`/`#000000` + `--grid-line`) with a warm cream palette (`#f5efe6`) and four earth accents: indigo (`#2c3e50`, shibori dye), moss (`#6b7a5e`), ochre (`#a9762e`), clay (`#b15533`), each with a dark variant and a "soft" variant (`color-mix` for badge backgrounds).
  - Added a `--hairline` token for thin dividing lines, replacing the thick borders/shadows of SaaS-style cards.
  - Registered the custom fonts in `@theme inline`: `--font-serif` (Fraunces), `--font-sans` (General Sans), `--font-jp` (Shippori Mincho), `--font-mono` (Geist Mono is still used for numbers/telemetry).
- `src/app/fonts/general-sans/*.woff2`:
  - Downloaded and self-hosted 4 weights of General Sans (Light/Regular/Medium/Semibold) from Fontshare (free license) via `next/font/local`, since this font is not available on Google Fonts.
- `src/app/layout.tsx`:
  - Replaced Geist Sans with `Fraunces` (serif headline, axes opsz/SOFT/WONK, italic) + `General Sans` (body/UI) + `Shippori Mincho` (kanji accent 宿, verified to contain full CJK glyphs even though next/font metadata lists it as a "latin" subset).
  - Updated the site title/description metadata to the "a place to stay" narrative.

#### Design: Components
- `src/components/hero.tsx`: New two-line headline ("One *roof*." in serif bold/italic + "Every service welcome." in light sans), a moss-colored kanji tagline 宿 with the romanization "(yado) - a place to stay.", an asymmetric left-aligned layout (instead of symmetric centered), a search bar and buttons without `rounded-full`/glow, and micro-interactions reduced to a subtle underline/opacity (removed the `whileHover scale` wrapper that felt like a dashboard).
- `src/components/navbar.tsx`: Simplified to a serif wordmark plus a small kanji, uppercase nav labels with wide tracking, underline-on-hover, and a search trigger and kbd hint in hairline boxes (not pills).
- `src/components/service-grid.tsx`: The bento card grid was replaced entirely by a **"room directory" list**: a single column, each service separated by a hairline (no shadowed cards), filter tabs as a sliding underline (not filled pills), and lifecycle badges centralized through the new `lifecycleAccent` helper in `src/lib/services.ts` (production=moss, staging=ochre, development=indigo), replacing the per-service `accent` field that used to hardcode sky/emerald/purple/amber colors.
- `src/components/interactive/tilt-card.tsx`: **Deleted**. The 3D tilt/glare effect is no longer used anywhere now that service-grid moved to the hairline list style (it conflicts with the new design's "no glow/scale-up" rule).
- `src/components/status-dashboard.tsx`, `src/components/status-row.tsx`, `src/components/status-dot.tsx`: Recolored from neon emerald/red to moss/clay; thick borders replaced with hairlines.
- `src/components/footer.tsx`: Simplified to a centered kanji signature 宿 plus minimal links, per the "small kanji as a signature mark" spec.
- `src/components/background-glow.tsx`: The technical grid + neon orbs (fuchsia/sky) were replaced with a washi texture (a thin `feTurbulence` SVG noise) + a dim warm indigo/moss wash.
- `src/components/sso-login-button.tsx`, `src/components/sso-profile-widget.tsx`, `src/components/theme-toggle.tsx`, `src/components/interactive/command-palette.tsx`: Full recolor to the indigo/moss/ochre/clay tokens + hairline, with sharper box radii (not rounded-2xl/pill).
- `src/components/telemetry/uptime-bar-graph.tsx`, `src/components/telemetry/incident-history.tsx`: Status recolor (operational=moss, degraded=ochre, outage=clay, maintenance=indigo), hairline borders.
- `src/app/docs/page.tsx`, `src/app/status/page.tsx`: Full recolor + restyle of tables/metric cards to a hairline-divided style, headings use `font-serif`.
- `src/app/page.tsx`: Added `border-t border-hairline` between sections as a "washi paper" divider and added a `whileInView` stagger animation to `ServiceGrid`, consistent with the mandatory animation rule in `AGENTS.md`.

#### Functional Fix: Real Telemetry Data (not fake numbers)
- `src/app/api/health/route.ts`:
  - Added a real probe for `libs` via the `LIBS_HEALTH_URL` env var (same pattern as `sso`/`malas`; defaults to `unknown` if not configured, not a guess).
  - `telemetry` (this app itself) and `gateway` (the edge ingress that forwards this request) are now treated as "up" by definition, with latency computed from the request's own duration (`Date.now() - requestStarted`), replacing the hardcoded `latencyMs: 8`.
- `.env.example`: Added `LIBS_HEALTH_URL` (empty/optional, with an explanatory comment).
- `src/lib/telemetry.ts` (**full rewrite**):
  - Removed all manually hardcoded 90-day data (a hand-written narrative `specialDays`, separate from the real `incidents.json`).
  - The 90-day buckets are now derived directly from `src/data/incidents.json`: the `date` field ("Today (...)" / "N days ago") is parsed into a day offset, `severity` is mapped to `DayStatus`, and `duration` (e.g. "38 minutes") is used to compute that day's uptime percentage mathematically, not a made-up number.
  - Per-service `uptime90d` is now the real average of the 90 buckets, instead of hand-written constants (`99.98`, `99.94`, etc.).
  - `currentStatus` and `avgLatencyMs` are now filled from the live `HealthResponse` (`useHealth()`/`/api/health`) via the new `getTelemetryData(liveHealth)` parameter, instead of a hardcoded `currentStatus: "up"` for all services.
- `src/app/status/page.tsx`:
  - Fixed a real bug in the "Live Endpoint Probes" table: the condition `isLiveUp ? "Operational" : "Operational"` always showed "Operational" regardless of the probe result. It now shows the real status (Operational/Unreachable/No live probe) from live data.
  - The main banner and the summary metric cards ("90-Day Uptime", "Avg Latency", "90d Incidents") are now computed from live data + the real incident log, instead of the static text "All Systems Operational" / "90-Day SLA Target: Met".
  - Fixed a follow-up display bug: `networkAvgLatencyMs` was typed as `number` with a fallback of `0`, so a self-check probe that really measured `0ms` was wrongly shown as "-" (treated as "no data"). Fixed by typing it as `number | null` so a real `0ms` still shows as `0ms`.

#### Copy
- The headline, tagline, and all supporting copy (hero, feature strip, status page, docs) were aligned to the "digital ryokan" tone while still following Rule 3 (plain technical language, no marketing hyperbole, no em dashes).

#### Follow-up Adjustments (direct feedback)
- `src/components/background-glow.tsx`: Increased the intensity of the washi paper texture (two noise layers: coarse mottling + fine grain, each desaturated via `feColorMatrix`) because the first version was too plain/almost invisible; it is still kept dim (opacity 0.05-0.13) with `multiply`/`overlay` blending so it does not hurt UI readability or feel excessive.
  - Further revision: the asymmetric `feTurbulence` noise layer (baseFrequency `0.012 0.09`) looked like wood grain rather than paper. Replaced with a thin shoji-style lattice (`repeating-linear-gradient` crosshatch, geometric and non-organic) plus one isotropic grain layer (symmetric baseFrequency `0.85`, no dominant direction) so the look stays modern and Japanese without resembling wood texture.
- `src/app/docs/page.tsx`: Section 4 ("Telemetry & Incident Reporting") is now restricted to sessions with the Owner/Sysadmin role (`useSsoSession`). Regular visitors see an "Admin access required" panel with a sign-in button, instead of raw CLI/AI instructions. Note: this is a client-side display gate (not server-side protection), consistent with the existing demo session pattern in `use-sso-session.ts`.
- `src/components/interactive/cursor-spotlight.tsx`: **Deleted**, along with its call in `src/app/layout.tsx`. The soft radial glow that follows the cursor was removed entirely at a direct request.

### v0.5.0 - 2026-09-19

Bauhaus line-art background, final kanji favicon, themed scrollbar, and a tighter admin gate on `/docs`:

- `src/components/background-glow.tsx` (**full rewrite**, several iterations based on visual references given directly by the user):
  - The earlier shoji lattice was replaced by a "Bauhaus line-art" composition: a `Ribbon` motif (a bundle of parallel lines forming one rounded bend, with the radius growing per copy around the same arc center, so the lines are truly parallel rather than just overlapping) and a `RingCluster` (concentric circles), plus a few solid dots, in a single ink color (`text-foreground`) that follows the theme, inspired by the "Bauhaus 1919" poster reference and the parallel-line pipe/ribbon pattern supplied by the user.
  - The container changed from `position: fixed` to `position: absolute` (and `body` in `layout.tsx` was given `position: relative` as the containing block) so the background scrolls with the page instead of staying stuck to the viewport.
  - It overcorrected at one point (density of 9 lines + opacity 0.16-0.22 + a double mirrored ribbon) and flooded the contrast of the "One roof." headline. It was revised to a composition that is still rich (several motifs spread along the page) but with opacity back at a level that does not hurt readability (0.09/0.13).
  - Collision bug at desktop width (~900px): the vertical line bundle of the hero motif cut straight through the "Every service welcome." line because its size stayed large while the hero layout changed at the wide breakpoint. Fixed by shrinking the hero motif and moving it to a small corner accent (14rem, anchored to the top-left corner, not reaching the headline's second line at all).
- `src/app/icon.svg`: Tried replacing it with a geometric Bauhaus mark (solid circle/triangle/square, then a line-art version), but reverted to the kanji 宿 per the user's explicit instruction ("keep the kanji for the favicon"); the Bauhaus change was directed at the background, not the favicon. `src/app/favicon.ico` (the default Next.js triangle icon) was deleted because `icon.svg` replaces it.
- `src/app/globals.css`: Added themed scrollbar styling (`scrollbar-color`/`scrollbar-width` for Firefox, `::-webkit-scrollbar*` for Chrome/Edge/Safari), a thin translucent thumb following the foreground color, replacing the default OS scrollbar that clashed with the cream/indigo palette.
- `src/app/docs/page.tsx`: Tightened the admin gate on Section 4. Instead of showing an "Admin access required" panel, the section (title and content) is now **not rendered at all** for non-admin visitors (`{isAdmin && (...)}`), so the page appears to naturally end at Section 3 with no hint that a hidden section exists.

### v0.3.0 - 2026-09-18

Project rename and domain update:
- Renamed the whole project from "White Archive" to "Yado" (inspired by the kanji character 宿, meaning inn/place to stop; it gives the feeling of "a home for your collection").
- Changed every domain reference from `*.suryatmaja.dev` to `*.yado.my.id`.
- Updated the project name, domain, and file references in all related files in the `yado` repository.
- The same changes were also applied to the derived repository `sso.yado`.

### v0.2.16 - 2026-09-05

Incident Data Separation, CLI Helper, and Dual-Mode Documentation (AI + Human):
- `src/data/incidents.json`:
  - Moved incident history and scheduled maintenance data out of the source code into a central JSON file so it is easy to manage for both humans (GitOps/VS Code) and AI agents.
- `src/lib/telemetry.ts`:
  - Imports incident data directly from `src/data/incidents.json`.
- `scripts/incident-cli.mjs`:
  - Created an interactive Node.js-based CLI tool for incident management operations (`list`, `create`, `update`, `resolve`), friendly to run from Claude Code, Gemini CLI, Antigravity, or by a human through the terminal.
- `package.json`:
  - Added shortcut scripts: `incident`, `incident:list`, `incident:create`, `incident:update`, `incident:resolve`.
- `AGENTS.md`:
  - Added Rule 6: Standard AI Agent Protocol for incident logging, UTC time conversion, ID format, and build validation.
- `README.md`:
  - Added a comprehensive guide with a dedicated trigger: `## 🤖 If you are an AI Assistant (Claude Code, Gemini CLI, Cursor, Antigravity) - READ THIS` and a practical guide for homelab Product Owners (via AI, via CLI, via direct JSON, and Uptime Kuma automatic webhooks).
- `src/app/docs/page.tsx`:
  - Added Section 4: "Telemetry & Incident Reporting (AI & Homelab Workflows)" to the official web documentation page (`/docs`), complete with a conversational AI prompt example box, terminal CLI commands, and a GitOps JSON guide.

### v0.2.15 - 2026-09-05

Dedicated 90-Day Status & OpenTelemetry Page (`/status`):
- `src/lib/telemetry.ts`:
  - Created a historical telemetry data module that generates 90 daily buckets per microservice (`sso`, `malas`, `libs`, `pore`, `gateway`) with 90-day uptime SLA and average latency calculations.
  - Added a dataset of incident history and scheduled maintenance with an update timeline (`Investigating` -> `Monitoring` -> `Resolved`/`Completed`).
- `src/components/telemetry/uptime-bar-graph.tsx`:
  - Created a 90-daily-bar visualization component with dynamic coloring (*operational* green, *degraded* yellow, *outage* red, *maintenance* sky blue).
  - Includes an interactive floating tooltip on hover for each day (showing date, status, uptime percentage, and incident summary).
- `src/components/telemetry/incident-history.tsx`:
  - Shows the list of incidents and post-incident reports (*post-mortem*) for the last 90 days, chronologically and transparently.
- `src/app/status/page.tsx`:
  - A dedicated `/status` page with a main banner ("All Systems Operational" & 30-second heartbeat), network metric summary cards, a 90-bar chart section per service, a live endpoint probe table, and the incident history log.
- `src/components/navbar.tsx` & `src/components/status-dashboard.tsx`:
  - Linked the "System Status" navigation link and the launcher status card button directly to the dedicated `/status` page.

### v0.2.14 - 2026-09-05

Removed the hero button wobble effect & 100% English language harmonization:
- `src/components/hero.tsx`:
  - Removed the elastic magnetic wrapper (`Magnetic`) that caused odd shaking/wobble when the cursor passed over the "Sign in" and "Browse Services" buttons.
  - Replaced it with a stable, smooth standard Framer Motion interaction transition (`whileHover={{ scale: 1.025, y: -1 }}` and `whileTap={{ scale: 0.98 }}`).
- Language harmonization (100% English):
  - `src/components/hero.tsx`: Harmonized all hero copy ("Browse Services", status pill, search placeholder, feature items).
  - `src/components/navbar.tsx`: Harmonized navigation labels ("Services", "System Status", "Documentation").
  - `src/lib/services.ts`: Harmonized microservice descriptions, taglines, and quick links.
  - `src/components/service-grid.tsx`: Harmonized the filter tabs ("All", "Production", "Development", "Staging"), headers, card metrics, and action buttons.
  - `src/components/sso-profile-widget.tsx`: Harmonized the account menu, status tags, and sign-in/sign-out buttons.
  - `src/components/status-dashboard.tsx`: Harmonized telemetry labels ("System Telemetry & Health", "System Status", "All systems operational", "Partial system outage", "Updated:", "Updating...").
  - `src/components/footer.tsx`: Harmonized the copyright note and SSO status ("All services SSO-enabled.").
  - `src/app/docs/page.tsx`: Translated all of the Yado architecture documentation into plain, clean technical English.

### v0.2.13 - 2026-09-05

Fix for 2 Next.js issues (Hydration Mismatch & Anime.js Deprecation):
- `src/components/sso-profile-widget.tsx` & `src/hooks/use-sso-session.ts`:
  - Fixed the *Hydration Mismatch* between Server-Side Rendering (SSR) and Client Hydration on the SSO widget button by making sure the initial DOM structure is always consistent before the local session state is applied.
- `src/components/interactive/animated-headline.tsx`:
  - Fixed the Anime.js v4 *Deprecation Warning* (`text.split() is deprecated`) by switching the import and function call to `splitText()`.

### v0.2.12 - 2026-09-05

Native-app interaction mode (disabled text selection & blog cursor):
- `src/app/globals.css`:
  - Set `user-select: none` on the global element (`body`) so users cannot select/highlight text or copy-paste like on a blog or article site.
  - Changed the default cursor to a normal application arrow (`cursor: default`) with no I-beam text cursor on general content.
  - Made sure all interactive elements (buttons, links, cards) have a consistent click indicator (`cursor: pointer`).
  - Only the search form input keeps `user-select: text` and `cursor: text`, for typing keywords.
- `src/app/layout.tsx` & `src/app/page.tsx`: Removed the text selection utility classes (`selection:...`).

### v0.2.11 - 2026-09-05

System telemetry automation (30-Second Heartbeat Auto-refresh):
- `src/hooks/use-health.ts`: Added a 1-second interval timer to precisely count down the 30-second auto-refresh cycle without needing a manual button press.
- `src/components/status-dashboard.tsx`: Replaced the manual button with an automatic `Auto-refresh: {countdown}s` indicator badge, with a green radar pulse animation while telemetry data is being refreshed.

### v0.2.10 - 2026-09-05

Added the SSO profile widget:
- `src/hooks/use-sso-session.ts`: Created a hook that detects the SSO login session state (stores the user profile data, login/logout flow, and a demo session simulation function).
- `src/components/sso-profile-widget.tsx`: Created the profile widget component in the header:
  - Guest mode: Shows the `SSO Sign In` button and a session simulation option.
  - Authenticated mode: Shows an avatar with a green active indicator, the user name, and an interactive dropdown menu (account details, link to the SSO portal, and a sign-out button).
- `src/components/navbar.tsx`: Integrated `SsoProfileWidget` on the right side of the header.

### v0.2.9 - 2026-09-05

Simplified and reinstalled the theme toggle button:
- `src/components/theme-toggle.tsx`:
  - Removed the *system* option from the button cycle so users can switch instantly between **Dark** and **Light** mode in a single click.
  - Added a subtle rotation and scale animation to the Sun (`Sun`) and Moon (`Moon`) icons using `framer-motion`.
- `src/components/navbar.tsx`: Put the `ThemeToggle` button back on the right side of the navigation header.
- `src/components/theme-provider.tsx`: Made sure the initial theme still detects the operating system by default, while still allowing manual changes through the button.

### v0.2.8 - 2026-09-05

Refined the service channel status filter animation:
- `src/components/service-grid.tsx`:
  - Removed `mode="popLayout"` from AnimatePresence, which previously made exiting elements jump in position (absolute offset collision) inside the CSS grid.
  - Applied `layout="position"` with separate transitions for `opacity` and card position shifts, so cards that stay or move columns move precisely and smoothly.
  - Added an active highlight capsule animation (*sliding pill highlight*) based on `layoutId="activeFilterPill"` with a spring curve (*spring physics*), making the filter tab switch move elastically and naturally.

### v0.2.7 - 2026-09-05

Documentation page animation and project rules:
- `src/app/docs/page.tsx`: Integrated `framer-motion` with a *stagger entrance* animation (staged fade-in and slide-up) on the breadcrumb, header, service table, and architecture cards.
- `.agents/rules/ui-consistency-and-animation.md`: Created the official project rules requiring an entrance transition animation on every new page, Lenis smooth scrolling, anti-AI-slop language, and changelog recording.
- `AGENTS.md`: Added a summary of the design standards and animation rules so the agent system always follows them.

### v0.2.6 - 2026-09-05

System-following theme automation and smooth transition animation:
- `src/components/navbar.tsx`: Removed the manual theme toggle button.
- `src/components/theme-provider.tsx`: Locked the theme to follow the user's operating system preference (*OS appearance*) 100% automatically and enabled theme change transitions.
- `src/app/globals.css`: Added CSS transitions (`background-color`, `border-color`, `color` with a 0.4s duration and a smooth bezier curve) so the dark/light theme switch happens smoothly without sharp jerks.

### v0.2.5 - 2026-09-05

- `src/components/navbar.tsx`: Added a click interaction on the "Yado" logo/text. When on the home page, clicking the logo scrolls the page straight to the very top (*smooth scroll to top*) using the Lenis engine.

### v0.2.4 - 2026-09-05

Added the internal documentation page and fixed scroll navigation:
- `src/components/navbar.tsx`:
  - Integrated the `useLenis` hook for `#services` and `#status` anchor navigation. Moving to the target section now runs with a *smooth scroll* animation without jerks (no blink or reload).
  - Changed the "Documentation" link to point to the internal `/docs` route using `next/link`.
- `src/app/docs/page.tsx`:
  - Created the internal Yado architecture documentation page (homelab ecosystem map, the `libs` platform spec (Go) and the `Pore.js` reader engine (TypeScript), and the OAuth2 SSO authentication flow).

### v0.2.2 - 2026-09-05

Navigation header update:
- `src/components/navbar.tsx`: Changed the header from a floating pill into a *Clean Edge-to-Edge Sticky Header* (`top-0`, thin bottom border, backdrop blur).
- Added internal navigation links (`Services`, `System Status`, and `Documentation`).
- Simplified the logo and the operational status dot.
- `src/components/hero.tsx`: Adjusted the top padding (`pt-28 sm:pt-36`) to be proportional to the new header height.

### v0.2.1 - 2026-09-05

Layout, spacing proportion, and footer unification fixes:
- `src/components/footer.tsx`: Removed the horizontal divider line (`border-t`) that made the footer look disconnected from the page layout.
- `src/components/status-dashboard.tsx`: Added a "System Status" section title header so it is balanced and consistent with the service catalog section.
- `src/components/hero.tsx`: Increased the top and bottom vertical padding so there is enough breathing room relative to the navbar and the section below.
- `src/app/page.tsx`: Adjusted the spacing between sections (`py-16 sm:py-24`) so it is not too tight, and placed the footer standalone at the bottom of the page.

### v0.2.0 - 2026-09-05

Launcher interface update: command palette integration, app status filter, scroll system fix, and service card restructuring.

#### New Files
- `src/components/navbar.tsx`: Navigation header with a status indicator, search shortcut button (Ctrl+K), SSO link, and theme toggle.
- `src/components/interactive/command-palette.tsx`: Quick search dialog for jumping between services with keyboard shortcuts (arrows, enter, and digits 1-9).
- `src/components/interactive/command-palette-provider.tsx`: Client component wrapper that renders the search dialog in the root layout.
- `src/hooks/use-command-palette.ts`: Custom hook and event listener for controlling the palette's open/close state.

#### Modified Files
- `src/lib/services.ts`:
  - Added fields to the `ServiceDef` type: `category`, `lifecycle` (`production` | `staging` | `development`), `version`, `progress`, `iconName`, `accent`, and `quickLinks`.
  - Added service entries `pore` (development status) and `telemetry` (staging status).
- `src/components/hero.tsx`:
  - Added a search trigger button directly in the hero area.
  - Adjusted the launcher description and the system feature summary.
- `src/components/service-grid.tsx`:
  - Added status filter tabs (`all`, `production`, `development`, `staging`).
  - Added a work progress bar for services in the development stage.
  - Added latency info and quick links (source code and documentation).
- `src/app/page.tsx`:
  - Removed the `SectionSnap` dependency and the rigid 100vh layout so scrolling works normally.
- `src/app/layout.tsx`:
  - Integrated the `Navbar` and `CommandPaletteProvider` components.
- `src/app/api/health/route.ts`:
  - Added status responses for the `telemetry` and `pore` services.

### v0.1.0 - Baseline (Commit: 5cc6c5d)
- Initial implementation of a 3-section landing page based on ScrollSection and SectionSnap.
