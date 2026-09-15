import React, { useState } from "react";
import { Search } from "lucide-react";

export function SearchBar({ value, onChange, placeholder = "Search...", className = "" }) {
  return (
    <div className={"relative " + className}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-9"
      />
    </div>
  );
}

export function Pagination({ page, total, pageSize = 20, onChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 text-sm text-brand-gray">
      <p>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded border border-brand-border hover:bg-brand-bg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded border border-brand-border hover:bg-brand-bg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
