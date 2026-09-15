import { supabase } from "../lib/supabase";

const BUCKETS = {
  products:   "product-images",
  parts:      "part-images",
  tickets:    "ticket-attachments",
  partReqs:   "part-request-attachments",
  quotes:     "quote-attachments",
};

export const storageService = {
  async upload(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(BUCKETS[bucket] || bucket)
      .upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(BUCKETS[bucket] || bucket).getPublicUrl(data.path);
    return { path: data.path, url: urlData.publicUrl };
  },

  async delete(bucket, path) {
    const { error } = await supabase.storage.from(BUCKETS[bucket] || bucket).remove([path]);
    if (error) throw error;
  },

  getPublicUrl(bucket, path) {
    const { data } = supabase.storage.from(BUCKETS[bucket] || bucket).getPublicUrl(path);
    return data.publicUrl;
  },
};
