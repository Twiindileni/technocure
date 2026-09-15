import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/nav/Navbar";
import { Footer } from "../components/nav/Footer";
import { CartSidebar } from "../components/shop/CartSidebar";

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}
