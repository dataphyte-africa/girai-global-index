"use client";

import { useState } from "react";

const years = ["2024", "2025"] as const;

export function YearSwitcher() {
  const [selected, setSelected] = useState<string>("2024");

  return (
    <div className="flex items-center bg-muted rounded-full p-0.5 text-sm">
      {years.map((year) => (
        <button
          key={year}
          onClick={() => setSelected(year)}
          className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
            selected === year
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {year}
        </button>
      ))}
    </div>
  );
}
