import React from "react";
import { Link } from "react-router-dom";
import { Wrench, Settings, Monitor, Search, Package, Building2, ArrowRight, Phone, Mail } from "lucide-react";

const services = [
  { icon: <Wrench className="w-6 h-6" />, title: "Printer Repairs", desc: "Expert diagnosis and repair of all printer hardware and software problems. We fix paper jams, print quality issues, connectivity faults, and more.", cta: "Request Repair" },
  { icon: <Settings className="w-6 h-6" />, title: "Preventive Maintenance", desc: "Scheduled maintenance service to prevent unexpected failures and extend the life of your printer. Includes cleaning, inspection, and part replacement.", cta: "Book Maintenance" },
  { icon: <Monitor className="w-6 h-6" />, title: "Printer Installation", desc: "Professional printer setup, configuration, driver installation, and network integration for homes and offices.", cta: "Get Installed" },
  { icon: <Search className="w-6 h-6" />, title: "Printer Troubleshooting", desc: "Technical diagnosis and support for printer errors, connectivity problems, and performance issues. Remote and on-site options available.", cta: "Get Help" },
  { icon: <Package className="w-6 h-6" />, title: "Parts Replacement", desc: "Genuine replacement of worn or damaged components including fusers, drums, rollers, printheads, and more.", cta: "Request Parts Service" },
  { icon: <Building2 className="w-6 h-6" />, title: "Business Printer Support", desc: "Dedicated support and maintenance contracts for companies operating multiple printers. Reduce downtime and printing costs.", cta: "Get a Quote" },
];

export default function ServicesPage() {
  return (
    <div className="flex-1 w-full flex flex-col pt-8 pb-12 z-20">
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-wide text-gray-100 mb-2">Our Services</h1>
        <p className="text-gray-400 text-sm font-light">From emergency repairs to scheduled maintenance — TechnoCure has the expertise to keep your printers running.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
        {services.map(s => (
          <div key={s.title} className="p-5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex gap-5">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F07878]/10 text-[#F07878] flex items-center justify-center">
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-gray-200 mb-1">{s.title}</h2>
              <p className="text-gray-400 text-[13px] leading-relaxed mb-4">{s.desc}</p>
              <Link to="/tickets/new" className="inline-flex items-center gap-1.5 text-[#F07878] text-xs font-semibold hover:gap-2.5 transition-all">
                {s.cta} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
