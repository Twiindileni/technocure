import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Ticket, CheckCircle, Package, FileText, PlusCircle, ShoppingCart, Wrench } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { ticketService } from "../../services/ticketService";
import { StatCard } from "../../components/ui/Card";
import { LoadingState } from "../../components/ui/Spinner";
import { StatusBadge, PriorityBadge } from "../../components/ui/Badge";
import { formatDate } from "../../utils/formatters";
import { supabase } from "../../lib/supabase";

export default function PortalDashboard() {
  const { user, profile } = useAuth();
  const [tickets, setTickets]         = useState([]);
  const [partReqCount, setPartReqCount] = useState(0);
  const [quoteCount, setQuoteCount]   = useState(0);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const t = await ticketService.getMyTickets(user.id);
        const pr = await supabase.from("part_requests").select("id", { count: "exact", head: true }).eq("customer_id", user.id);
        const qr = await supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("customer_id", user.id);
        setTickets(t);
        setPartReqCount(pr.count || 0);
        setQuoteCount(qr.count || 0);
      } catch { toast.error("Failed to load dashboard data"); }
      finally { setLoading(false); }
    }
    load();
  }, [user]);

  const ACTIVE = ["New","Open","Assigned","In Progress","Awaiting Customer","Awaiting Parts","Scheduled"];
  const DONE   = ["Completed","Closed"];
  const activeTickets    = tickets.filter(t => ACTIVE.includes(t.status));
  const completedTickets = tickets.filter(t => DONE.includes(t.status));
  const recentTickets    = tickets.slice(0, 5);

  const quickActions = [
    { icon: <PlusCircle className="w-6 h-6 text-brand-primary" />, title: "Log New Ticket", desc: "Submit a new printer service request", to: "/tickets/new" },
    { icon: <ShoppingCart className="w-6 h-6 text-blue-600" />, title: "Shop Printers", desc: "Browse our range of printers for sale", to: "/shop/printers" },
    { icon: <Wrench className="w-6 h-6 text-green-600" />, title: "Request a Part", desc: "Can't find the part you need? Request it", to: "/parts/request" },
  ];

  if (loading) return <LoadingState message="Loading your dashboard..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Welcome back, {profile?.full_name || "Customer"}</h1>
        <p className="text-brand-gray mt-1">Here is what is happening with your account.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Tickets"    value={activeTickets.length}    icon={<Ticket className="w-5 h-5" />}      color="brand"  />
        <StatCard label="Completed Tickets" value={completedTickets.length} icon={<CheckCircle className="w-5 h-5" />} color="green"  />
        <StatCard label="Part Requests"     value={partReqCount}            icon={<Package className="w-5 h-5" />}     color="blue"   />
        <StatCard label="Quote Requests"    value={quoteCount}              icon={<FileText className="w-5 h-5" />}    color="yellow" />
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
          <h2 className="text-base font-semibold text-brand-dark">Recent Tickets</h2>
          <Link to="/portal/tickets" className="text-sm text-brand-primary hover:underline font-medium">View all</Link>
        </div>
        {recentTickets.length === 0 ? (
          <div className="px-6 py-12 text-center text-brand-gray text-sm">
            No tickets yet. <Link to="/tickets/new" className="text-brand-primary hover:underline font-medium">Log your first service request.</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-brand-border bg-brand-bg">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-brand-dark">Ticket #</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-brand-dark">Printer</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-brand-dark">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-brand-dark">Priority</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-brand-dark">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map(t => (
                  <tr key={t.id} className="border-b border-brand-border hover:bg-brand-bg/60 transition-colors">
                    <td className="px-5 py-3">
                      <Link to={"/tickets/track?ticket=" + t.ticket_number} className="font-mono text-brand-primary hover:underline font-medium">{t.ticket_number}</Link>
                    </td>
                    <td className="px-5 py-3 text-brand-dark">{[t.printer_brand, t.printer_model].filter(Boolean).join(" ") || "—"}</td>
                    <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-5 py-3"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-5 py-3 text-brand-gray">{formatDate(t.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-base font-semibold text-brand-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map(a => (
            <Link key={a.to} to={a.to} className="card p-5 flex items-start gap-4 hover:border-brand-primary hover:shadow-md transition-all group">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-bg flex items-center justify-center group-hover:bg-brand-primary-light transition-colors">{a.icon}</div>
              <div>
                <p className="font-semibold text-brand-dark group-hover:text-brand-primary transition-colors">{a.title}</p>
                <p className="text-sm text-brand-gray mt-0.5">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
