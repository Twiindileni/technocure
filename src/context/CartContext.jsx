import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen]   = useState(false);

  const addItem = (item) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.type === item.type);
      if (existing) return prev.map(i => i.id === item.id && i.type === item.type ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setOpen(true);
  };

  const removeItem = (id, type) => setItems(prev => prev.filter(i => !(i.id === id && i.type === type)));
  const updateQty  = (id, type, qty) => setItems(prev => prev.map(i => i.id === id && i.type === type ? { ...i, qty } : i));
  const clear      = () => setItems([]);
  const total      = items.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
  const count      = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, total, count, open, setOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
