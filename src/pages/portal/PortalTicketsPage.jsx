import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Package } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { ticketService } from "../../services/ticketService";
import { supabase } from "../../lib/supabase";
import { LoadingState } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/States";
import { StatusBadge, PriorityBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { formatDate } from "../../utils/formatters";

export default function PortalTicketsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("");
  const ACTIVE  = ["New","Open","Assigned","In Progress","Awaiting Customer","Awaiting Parts","Scheduled"];
  const DONE    = ["Completed"];
  const CLOSED  = ["Closed","Cancelled"];
  useEffect(() => {
    if (!user) return;
    ticketService.getMyTickets(user.id).then(setTickets).catch(() => toast.error("Failed to load tickets")).finally(() => setLoading(false));
  }, [user]);
  const filtered = tickets.filter(t => {
    if (!filter) return true;
    if (filter === "active")    return ACTIVE.includes(t.status);
    if (filter === "completed") return DONE.includes(t.status);
    if (filter === "closed")    return CLOSED.includes(t.status);
    return true;
  });
  if (loading) return <LoadingState />;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-brand-dark">My Tickets</h1>
        <Button onClick={() => navigate("/tickets/new")}><Plus className="w-4 h-4 mr-1.5" />Log New Ticket</Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {[["","All"],["active","Active"],["completed","Completed"],["closed","Closed"]].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={"px-4 py-1.5 rounded-full text-sm font-medium border transition-colors " + (filter === v ? "bg-brand-primary text-white border-brand-primary" : "bg-white text-brand-gray border-brand-border hover:border-brand-primary hover:text-brand-primary")}>
            {l}
          </button>
        ))}
      </div>
      <div className="card p-0 overflow-hidden">
        {filtered.length === 0 ? <EmptyState title="No tickets" description="Log your first service request." action={<Button onClick={() => navigate("/tickets/new")}><Plus className="w-4 h-4 mr-1.5" />Log New Ticket</Button>} /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead><tr className="border-b border-brand-border bg-brand-bg">
                {["Ticket #","Brand","Model","Issue","Status","Priority","Created",""].map(h => <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-brand-dark">{h}</th>)}
              </tr></thead>
              <tbody>{filtered.map(t => (
                <tr key={t.id} className="border-b border-brand-border hover:bg-brand-bg/60">
                  <td className="px-5 py-3 font-mono font-medium text-brand-dark">{t.ticket_number}</td>
                  <td className="px-5 py-3">{t.printer_brand || "—"}</td>
                  <td className="px-5 py-3">{t.printer_model || "—"}</td>
                  <td className="px-5 py-3">{t.issue_category || "—"}</td>
                  <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-5 py-3"><PriorityBadge priority={t.priority} /></td>
                  <td className="px-5 py-3 text-brand-gray">{formatDate(t.created_at)}</td>
                  <td className="px-5 py-3"><Link to={"/tickets/track?ticket=" + t.ticket_number} className="text-brand-primary hover:underline text-sm font-medium">Track</Link></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
