import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client for privileged server-side writes (bypasses RLS).
// Only import from server code (route handlers / server actions).
export const createAdminClient = () =>
  createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
