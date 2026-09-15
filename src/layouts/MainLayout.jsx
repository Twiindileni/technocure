import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Grid, ShoppingCart, User, Cpu, Ruler, Monitor, Menu, ChevronDown, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { CartSidebar } from "../components/shop/CartSidebar";

const Octagon = ({ className, size = 150, delay = "0s", duration = "8s" }) => (
  <div className={`absolute pointer-events-none opacity-60 ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
      <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="none" stroke="#F07878" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="60 250"
        style={{ animation: `neon-travel ${duration} linear infinite`, animationDelay: delay, filter: 'drop-shadow(0 0 4px #F07878) drop-shadow(0 0 10px #F07878)' }}
      />
    </svg>
  </div>
);

export function MainLayout() {
  const { setOpen } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-hidden bg-gradient-to-br from-[#3a3a3a] to-[#222222] font-sans">
      
      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#222222]/95 backdrop-blur-md flex flex-col p-8">
          <div className="flex justify-between items-center mb-12">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="TechnoCure Logo" className="w-10 h-10 object-contain" />
              <div className="font-extrabold text-3xl tracking-tighter text-white">
                TechnoCure<span className="text-[#F07878]">.</span>
              </div>
            </Link>
            <button className="text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-6 text-xl text-gray-300 font-medium overflow-y-auto pb-6">
            <Link to="/" className={location.pathname === '/' ? 'text-white font-bold' : ''}>Home</Link>
            <Link to="/services" className={location.pathname === '/services' ? 'text-white font-bold' : ''}>Services</Link>
            <Link to="/shop/printers" className={location.pathname === '/shop/printers' ? 'text-white font-bold' : ''}>Shop Printers</Link>
            <Link to="/shop/parts" className={location.pathname === '/shop/parts' ? 'text-white font-bold' : ''}>Shop Parts</Link>
            <Link to="/tickets/track" className={location.pathname === '/tickets/track' ? 'text-white font-bold' : ''}>Track Ticket</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'text-white font-bold' : ''}>About</Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'text-white font-bold' : ''}>Contact</Link>
          </nav>
          
          <div className="mt-auto flex flex-col gap-6 pt-6 border-t border-white/10">
            <Link to="/tickets/new" className="bg-[#F07878] hover:bg-[#d86a6a] text-white text-center font-semibold px-4 py-3.5 rounded-xl transition-colors">
              Log a Ticket
            </Link>
            <div className="flex justify-center gap-8 text-gray-400">
              <button onClick={() => { setMobileMenuOpen(false); setOpen(true); }}><ShoppingCart className="w-7 h-7 hover:text-white" /></button>
              <Link to="/auth/login"><User className="w-7 h-7 hover:text-white" /></Link>
            </div>
          </div>
        </div>
      )}

      {/* Left Panel - White */}
      <div className="w-full lg:w-[25%] bg-white relative flex flex-col justify-between pt-8 pb-16 px-8 lg:px-12 z-20 min-h-[40vh] lg:min-h-screen border-r border-gray-200">
        
        {/* Animated Background Octagons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <Octagon className="-left-16 top-[5%] rotate-12" size={220} duration="12s" />
          <Octagon className="-right-10 top-[40%] rotate-45" size={160} duration="8s" delay="-3s" />
          <Octagon className="left-[5%] bottom-[10%] -rotate-12" size={280} duration="15s" delay="-7s" />
          <Octagon className="right-[20%] bottom-[-10%] rotate-90" size={140} duration="10s" delay="-1s" />
          
          {/* Scattered Small Octagons */}
          <Octagon className="left-[40%] top-[20%] rotate-6" size={60} duration="6s" delay="-2s" />
          <Octagon className="right-[15%] top-[18%] rotate-45" size={40} duration="4s" delay="-1s" />
          <Octagon className="left-[15%] top-[55%] -rotate-12" size={80} duration="7s" delay="-4s" />
          <Octagon className="right-[30%] bottom-[35%] rotate-180" size={50} duration="5s" delay="-2.5s" />
          <Octagon className="left-[10%] top-[75%] rotate-90" size={35} duration="4.5s" delay="-0.5s" />
        </div>

        {/* Logo */}
        <div className="flex justify-between items-center mb-12 lg:mb-0 relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="TechnoCure Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
            <div className="font-extrabold text-3xl tracking-tighter text-gray-900">
              TechnoCure<span className="text-[#F07878]">.</span>
            </div>
          </Link>
          <button className="lg:hidden text-gray-900" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Left Sub-Links */}
        <div className="hidden lg:flex flex-col space-y-6 mb-12 text-[13px] font-semibold text-gray-400 relative z-10">
          <Link to="/services" className="flex items-center gap-4 hover:text-gray-900 transition-colors group">
            <span className="w-6 border-b-2 border-[#F07878] opacity-100"></span> Service Process
          </Link>
          <Link to="/services" className="flex items-center gap-4 hover:text-gray-900 transition-colors group">
            <span className="w-6 border-b-2 border-transparent group-hover:border-gray-300 transition-colors"></span> Warranty Details
          </Link>
          <Link to="/shop/parts" className="flex items-center gap-4 hover:text-gray-900 transition-colors group">
            <span className="w-6 border-b-2 border-transparent group-hover:border-gray-300 transition-colors"></span> Supported Brands
          </Link>
          <Link to="/quotes/new" className="flex items-center gap-4 hover:text-gray-900 transition-colors group">
            <span className="w-6 border-b-2 border-transparent group-hover:border-gray-300 transition-colors"></span> Maintenance Contracts
          </Link>
        </div>
      </div>

      {/* Right Panel - Dark Container */}
      <div className="w-full lg:w-[75%] relative flex flex-col justify-between pt-8 pb-12 px-8 lg:px-16 xl:px-24 min-h-[60vh] lg:min-h-screen z-30">
        
        {/* Top Navigation */}
        <div className="hidden lg:flex justify-between items-center z-50 relative w-full">
          <nav className="flex gap-8 text-sm text-gray-400 font-medium items-center">
            <Link to="/" className={`pb-1 border-b-2 transition-colors ${location.pathname === '/' ? 'text-white border-[#F07878]' : 'border-transparent hover:text-white'}`}>Home</Link>
            <Link to="/services" className={`pb-1 border-b-2 transition-colors ${location.pathname === '/services' ? 'text-white border-[#F07878]' : 'border-transparent hover:text-white'}`}>Services</Link>
            
            <div className="relative group cursor-pointer hover:text-white transition-colors flex items-center gap-1 pb-1">
              <span className={location.pathname.startsWith('/shop') ? 'text-white' : ''}>Shop</span> <ChevronDown className="w-3.5 h-3.5" />
              <div className="absolute top-full left-0 mt-2 w-32 bg-white text-gray-800 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden">
                <Link to="/shop/printers" className="px-4 py-2 text-sm hover:bg-brand-bg hover:text-[#F07878]">Printers</Link>
                <Link to="/shop/parts" className="px-4 py-2 text-sm hover:bg-brand-bg hover:text-[#F07878]">Parts</Link>
              </div>
            </div>

            <Link to="/tickets/track" className={`pb-1 border-b-2 transition-colors ${location.pathname === '/tickets/track' ? 'text-white border-[#F07878]' : 'border-transparent hover:text-white'}`}>Track Ticket</Link>
            <Link to="/about" className={`pb-1 border-b-2 transition-colors ${location.pathname === '/about' ? 'text-white border-[#F07878]' : 'border-transparent hover:text-white'}`}>About</Link>
            <Link to="/contact" className={`pb-1 border-b-2 transition-colors ${location.pathname === '/contact' ? 'text-white border-[#F07878]' : 'border-transparent hover:text-white'}`}>Contact</Link>
          </nav>
          
          <div className="flex gap-6 text-gray-400 items-center">
            <button onClick={() => setOpen(true)}><ShoppingCart className="w-5 h-5 hover:text-white transition-colors cursor-pointer" /></button>
            <Link to="/auth/login"><User className="w-5 h-5 hover:text-white transition-colors cursor-pointer" /></Link>
            <Link to="/tickets/new" className="ml-2 bg-[#F07878] hover:bg-[#d86a6a] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors hidden sm:block">
              Log a Ticket
            </Link>
          </div>
        </div>

        {/* MAIN CONTENT AREA - THIS IS WHERE PAGE CONTENT GOES */}
        <main className="flex-1 flex flex-col z-30 relative w-full h-full animate-fade-in" key={location.pathname}>
          <Outlet />
        </main>

        {/* Bottom Features Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-gray-400 border-t border-gray-600/50 pt-10 mt-16 lg:mt-auto lg:pl-32 z-40 relative">
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

        <div className="mt-10 lg:mt-6 text-center sm:text-right text-[10px] tracking-widest text-gray-500 z-40 relative uppercase font-medium">
          done by: <span className="text-[#F07878] font-bold">Purpose Technology</span>
        </div>
      </div>
      
      <CartSidebar />
    </div>
  );
}
