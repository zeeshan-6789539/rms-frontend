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
  Check,
  X,
} from "lucide-react";
import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { cn } from "@/utils/cn";
import { getTodayIsoDate } from "@/utils/format";
import type { IDateTimePickerProps } from "@/types/ui";

type TCalendarViewMode = "days" | "months" | "years";
type TTimeDropdown = "hour" | "minute" | "period" | null;

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

// Helper: Convert 24h to 12h + AM/PM
const to12HourFormat = (hour24: number): { hour12: number; period: "AM" | "PM" } => {
  const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12, period };
};

// Helper: Convert 12h + AM/PM to 24h
const to24HourFormat = (hour12: number, period: "AM" | "PM") => {
  if (period === "AM") {
    return hour12 === 12 ? 0 : hour12;
  }
  return hour12 === 12 ? 12 : hour12 + 12;
};

const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS_SHORT_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const POPOVER_WIDTH = 480;
const POPOVER_HEIGHT = 380;

interface ITimeDropdownOption {
  value: string | number;
  label: string;
}

interface ITimeDropdownProps {
  label: string;
  value: string | number;
  options: ITimeDropdownOption[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string | number) => void;
}

const TimeDropdown = ({ label, value, options, isOpen, onToggle, onSelect }: ITimeDropdownProps) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const activeItem = listRef.current.querySelector('[data-active="true"]');
    activeItem?.scrollIntoView({ block: "center" });
  }, [isOpen]);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  return (
    <div className="relative flex flex-col gap-1">
      <label className="text-[11px] font-medium text-muted-foreground">{label}</label>
      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between rounded-lg border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs outline-none transition-all hover:border-primary/50 focus:border-ring focus:ring-2 focus:ring-ring/20",
          isOpen ? "border-primary ring-2 ring-ring/20" : "border-input",
        )}
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform duration-150",
            isOpen && "rotate-180 text-primary",
          )}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div
          ref={listRef}
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-full z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-input bg-popover p-1 shadow-lg animate-in fade-in zoom-in-95"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                data-active={isSelected}
                onClick={() => onSelect(option.value)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <span>{option.label}</span>
                {isSelected ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

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
  
  // 12-Hour state derived from 24-hour hour
  const { hour12: initHour12, period: initPeriod } = useMemo(
    () => to12HourFormat(initialDate.hour),
    [initialDate.hour]
  );
  
  const [selectedHour12, setSelectedHour12] = useState<number>(initHour12);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(initPeriod);
  const [selectedMinute, setSelectedMinute] = useState<number>(initialDate.minute);
  const [openTimeDropdown, setOpenTimeDropdown] = useState<TTimeDropdown>(null);

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
      const { hour12, period } = to12HourFormat(parsedValue.hour);
      setSelectedHour12(hour12);
      setSelectedPeriod(period);
      setSelectedMinute(parsedValue.minute);
    } else {
      const now = new Date();
      setViewYear(now.getFullYear());
      setViewMonth(now.getMonth());
      setSelectedDay(null);
      const { hour12, period } = to12HourFormat(now.getHours());
      setSelectedHour12(hour12);
      setSelectedPeriod(period);
      setSelectedMinute(Math.floor(now.getMinutes() / 5) * 5);
    }
    setViewMode("days");
    setOpenTimeDropdown(null);
    updatePosition();
    setIsOpen(true);
  };

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
        setOpenTimeDropdown(null);
      } else if (!(target as HTMLElement).closest('[role="listbox"], [aria-haspopup="listbox"]')) {
        setOpenTimeDropdown(null);
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        if (openTimeDropdown) {
          setOpenTimeDropdown(null);
          return;
        }
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
  }, [isOpen, updatePosition, openTimeDropdown]);

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
        hour12: true,
      }).format(dateObj);
    } catch {
      return value;
    }
  }, [parsedValue, locale, value]);

  const monthLongNames = useMemo(() => {
    try {
      const formatter = new Intl.DateTimeFormat(locale, { month: "long" });
      return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2026, i, 1)));
    } catch {
      return MONTH_NAMES_EN;
    }
  }, [locale]);

  const monthShortNames = useMemo(() => {
    try {
      const formatter = new Intl.DateTimeFormat(locale, { month: "short" });
      return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2026, i, 1)));
    } catch {
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }
  }, [locale]);

  const weekdayNames = useMemo(() => {
    try {
      const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
      return Array.from({ length: 7 }, (_, i) => formatter.format(new Date(2026, 8, 20 + i)));
    } catch {
      return WEEKDAYS_SHORT_EN;
    }
  }, [locale]);

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
    hour12: number,
    minute: number,
    period: "AM" | "PM",
  ) => {
    const hour24 = to24HourFormat(hour12, period);
    const isoDateTime = toIsoDateTimeString(year, month, day, hour24, minute);
    onChange(isoDateTime);
  };

  const handleDayClick = (cell: { year: number; month: number; day: number }) => {
    setViewYear(cell.year);
    setViewMonth(cell.month);
    setSelectedDay(cell.day);
    applyDateTime(cell.year, cell.month, cell.day, selectedHour12, selectedMinute, selectedPeriod);
  };

  const handleHourChange = (newHour12: number) => {
    setSelectedHour12(newHour12);
    const dayToUse = selectedDay ?? new Date().getDate();
    applyDateTime(viewYear, viewMonth, dayToUse, newHour12, selectedMinute, selectedPeriod);
  };

  const handleMinuteChange = (newMinute: number) => {
    setSelectedMinute(newMinute);
    const dayToUse = selectedDay ?? new Date().getDate();
    applyDateTime(viewYear, viewMonth, dayToUse, selectedHour12, newMinute, selectedPeriod);
  };

  const handlePeriodChange = (newPeriod: "AM" | "PM") => {
    setSelectedPeriod(newPeriod);
    const dayToUse = selectedDay ?? new Date().getDate();
    applyDateTime(viewYear, viewMonth, dayToUse, selectedHour12, selectedMinute, newPeriod);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
    setViewMode("days");
    setOpenTimeDropdown(null);
    triggerRef.current?.focus();
  };

  const handleNow = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    const minVal = now.getMinutes();
    const { hour12, period } = to12HourFormat(now.getHours());

    setViewYear(y);
    setViewMonth(m);
    setSelectedDay(d);
    setSelectedHour12(hour12);
    setSelectedMinute(minVal);
    setSelectedPeriod(period);

    applyDateTime(y, m, d, hour12, minVal, period);
    setIsOpen(false);
    setViewMode("days");
    setOpenTimeDropdown(null);
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
    <div className="relative w-full">
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
              className="animate-in fade-in zoom-in-95 z-[100] rounded-xl border border-input bg-popover p-4 text-popover-foreground shadow-2xl outline-none backdrop-blur-sm"
            >
              {/* Flex Container for Side-by-Side View */}
              <div className="flex flex-row gap-4">
                {/* Left Side: Calendar View */}
                <div className="flex-1 min-w-0">
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
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-95"
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
                                "flex h-8 w-full items-center justify-center rounded-lg text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring/40",
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
                </div>

                {/* Vertical Divider */}
                <div className="w-[1px] bg-border shrink-0 my-1" />

                {/* Right Side: Time Selection Section */}
                <div className="w-36 flex flex-col justify-between py-1 shrink-0">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground pb-3">
                      <Clock className="h-3.5 w-3.5 text-primary" aria-hidden />
                      <span>{t("time")}</span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {/* Hours Dropdown */}
                      <TimeDropdown
                        label={t("hour")}
                        value={selectedHour12}
                        isOpen={openTimeDropdown === "hour"}
                        onToggle={() =>
                          setOpenTimeDropdown((prev) => (prev === "hour" ? null : "hour"))
                        }
                        onSelect={(val) => {
                          handleHourChange(Number(val));
                          setOpenTimeDropdown(null);
                        }}
                        options={Array.from({ length: 12 }, (_, i) => i + 1).map((h) => ({
                          value: h,
                          label: String(h).padStart(2, "0"),
                        }))}
                      />

                      {/* Minutes Dropdown */}
                      <TimeDropdown
                        label={t("minute")}
                        value={selectedMinute}
                        isOpen={openTimeDropdown === "minute"}
                        onToggle={() =>
                          setOpenTimeDropdown((prev) => (prev === "minute" ? null : "minute"))
                        }
                        onSelect={(val) => {
                          handleMinuteChange(Number(val));
                          setOpenTimeDropdown(null);
                        }}
                        options={Array.from({ length: 12 }, (_, i) => i * 5).map((minVal) => ({
                          value: minVal,
                          label: String(minVal).padStart(2, "0"),
                        }))}
                      />

                      {/* AM / PM Dropdown */}
                      <TimeDropdown
                        label="Period"
                        value={selectedPeriod}
                        isOpen={openTimeDropdown === "period"}
                        onToggle={() =>
                          setOpenTimeDropdown((prev) => (prev === "period" ? null : "period"))
                        }
                        onSelect={(val) => {
                          handlePeriodChange(val as "AM" | "PM");
                          setOpenTimeDropdown(null);
                        }}
                        options={[
                          { value: "AM", label: "AM" },
                          { value: "PM", label: "PM" },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
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
                      setOpenTimeDropdown(null);
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