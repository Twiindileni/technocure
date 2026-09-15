import React from "react";
import { TICKET_STATUS_COLORS, PRIORITY_COLORS } from "../../utils/ticketUtils";

export function StatusBadge({ status }) {
  const cls = TICKET_STATUS_COLORS[status] || "bg-gray-100 text-gray-600";
  return (
    <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " + cls}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const cls = PRIORITY_COLORS[priority] || "bg-gray-100 text-gray-600";
  return (
    <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " + cls}>
      {priority}
    </span>
  );
}

export function Badge({ children, color = "gray" }) {
  const colors = {
    gray:   "bg-gray-100 text-gray-700",
    blue:   "bg-blue-100 text-blue-700",
    green:  "bg-green-100 text-green-700",
    red:    "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-800",
    brand:  "bg-brand-primary-light text-brand-primary-dark",
  };
  return (
    <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " + (colors[color] || colors.gray)}>
      {children}
    </span>
  );
}
