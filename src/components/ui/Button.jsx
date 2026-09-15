import React from "react";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  danger: "inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizes = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-2.5",
};

export function Button({
  variant = "primary", size = "md", loading = false, disabled = false,
  className = "", children, as: Tag = "button", ...props
}) {
  return (
    <Tag
      className={[variants[variant], sizes[size], className].join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
        </svg>
      )}
      {children}
    </Tag>
  );
}
