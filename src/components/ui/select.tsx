"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { useIsHydrated } from "@/hooks/use-is-hydrated";
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
  const t = useTranslations("select");
  const isHydrated = useIsHydrated();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    left: number;
    width: number;
  }>({
    top: 0,
    left: 0,
    width: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const generatedId = useId();
  const listboxId = `${id ?? generatedId}-listbox`;

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const showSearch = options.length > 3;

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!showSearch || !searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase().trim();
    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [options, searchQuery, showSearch]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const width = rect.width;
    const estimatedHeight = Math.min(
      280,
      (showSearch ? 46 : 8) + Math.min(options.length, 6) * 40,
    );

    let top = rect.bottom + 4;
    // Open upwards if not enough room below
    if (rect.bottom + estimatedHeight > viewportHeight && rect.top > estimatedHeight + 4) {
      top = Math.max(8, rect.top - estimatedHeight - 4);
    }

    let left = rect.left;
    if (left + width > viewportWidth - 8) {
      left = Math.max(8, viewportWidth - width - 8);
    }
    if (left < 8) {
      left = 8;
    }

    setPopoverPosition({ top, left, width });
  }, [options.length, showSearch]);

  const closeAndRefocusTrigger = () => {
    setIsOpen(false);
    setSearchQuery("");
    triggerRef.current?.focus();
  };

  const commitSelection = (index: number) => {
    const option = filteredOptions[index];
    if (!option) return;
    onChange(option.value);
    closeAndRefocusTrigger();
  };

  const openWithHighlight = () => {
    updatePosition();
    const initialIndex = selectedIndex >= 0 ? selectedIndex : 0;
    setActiveIndex(initialIndex);
    setSearchQuery("");
    setIsOpen(true);
  };

  // Scroll active item into view
  useEffect(() => {
    if (!isOpen) return;
    const activeItem = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    activeItem?.scrollIntoView({ block: "nearest" });
  }, [isOpen, activeIndex]);

  // Focus search input or list when opening, and handle outside clicks & repositioning
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    // Auto-focus search input if available, else focus list
    if (showSearch) {
      searchInputRef.current?.focus();
    } else {
      listRef.current?.focus();
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !popoverRef.current?.contains(target)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, showSearch, updatePosition]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openWithHighlight();
    }
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, filteredOptions.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Enter":
        event.preventDefault();
        commitSelection(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        closeAndRefocusTrigger();
        break;
      case "Tab":
        setIsOpen(false);
        setSearchQuery("");
        break;
      default:
        break;
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (filteredOptions.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, filteredOptions.length - 1));
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
        setActiveIndex(filteredOptions.length - 1);
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
        setSearchQuery("");
        break;
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
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
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {/* Popover rendered via Portal to document.body */}
      {isOpen && isHydrated
        ? createPortal(
            <div
              ref={popoverRef}
              style={{
                position: "fixed",
                top: `${popoverPosition.top}px`,
                left: `${popoverPosition.left}px`,
                width: `${popoverPosition.width}px`,
              }}
              className="animate-in fade-in zoom-in-95 z-[100] rounded-lg border border-input bg-popover shadow-xl outline-none"
            >
              {/* Optional Search Bar for > 3 options */}
              {showSearch ? (
                <div className="border-b border-border p-1.5">
                  <div className="relative flex items-center">
                    <Search
                      className="pointer-events-none absolute start-2.5 h-3.5 w-3.5 text-muted-foreground"
                      aria-hidden
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setActiveIndex(0);
                      }}
                      onKeyDown={handleSearchKeyDown}
                      placeholder={t("searchPlaceholder")}
                      className="h-8 w-full rounded-md border border-input bg-card ps-8 pe-7 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring/30"
                    />
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setActiveIndex(0);
                          searchInputRef.current?.focus();
                        }}
                        className="absolute end-2 flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {/* Options Listbox */}
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                tabIndex={showSearch ? -1 : 0}
                aria-activedescendant={
                  filteredOptions[activeIndex]
                    ? `${listboxId}-option-${activeIndex}`
                    : undefined
                }
                onKeyDown={handleListKeyDown}
                className="max-h-60 overflow-auto p-1 outline-none"
              >
                {filteredOptions.length === 0 ? (
                  <li className="px-3 py-4 text-center text-xs text-muted-foreground">
                    {t("noResults")}
                  </li>
                ) : (
                  filteredOptions.map((option, index) => {
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
                          "flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors",
                          isActive && "bg-accent text-accent-foreground",
                          isSelected && "font-medium text-primary",
                        )}
                      >
                        <span className="truncate">{option.label}</span>
                        {isSelected ? (
                          <Check className="h-4 w-4 shrink-0" aria-hidden />
                        ) : null}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};
