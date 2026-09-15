import React from "react";
import { Link } from "react-router-dom";

export function Logo({ size = "md", showText = true, lightText = false, to = "/" }) {
  const iconSizes = {
    sm: "h-7 w-auto",
    md: "h-9 w-auto",
    lg: "h-12 w-auto",
  };

  const content = (
    <div className="flex items-center gap-3 flex-shrink-0">
      <img
        src="/logo.png"
        alt="TechnoCure Logo"
        className={iconSizes[size] || iconSizes.md}
      />
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={"font-extrabold text-base tracking-tight " + (lightText ? "text-white" : "text-brand-dark")}>
            TechnoCure
          </span>
          <span className={"text-[10px] uppercase tracking-widest mt-0.5 " + (lightText ? "text-gray-400" : "text-brand-gray")}>
            Center CC
          </span>
        </div>
      )}
    </div>
  );

  if (to) {
    return <Link to={to} className="hover:opacity-90 transition-opacity">{content}</Link>;
  }

  return content;
}
