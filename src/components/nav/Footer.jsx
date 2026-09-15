import React from "react";
import { Link } from "react-router-dom";
import { Printer, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Logo lightText />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Professional printer repair, maintenance, parts and technical support for homes and businesses across Namibia.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Services</h4>
            <ul className="space-y-2 text-sm">
              {["Printer Repairs","Preventive Maintenance","Printer Installation","Parts Replacement","Business Support","Technical Support"].map(s => (
                <li key={s}><Link to="/services" className="hover:text-brand-primary transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop/printers" className="hover:text-brand-primary transition-colors">Shop Printers</Link></li>
              <li><Link to="/shop/parts" className="hover:text-brand-primary transition-colors">Printer Parts</Link></li>
              <li><Link to="/tickets/new" className="hover:text-brand-primary transition-colors">Log a Ticket</Link></li>
              <li><Link to="/tickets/track" className="hover:text-brand-primary transition-colors">Track Ticket</Link></li>
              <li><Link to="/quotes/new" className="hover:text-brand-primary transition-colors">Request Quote</Link></li>
              <li><Link to="/about" className="hover:text-brand-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                <a href="tel:+264817854573" className="hover:text-brand-primary transition-colors">+264 81 785 4573</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                <a href="mailto:admin@technocurenam.com" className="hover:text-brand-primary transition-colors">admin@technocurenam.com</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                <span>Namibia</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                <span>Mon–Fri: 08:00–17:00<br />Sat: 09:00–13:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} TechnoCure Center CC. All rights reserved.</p>
          <p>Website by <a href="tel:+264817854573" className="hover:text-brand-primary transition-colors">Purpose Technology</a></p>
        </div>
      </div>
    </footer>
  );
}
