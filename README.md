# Yado - Launcher, Telemetry & Mission Control

Yado (宿) - meaning "inn / place to stop", a place that feels like "a home for your collection".

Yado is the centralized portal, microservice launcher, and observability dashboard for the `*.yado.my.id` homelab network. Built with Next.js 16 (Turbopack), Tailwind CSS, Framer Motion, and Anime.js.

---

## 🤖 If you are an AI Assistant (Claude Code, Gemini CLI, Cursor, Antigravity) - READ THIS

> [!IMPORTANT]
> When the user asks you to record a downtime, report an incident, log an outage, or schedule maintenance, follow this exact automated protocol.

### 1. Source of Truth
All incident records and maintenance announcements are stored in:
```
src/data/incidents.json
```
TypeScript schema definition is in `src/lib/telemetry.ts` (`IncidentRecord`, `IncidentUpdate`).

### 2. Available CLI Commands
You can run these commands via your bash/terminal execution tool:

```bash
# List all current incidents
npm run incident:list

# Create a new incident / outage / maintenance announcement
npm run incident:create -- --title="<Title>" --service="<sso|malas|libs|pore|gateway>" --severity="<minor|major|maintenance>" --duration="<e.g. 15 minutes>" --message="<Initial log>"

# Add a progress update to an active incident
npm run incident:update -- --id="<inc-id>" --status="<Investigating|Identified|Monitoring|Resolved|Completed>" --message="<Update details>"

# Resolve an incident
npm run incident:resolve -- --id="<inc-id>" --duration="<final duration>" --message="<Resolution summary>"
```

### 3. Allowed Services & Values
- **Service IDs:**
  - `sso`: SSO Identity Provider (`sso.yado.my.id`)
  - `malas`: Malas Library & Reader (`malas.yado.my.id`)
  - `libs`: libs Tunnel & Broker (`libs.yado.my.id`)
  - `pore`: Pore.js Reader Engine (`pore.yado.my.id`)
  - `gateway`: Edge Gateway & Ingress (`yado.my.id`)
- **Severities:** `minor`, `major`, `maintenance`
- **Investigation Statuses:** `Investigating`, `Identified`, `Monitoring`, `Resolved`, `Completed`
- **Timestamp Standard:** Always use UTC time format `HH:MM UTC` for update logs.

### 4. AI Prompting Examples & Expected Actions
- **User:** *"malas just crashed for 20 minutes because of a memory leak, please log the incident."*
  &rarr; Execute:
  `npm run incident:create -- --title="Malas Memory Pressure Spike" --service="malas" --severity="minor" --duration="20 minutes" --message="Cache buffer memory exhaustion mitigated by restarting service."`
- **User:** *"Tomorrow at 2 AM there is a 30-minute maintenance window to swap the homelab switch."*
  &rarr; Execute:
  `npm run incident:create -- --title="Scheduled Network Switch Maintenance" --service="gateway" --severity="maintenance" --duration="30 minutes" --message="Upstream 2.5GbE switch firmware update and port re-wiring."`
- **User:** *"Please resolve yesterday's libs incident."*
  &rarr; Find ID using `npm run incident:list` then execute `npm run incident:resolve -- --id="<id>" --message="Resolved."`

---

## 👤 For Product Owners & Homelab Maintainers

You can manage telemetry, status bars, and maintenance notices through 3 flexible workflows:

### Method A: Natural Language via AI (Fastest)
Open **Claude Code**, **Gemini CLI**, or **Antigravity** in this repository and simply tell the AI:
> *"SSO was down for 10 minutes earlier because of a database update, please log it in telemetry."*

The AI will read the protocol above, execute the script, format the logs, and update the status page automatically.

### Method B: Manual CLI / Terminal
Run the interactive CLI helper:
```bash
# View incidents
npm run incident:list

# Create incident
npm run incident:create -- --title="SSO OAuth Key Rotation" --service=sso --severity=maintenance --message="Rotating RSA keys."

# Update an incident
npm run incident:update -- --id=inc-01 --status=Monitoring --message="Key rotation completed. Verifying session validation."

# Resolve
npm run incident:resolve -- --id=inc-01 --message="All authentication channels verified."
```

### Method C: Direct File Edit (VS Code / GitHub Mobile Web)
Simply edit `src/data/incidents.json` directly. Example structure:
```json
[
  {
    "id": "inc-04",
    "title": "Scheduled Proxmox Hypervisor Upgrade",
    "date": "Today (Sep 5, 2026)",
    "severity": "maintenance",
    "serviceId": "gateway",
    "serviceName": "Edge Gateway & Ingress",
    "duration": "30 minutes",
    "updates": [
      {
        "timestamp": "16:00 UTC",
        "status": "Completed",
        "message": "Node rebooted into Linux Kernel 6.8 with zero packet loss."
      }
    ]
  }
]
```

### Method D: Automated Homelab Monitoring via Uptime Kuma
If you run **Uptime Kuma** or Prometheus in your homelab:
1. In Uptime Kuma: Navigate to **Settings &rarr; Notifications &rarr; Webhook**.
2. Set webhook target to: `https://yado.yado.my.id/api/telemetry/webhook`.
3. Set alert on service down/up. Uptime Kuma will automatically notify and register status updates in real-time without manual intervention.

---

## 🛠️ Tech Stack & Features

- **Framework:** Next.js 16 (Turbopack, App Router, React 19)
- **Styling:** Vanilla Tailwind CSS with dynamic OS theme auto-adapt
- **Animations:** Framer Motion staggered entrance (`[0.16, 1, 0.3, 1]`) + Anime.js text reveal
- **Smooth Scrolling:** Lenis smooth scrolling with anchor offsets
- **Telemetry:** 90-day interactive daily bar graphs (`/status`), heartbeat polling (30s), live response probes
- **Identity:** Single Sign-On (SSO) OAuth2 session widget with Guest and Authenticated states
- **Command Palette:** Keyboard-driven navigation (`Ctrl + K` or `/`)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run linter
npm run lint

# Compile production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000) for the Launcher, or [http://localhost:3000/status](http://localhost:3000/status) for the 90-Day Telemetry Portal.
