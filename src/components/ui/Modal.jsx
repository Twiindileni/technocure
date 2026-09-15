import React, { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ open, onClose, title, children, size = "md" }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40" onClick={onClose} />
        <div className={"relative bg-white rounded-lg shadow-xl w-full " + (widths[size] || widths.md)}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
            <h2 className="text-lg font-semibold text-brand-dark">{title}</h2>
            <button onClick={onClose} className="p-1 rounded hover:bg-brand-bg text-brand-gray">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
