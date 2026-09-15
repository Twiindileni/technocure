import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Search, ArrowLeft } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { ticketService } from "../../services/ticketService";
import { Input } from "../../components/ui/Form";
import { Button } from "../../components/ui/Button";
import { StatusBadge, PriorityBadge } from "../../components/ui/Badge";
import { TicketTimeline } from "../../components/tickets/TicketTimeline";
import { LoadingState } from "../../components/ui/Spinner";
import { formatDate, formatDateTime } from "../../utils/formatters";

export default function TrackTicketPage() {
  const [searchParams] = useSearchParams();
  const [ticket, setTicket]   = useState(null);
  const [loading, setLoading] = useState(false);


  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    const t = searchParams.get("ticket");
    if (t) setValue("ticket_number", t);
  }, [searchParams, setValue]);

  async function onSearch({ ticket_number, contact }) {
    setLoading(true);
    setTicket(null);
    try {
      const data = await ticketService.trackTicket(ticket_number.trim(), contact.trim());
      setTicket(data);
    } catch (err) {
      toast.error(err.message || "Ticket not found. Please check your details.");
    } finally { setLoading(false); }
  }

  const visibleNotes = ticket?.ticket_notes?.filter(n => n.is_customer_visible) || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-brand-dark">Track Your Service Ticket</h1>
        <p className="text-brand-gray mt-2">Enter your ticket number and email or phone to view your ticket status.</p>
      </div>

      <div className="card p-6 mb-8">
        <form onSubmit={handleSubmit(onSearch)} className="flex flex-col sm:flex-row gap-4">
          <Input label="Ticket Number" placeholder="TC-2026-00001" className="flex-1"
            error={errors.ticket_number?.message}
            {...register("ticket_number", { required: "Ticket number required" })} />
          <Input label="Email or Phone" placeholder="your@email.com or 081..." className="flex-1"
            error={errors.contact?.message}
            {...register("contact", { required: "Email or phone required" })} />
          <div className="flex items-end">
            <Button type="submit" loading={loading} className="w-full sm:w-auto">
              <Search className="w-4 h-4 mr-1.5" />Track
            </Button>
          </div>
        </form>
      </div>

      {loading && <LoadingState message="Looking up your ticket..." />}

      {ticket && (
        <div className="space-y-5">
          <div className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs text-brand-gray uppercase tracking-wide font-medium mb-1">Ticket Number</p>
                <p className="font-mono font-bold text-brand-primary text-xl">{ticket.ticket_number}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm border-t border-brand-border pt-4">
              <div><p className="text-brand-gray text-xs mb-1">Submitted</p><p className="font-medium text-brand-dark">{formatDate(ticket.created_at)}</p></div>
              <div><p className="text-brand-gray text-xs mb-1">Last Updated</p><p className="font-medium text-brand-dark">{formatDate(ticket.updated_at)}</p></div>
              {ticket.scheduled_date && <div><p className="text-brand-gray text-xs mb-1">Scheduled</p><p className="font-medium text-brand-dark">{formatDateTime(ticket.scheduled_date)}</p></div>}
              {ticket.assigned_technician && <div><p className="text-brand-gray text-xs mb-1">Technician</p><p className="font-medium text-brand-dark">{ticket.assigned_technician.full_name}</p></div>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="card p-5">
              <h3 className="font-semibold text-brand-dark mb-3 text-sm">Printer Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-brand-gray">Brand</dt><dd className="font-medium text-brand-dark">{ticket.printer_brand || "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-brand-gray">Model</dt><dd className="font-medium text-brand-dark">{ticket.printer_model || "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-brand-gray">Issue</dt><dd className="font-medium text-brand-dark">{ticket.issue_category || "—"}</dd></div>
              </dl>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-brand-dark mb-3 text-sm">Service Progress</h3>
              <TicketTimeline status={ticket.status} />
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-brand-dark mb-2 text-sm">Problem Description</h3>
            <p className="text-brand-gray text-sm leading-relaxed">{ticket.description || "—"}</p>
          </div>

          {ticket.resolution && (
            <div className="card p-5 border-green-200 bg-green-50">
              <h3 className="font-semibold text-green-800 mb-2 text-sm">Resolution</h3>
              <p className="text-green-700 text-sm leading-relaxed">{ticket.resolution}</p>
            </div>
          )}

          {visibleNotes.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-brand-dark mb-3 text-sm">Technician Updates</h3>
              <div className="space-y-3">
                {visibleNotes.map(n => (
                  <div key={n.id} className="border-l-2 border-brand-primary pl-3 py-1">
                    <p className="text-sm text-brand-dark">{n.note}</p>
                    <p className="text-xs text-brand-gray mt-1">{formatDateTime(n.created_at)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => setTicket(null)} className="flex items-center gap-2 text-sm text-brand-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />Track another ticket
          </button>
        </div>
      )}
    </div>
  );
}
