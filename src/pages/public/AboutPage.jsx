import React from "react";
import { Link } from "react-router-dom";
import { Shield, Zap, Award, Heart, Users, Wrench } from "lucide-react";

const values = [
  { icon: <Shield className="w-6 h-6" />, title: "Reliability", desc: "We do what we say. Dependable service, every time." },
  { icon: <Zap className="w-6 h-6" />, title: "Fast Response", desc: "Quick turnaround on repairs and service requests." },
  { icon: <Award className="w-6 h-6" />, title: "Technical Expertise", desc: "Experienced technicians trained on all major printer brands." },
  { icon: <Heart className="w-6 h-6" />, title: "Customer First", desc: "Your satisfaction drives every decision we make." },
  { icon: <Users className="w-6 h-6" />, title: "Professionalism", desc: "We treat your equipment and workspace with respect." },
  { icon: <Wrench className="w-6 h-6" />, title: "Quality Work", desc: "Repairs done right the first time, using quality parts." },
];

export default function AboutPage() {
  return (
    <div>
      <div className="bg-brand-dark py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand-primary text-sm font-semibold uppercase tracking-widest mb-3">About Us</p>
          <h1 className="text-4xl font-bold text-white mb-4">About TechnoCure Center CC</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Namibia's dedicated printer repair and service specialists.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Who We Are</h2>
            <div className="space-y-4 text-brand-gray leading-relaxed">
              <p>TechnoCure Center CC is a professional printer services company based in Namibia. We specialise in the repair, maintenance, installation and supply of printers and printer parts for homes, small businesses, and large enterprises.</p>
              <p>Our team of trained technicians brings expertise across a wide range of printer brands including HP, Canon, Brother, Epson, Kyocera, Ricoh, and more. Whether you have a single desktop printer or a fleet of office devices, we have the skills and parts to keep them running.</p>
              <p>We understand that printer downtime costs your business time and money. That is why we prioritise fast, effective service and transparent communication throughout the repair process.</p>
            </div>
          </div>
          <div className="bg-brand-bg rounded-xl p-8 border border-brand-border">
            <h3 className="text-lg font-semibold text-brand-dark mb-4">Our Services Include</h3>
            <ul className="space-y-2 text-brand-gray text-sm">
              {["Printer repairs and diagnostics","Preventive maintenance","Printer installation and setup","Parts replacement and supply","Business printer support contracts","Technical support and troubleshooting","Printer and parts sales"].map(s => (
                <li key={s} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0" />{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-brand-dark text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map(v => (
              <div key={v.title} className="card p-5">
                <div className="w-10 h-10 rounded-lg bg-brand-primary-light text-brand-primary flex items-center justify-center mb-3">{v.icon}</div>
                <h3 className="font-semibold text-brand-dark mb-1">{v.title}</h3>
                <p className="text-sm text-brand-gray">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-dark rounded-xl p-10 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Ready to get started?</h3>
          <p className="text-gray-400 mb-6">Log a service ticket or contact us directly.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/tickets/new" className="btn-primary">Log a Service Ticket</Link>
            <Link to="/contact" className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
