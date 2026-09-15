import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/nav/Navbar";
import { Footer } from "../components/nav/Footer";
import { CartSidebar } from "../components/shop/CartSidebar";

export function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen bg-[#303030]">
      {!isHome && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isHome && <Footer />}
      <CartSidebar />
    </div>
  );
}
