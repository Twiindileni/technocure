import { supabase } from "../lib/supabase";

export const adminService = {
  async getDashboardStats() {
    const [tickets, openTickets, inProgress, completed, parts, quotes, customers] = await Promise.all([
      supabase.from("tickets").select("*", { count: "exact", head: true }),
      supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "Open"),
      supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "In Progress"),
      supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "Completed"),
      supabase.from("parts").select("*", { count: "exact", head: true }),
      supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "Pending"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
    ]);
    return {
      totalTickets:   tickets.count || 0,
      openTickets:    openTickets.count || 0,
      inProgress:     inProgress.count || 0,
      completed:      completed.count || 0,
      totalParts:     parts.count || 0,
      pendingQuotes:  quotes.count || 0,
      customers:      customers.count || 0,
    };
  },

  async getRecentTickets(limit = 10) {
    const { data, error } = await supabase
      .from("tickets")
      .select("*, customer:profiles!tickets_customer_id_fkey(full_name)")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },
};
