export type ServiceId = "sso" | "malas" | "pore" | "telemetry";

export type ServiceCategory = "Identity" | "Core" | "Reader" | "DevTools" | "Experimental";
export type ServiceLifecycle = "production" | "staging" | "development";

export interface QuickLink {
  label: string;
  url: string;
}

export interface ServiceDef {
  id: ServiceId;
  name: string;
  tagline: string;
  description: string;
  url: string;
  repo: string;
  category: ServiceCategory;
  lifecycle: ServiceLifecycle;
  version: string;
  progress?: number;
  iconName: "ShieldCheck" | "Sparkles" | "BookOpen" | "Activity";
  quickLinks?: QuickLink[];
}

// A single accent per lifecycle stage, rather than one-off colors per
// service - keeps the room-directory list reading as one calm palette
// instead of a rainbow of per-card tints.
export const lifecycleAccent: Record<ServiceLifecycle, { label: string; text: string; badge: string }> = {
  production: { label: "production", text: "text-moss", badge: "border-moss/30 bg-moss-soft text-moss" },
  staging: { label: "staging", text: "text-ochre", badge: "border-ochre/30 bg-ochre-soft text-ochre" },
  development: { label: "development", text: "text-indigo", badge: "border-indigo/30 bg-indigo-soft text-indigo" },
};

export const services: ServiceDef[] = [
  {
    id: "sso",
    name: "SSO",
    tagline: "Identity & Access",
    description:
      "Centralized OAuth2 identity provider securing all services in the Yado network.",
    url: process.env.NEXT_PUBLIC_SSO_URL ?? "https://sso.yado.my.id",
    repo: "https://github.com/samsmon/sso.yado",
    category: "Identity",
    lifecycle: "production",
    version: "v1.2.4",
    iconName: "ShieldCheck",
    quickLinks: [
      { label: "Portal", url: "https://sso.yado.my.id" },
      { label: "Docs", url: "https://github.com/samsmon/sso.yado#readme" },
    ],
  },
  {
    id: "malas",
    name: "Malas",
    tagline: "Core Service",
    description:
      "Core backend service for media catalog indexing, reading workflows, and data orchestration.",
    url: process.env.NEXT_PUBLIC_MALAS_URL ?? "https://malas.yado.my.id",
    repo: "https://github.com/samsmon/malas",
    category: "Core",
    lifecycle: "production",
    version: "v1.0.0",
    iconName: "Sparkles",
    quickLinks: [
      { label: "Launch", url: "https://malas.yado.my.id" },
      { label: "API", url: "https://github.com/samsmon/malas#api" },
    ],
  },
  {
    id: "pore",
    name: "Pore Reader",
    tagline: "Viewer & Inspector",
    description:
      "Digital reading engine and visual inspector for manga, EPUB, and signal archives.",
    url: "#",
    repo: "https://github.com/samsmon/yado",
    category: "Reader",
    lifecycle: "development",
    version: "v0.4.0-alpha",
    progress: 70,
    iconName: "BookOpen",
    quickLinks: [
      { label: "Docs", url: "/docs" },
      { label: "Roadmap", url: "https://github.com/samsmon/yado/tree/main/docs" },
    ],
  },
  {
    id: "telemetry",
    name: "Telemetry",
    tagline: "Health & Monitoring",
    description:
      "Automated uptime tracking, response latency, and service availability monitors.",
    url: "#status",
    repo: "https://github.com/samsmon/yado",
    category: "DevTools",
    lifecycle: "staging",
    version: "v0.9.1-rc",
    progress: 90,
    iconName: "Activity",
    quickLinks: [
      { label: "Endpoint", url: "/api/health" },
      { label: "Dashboard", url: "#status" },
    ],
  },
];

export const ssoConfig = {
  clientId: process.env.NEXT_PUBLIC_SSO_CLIENT_ID ?? "yado-landing",
  redirectUri: process.env.NEXT_PUBLIC_SSO_REDIRECT_URI ?? "",
  authorizeUrl: `${process.env.NEXT_PUBLIC_SSO_URL ?? "https://sso.yado.my.id"}/oauth/authorize`,
};

export const PKCE_VERIFIER_KEY = "yado_pkce_verifier";
export const OAUTH_STATE_KEY = "yado_oauth_state";

export async function buildSsoLoginUrl(): Promise<string> {
  const { generateRandomString, generateCodeChallenge } = await import("./pkce");

  const verifier = generateRandomString(64);
  const state = generateRandomString(32);
  const challenge = await generateCodeChallenge(verifier);

  sessionStorage.setItem(PKCE_VERIFIER_KEY, verifier);
  sessionStorage.setItem(OAUTH_STATE_KEY, state);

  const url = new URL(ssoConfig.authorizeUrl);
  url.searchParams.set("client_id", ssoConfig.clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("scope", "profile:read");
  url.searchParams.set("state", state);
  if (ssoConfig.redirectUri) {
    url.searchParams.set("redirect_uri", ssoConfig.redirectUri);
  }
  return url.toString();
}
