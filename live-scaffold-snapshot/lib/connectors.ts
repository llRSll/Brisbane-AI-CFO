import "server-only";

import { verifyOpenAI } from "@/lib/ai";
import { createAdminClient } from "@/lib/supabase/server";

export type ConnectorStatus = {
  id: "supabase" | "openai" | "vercel" | "github";
  label: string;
  ok: boolean;
  detail: string;
};

export const getConnectorStatuses = async (): Promise<ConnectorStatus[]> => {
  const supabase = await verifySupabase();
  const openai = verifyOpenAI();

  return [
    supabase,
    {
      id: "openai",
      label: "OpenAI",
      ok: openai.ok,
      detail: openai.ok ? "API key configured" : (openai.error ?? "Not connected"),
    },
    getVercelStatus(),
    getGitHubStatus(),
  ];
};

const verifySupabase = async (): Promise<ConnectorStatus> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey || !anonKey) {
    return {
      id: "supabase",
      label: "Supabase",
      ok: false,
      detail: "Missing Supabase env vars",
    };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("attendees")
      .select("id", { count: "exact", head: true });

    if (error) {
      return {
        id: "supabase",
        label: "Supabase",
        ok: false,
        detail: error.message,
      };
    }

    return {
      id: "supabase",
      label: "Supabase",
      ok: true,
      detail: "Live database reachable",
    };
  } catch (error) {
    return {
      id: "supabase",
      label: "Supabase",
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
    };
  }
};

const getVercelStatus = (): ConnectorStatus => {
  if (process.env.VERCEL === "1") {
    const host = process.env.VERCEL_URL ?? "deployed";
    return {
      id: "vercel",
      label: "Vercel",
      ok: true,
      detail: `Deployed (${host})`,
    };
  }

  return {
    id: "vercel",
    label: "Vercel",
    ok: true,
    detail: "Local dev — link with vercel link, deploy with vercel",
  };
};

const getGitHubStatus = (): ConnectorStatus => {
  const repo = process.env.GITHUB_REPOSITORY;

  if (process.env.GITHUB_ACTIONS === "true") {
    return {
      id: "github",
      label: "GitHub",
      ok: true,
      detail: repo ? `CI running (${repo})` : "CI running",
    };
  }

  return {
    id: "github",
    label: "GitHub",
    ok: true,
    detail: repo
      ? `Repo linked (${repo})`
      : "Push to GitHub — CI builds live/ on main",
  };
};
