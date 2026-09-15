import React from "react";

export function Table({ children, className = "" }) {
  return (
    <div className={`table-wrapper ${className}`}>
      <table>
        {children}
      </table>
    </div>
  );
}
