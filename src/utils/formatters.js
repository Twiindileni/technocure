export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  const formatted = new Intl.NumberFormat("en-NA", { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(num);
  return `N$ ${formatted}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-NA", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-NA", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function formatRelative(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return formatDate(dateStr);
}

export function truncate(str, max = 80) {
  if (!str) return "";
  return str.length <= max ? str : str.slice(0, max) + "…";
}
