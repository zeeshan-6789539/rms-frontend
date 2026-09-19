export const formatCurrency = (
  value: number,
  locale: string,
  currency = "PKR",
): string =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

// Short form ("PKR 40K") for tight spaces like chart axis ticks
export const formatCompactCurrency = (
  value: number,
  locale: string,
  currency = "PKR",
): string =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
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
