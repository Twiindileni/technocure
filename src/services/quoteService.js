import { supabase } from "../lib/supabase";

export const quoteService = {
  async createQuote(payload) {
    const { count } = await supabase.from("quote_requests").select("*", { count: "exact", head: true });
    const seq = (count || 0) + 1;
    const year = new Date().getFullYear();
    const quote_number = "QT-" + year + "-" + String(seq).padStart(5, "0");
    const { data, error } = await supabase
      .from("quote_requests")
      .insert({ ...payload, quote_number, status: "Pending" })
      .select().single();
    if (error) throw error;
    return data;
  },

  async getQuotes({ status, page = 1, pageSize = 20 } = {}) {
    let q = supabase
      .from("quote_requests")
      .select("*, customer:profiles!quote_requests_customer_id_fkey(full_name,email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
    if (status) q = q.eq("status", status);
    const { data, error, count } = await q;
    if (error) throw error;
    return { data: data || [], total: count || 0 };
  },

  async updateQuote(id, updates) {
    const { data, error } = await supabase
      .from("quote_requests").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },
};
