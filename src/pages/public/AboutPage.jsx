import React from "react";
import { Link } from "react-router-dom";
import { Shield, Zap, Award, Heart, Users, Wrench } from "lucide-react";

const values = [
  { icon: <Shield className="w-5 h-5" />, title: "Reliability", desc: "We do what we say. Dependable service, every time." },
  { icon: <Zap className="w-5 h-5" />, title: "Fast Response", desc: "Quick turnaround on repairs and service requests." },
  { icon: <Award className="w-5 h-5" />, title: "Technical Expertise", desc: "Experienced technicians trained on all major printer brands." },
  { icon: <Heart className="w-5 h-5" />, title: "Customer First", desc: "Your satisfaction drives every decision we make." },
  { icon: <Users className="w-5 h-5" />, title: "Professionalism", desc: "We treat your equipment and workspace with respect." },
  { icon: <Wrench className="w-5 h-5" />, title: "Quality Work", desc: "Repairs done right the first time, using quality parts." },
];

export default function AboutPage() {
  return (
    <div className="flex-1 w-full flex flex-col pt-8 pb-12 z-20 overflow-y-auto pr-4 scrollbar-hide">
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-wide text-gray-100 mb-2">About TechnoCure</h1>
        <p className="text-gray-400 text-sm font-light">Namibia's dedicated printer repair and service specialists.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-12">
        <div>
          <div className="space-y-4 text-gray-300 text-[13px] leading-relaxed font-light">
            <p>TechnoCure Center CC is a professional printer services company based in Namibia. We specialise in the repair, maintenance, installation and supply of printers and printer parts for homes, small businesses, and large enterprises.</p>
            <p>Our team of trained technicians brings expertise across a wide range of printer brands including HP, Canon, Brother, Epson, Kyocera, Ricoh, and more. Whether you have a single desktop printer or a fleet of office devices, we have the skills and parts to keep them running.</p>
            <p>We understand that printer downtime costs your business time and money. That is why we prioritise fast, effective service and transparent communication throughout the repair process.</p>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-sm font-semibold text-gray-200 mb-4 tracking-wide uppercase">Core Values</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map(v => (
              <div key={v.title} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F07878]/10 text-[#F07878] flex items-center justify-center flex-shrink-0">{v.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-200 text-xs mb-0.5">{v.title}</h4>
                  <p className="text-[10px] text-gray-400 leading-tight">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
