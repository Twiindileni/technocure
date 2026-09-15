import { supabase } from "../lib/supabase";

export const partsService = {
  async getParts({ brand, search, page = 1, pageSize = 12 } = {}) {
    let q = supabase
      .from("parts")
      .select("*, part_images(*), part_compatibility(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
    if (brand)  q = q.eq("brand", brand);
    if (search) q = q.ilike("name", `%${search}%`);
    const { data, error, count } = await q;
    if (error) throw error;
    return { data: data || [], total: count || 0 };
  },

  async getPart(id) {
    const { data, error } = await supabase
      .from("parts")
      .select("*, part_images(*), part_compatibility(*)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async createPart(payload) {
    const { data, error } = await supabase.from("parts").insert(payload).select().single();
    if (error) throw error;
    return data;
  },

  async updatePart(id, updates) {
    const { data, error } = await supabase
      .from("parts").update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async deletePart(id) {
    const { error } = await supabase.from("parts").delete().eq("id", id);
    if (error) throw error;
  },

  async addPartImage(partId, storagePath, isPrimary = false) {
    const { data, error } = await supabase.from("part_images").insert({
      part_id: partId,
      storage_path: storagePath,
      is_primary: isPrimary
    }).select().single();
    if (error) throw error;
    return data;
  },

  async removePartImage(imageId) {
    const { error } = await supabase.from("part_images").delete().eq("id", imageId);
    if (error) throw error;
  },

  async createPartRequest(payload) {
    const { count } = await supabase.from("part_requests").select("*", { count: "exact", head: true });
    const seq = (count || 0) + 1;
    const year = new Date().getFullYear();
    const request_number = `PR-${year}-${String(seq).padStart(5, "0")}`;
    const { data, error } = await supabase
      .from("part_requests").insert({ ...payload, request_number, status: "Pending" })
      .select().single();
    if (error) throw error;
    return data;
  },

  async getPartRequests({ status, page = 1, pageSize = 20 } = {}) {
    let q = supabase
      .from("part_requests")
      .select("*, customer:profiles!part_requests_customer_id_fkey(full_name,email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
    if (status) q = q.eq("status", status);
    const { data, error, count } = await q;
    if (error) throw error;
    return { data: data || [], total: count || 0 };
  },
};
