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
    <div className="flex-1 w-full flex flex-col pt-8 pb-12 z-20 overflow-y-auto pr-4 scrollbar-hide">
      
      {!ticket ? (
        <div className="max-w-2xl mt-4">
          <div className="mb-8">
            <h1 className="text-3xl font-light tracking-wide text-gray-100 mb-2">Track Ticket</h1>
            <p className="text-gray-400 text-sm font-light">Enter your ticket number and contact detail to view the status.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <form onSubmit={handleSubmit(onSearch)} className="flex flex-col sm:flex-row gap-5 items-end [&_label]:text-gray-300 [&_.input-field]:bg-white/5 [&_.input-field]:text-white [&_.input-field]:border-white/10 [&_.input-field]:focus:border-[#F07878]">
              <Input label="Ticket Number" placeholder="TC-2026-00001" className="flex-1 w-full"
                error={errors.ticket_number?.message}
                {...register("ticket_number", { required: "Ticket number required" })} />
              
              <Input label="Email or Phone" placeholder="your@email.com or 081..." className="flex-1 w-full"
                error={errors.contact?.message}
                {...register("contact", { required: "Email or phone required" })} />
              
              <Button type="submit" loading={loading} className="w-full sm:w-auto bg-[#F07878] hover:bg-[#d86a6a] text-white border-0 py-2.5">
                <Search className="w-4 h-4 mr-1.5" />Track
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl w-full">
          <button onClick={() => setTicket(null)} className="flex items-center text-sm text-[#F07878] hover:text-white transition-colors mb-6 font-medium">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Search
          </button>

          <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-semibold text-gray-100">{ticket.ticket_number}</h2>
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <p className="text-gray-400 text-sm">{ticket.printer_brand} {ticket.printer_model}</p>
              </div>
              <div className="text-left sm:text-right text-sm">
                <p className="text-gray-400">Date Logged</p>
                <p className="font-semibold text-gray-200">{formatDate(ticket.created_at)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">Customer Details</p>
                <div className="text-gray-300 text-sm space-y-1">
                  <p className="font-medium text-gray-100">{ticket.customer_name}</p>
                  <p>{ticket.company_name}</p>
                  <p>{ticket.email}</p>
                  <p>{ticket.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">Problem Description</p>
                <div className="bg-white/5 p-4 rounded text-sm text-gray-300">
                  <p className="font-medium text-[#F07878] mb-1">{ticket.problem_category}</p>
                  <p className="leading-relaxed">{ticket.problem_description}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-6">
               <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-4">Ticket Timeline</p>
               <div className="opacity-90">
                 <TicketTimeline ticketId={ticket.id} currentStatus={ticket.status} />
               </div>
            </div>
          </div>

          {visibleNotes.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <h3 className="font-semibold text-gray-200 mb-6 tracking-wide">Updates from Technician</h3>
              <div className="space-y-4">
                {visibleNotes.map(n => (
                  <div key={n.id} className="p-4 bg-white/5 rounded-lg border-l-2 border-[#F07878]">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-200 text-sm">{n.user?.full_name || 'Technician'}</span>
                      <span className="text-xs text-gray-500">{formatDateTime(n.created_at)}</span>
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{n.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
