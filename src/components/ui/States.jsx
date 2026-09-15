import React from "react";

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {icon && <div className="text-gray-300 mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-brand-dark mb-1">{title}</h3>
      {description && <p className="text-brand-gray text-sm max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <span className="text-red-500 text-xl">!</span>
      </div>
      <h3 className="text-lg font-semibold text-brand-dark mb-1">Error</h3>
      <p className="text-brand-gray text-sm max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary text-sm">Try again</button>
      )}
    </div>
  );
}
