import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://uhpeyxcpozvhdclikekb.supabase.co";
const DEFAULT_KEY = "sb_publishable_zxnRTv3PnlDNHcrYcktPjQ_n2l7B1Pr";

const rawUrl = process.env.REACT_APP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabaseUrl = (typeof rawUrl === "string" && rawUrl.trim().startsWith("http"))
  ? rawUrl.trim()
  : DEFAULT_URL;

const supabaseAnon = (typeof rawKey === "string" && rawKey.trim().length > 0)
  ? rawKey.trim()
  : DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: { persistSession: true, autoRefreshToken: true },
});
