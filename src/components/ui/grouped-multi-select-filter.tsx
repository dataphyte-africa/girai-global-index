"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import type {
  GroupedMultiSelectGroup,
} from "@/lib/score-filter-options";

export type {
  GroupedMultiSelectGroup,
  GroupedMultiSelectOption,
} from "@/lib/score-filter-options";

export interface GroupedMultiSelectFilterProps {
  placeholder: string;
  fieldLabel?: string;
  groups: GroupedMultiSelectGroup[];
  selected: string[];
  onChange: (next: string[]) => void;
  className?: string;
}

/**
 * Multi-select dropdown with section headers (e.g. Dimensions / Pillars).
 */
export function GroupedMultiSelectFilter({
  placeholder,
  fieldLabel,
  groups,
  selected,
  onChange,
  className,
}: GroupedMultiSelectFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const allOptions = React.useMemo(
    () => groups.flatMap((g) => g.options),
    [groups]
  );

  const optionCount = allOptions.length;

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

  const visibleGroups = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((group) => ({
        ...group,
        options: group.options.filter((o) =>
          o.label.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.options.length > 0);
  }, [groups, search]);

  const triggerLabel = React.useMemo(() => {
    if (selected.length === 0) return placeholder;
    if (selected.length === 1) {
      return (
        allOptions.find((o) => o.value === selected[0])?.label ?? selected[0]
      );
    }
    return `${selected.length} selected`;
  }, [selected, placeholder, allOptions]);

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((s) => s !== value)
        : [...selected, value]
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
            className="absolute z-50 mt-1 w-[min(22rem,calc(100vw-2rem))] rounded-md border bg-popover shadow-lg"
          >
            {optionCount > 8 && (
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
            <div className="max-h-80 overflow-y-auto p-1">
              {visibleGroups.length === 0 ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No matches
                </div>
              ) : (
                visibleGroups.map((group) => (
                  <div key={group.heading} className="py-0.5">
                    <p className="px-2 pb-1 pt-2 text-xs font-bold text-foreground">
                      {group.heading}
                    </p>
                    {group.options.map((opt) => {
                      const checked = selected.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggle(opt.value)}
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
                          <span className="min-w-0 flex-1 truncate">
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))
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
