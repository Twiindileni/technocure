import React, { useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Ticket, Package, User, LogOut,
  Printer, Menu, X, ChevronRight
} from "lucide-react";
import { Logo } from "../components/ui/Logo";

const portalLinks = [
  { label: "Dashboard",     to: "/portal",                 icon: <LayoutDashboard className="w-4 h-4" />, exact: true },
  { label: "My Tickets",    to: "/portal/tickets",         icon: <Ticket className="w-4 h-4" /> },
  { label: "My Orders",     to: "/portal/orders",          icon: <Package className="w-4 h-4" /> },
  { label: "Part Requests", to: "/portal/part-requests",   icon: <Printer className="w-4 h-4" /> },
  { label: "Profile",       to: "/portal/profile",         icon: <User className="w-4 h-4" /> },
];

export function PortalLayout() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate("/"); };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-white border-r border-brand-border w-56 flex-shrink-0">
      <div className="px-4 py-4 border-b border-brand-border">
        <Logo size="sm" />
      </div>
      <div className="px-3 py-4 border-b border-brand-border">
        <p className="text-xs text-brand-gray">Signed in as</p>
        <p className="text-sm font-semibold text-brand-dark truncate">{profile?.full_name || "Customer"}</p>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {portalLinks.map(link => (
          <NavLink
            key={link.to} to={link.to} end={link.exact}
            className={({ isActive }) =>
              "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors " +
              (isActive ? "bg-brand-primary-light text-brand-primary" : "text-gray-600 hover:bg-brand-bg hover:text-brand-dark")
            }
          >
            {link.icon}{link.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-2 py-3 border-t border-brand-border">
        <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
          <LogOut className="w-4 h-4" />Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      {/* Mobile sidebar */}
      {sideOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSideOpen(false)} />
          <div className="relative flex w-56"><Sidebar /></div>
        </div>
      )}
      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-brand-border">
          <button onClick={() => setSideOpen(!sideOpen)}><Menu className="w-5 h-5" /></button>
          <span className="font-semibold text-brand-dark text-sm">Customer Portal</span>
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
