"use client";

import { useState } from "react";
import { PROCEDURE_DESCRIPTIONS } from "@/lib/procedure-descriptions";

interface ProcedureTooltipProps {
  code: string;
  description: string;
}

export function ProcedureTooltip({ code, description }: ProcedureTooltipProps) {
  const [open, setOpen] = useState(false);
  const humanDesc = PROCEDURE_DESCRIPTIONS[code];

  return (
    <div className="relative">
      <div className="flex items-start gap-1">
        <span>{description || "(no description)"}</span>
        {humanDesc && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 hover:bg-blue-200"
            aria-label="More info"
          >
            ?
          </button>
        )}
      </div>
      {open && humanDesc && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-lg">
            <div className="mb-1 font-mono text-xs font-semibold text-gray-500">
              {code}
            </div>
            <div>{humanDesc}</div>
          </div>
        </>
      )}
    </div>
  );
}
