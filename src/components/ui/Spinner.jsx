import React from "react";
import { Loader2 } from "lucide-react";

export function Spinner({ size = "md", className = "" }) {
  const s = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" }[size] || "w-6 h-6";
  return <Loader2 className={"animate-spin text-brand-primary " + s + " " + className} />;
}

export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-brand-gray">
      <Spinner size="lg" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
