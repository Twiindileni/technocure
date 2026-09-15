import React from "react";
import { TIMELINE_STEPS, getTimelineStep } from "../../utils/ticketUtils";
import { Check } from "lucide-react";

export function TicketTimeline({ status }) {
  const currentStep = getTimelineStep(status);

  return (
    <ol className="relative ml-4">
      {TIMELINE_STEPS.map((step, i) => {
        const done    = i < currentStep;
        const current = i === currentStep;
        return (
          <li key={step.key} className="mb-6 ml-6">
            <span className={"absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-white " +
              (done ? "bg-brand-primary" : current ? "bg-brand-primary" : "bg-gray-200")}>
              {done ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <span className={"w-2 h-2 rounded-full " + (current ? "bg-white" : "bg-gray-400")} />
              )}
            </span>
            <div className={"text-sm font-medium " + (current ? "text-brand-primary" : done ? "text-brand-dark" : "text-brand-gray")}>
              {step.label}
            </div>
            {current && (
              <p className="text-xs text-brand-primary mt-0.5 font-medium">Current stage</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
