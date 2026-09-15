import React from "react";
import { Link } from "react-router-dom";
import { Grid, ShoppingCart, User, Cpu, Ruler, Monitor, Menu } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function HomePage() {
  const { setOpen } = useCart();

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-hidden bg-gradient-to-br from-[#3a3a3a] to-[#222222]">
      
      {/* Left Panel - White (Full height on desktop, auto on mobile) */}
      <div className="w-full lg:w-[32%] bg-white relative flex flex-col justify-between pt-8 pb-16 px-8 lg:px-12 xl:px-16 z-10 min-h-[40vh] lg:min-h-screen">
        
        {/* Logo */}
        <div className="flex justify-between items-center mb-12 lg:mb-0">
          <div className="font-extrabold text-3xl tracking-tighter text-gray-900">
            TechnoCure<span className="text-brand-primary">.</span>
          </div>
          <button className="lg:hidden text-gray-900">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Left Menu Links (Hidden on mobile for cleaner hero, or shown at bottom) */}
        <div className="hidden lg:flex flex-col space-y-6 mb-12 text-[13px] font-semibold text-gray-400">
          <Link to="/services" className="flex items-center gap-4 hover:text-gray-900 transition-colors group">
            <span className="w-6 border-b-2 border-brand-primary opacity-100"></span> Tech Specs
          </Link>
          <Link to="/services" className="flex items-center gap-4 hover:text-gray-900 transition-colors group">
            <span className="w-6 border-b-2 border-transparent group-hover:border-gray-300 transition-colors"></span> Warranty Details
          </Link>
          <Link to="/shop/parts" className="flex items-center gap-4 hover:text-gray-900 transition-colors group">
            <span className="w-6 border-b-2 border-transparent group-hover:border-gray-300 transition-colors"></span> What's Included
          </Link>
          <Link to="/quotes/new" className="flex items-center gap-4 hover:text-gray-900 transition-colors group">
            <span className="w-6 border-b-2 border-transparent group-hover:border-gray-300 transition-colors"></span> Financing Options
          </Link>
        </div>
      </div>

      {/* Right Panel - Dark */}
      <div className="w-full lg:w-[68%] relative flex flex-col justify-between pt-8 pb-12 px-8 lg:px-16 xl:px-24 min-h-[60vh] lg:min-h-screen">
        
        {/* Top Navigation (Desktop) */}
        <div className="hidden lg:flex justify-between items-center z-20 relative w-full">
          <nav className="flex gap-10 text-sm text-gray-400 font-medium">
            <Link to="/shop/printers" className="hover:text-white transition-colors">Printers</Link>
            <Link to="/shop/parts" className="hover:text-white transition-colors">Parts</Link>
            <Link to="/tickets/new" className="text-white border-b-2 border-brand-primary pb-1">Repairs</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Support</Link>
          </nav>
          <div className="flex gap-8 text-gray-400">
            <Link to="/"><Grid className="w-5 h-5 hover:text-white transition-colors cursor-pointer" /></Link>
            <button onClick={() => setOpen(true)}><ShoppingCart className="w-5 h-5 hover:text-white transition-colors cursor-pointer" /></button>
            <Link to="/auth/login"><User className="w-5 h-5 hover:text-white transition-colors cursor-pointer" /></Link>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="max-w-xl lg:ml-auto lg:mr-0 text-white mt-24 lg:mt-32 z-20 relative">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 tracking-wide text-gray-100 leading-tight">
            Professional Printer<br/>Repair & Service
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-12 leading-relaxed font-light max-w-lg">
            TechnoCure delivers stunning service quality—creating clean and reliable machines that bring your office back to life. Our technicians take the next step in exceeding expectations offered by standard repair shops.
          </p>
          <div className="flex flex-wrap items-center gap-8">
            <Link to="/tickets/new" className="px-8 py-3.5 rounded-full border border-gray-500 text-gray-300 text-sm font-medium hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/10 transition-all">
              Book a Repair
            </Link>
            <span className="text-2xl font-medium tracking-wide">N$ 450<span className="text-xs text-gray-500 ml-1 font-normal">/hr</span></span>
          </div>
        </div>

        {/* Bottom Features Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-gray-400 border-t border-gray-600/50 pt-10 mt-16 lg:mt-auto lg:pl-32 z-20 relative">
          <div className="flex gap-4 items-center">
            <Cpu className="w-8 h-8 text-gray-500 shrink-0" />
            <div>
              <p className="text-[11px] font-bold tracking-widest text-gray-300 mb-1">EXPERTISE</p>
              <p className="text-xs leading-snug">Certified technicians<br/>for all major brands</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            <Ruler className="w-8 h-8 text-gray-500 shrink-0" />
            <div>
              <p className="text-[11px] font-bold tracking-widest text-gray-300 mb-1">PARTS</p>
              <p className="text-xs leading-snug">Original OEM spares<br/>guaranteed quality</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <Monitor className="w-8 h-8 text-gray-500 shrink-0" />
            <div>
              <p className="text-[11px] font-bold tracking-widest text-gray-300 mb-1">WARRANTY</p>
              <p className="text-xs leading-snug">30-day guarantee<br/>on all repairs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Printer Image - Desktop */}
      <div className="hidden lg:block absolute top-1/2 left-[32%] -translate-x-1/2 -translate-y-1/2 w-[55vw] max-w-[900px] z-30 pointer-events-none drop-shadow-2xl">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/HP_LaserJet_2100.png/640px-HP_LaserJet_2100.png" 
          alt="Floating Printer" 
          className="w-full h-auto object-contain scale-x-[-1] opacity-95"
          style={{ filter: 'drop-shadow(30px 30px 40px rgba(0,0,0,0.8))' }}
        />
      </div>

      {/* Floating Printer Image - Mobile (Shown between the two panels) */}
      <div className="lg:hidden absolute top-[40vh] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[400px] z-30 pointer-events-none drop-shadow-2xl">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/HP_LaserJet_2100.png/640px-HP_LaserJet_2100.png" 
          alt="Floating Printer" 
          className="w-full h-auto object-contain scale-x-[-1] opacity-95"
          style={{ filter: 'drop-shadow(20px 20px 30px rgba(0,0,0,0.8))' }}
        />
      </div>

    </div>
  );
}
