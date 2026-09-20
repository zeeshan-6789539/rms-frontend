import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatDate } from "@/utils/format";
import { buildDocumentNumber, drawInfoSection, drawPdfHeader, PAGE_MARGIN, trimTrailingWhitespace } from "@/utils/pdf";
import { ENTRY_TYPE_PDF_LABELS, PAYMENT_METHOD_PDF_LABELS } from "@/utils/pdf-labels";
import { PDF_COLORS } from "@/utils/pdf-theme";
import type { ILease } from "@/types/lease";
import type { ILedgerEntry } from "@/types/ledger";
import type { IPayment } from "@/types/payment";

const PDF_LOCALE = "en";

export const generateLedgerPdf = (
  lease: ILease,
  entries: ILedgerEntry[],
  paymentByPaymentId: Map<string, IPayment>,
  periodLabel: string,
  searchQuery: string,
): jsPDF => {
  const doc = new jsPDF();
  const headerBottomY = drawPdfHeader(doc, "Ledger statement", buildDocumentNumber("LDG", lease.id));

  const sectionBottomY = drawInfoSection(doc, headerBottomY, [
    { label: "Tenant", value: lease.tenantName },
    { label: "Property", value: lease.propertyName },
    { label: "Period", value: periodLabel },
    { label: "Filter", value: searchQuery ? `Search: "${searchQuery}"` : "None" },
  ]);

  let tableBottomY = sectionBottomY;

  autoTable(doc, {
    startY: sectionBottomY,
    head: [["Type", "Date", "Details", "Amount", "Balance"]],
    body:
      entries.length === 0
        ? [["No ledger entries found.", "", "", "", ""]]
        : entries.map((entry) => {
            const linkedPayment = entry.paymentId ? paymentByPaymentId.get(entry.paymentId) : undefined;
            const amountLabel = `${entry.transactionType === "credit" ? "-" : ""}${formatCurrency(Number(entry.amount), PDF_LOCALE)}`;
            const details = linkedPayment
              ? `${PAYMENT_METHOD_PDF_LABELS[linkedPayment.paymentMethod]}${
                  linkedPayment.receiptNumber ? ` · Receipt ${linkedPayment.receiptNumber}` : ""
                }`
              : entry.description ?? "—";
            return [
              ENTRY_TYPE_PDF_LABELS[entry.entryType],
              entry.dueDate ? formatDate(entry.dueDate, PDF_LOCALE) : "—",
              details,
              amountLabel,
              entry.runningBalance != null ? formatCurrency(Number(entry.runningBalance), PDF_LOCALE) : "—",
            ];
          }),
    theme: "grid",
    margin: { top: PAGE_MARGIN, right: PAGE_MARGIN, bottom: PAGE_MARGIN, left: PAGE_MARGIN },
    styles: {
      font: "helvetica",
      fontSize: 9,
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
    columnStyles: { 3: { halign: "right" }, 4: { halign: "right" } },
    didParseCell: (data) => {
      if (data.section !== "body") return;
      const entry = entries[data.row.index];
      if (entry?.entryType === "payment_received") {
        data.cell.styles.fillColor = PDF_COLORS.paymentHighlight;
      }
      if (entry?.status === false) {
        data.cell.styles.textColor = PDF_COLORS.textMuted;
      }
    },
    didDrawCell: (data) => {
      if (data.section !== "body") return;
      if (entries[data.row.index]?.status !== false) return;
      const lineY = data.cell.y + data.cell.height / 2;
      doc.setDrawColor(...PDF_COLORS.textMuted);
      doc.setLineWidth(0.3);
      doc.line(data.cell.x + 1, lineY, data.cell.x + data.cell.width - 1, lineY);
    },
    didDrawPage: (data) => {
      if (data.cursor) tableBottomY = data.cursor.y;
    },
  });

  trimTrailingWhitespace(doc, tableBottomY);

  return doc;
};
