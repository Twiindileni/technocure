import React from "react";
import { Link } from "react-router-dom";
import { Wrench, Settings, Monitor, Search, Package, Building2, ArrowRight, Phone, Mail } from "lucide-react";

const services = [
  { icon: <Wrench className="w-7 h-7" />, title: "Printer Repairs", desc: "Expert diagnosis and repair of all printer hardware and software problems. We fix paper jams, print quality issues, connectivity faults, and more.", cta: "Request Repair" },
  { icon: <Settings className="w-7 h-7" />, title: "Preventive Maintenance", desc: "Scheduled maintenance service to prevent unexpected failures and extend the life of your printer. Includes cleaning, inspection, and part replacement.", cta: "Book Maintenance" },
  { icon: <Monitor className="w-7 h-7" />, title: "Printer Installation", desc: "Professional printer setup, configuration, driver installation, and network integration for homes and offices.", cta: "Get Installed" },
  { icon: <Search className="w-7 h-7" />, title: "Printer Troubleshooting", desc: "Technical diagnosis and support for printer errors, connectivity problems, and performance issues. Remote and on-site options available.", cta: "Get Help" },
  { icon: <Package className="w-7 h-7" />, title: "Parts Replacement", desc: "Genuine replacement of worn or damaged components including fusers, drums, rollers, printheads, and more.", cta: "Request Parts Service" },
  { icon: <Building2 className="w-7 h-7" />, title: "Business Printer Support", desc: "Dedicated support and maintenance contracts for companies operating multiple printers. Reduce downtime and printing costs.", cta: "Get a Quote" },
];

export default function ServicesPage() {
  return (
    <div>
      <div className="bg-brand-dark py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand-primary text-sm font-semibold uppercase tracking-widest mb-3">What We Do</p>
          <h1 className="text-4xl font-bold text-white mb-4">Professional Printer Services</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">From emergency repairs to scheduled maintenance — TechnoCure has the expertise to keep your printers running.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(s => (
            <div key={s.title} className="card p-6 flex gap-5 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-brand-primary-light text-brand-primary flex items-center justify-center">{s.icon}</div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-brand-dark mb-2">{s.title}</h2>
                <p className="text-brand-gray text-sm leading-relaxed mb-4">{s.desc}</p>
                <Link to="/tickets/new" className="inline-flex items-center gap-1.5 text-brand-primary text-sm font-semibold hover:gap-2.5 transition-all">
                  {s.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-brand-primary-light border border-brand-primary/20 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-brand-dark mb-2">Not sure which service you need?</h3>
          <p className="text-brand-gray mb-6">Contact our team and we will assess your printer and recommend the right solution.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/tickets/new" className="btn-primary">Log a Service Ticket</Link>
            <Link to="/contact" className="btn-secondary">Contact Us</Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 text-sm text-brand-gray">
            <a href="tel:+264817854573" className="flex items-center gap-2 hover:text-brand-primary"><Phone className="w-4 h-4" />+264 81 785 4573</a>
            <a href="mailto:admin@technocurenam.com" className="flex items-center gap-2 hover:text-brand-primary"><Mail className="w-4 h-4" />admin@technocurenam.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}
