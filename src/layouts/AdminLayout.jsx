import React, { useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Ticket, Package, Users, FileText,
  Printer, LogOut, Menu, Settings, Wrench
} from "lucide-react";
import { Logo } from "../components/ui/Logo";

const adminLinks = [
  { label: "Dashboard",    to: "/admin",                    icon: <LayoutDashboard className="w-4 h-4" />, exact: true },
  { label: "Tickets",      to: "/admin/tickets",            icon: <Ticket className="w-4 h-4" /> },
  { label: "Printers",     to: "/admin/inventory/printers", icon: <Printer className="w-4 h-4" /> },
  { label: "Parts",        to: "/admin/inventory/parts",    icon: <Package className="w-4 h-4" /> },
  { label: "Customers",    to: "/admin/customers",          icon: <Users className="w-4 h-4" /> },
  { label: "Quotes",       to: "/admin/quotes",             icon: <FileText className="w-4 h-4" /> },
  { label: "Part Requests",to: "/admin/part-requests",      icon: <Wrench className="w-4 h-4" /> },
];

function Sidebar({ onClose }) {
  const { profile, role, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => { await logout(); navigate("/"); };

  return (
    <aside className="flex flex-col h-full bg-brand-dark w-56 flex-shrink-0">
      <div className="px-4 py-4 border-b border-gray-700">
        <Logo size="sm" lightText />
      </div>
      <div className="px-4 py-3 border-b border-gray-700">
        <p className="text-xs text-gray-500">Signed in as</p>
        <p className="text-sm font-semibold text-white truncate">{profile?.full_name || "Admin"}</p>
        <p className="text-xs text-gray-400 capitalize">{role}</p>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {adminLinks.map(link => (
          <NavLink
            key={link.to} to={link.to} end={link.exact}
            onClick={onClose}
            className={({ isActive }) =>
              "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors " +
              (isActive ? "bg-brand-primary text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white")
            }
          >
            {link.icon}{link.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-2 py-3 border-t border-gray-700">
        <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-400 hover:text-red-400 rounded-md transition-colors">
          <LogOut className="w-4 h-4" />Logout
        </button>
      </div>
    </aside>
  );
}

export function AdminLayout() {
  const [sideOpen, setSideOpen] = useState(false);

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden">
      <div className="hidden md:flex"><Sidebar /></div>
      {sideOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSideOpen(false)} />
          <div className="relative flex w-56">
            <Sidebar onClose={() => setSideOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-brand-border">
          <button onClick={() => setSideOpen(!sideOpen)}><Menu className="w-5 h-5" /></button>
          <span className="font-semibold text-brand-dark text-sm">Admin Dashboard</span>
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function TechLayout() {
  const [sideOpen, setSideOpen] = useState(false);
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => { await logout(); navigate("/"); };

  const techLinks = [
    { label: "My Jobs",     to: "/technician",         exact: true },
    { label: "All Tickets", to: "/technician/tickets" },
  ];

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden">
      <aside className="hidden md:flex flex-col w-56 bg-brand-dark flex-shrink-0">
        <div className="px-4 py-4 border-b border-gray-700">
          <Logo size="sm" lightText />
        </div>
        <div className="px-4 py-3 border-b border-gray-700">
          <p className="text-xs text-gray-500">Technician</p>
          <p className="text-sm font-semibold text-white truncate">{profile?.full_name}</p>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {techLinks.map(l => (
            <NavLink key={l.to} to={l.to} end={l.exact}
              className={({ isActive }) =>
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors " +
                (isActive ? "bg-brand-primary text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white")
              }
            >{l.label}</NavLink>
          ))}
        </nav>
        <div className="px-2 py-3 border-t border-gray-700">
          <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-400 hover:text-red-400 rounded-md">
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
      </aside>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"><Outlet /></div>
      </div>
    </div>
  );
}
