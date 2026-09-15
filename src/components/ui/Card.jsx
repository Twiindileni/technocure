import React from "react";

export function Card({ children, className = "", padding = true }) {
  return (
    <div className={"card " + (padding ? "p-6 " : "") + className}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-brand-dark">{title}</h3>
        {subtitle && <p className="text-sm text-brand-gray mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon, trend, color = "brand" }) {
  const colors = {
    brand:  "bg-brand-primary-light text-brand-primary",
    blue:   "bg-blue-100 text-blue-600",
    green:  "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-700",
    red:    "bg-red-100 text-red-600",
  };
  return (
    <div className="card p-5 flex items-center gap-4">
      {icon && (
        <div className={"w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 " + (colors[color] || colors.brand)}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-2xl font-bold text-brand-dark">{value}</p>
        <p className="text-sm text-brand-gray truncate">{label}</p>
        {trend && <p className="text-xs text-green-600 mt-0.5">{trend}</p>}
      </div>
    </div>
  );
}
