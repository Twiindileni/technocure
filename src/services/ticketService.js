import { supabase } from "../lib/supabase";

export const ticketService = {
  async createTicket(payload) {
    const { count } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true });
    const seq = (count || 0) + 1;
    const year = new Date().getFullYear();
    const ticket_number = "TC-" + year + "-" + String(seq).padStart(5, "0");

    // Separate pure-form contact fields from DB ticket columns
    const {
      full_name, email, phone, company, address,
      ...ticketFields
    } = payload;

    const ticketInsertData = {
      ...ticketFields,
      ticket_number,
      status: "New",
      printer_location: ticketFields.printer_location || address || null,
      // Store contact details directly so guest tracking works
      contact_name:  full_name  || null,
      contact_email: email      || null,
      contact_phone: phone      || null,
    };

    // Strip empty strings / undefined keys
    Object.keys(ticketInsertData).forEach((k) => {
      if (ticketInsertData[k] === "" || ticketInsertData[k] === undefined) {
        delete ticketInsertData[k];
      }
    });

    const { data, error } = await supabase
      .from("tickets")
      .insert(ticketInsertData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getTicket(id) {
    const { data, error } = await supabase
      .from("tickets")
      .select("*, assigned_technician:profiles!tickets_assigned_technician_id_fkey(id,full_name,email), customer:profiles!tickets_customer_id_fkey(id,full_name,email,phone,company), ticket_notes(*), ticket_attachments(*)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async trackTicket(ticketNumber, contactValue) {
    const contact = (contactValue || "").trim().toLowerCase();
    const contactStripped = contact.replace(/[\s\-+()]/g, "");

    const { data, error } = await supabase
      .from("tickets")
      .select("*, customer:profiles!tickets_customer_id_fkey(full_name,email,phone,company), assigned_technician:profiles!tickets_assigned_technician_id_fkey(full_name), ticket_notes(*), ticket_attachments(*)")
      .eq("ticket_number", ticketNumber.trim().toUpperCase())
      .single();

    if (error || !data) throw new Error("Ticket not found. Please check your ticket number.");

    // If no contact info was stored on this ticket at all, trust the ticket number alone
    const hasStoredContact =
      data.contact_email || data.contact_phone ||
      data.customer?.email || data.customer?.phone;

    if (!hasStoredContact) return data;

    // Normalise stored values for comparison
    const storedEmail = (data.contact_email || data.customer?.email || "").toLowerCase().trim();
    const storedPhone = (data.contact_phone || data.customer?.phone || "").replace(/[\s\-+()]/g, "");

    const emailMatch = storedEmail && storedEmail === contact;
    const phoneMatch = storedPhone && storedPhone === contactStripped;

    if (!emailMatch && !phoneMatch) {
      throw new Error("Contact information does not match this ticket. Try your email or phone number.");
    }

    return data;
  },

  async getMyTickets(customerId) {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getAllTickets({ status, priority, technicianId, search, page = 1, pageSize = 20 } = {}) {
    let q = supabase
      .from("tickets")
      .select("*, customer:profiles!tickets_customer_id_fkey(full_name,email), assigned_technician:profiles!tickets_assigned_technician_id_fkey(full_name)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
    if (status)       q = q.eq("status", status);
    if (priority)     q = q.eq("priority", priority);
    if (technicianId) q = q.eq("assigned_technician_id", technicianId);
    if (search)       q = q.ilike("ticket_number", "%" + search + "%");
    const { data, error, count } = await q;
    if (error) throw error;
    return { data: data || [], total: count || 0 };
  },

  async updateTicket(id, updates) {
    const { data, error } = await supabase
      .from("tickets")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async addNote(ticketId, userId, note, isCustomerVisible = false) {
    const { data, error } = await supabase
      .from("ticket_notes")
      .insert({ ticket_id: ticketId, user_id: userId, note, is_customer_visible: isCustomerVisible })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getTechnicianTickets(technicianId) {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("assigned_technician_id", technicianId)
      .not("status", "in", "(Completed,Closed,Cancelled)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
};
