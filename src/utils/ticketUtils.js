// Generate ticket number like TC-2026-00001
export function generateTicketNumber(sequence) {
  const year = new Date().getFullYear();
  const padded = String(sequence).padStart(5, "0");
  return `TC-${year}-${padded}`;
}

// Generate part request number like PR-2026-00001
export function generatePartRequestNumber(sequence) {
  const year = new Date().getFullYear();
  const padded = String(sequence).padStart(5, "0");
  return `PR-${year}-${padded}`;
}

// Generate quote number like QT-2026-00001
export function generateQuoteNumber(sequence) {
  const year = new Date().getFullYear();
  const padded = String(sequence).padStart(5, "0");
  return `QT-${year}-${padded}`;
}

export const TICKET_STATUSES = [
  "New","Open","Assigned","In Progress",
  "Awaiting Customer","Awaiting Parts","Scheduled",
  "Completed","Closed","Cancelled",
];

export const TICKET_PRIORITIES = ["Low","Normal","High","Urgent"];

export const TICKET_STATUS_COLORS = {
  "New":               "bg-gray-100 text-gray-700",
  "Open":              "bg-blue-100 text-blue-700",
  "Assigned":          "bg-indigo-100 text-indigo-700",
  "In Progress":       "bg-amber-100 text-amber-700",
  "Awaiting Customer": "bg-orange-100 text-orange-700",
  "Awaiting Parts":    "bg-yellow-100 text-yellow-800",
  "Scheduled":         "bg-purple-100 text-purple-700",
  "Completed":         "bg-green-100 text-green-700",
  "Closed":            "bg-slate-100 text-slate-600",
  "Cancelled":         "bg-red-100 text-red-600",
};

export const PRIORITY_COLORS = {
  "Low":    "bg-gray-100 text-gray-600",
  "Normal": "bg-blue-100 text-blue-600",
  "High":   "bg-orange-100 text-orange-700",
  "Urgent": "bg-red-100 text-red-700",
};

export const TIMELINE_STEPS = [
  { label: "Ticket Created",        key: "created"    },
  { label: "Ticket Assigned",       key: "assigned"   },
  { label: "Technician Diagnosing", key: "diagnosing" },
  { label: "Repair / Parts",        key: "repairing"  },
  { label: "Completed",             key: "completed"  },
];

export function getTimelineStep(status) {
  if (["New", "Open"].includes(status))                     return 0;
  if (status === "Assigned")                                return 1;
  if (["In Progress", "Awaiting Customer"].includes(status))return 2;
  if (["Awaiting Parts", "Scheduled"].includes(status))     return 3;
  if (["Completed", "Closed"].includes(status))             return 4;
  return 0;
}
