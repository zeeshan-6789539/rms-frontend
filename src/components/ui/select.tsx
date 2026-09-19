"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import type { ISelectProps } from "@/types/ui";

export const Select = ({
  id,
  options,
  value,
  onChange,
  placeholder,
  hasError,
  disabled,
  className,
  ...props
}: ISelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const generatedId = useId();
  const listboxId = `${id ?? generatedId}-listbox`;

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  // Focus the panel whenever it opens, and close it on an outside click.
  useEffect(() => {
    if (!isOpen) return;

    listRef.current?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const activeItem = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    activeItem?.scrollIntoView({ block: "nearest" });
  }, [isOpen, activeIndex]);

  const closeAndRefocusTrigger = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const commitSelection = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    closeAndRefocusTrigger();
  };

  const openWithHighlight = () => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openWithHighlight();
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (options.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commitSelection(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        closeAndRefocusTrigger();
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => (isOpen ? setIsOpen(false) : openWithHighlight())}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-lg border bg-card px-3 text-start text-sm text-foreground shadow-sm outline-none transition-[border-color,box-shadow]",
          "focus:border-ring focus:ring-2 focus:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60",
          hasError ? "border-danger focus:border-danger focus:ring-danger/25" : "border-input",
          className,
        )}
        {...props}
      >
        <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
          {selectedOption?.label ?? placeholder ?? ""}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            isOpen && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${listboxId}-option-${activeIndex}`}
          onKeyDown={handleListKeyDown}
          className="absolute inset-x-0 z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-input bg-popover p-1 shadow-lg outline-none"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => commitSelection(index)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-foreground",
                  isActive && "bg-accent text-accent-foreground",
                  isSelected && "font-medium text-primary",
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};
