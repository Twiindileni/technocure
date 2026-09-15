import axios from "axios";
import { supabase } from "./supabase";

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

const api = axios.create({
  baseURL: supabaseUrl + "/rest/v1",
  headers: {
    "Content-Type": "application/json",
    apikey: supabaseAnon,
  },
});

// Inject auth token into every request
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Global error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err?.message || "An error occurred";
    console.error("[API Error]", msg, err?.response?.data);
    return Promise.reject(new Error(msg));
  }
);

export default api;
