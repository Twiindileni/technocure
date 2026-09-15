import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PRINTER_IMAGES = [
  "/images/hero_printers/d14078219280077ec09a08164309165b.png",
  "/images/hero_printers/d05667da20f28964058138ed0c1e2578.png",
  "/images/hero_printers/d684a3fe151da2e4860286dba3b8e5ca.png",
  "/images/hero_printers/3f9fcff1acb249c700b89116ba83eb88.png",
  "/images/hero_printers/ea8c02240be0dd986ea15d07d77de2ff.png"
];

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % PRINTER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % PRINTER_IMAGES.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + PRINTER_IMAGES.length) % PRINTER_IMAGES.length);

  return (
    <>
      {/* Main Hero Content */}
      {/* Added mt-48 sm:mt-56 on mobile to push text down, making room for the straddling printer image */}
      <div className="max-w-xl lg:ml-auto lg:mr-0 text-white mt-48 sm:mt-56 lg:mt-32 z-20 relative w-full">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 tracking-wide text-gray-100 leading-tight">
          Professional Printer<br/>Repair & Service
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mb-12 leading-relaxed font-light max-w-lg">
          TechnoCure delivers stunning service quality—creating clean and reliable machines that bring your office back to life. Our technicians take the next step in exceeding expectations offered by standard repair shops.
        </p>
        <div className="flex flex-wrap items-center gap-8">
          <Link to="/tickets/new" className="px-8 py-3.5 rounded-full border border-gray-500 text-gray-300 text-sm font-medium hover:border-[#F07878] hover:text-[#F07878] hover:bg-[#F07878]/10 transition-all">
            Log a Ticket
          </Link>
          <span className="text-2xl font-medium tracking-wide">N$ 450<span className="text-xs text-gray-500 ml-1 font-normal">/hr</span></span>
        </div>
      </div>

      {/* Floating Printer Images Carousel - Desktop */}
      {/* left-0 here perfectly aligns with the split boundary since this component renders inside the right panel */}
      <div className="hidden lg:flex absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[55vw] max-w-[800px] z-30 pointer-events-none drop-shadow-2xl flex-col items-center">
        <div className="relative w-full h-auto aspect-[4/3] flex items-center justify-center">
          {PRINTER_IMAGES.map((img, index) => (
            <img 
              key={img}
              src={img} 
              alt={`Printer ${index + 1}`} 
              className={`absolute m-auto max-h-full max-w-full object-contain transition-opacity duration-1000 ${index === currentImage ? 'opacity-95' : 'opacity-0'}`}
              style={{ filter: 'drop-shadow(30px 30px 40px rgba(0,0,0,0.8))' }}
            />
          ))}
        </div>
        
        {/* Desktop Controls */}
        <div className="mt-8 flex gap-4 pointer-events-auto items-center relative z-40 ml-[25%]">
          <button onClick={prevImage} className="p-2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full text-white transition-colors border border-white/10">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2 items-center mx-4">
            {PRINTER_IMAGES.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentImage ? 'bg-[#F07878] w-8' : 'bg-white/20 hover:bg-white/40 w-2'}`}
              />
            ))}
          </div>
          <button onClick={nextImage} className="p-2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full text-white transition-colors border border-white/10">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Floating Printer Images Carousel - Mobile */}
      {/* top-0 and -translate-y-1/2 centers it exactly on the line between the white and dark panels */}
      <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[80vw] max-w-[350px] z-30 pointer-events-none drop-shadow-2xl flex-col items-center">
        <div className="relative w-full aspect-[4/3] flex items-center justify-center">
          {PRINTER_IMAGES.map((img, index) => (
            <img 
              key={img}
              src={img} 
              alt={`Printer ${index + 1}`} 
              className={`absolute m-auto max-h-full max-w-full object-contain transition-opacity duration-1000 ${index === currentImage ? 'opacity-95' : 'opacity-0'}`}
              style={{ filter: 'drop-shadow(20px 20px 30px rgba(0,0,0,0.8))' }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
