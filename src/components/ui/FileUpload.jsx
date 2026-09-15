import React, { useRef } from "react";
import { Upload, X, Paperclip } from "lucide-react";

export function FileUpload({ label, onChange, accept, multiple = false, maxMB = 10, error, files = [] }) {
  const inputRef = useRef();

  const handleChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (maxMB) {
      const oversized = selected.filter(f => f.size > maxMB * 1024 * 1024);
      if (oversized.length) { alert("File too large. Max " + maxMB + "MB"); return; }
    }
    onChange(multiple ? selected : selected[0]);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-brand-dark">{label}</label>}
      <div
        onClick={() => inputRef.current?.click()}
        className={"border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors " + (error ? "border-red-400" : "border-brand-border hover:border-brand-primary")}
      >
        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-brand-gray">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-400 mt-1">Max {maxMB}MB</p>
      </div>
      <input ref={inputRef} type="file" className="hidden" accept={accept} multiple={multiple} onChange={handleChange} />
      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-brand-gray">
              <Paperclip className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{f.name}</span>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
