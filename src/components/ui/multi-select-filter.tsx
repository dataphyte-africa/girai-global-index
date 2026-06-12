"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface MultiSelectFilterProps {
  /** Trigger text when nothing is selected (e.g. "All regions"). */
  placeholder: string;
  /** Optional uppercase label above the trigger (evidence explorer style). */
  fieldLabel?: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  className?: string;
}

/**
 * Multi-select facet dropdown with visible checkboxes — matches the
 * Evidence Explorer `FacetDropdown` pattern.
 */
export function MultiSelectFilter({
  placeholder,
  fieldLabel,
  options,
  selected,
  onChange,
  className,
}: MultiSelectFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const filtered = React.useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, search]);

  const triggerLabel =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selected[0]
        : `${selected.length} selected`;

  const toggle = (option: string) => {
    onChange(
      selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option]
    );
  };

  const searchLabel = fieldLabel ?? placeholder.replace(/^All /i, "");

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {fieldLabel ? (
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {fieldLabel}
        </label>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors",
          "hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary",
          open && "ring-2 ring-primary"
        )}
      >
        <span
          className={cn(
            "truncate",
            selected.length === 0 && "text-muted-foreground"
          )}
        >
          {triggerLabel}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 opacity-60 transition-transform",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 mt-1 w-[min(20rem,calc(100vw-2rem))] rounded-md border bg-popover shadow-lg"
          >
            {options.length > 8 && (
              <div className="border-b px-2 py-1.5">
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${searchLabel.toLowerCase()}…`}
                  className="w-full bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            )}
            <div className="max-h-72 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No matches
                </div>
              ) : (
                filtered.map((option) => {
                  const checked = selected.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggle(option)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
                        "hover:bg-accent",
                        checked && "bg-accent/60"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                          checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40"
                        )}
                        aria-hidden
                      >
                        {checked ? (
                          <svg viewBox="0 0 16 16" className="h-3 w-3">
                            <path
                              fill="currentColor"
                              d="M6.173 12.414L2.586 8.828l1.414-1.414 2.173 2.172 5.828-5.828 1.414 1.414z"
                            />
                          </svg>
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{option}</span>
                    </button>
                  );
                })
              )}
            </div>
            {selected.length > 0 && (
              <div className="flex justify-end border-t p-1.5">
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Clear
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
