import React from "react";

export const Input = React.forwardRef(({ label, error, className = "", required, ...props }, ref) => {
  return (
    <div className={"flex flex-col gap-1 " + className}>
      {label && (
        <label className="text-sm font-medium text-brand-dark">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input ref={ref} className={"input-field " + (error ? "border-red-400 focus:ring-red-400" : "")} {...props} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
Input.displayName = "Input";

export const Textarea = React.forwardRef(({ label, error, className = "", required, rows = 4, ...props }, ref) => {
  return (
    <div className={"flex flex-col gap-1 " + className}>
      {label && (
        <label className="text-sm font-medium text-brand-dark">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={"input-field resize-none " + (error ? "border-red-400" : "")}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
Textarea.displayName = "Textarea";

export const Select = React.forwardRef(({ label, error, className = "", required, options = [], children, ...props }, ref) => {
  return (
    <div className={"flex flex-col gap-1 " + className}>
      {label && (
        <label className="text-sm font-medium text-brand-dark">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select ref={ref} className={"input-field " + (error ? "border-red-400" : "")} {...props}>
        {children ? children : (
          <>
            <option value="">Select...</option>
            {options.map((o) => (
              <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>
                {typeof o === "string" ? o : o.label}
              </option>
            ))}
          </>
        )}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
Select.displayName = "Select";
