// Amounts render as plain grouped numbers, with no currency code or symbol
export const formatCurrency = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value);

// Short form ("40K") for tight spaces like chart axis ticks
export const formatCompactCurrency = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export const formatNumber = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale).format(value);

export const formatTime = (value: string | number | Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export const formatDate = (value: string | number | Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export const formatDateTime = (
  value: string | number | Date,
  locale: string,
): string =>
  new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

/** Returns today's date as an ISO date string (YYYY-MM-DD) in local time. */
export const getTodayIsoDate = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
