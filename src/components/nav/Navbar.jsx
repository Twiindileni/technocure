import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Menu, X, ShoppingCart, Printer, ChevronDown } from "lucide-react";
import { Logo } from "../ui/Logo";

const navLinks = [
  { label: "Home",         to: "/" },
  { label: "Services",     to: "/services" },
  {
    label: "Shop",
    children: [
      { label: "Printers", to: "/shop/printers" },
      { label: "Parts",    to: "/shop/parts" },
    ],
  },
  { label: "Track Ticket", to: "/tickets/track" },
  { label: "About",        to: "/about" },
  { label: "Contact",      to: "/contact" },
];

function NavDropdown({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors py-2">
        {label}<ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-brand-border py-1 z-50">
          {children.map(c => (
            <Link key={c.to} to={c.to} className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-bg hover:text-brand-primary">
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { isAuthenticated, isAdmin, isTechnician, logout } = useAuth();
  const { count, setOpen } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const portalLink = isAdmin ? "/admin" : isTechnician ? "/technician" : "/portal";

  return (
    <header className="bg-white border-b border-brand-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link =>
              link.children ? (
                <NavDropdown key={link.label} label={link.label} children={link.children} />
              ) : (
                <NavLink
                  key={link.to} to={link.to}
                  className={({ isActive }) =>
                    "text-sm font-medium transition-colors " + (isActive ? "text-brand-primary" : "text-gray-700 hover:text-brand-primary")
                  }
                  end={link.to === "/"}
                >
                  {link.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="relative p-2 text-gray-600 hover:text-brand-primary transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <>
                <Link to={portalLink} className="btn-secondary text-sm">
                  My Portal
                </Link>
                <button onClick={handleLogout} className="btn-ghost text-sm">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth/login" className="btn-secondary text-sm">Login</Link>
            )}

            <Link to="/tickets/new" className="btn-primary text-sm">
              Log a Ticket
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-700">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-brand-border py-3 space-y-1">
            {navLinks.map(link =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-semibold uppercase text-brand-gray tracking-wide">{link.label}</p>
                  {link.children.map(c => (
                    <Link key={c.to} to={c.to} onClick={() => setMobileOpen(false)} className="block px-6 py-2 text-sm text-gray-700 hover:text-brand-primary">
                      {c.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-primary">
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-brand-border flex flex-col gap-2 px-3">
              <Link to="/tickets/new" onClick={() => setMobileOpen(false)} className="btn-primary text-sm text-center">
                Log a Ticket
              </Link>
              {isAuthenticated ? (
                <Link to={portalLink} onClick={() => setMobileOpen(false)} className="btn-secondary text-sm text-center">
                  My Portal
                </Link>
              ) : (
                <Link to="/auth/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-sm text-center">
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
