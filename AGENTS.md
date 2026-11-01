<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` - verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Yado Design, Animation, and Consistency Standards

1. **Mandatory entrance animation:** Every page (`page.tsx`) and major section must use Framer Motion with a staggered fade/slide-up pattern (`[0.16, 1, 0.3, 1]`). Pages must not appear statically without animation.
2. **Smooth scrolling:** Navigation to anchor IDs (`#services`, `#status`, etc.) must use `useLenis` (`lenis.scrollTo(...)`) so scrolling is smooth and does not flicker.
3. **Anti-AI-slop language:** Avoid hyperbolic marketing words and excessive emoji. Use concise, plain technical terms.
4. **OS-driven theme:** The theme follows the operating system automatically, with a smooth CSS color transition.
5. **Changelog is mandatory:** Every change or added file must be recorded in detail in `CHANGELOG.md`.
6. **Telemetry and incident log protocol (AI agent rules):**
   - The main incident data source is `src/data/incidents.json`.
   - AI must not write ambiguous local date formats; use the standard UTC format for update timestamps (`HH:MM UTC`) and descriptive date formats (`Month DD, YYYY` or `X days ago` / `Today (Month DD, YYYY)`).
   - Run the helper script `node scripts/incident-cli.mjs [create|update|resolve|list]` or edit `src/data/incidents.json` directly, following the TypeScript `IncidentRecord` schema in `src/lib/telemetry.ts`.
   - Valid severities: `minor`, `major`, `maintenance`.
   - Valid investigation statuses: `Investigating`, `Identified`, `Monitoring`, `Resolved`, `Completed`.
   - Validate changes by running `npm run build` before finishing the task.
