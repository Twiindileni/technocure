import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { EmptyState } from "../../components/ui/States";
import { Button } from "../../components/ui/Button";
export default function PortalOrdersPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark">My Orders</h1>
      <div className="card"><EmptyState icon={<ShoppingBag className="w-12 h-12" />} title="No orders yet" description="Your order history will appear here once you make a purchase." action={<Button onClick={() => navigate("/shop/printers")}>Shop Printers</Button>} /></div>
    </div>
  );
}
