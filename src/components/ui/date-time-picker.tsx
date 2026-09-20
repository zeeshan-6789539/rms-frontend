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
import { useLocale, useTranslations } from "next-intl";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";
import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { cn } from "@/utils/cn";
import { getTodayIsoDate } from "@/utils/format";
import type { IDateTimePickerProps } from "@/types/ui";

type TCalendarViewMode = "days" | "months" | "years";

const parseIsoDateTime = (
  iso?: string,
): { year: number; month: number; day: number; hour: number; minute: number } | null => {
  if (!iso) return null;
  const normalized = iso.includes("T") ? iso : iso.replace(" ", "T");
  const [datePart, timePart] = normalized.split("T");
  if (!datePart || !/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return null;

  const [y, m, d] = datePart.split("-").map(Number);
  let hour = 12;
  let minute = 0;

  if (timePart) {
    const [h, min] = timePart.split(":").map(Number);
    if (!Number.isNaN(h)) hour = h;
    if (!Number.isNaN(min)) minute = min;
  }

  return { year: y, month: m - 1, day: d, hour, minute };
};

const toIsoDateTimeString = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): string => {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  const h = String(hour).padStart(2, "0");
  const min = String(minute).padStart(2, "0");
  return `${year}-${m}-${d}T${h}:${min}`;
};

const MONTH_NAMES_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS_SHORT_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const POPOVER_WIDTH = 320;
const POPOVER_HEIGHT = 410;

export const DateTimePicker = ({
  id,
  value = "",
  onChange,
  placeholder,
  min,
  max,
  hasError,
  disabled,
  className,
  locale: propLocale,
  "aria-label": ariaLabel,
}: IDateTimePickerProps) => {
  const t = useTranslations("datePicker");
  const activeLocale = useLocale();
  const locale = propLocale ?? activeLocale;
  const isHydrated = useIsHydrated();
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const todayIso = useMemo(() => getTodayIsoDate(), []);
  const parsedValue = useMemo(() => parseIsoDateTime(value), [value]);

  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<TCalendarViewMode>("days");
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Active view state
  const initialDate = useMemo(() => {
    if (parsedValue) return parsedValue;
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
      hour: now.getHours(),
      minute: Math.floor(now.getMinutes() / 5) * 5,
    };
  }, [parsedValue]);

  const [viewYear, setViewYear] = useState<number>(initialDate.year);
  const [viewMonth, setViewMonth] = useState<number>(initialDate.month);
  const [selectedDay, setSelectedDay] = useState<number | null>(parsedValue ? parsedValue.day : null);
  const [selectedHour, setSelectedHour] = useState<number>(initialDate.hour);
  const [selectedMinute, setSelectedMinute] = useState<number>(initialDate.minute);

  const decadeStart = Math.floor(viewYear / 12) * 12;

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + 6;
    if (rect.bottom + POPOVER_HEIGHT > viewportHeight && rect.top > POPOVER_HEIGHT + 6) {
      top = Math.max(8, rect.top - POPOVER_HEIGHT - 6);
    }

    let left = rect.left;
    const isRtl = document.documentElement.dir === "rtl" || document.dir === "rtl";
    if (isRtl) {
      left = rect.right - POPOVER_WIDTH;
    }
    if (left + POPOVER_WIDTH > viewportWidth - 12) {
      left = Math.max(12, viewportWidth - POPOVER_WIDTH - 12);
    }
    if (left < 12) {
      left = 12;
    }

    setPopoverPosition({ top, left });
  }, []);

  const openPicker = () => {
    if (parsedValue) {
      setViewYear(parsedValue.year);
      setViewMonth(parsedValue.month);
      setSelectedDay(parsedValue.day);
      setSelectedHour(parsedValue.hour);
      setSelectedMinute(parsedValue.minute);
    } else {
      const now = new Date();
      setViewYear(now.getFullYear());
      setViewMonth(now.getMonth());
      setSelectedDay(null);
      setSelectedHour(now.getHours());
      setSelectedMinute(Math.floor(now.getMinutes() / 5) * 5);
    }
    setViewMode("days");
    updatePosition();
    setIsOpen(true);
  };

  // Click outside and repositioning
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !popoverRef.current?.contains(target)
      ) {
        setIsOpen(false);
        setViewMode("days");
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setViewMode("days");
        triggerRef.current?.focus();
      }
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  const formattedDisplay = useMemo(() => {
    if (!parsedValue) return "";
    try {
      const dateObj = new Date(
        parsedValue.year,
        parsedValue.month,
        parsedValue.day,
        parsedValue.hour,
        parsedValue.minute,
      );
      return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(dateObj);
    } catch {
      return value;
    }
  }, [parsedValue, locale, value]);

  // Localized month full names
  const monthLongNames = useMemo(() => {
    try {
      const formatter = new Intl.DateTimeFormat(locale, { month: "long" });
      return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2026, i, 1)));
    } catch {
      return MONTH_NAMES_EN;
    }
  }, [locale]);

  // Localized month short names
  const monthShortNames = useMemo(() => {
    try {
      const formatter = new Intl.DateTimeFormat(locale, { month: "short" });
      return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2026, i, 1)));
    } catch {
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }
  }, [locale]);

  // Localized weekday names
  const weekdayNames = useMemo(() => {
    try {
      const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
      return Array.from({ length: 7 }, (_, i) => formatter.format(new Date(2026, 8, 20 + i)));
    } catch {
      return WEEKDAYS_SHORT_EN;
    }
  }, [locale]);

  // Calendar cells
  const calendarCells = useMemo(() => {
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    interface ICalendarCell {
      day: number;
      month: number;
      year: number;
      isCurrentMonth: boolean;
      isoDate: string;
      isDisabled: boolean;
      isToday: boolean;
      isSelected: boolean;
    }

    const minDatePart = min ? min.split("T")[0] : undefined;
    const maxDatePart = max ? max.split("T")[0] : undefined;
    const valueDatePart = parsedValue
      ? `${parsedValue.year}-${String(parsedValue.month + 1).padStart(2, "0")}-${String(parsedValue.day).padStart(2, "0")}`
      : undefined;

    const cells: ICalendarCell[] = [];

    // Leading days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      const mStr = String(prevMonth + 1).padStart(2, "0");
      const dStr = String(day).padStart(2, "0");
      const iso = `${prevYear}-${mStr}-${dStr}`;

      cells.push({
        day,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        isoDate: iso,
        isDisabled: (Boolean(minDatePart) && iso < minDatePart!) || (Boolean(maxDatePart) && iso > maxDatePart!),
        isToday: iso === todayIso,
        isSelected: iso === valueDatePart,
      });
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const mStr = String(viewMonth + 1).padStart(2, "0");
      const dStr = String(day).padStart(2, "0");
      const iso = `${viewYear}-${mStr}-${dStr}`;

      cells.push({
        day,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
        isoDate: iso,
        isDisabled: (Boolean(minDatePart) && iso < minDatePart!) || (Boolean(maxDatePart) && iso > maxDatePart!),
        isToday: iso === todayIso,
        isSelected: iso === valueDatePart,
      });
    }

    // Trailing days
    const totalCells = cells.length <= 35 ? 35 : 42;
    const remaining = totalCells - cells.length;
    for (let day = 1; day <= remaining; day++) {
      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      const mStr = String(nextMonth + 1).padStart(2, "0");
      const dStr = String(day).padStart(2, "0");
      const iso = `${nextYear}-${mStr}-${dStr}`;

      cells.push({
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isoDate: iso,
        isDisabled: (Boolean(minDatePart) && iso < minDatePart!) || (Boolean(maxDatePart) && iso > maxDatePart!),
        isToday: iso === todayIso,
        isSelected: iso === valueDatePart,
      });
    }

    return cells;
  }, [viewYear, viewMonth, min, max, parsedValue, todayIso]);

  const handlePrev = () => {
    if (viewMode === "days") {
      if (viewMonth === 0) {
        setViewYear((y) => y - 1);
        setViewMonth(11);
      } else {
        setViewMonth((m) => m - 1);
      }
    } else if (viewMode === "months") {
      setViewYear((y) => y - 1);
    } else if (viewMode === "years") {
      setViewYear((y) => y - 12);
    }
  };

  const handleNext = () => {
    if (viewMode === "days") {
      if (viewMonth === 11) {
        setViewYear((y) => y + 1);
        setViewMonth(0);
      } else {
        setViewMonth((m) => m + 1);
      }
    } else if (viewMode === "months") {
      setViewYear((y) => y + 1);
    } else if (viewMode === "years") {
      setViewYear((y) => y + 12);
    }
  };

  const applyDateTime = (
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
  ) => {
    const isoDateTime = toIsoDateTimeString(year, month, day, hour, minute);
    onChange(isoDateTime);
  };

  const handleDayClick = (cell: { year: number; month: number; day: number }) => {
    setViewYear(cell.year);
    setViewMonth(cell.month);
    setSelectedDay(cell.day);
    applyDateTime(cell.year, cell.month, cell.day, selectedHour, selectedMinute);
  };

  const handleHourChange = (newHour: number) => {
    setSelectedHour(newHour);
    const dayToUse = selectedDay ?? new Date().getDate();
    applyDateTime(viewYear, viewMonth, dayToUse, newHour, selectedMinute);
  };

  const handleMinuteChange = (newMinute: number) => {
    setSelectedMinute(newMinute);
    const dayToUse = selectedDay ?? new Date().getDate();
    applyDateTime(viewYear, viewMonth, dayToUse, selectedHour, newMinute);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
    setViewMode("days");
    triggerRef.current?.focus();
  };

  const handleNow = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    const h = now.getHours();
    const minVal = now.getMinutes();

    setViewYear(y);
    setViewMonth(m);
    setSelectedDay(d);
    setSelectedHour(h);
    setSelectedMinute(minVal);
    applyDateTime(y, m, d, h, minVal);
    setIsOpen(false);
    setViewMode("days");
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setViewMode("days");
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id={inputId}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => (isOpen ? setIsOpen(false) : openPicker())}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "group flex h-11 w-full items-center justify-between gap-2 rounded-lg border bg-card px-3 text-start text-sm shadow-sm outline-none transition-[border-color,box-shadow]",
          "focus:border-ring focus:ring-2 focus:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60",
          hasError ? "border-danger focus:border-danger focus:ring-danger/25" : "border-input",
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <CalendarIcon
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground",
              isOpen && "text-primary",
            )}
            aria-hidden
          />
          <span
            className={cn(
              "truncate font-normal",
              formattedDisplay ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {formattedDisplay || placeholder || t("selectDateTime")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {value && !disabled ? (
            <span
              role="button"
              tabIndex={0}
              title={t("clear")}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  handleClear();
                }
              }}
              className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </span>
          ) : null}
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180 text-primary",
            )}
            aria-hidden
          />
        </div>
      </button>

      {/* Floating Popover via Portal */}
      {isOpen && isHydrated
        ? createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              top: `${popoverPosition.top}px`,
              left: `${popoverPosition.left}px`,
              width: `${POPOVER_WIDTH}px`,
            }}
            className="animate-in fade-in zoom-in-95 z-[100] rounded-xl border border-input bg-popover p-3.5 text-popover-foreground shadow-2xl outline-none backdrop-blur-sm"
          >
            {/* Header Navigation */}
            <div className="flex items-center justify-between gap-1 pb-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label={t("previousMonth")}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-input hover:bg-card hover:text-foreground active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>

              <div className="flex items-center gap-1">
                {viewMode === "days" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setViewMode("months")}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-95"
                    >
                      <span>{monthLongNames[viewMonth]}</span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden />
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewMode("years")}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-95"
                    >
                      <span>{viewYear}</span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden />
                    </button>
                  </>
                )}

                {viewMode === "months" && (
                  <button
                    type="button"
                    onClick={() => setViewMode("years")}
                    className="flex items-center gap-1 rounded-lg px-3 py-1 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-95"
                  >
                    <span>{viewYear}</span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden />
                  </button>
                )}

                {viewMode === "years" && (
                  <span className="px-2 py-1 text-sm font-semibold text-foreground">
                    {decadeStart} – {decadeStart + 11}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label={t("nextMonth")}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-input hover:bg-card hover:text-foreground active:scale-95"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {/* View Mode 1: Days Grid */}
            {viewMode === "days" && (
              <>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {weekdayNames.map((day, idx) => (
                    <span
                      key={idx}
                      className="h-7 flex items-center justify-center text-[11px] font-semibold tracking-wider text-muted-foreground uppercase"
                    >
                      {day}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 pt-1">
                  {calendarCells.map((cell) => {
                    const isSelected = cell.isSelected;
                    const isToday = cell.isToday;
                    const isDisabled = cell.isDisabled;

                    return (
                      <button
                        key={cell.isoDate}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleDayClick(cell)}
                        className={cn(
                          "flex h-8 w-full sm:h-9 items-center justify-center rounded-lg text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring/40",
                          cell.isCurrentMonth
                            ? "text-foreground font-normal"
                            : "text-muted-foreground/40 font-normal",
                          !isSelected && !isDisabled && "hover:bg-accent hover:text-accent-foreground",
                          isToday && !isSelected && "border border-primary/60 font-semibold text-primary",
                          isSelected &&
                          "bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary-hover",
                          isDisabled &&
                          "cursor-not-allowed opacity-25 hover:bg-transparent pointer-events-none",
                        )}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* View Mode 2: Month Grid */}
            {viewMode === "months" && (
              <div className="grid grid-cols-3 gap-2 py-2">
                {monthShortNames.map((name, index) => {
                  const isSelected = index === viewMonth;
                  const isCurrent =
                    index === new Date().getMonth() && viewYear === new Date().getFullYear();

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setViewMonth(index);
                        setViewMode("days");
                      }}
                      className={cn(
                        "flex h-11 items-center justify-center rounded-lg text-sm font-medium transition-all active:scale-95",
                        isSelected
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                          : isCurrent
                            ? "border border-primary/60 text-primary font-semibold hover:bg-accent"
                            : "text-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* View Mode 3: Year Grid */}
            {viewMode === "years" && (
              <div className="grid grid-cols-3 gap-2 py-2">
                {Array.from({ length: 12 }, (_, i) => decadeStart + i).map((year) => {
                  const isSelected = year === viewYear;
                  const isCurrent = year === new Date().getFullYear();

                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setViewYear(year);
                        setViewMode("months");
                      }}
                      className={cn(
                        "flex h-11 items-center justify-center rounded-lg text-sm font-medium transition-all active:scale-95",
                        isSelected
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                          : isCurrent
                            ? "border border-primary/60 text-primary font-semibold hover:bg-accent"
                            : "text-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Time Picker Controls */}
            {viewMode === "days" && (
              <div className="mt-3.5 border-t border-border pt-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    <span>{t("time")}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Hour */}
                    <select
                      value={selectedHour}
                      onChange={(e) => handleHourChange(Number(e.target.value))}
                      aria-label={t("hour")}
                      className="cursor-pointer rounded-lg border border-input bg-card px-2 py-1 text-xs font-semibold text-foreground shadow-xs outline-none focus:border-ring focus:ring-1 focus:ring-ring/30"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i} className="bg-popover text-popover-foreground">
                          {String(i).padStart(2, "0")}
                        </option>
                      ))}
                    </select>

                    <span className="font-bold text-muted-foreground">:</span>

                    {/* Minute */}
                    <select
                      value={selectedMinute}
                      onChange={(e) => handleMinuteChange(Number(e.target.value))}
                      aria-label={t("minute")}
                      className="cursor-pointer rounded-lg border border-input bg-card px-2 py-1 text-xs font-semibold text-foreground shadow-xs outline-none focus:border-ring focus:ring-1 focus:ring-ring/30"
                    >
                      {Array.from({ length: 12 }, (_, i) => i * 5).map((minVal) => (
                        <option key={minVal} value={minVal} className="bg-popover text-popover-foreground">
                          {String(minVal).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
              <button
                type="button"
                onClick={handleClear}
                className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {t("clear")}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleNow}
                  className="rounded-md px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary-soft hover:text-primary-soft-foreground"
                >
                  {t("now")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setViewMode("days");
                  }}
                  className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted/80"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
        : null}
    </div>
  );
};
