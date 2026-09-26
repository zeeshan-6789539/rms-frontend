import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatDate } from "@/utils/format";
import { getPeriodRange } from "@/utils/period";
import {
  buildDocumentNumber,
  drawInfoSection,
  drawPdfHeader,
  drawPoweredByFooter,
  drawTotalBox,
  PAGE_MARGIN,
  trimTrailingWhitespace,
} from "@/utils/pdf";
import { ENTRY_TYPE_PDF_LABELS } from "@/utils/pdf-labels";
import { PDF_COLORS } from "@/utils/pdf-theme";
import type { ILease } from "@/types/lease";
import type { ILedgerEntry } from "@/types/ledger";

const PDF_LOCALE = "en";

export const generateInvoicePdf = (
  lease: ILease,
  entries: ILedgerEntry[],
  companyName: string | null | undefined,
): jsPDF => {
  const periodRange = getPeriodRange("current_month");
  const entriesThisMonth = entries.filter((entry) => {
    if (!entry.status) return false;
    if (!periodRange) return true;
    const entryDate = new Date(entry.dueDate ?? entry.createdAt);
    return entryDate >= periodRange.start && entryDate < periodRange.end;
  });
  const chargesThisMonth = entriesThisMonth.filter((entry) => entry.entryType !== "payment_received");
  const paymentsThisMonth = entriesThisMonth.filter((entry) => entry.entryType === "payment_received");
  const chargesTotal = chargesThisMonth.reduce((sum, entry) => sum + Number(entry.amount), 0);
  const paymentsTotal = paymentsThisMonth.reduce((sum, entry) => sum + Number(entry.amount), 0);
  const getEntryTime = (entry: ILedgerEntry) => new Date(entry.dueDate ?? entry.createdAt).getTime();
  const totalDue = chargesTotal - paymentsTotal;
  const invoiceMonthLabel = new Date().toLocaleDateString(PDF_LOCALE, {
    month: "long",
    year: "numeric",
  });

  const doc = new jsPDF();
  const headerBottomY = drawPdfHeader(
    doc,
    companyName,
    "Invoice",
    buildDocumentNumber("INV", lease.id),
    [lease.tenantName, lease.propertyName],
  );

  const sectionBottomY = drawInfoSection(doc, headerBottomY, [
    { label: "Billing period", value: invoiceMonthLabel },
    {
      label: "Lease term",
      value: `${formatDate(lease.startDate, PDF_LOCALE)} - ${formatDate(lease.endDate, PDF_LOCALE)}`,
    },
  ]);

  let tableBottomY = sectionBottomY;
  const combinedEntries = [...chargesThisMonth, ...paymentsThisMonth].sort(
    (a, b) => getEntryTime(a) - getEntryTime(b),
  );

  autoTable(doc, {
    startY: sectionBottomY,
    head: [["Description", "Due date", "Amount"]],
    body:
      entriesThisMonth.length === 0
        ? [[`No charges for ${invoiceMonthLabel}.`, "", ""]]
        : combinedEntries.map((entry) => {
            const isPayment = entry.entryType === "payment_received";
            const label = ENTRY_TYPE_PDF_LABELS[entry.entryType];
            return [
              entry.description ? `${label} — ${entry.description}` : label,
              formatDate(entry.dueDate ?? entry.createdAt, PDF_LOCALE),
              `${isPayment ? "-" : ""}${formatCurrency(Number(entry.amount), PDF_LOCALE)}`,
            ];
          }),
    theme: "grid",
    margin: { top: PAGE_MARGIN, right: PAGE_MARGIN, bottom: PAGE_MARGIN, left: PAGE_MARGIN },
    styles: {
      font: "helvetica",
      fontSize: 10,
      textColor: PDF_COLORS.text,
      lineColor: PDF_COLORS.border,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: PDF_COLORS.white,
      textColor: PDF_COLORS.black,
      fontStyle: "bold",
      lineColor: PDF_COLORS.black,
      lineWidth: { bottom: 0.5, top: 0, left: 0, right: 0 },
    },
    alternateRowStyles: { fillColor: PDF_COLORS.rowStripe },
    columnStyles: { 2: { halign: "right" } },
    didParseCell: (data) => {
      if (data.section === "body" && combinedEntries[data.row.index]?.entryType === "payment_received") {
        data.cell.styles.fillColor = PDF_COLORS.paymentHighlight;
      }
    },
    didDrawPage: (data) => {
      if (data.cursor) tableBottomY = data.cursor.y;
    },
  });

  const totalBoxBottomY = drawTotalBox(doc, tableBottomY + 4, "Total due", formatCurrency(totalDue, PDF_LOCALE));

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.textMuted);
  const noteY = totalBoxBottomY + 6;
  doc.text(
    `Lease outstanding balance: ${formatCurrency(Number(lease.outstandingBalance), PDF_LOCALE)}`,
    PAGE_MARGIN,
    noteY,
  );

  trimTrailingWhitespace(doc, drawPoweredByFooter(doc, noteY));

  return doc;
};
