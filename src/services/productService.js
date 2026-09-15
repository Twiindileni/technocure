import { supabase } from "../lib/supabase";

export const productService = {
  async getPrinters({ category, search, page = 1, pageSize = 12 } = {}) {
    let q = supabase
      .from("printers")
      .select("*, printer_images(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
    if (category) q = q.eq("category", category);
    if (search)   q = q.ilike("name", `%${search}%`);
    const { data, error, count } = await q;
    if (error) throw error;
    return { data: data || [], total: count || 0 };
  },

  async getPrinter(id) {
    const { data, error } = await supabase
      .from("printers")
      .select("*, printer_images(*)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async createPrinter(payload) {
    const { data, error } = await supabase.from("printers").insert(payload).select().single();
    if (error) throw error;
    return data;
  },

  async updatePrinter(id, updates) {
    const { data, error } = await supabase
      .from("printers").update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async deletePrinter(id) {
    const { error } = await supabase.from("printers").delete().eq("id", id);
    if (error) throw error;
  },

  async addPrinterImage(printerId, storagePath, isPrimary = false) {
    const { data, error } = await supabase.from("printer_images").insert({
      printer_id: printerId,
      storage_path: storagePath,
      is_primary: isPrimary
    }).select().single();
    if (error) throw error;
    return data;
  },

  async removePrinterImage(imageId) {
    const { error } = await supabase.from("printer_images").delete().eq("id", imageId);
    if (error) throw error;
  },
};
