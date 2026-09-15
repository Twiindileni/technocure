import { supabase } from "../lib/supabase";

export const customerService = {
  async getCustomers({ search, page = 1, pageSize = 20 } = {}) {
    let q = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .eq("role", "customer")
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
    if (search) q = q.ilike("full_name", "%" + search + "%");
    const { data, error, count } = await q;
    if (error) throw error;
    return { data: data || [], total: count || 0 };
  },

  async getCustomer(id) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  },

  async getStaff() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role")
      .in("role", ["technician", "admin", "manager"]);
    if (error) throw error;
    return data || [];
  },
};
