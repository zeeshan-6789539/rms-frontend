export const siteConfig = {
  name: "RMS",
  description: "Rent Management System",
  poweredBy: "Powered by MIFA Alliance",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1",
  apiTimeoutMs: 15_000,
} as const;
