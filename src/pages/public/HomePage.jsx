import React from "react";
import { Link } from "react-router-dom";
import { Grid, ShoppingCart, User, Cpu, Ruler, Monitor } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function HomePage() {
  const { setOpen } = useCart();

  return (
    <div className="min-h-screen bg-[#2c2c2c] flex items-center justify-center p-4 sm:p-8">
      {/* Main Container - max width and fixed aspect ratio container */}
      <div className="w-full max-w-6xl h-[85vh] min-h-[600px] max-h-[800px] bg-gradient-to-br from-[#3a3a3a] to-[#222222] flex shadow-2xl relative overflow-hidden rounded-sm">
        
        {/* Left Panel - White */}
        <div className="w-[32%] bg-white h-full relative py-12 px-10 flex flex-col justify-between z-10">
          {/* Logo */}
          <div className="font-extrabold text-3xl tracking-tighter text-gray-800">
            TechnoCure<span className="text-[#F07878]">.</span>
          </div>

          {/* Left Menu Links */}
          <div className="space-y-5 mb-10 text-[13px] font-medium text-gray-400">
            <Link to="/services" className="flex items-center gap-4 hover:text-gray-800 transition-colors group">
              <span className="w-4 border-b-2 border-[#F07878] opacity-100"></span> Tech Specs
            </Link>
            <Link to="/services" className="flex items-center gap-4 hover:text-gray-800 transition-colors group">
              <span className="w-4 border-b-2 border-transparent group-hover:border-gray-300 transition-colors"></span> Warranty Details
            </Link>
            <Link to="/shop/parts" className="flex items-center gap-4 hover:text-gray-800 transition-colors group">
              <span className="w-4 border-b-2 border-transparent group-hover:border-gray-300 transition-colors"></span> What's Included
            </Link>
            <Link to="/quotes/new" className="flex items-center gap-4 hover:text-gray-800 transition-colors group">
              <span className="w-4 border-b-2 border-transparent group-hover:border-gray-300 transition-colors"></span> Financing Options
            </Link>
          </div>
        </div>

        {/* Right Panel - Dark */}
        <div className="w-[68%] h-full relative py-12 px-12 flex flex-col justify-between">
          
          {/* Top Navigation */}
          <div className="flex justify-between items-center z-20 relative">
            <nav className="flex gap-10 text-[13px] text-gray-400 font-medium">
              <Link to="/shop/printers" className="hover:text-white transition-colors">Printers</Link>
              <Link to="/shop/parts" className="hover:text-white transition-colors">Parts</Link>
              <Link to="/tickets/new" className="text-white border-b border-[#F07878] pb-1">Repairs</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Support</Link>
            </nav>
            <div className="flex gap-6 text-gray-400">
              <Link to="/"><Grid className="w-4 h-4 hover:text-white transition-colors cursor-pointer" /></Link>
              <button onClick={() => setOpen(true)}><ShoppingCart className="w-4 h-4 hover:text-white transition-colors cursor-pointer" /></button>
              <Link to="/auth/login"><User className="w-4 h-4 hover:text-white transition-colors cursor-pointer" /></Link>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="max-w-md ml-auto mr-8 text-white mt-12 z-20 relative">
            <h1 className="text-3xl font-light mb-6 tracking-wide text-gray-100">Professional Printer<br/>Repair & Service</h1>
            <p className="text-gray-400 text-xs mb-10 leading-relaxed font-light">
              TechnoCure delivers stunning service quality—creating clean and reliable machines that bring your office back to life. Our technicians take the next step in exceeding expectations offered by standard repair shops.
            </p>
            <div className="flex items-center gap-10">
              <Link to="/tickets/new" className="px-8 py-2.5 rounded-full border border-gray-500 text-gray-300 text-xs font-medium hover:border-[#F07878] hover:text-[#F07878] transition-all">
                Book a Repair
              </Link>
              <span className="text-lg font-medium tracking-wide">N$ 450<span className="text-[10px] text-gray-500 ml-1">/hr</span></span>
            </div>
          </div>

          {/* Bottom Features Strip */}
          <div className="flex gap-12 text-gray-400 border-t border-gray-600/50 pt-8 pl-32 z-20 relative">
            <div className="flex gap-3 items-center">
              <Cpu className="w-6 h-6 text-gray-500" />
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-300 mb-0.5">EXPERTISE</p>
                <p className="text-[10px] leading-tight">Certified technicians<br/>for all major brands</p>
              </div>
            </div>
            
            <div className="flex gap-3 items-center">
              <Ruler className="w-6 h-6 text-gray-500" />
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-300 mb-0.5">PARTS</p>
                <p className="text-[10px] leading-tight">Original OEM spares<br/>guaranteed quality</p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <Monitor className="w-6 h-6 text-gray-500" />
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-300 mb-0.5">WARRANTY</p>
                <p className="text-[10px] leading-tight">30-day guarantee<br/>on all repairs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Printer Image */}
        <div className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-[45%] w-[650px] z-30 pointer-events-none drop-shadow-2xl">
          {/* REPLACE THIS SRC WITH YOUR TRANSPARENT PRINTER PNG */}
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/HP_LaserJet_2100.png/640px-HP_LaserJet_2100.png" 
            alt="Floating Printer" 
            className="w-full h-auto object-contain scale-x-[-1] opacity-90"
            style={{ filter: 'drop-shadow(20px 20px 30px rgba(0,0,0,0.8))' }}
          />
        </div>

      </div>
    </div>
  );
}
