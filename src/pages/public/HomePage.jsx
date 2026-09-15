import React from "react";
import { Link } from "react-router-dom";
import { Truck, ShieldCheck, Wrench, ArrowRight, Printer, CheckCircle, Package } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#1a1c23] text-white overflow-hidden flex flex-col justify-center min-h-[85vh]">
        {/* Decorative hexagons/shapes mimicking the image */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[80%] bg-brand-primary rounded-full blur-[120px]"></div>
          <div className="absolute top-[40%] right-[10%] w-[30%] h-[50%] bg-brand-dark rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-primary"></div>
            <p className="text-brand-primary text-xs sm:text-sm font-bold uppercase tracking-widest">Namibia Printer Repair & Printer Consumables</p>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-8 max-w-4xl">
            Big box stores just send a printer.<br className="hidden md:block" /> We deliver on service too!
          </h1>
          
          <p className="text-gray-300 text-lg sm:text-xl mb-10 max-w-3xl leading-relaxed font-medium">
            TechnoCure is Namibia's leading printer repair and printer consumables provider. Don't get stuck with a broken printer just because it's "cheaper" elsewhere, every minute you're down is billable time you can't get back!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/tickets/new" className="px-8 py-3.5 bg-brand-primary hover:bg-brand-dark text-white rounded-md font-bold text-base transition-colors shadow-lg">
              Fix My Printer
            </Link>
            <Link to="/shop/printers" className="px-8 py-3.5 bg-transparent border-2 border-white/30 hover:bg-white/10 text-white rounded-md font-bold text-base transition-colors">
              How We Save You Money
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Strip (Coral instead of green) */}
      <section className="bg-brand-primary text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20">
          
          <div className="flex items-start gap-4 md:px-6 pt-6 md:pt-0 first:pt-0 first:px-0">
            <Truck className="w-12 h-12 flex-shrink-0 text-white/90 stroke-1" />
            <div>
              <h3 className="text-lg font-bold mb-2">Fast Turnaround</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Same-day assessment. Within 24-48 hours you can have your printer repaired and back to working condition.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 md:px-6 pt-6 md:pt-0">
            <ShieldCheck className="w-12 h-12 flex-shrink-0 text-white/90 stroke-1" />
            <div>
              <h3 className="text-lg font-bold mb-2">Quality Guarantee</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                We offer a comprehensive warranty on all repairs, genuine replacement parts, and refurbished printers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 md:px-6 pt-6 md:pt-0 last:pr-0">
            <Wrench className="w-12 h-12 flex-shrink-0 text-white/90 stroke-1" />
            <div>
              <h3 className="text-lg font-bold mb-2">On-Site Printer Servicing</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                We come to you. Typically within 1-4 hours to diagnose and fix your printers, cartridges and toners issues.
              </p>
            </div>
          </div>
          
        </div>
      </section>

      {/* Brands We Service Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column (Text) */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
              <p className="text-brand-primary text-xs font-bold uppercase tracking-widest">Printer Brands</p>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1] mb-6">
              Printer Brands<br />We Service
            </h2>
            
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              TechnoCure repairs and services Hewlett Packard (HP), Canon, Brother, Epson, Kyocera, Ricoh and Xerox. Laser printers, copiers, plotters and all-in-one (MFP) printers. If it plugs into a computer, we can fix it!
            </p>
            
            <Link to="/tickets/new" className="inline-block px-8 py-3.5 bg-brand-primary hover:bg-brand-dark text-white rounded-md font-bold text-base transition-colors shadow-lg">
              Service My Printer
            </Link>
          </div>
          
          {/* Right Column (Cards Grid) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Brand Card 1: Brother */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-6">
                <span className="text-3xl font-black tracking-tighter text-[#0033cc]">brother.</span>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest -mt-1 ml-1">at your side</p>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Brother</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Printers, Copiers, OEM Cartridges, P-touch, QL Series Label Printers, Industrial Mobile, Rugged Printers.
              </p>
            </div>

            {/* Brand Card 2: Ricoh */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-6">
                <span className="text-3xl font-black tracking-tighter text-[#cf142b]">RICOH</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ricoh</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Printers, Copiers, OEM Cartridges, MFP, IM C Series, DTF Printers, Production Printers.
              </p>
            </div>

            {/* Brand Card 3: Lexmark */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-6">
                <span className="text-3xl font-black tracking-tighter text-[#000000]">LEXMARK</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lexmark</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Printers, Copiers, OEM Cartridges, MFP, Enterprise Series, Color Laser, Dot Matrix Printers.
              </p>
            </div>

            {/* Brand Card 4: HP */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-6">
                <span className="text-3xl font-black tracking-tighter text-[#0096d6] italic">hp</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hewlett Packard</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                LaserJet, OfficeJet, DesignJet Plotters, PageWide, ScanJet, Enterprise MFP, OEM Consumables.
              </p>
            </div>
            
            {/* Brand Card 5: Canon */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-6">
                <span className="text-3xl font-black tracking-tighter text-[#cc0000]">Canon</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Canon</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                PIXMA, MAXIFY, imageRUNNER, imageCLASS, Wide Format Printers, Production Printers.
              </p>
            </div>
            
            {/* Brand Card 6: Kyocera */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-6">
                <span className="text-3xl font-black tracking-tighter text-[#da291c]">KYOCERA</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Kyocera</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                ECOSYS Printers, TASKalfa MFPs, Production Printing Systems, Original Toner.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Services Strip (Optional addition to keep some old functionality) */}
      <section className="py-16 px-4 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/shop/parts" className="group flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-brand-primary hover:text-white transition-all text-center">
              <Package className="w-10 h-10 mb-4 text-brand-primary group-hover:text-white" />
              <h3 className="font-bold mb-1">Buy Parts</h3>
              <p className="text-xs text-gray-500 group-hover:text-white/80">Genuine components</p>
            </Link>
            <Link to="/tickets/new" className="group flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-brand-primary hover:text-white transition-all text-center">
              <Wrench className="w-10 h-10 mb-4 text-brand-primary group-hover:text-white" />
              <h3 className="font-bold mb-1">Book Repair</h3>
              <p className="text-xs text-gray-500 group-hover:text-white/80">Expert technicians</p>
            </Link>
            <Link to="/shop/printers" className="group flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-brand-primary hover:text-white transition-all text-center">
              <Printer className="w-10 h-10 mb-4 text-brand-primary group-hover:text-white" />
              <h3 className="font-bold mb-1">New Printers</h3>
              <p className="text-xs text-gray-500 group-hover:text-white/80">Top brand models</p>
            </Link>
            <Link to="/services" className="group flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-brand-primary hover:text-white transition-all text-center">
              <CheckCircle className="w-10 h-10 mb-4 text-brand-primary group-hover:text-white" />
              <h3 className="font-bold mb-1">Maintenance</h3>
              <p className="text-xs text-gray-500 group-hover:text-white/80">SLA contracts</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
