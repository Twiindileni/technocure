import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Package } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { LoadingState } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/States";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { formatDate } from "../../utils/formatters";

export default function PortalPartRequestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reqs, setReqs]       = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;
    supabase.from("part_requests").select("*").eq("customer_id", user.id).order("created_at", { ascending: false })
      .then(({ data, error }) => { if (error) throw error; setReqs(data || []); })
      .catch(() => toast.error("Failed to load requests"))
      .finally(() => setLoading(false));
  }, [user]);
  if (loading) return <LoadingState />;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-brand-dark">My Part Requests</h1>
        <Button onClick={() => navigate("/parts/request")}><Plus className="w-4 h-4 mr-1.5" />Request a Part</Button>
      </div>
      <div className="card p-0 overflow-hidden">
        {reqs.length === 0 ? <EmptyState icon={<Package className="w-12 h-12" />} title="No part requests yet" description="Submit a request and our team will source the part for you." action={<Button onClick={() => navigate("/parts/request")}>Request a Part</Button>} /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead><tr className="border-b border-brand-border bg-brand-bg">
                {["Request #","Part","Printer","Status","Qty","Date"].map(h => <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-brand-dark">{h}</th>)}
              </tr></thead>
              <tbody>{reqs.map(r => (
                <tr key={r.id} className="border-b border-brand-border hover:bg-brand-bg/60">
                  <td className="px-5 py-3 font-mono font-medium text-brand-dark">{r.request_number}</td>
                  <td className="px-5 py-3">{r.requested_part || "—"}</td>
                  <td className="px-5 py-3">{[r.printer_brand, r.printer_model].filter(Boolean).join(" / ") || "—"}</td>
                  <td className="px-5 py-3"><Badge color="gray">{r.status || "Pending"}</Badge></td>
                  <td className="px-5 py-3">{r.quantity}</td>
                  <td className="px-5 py-3 text-brand-gray">{formatDate(r.created_at)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
