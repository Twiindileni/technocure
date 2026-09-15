import React from "react";
import { useCart } from "../../context/CartContext";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { Link } from "react-router-dom";

export function CartSidebar() {
  const { open, setOpen, items, removeItem, updateQty, total, count } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/30" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-sm bg-white shadow-xl flex flex-col h-full">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <h2 className="font-semibold text-brand-dark">
            Quote Request{count > 0 && <span className="ml-2 text-brand-primary">({count})</span>}
          </h2>
          <button onClick={() => setOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-brand-gray">
            <ShoppingCart className="w-10 h-10 text-gray-300" />
            <p className="text-sm">Your quote list is empty.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {items.map(item => (
              <div key={item.id + item.type} className="flex gap-3">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-brand-border flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-brand-bg rounded-md border border-brand-border flex-shrink-0 flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-gray-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-dark truncate">{item.name}</p>
                  <p className="text-xs text-brand-gray capitalize">{item.type}</p>
                  <p className="text-sm font-semibold text-brand-primary mt-1">{formatCurrency(item.price)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <select
                      value={item.qty}
                      onChange={e => updateQty(item.id, item.type, Number(e.target.value))}
                      className="text-xs border border-brand-border rounded px-1 py-0.5"
                    >
                      {[1,2,3,4,5,10].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <button onClick={() => removeItem(item.id, item.type)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-brand-border space-y-3">
            <div className="flex justify-between text-sm font-semibold text-brand-dark">
              <span>Estimated Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <p className="text-xs text-brand-gray">Prices are subject to availability. We will confirm via quote.</p>
            <Link
              to="/quotes/new"
              onClick={() => setOpen(false)}
              className="btn-primary w-full text-center text-sm"
            >
              Request Quote
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
