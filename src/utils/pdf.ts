import type jsPDF from "jspdf";
import { formatDate } from "@/utils/format";
import { PDF_COLORS } from "@/utils/pdf-theme";
import type { IPdfInfoField, IPdfPageContext } from "@/types/pdf";

export const PAGE_MARGIN = 12;

// PDFs stay English-only — jsPDF's built-in helvetica font has no Urdu glyphs
const PDF_LOCALE = "en";

export const buildPdfFileName = (title: string, tenantName: string): string => {
  const safeTitle = title.trim().replace(/\s+/g, "_") || "document";
  const safeName = tenantName.trim().replace(/\s+/g, "_") || "document";
  const datePart = formatDate(new Date(), PDF_LOCALE);
  return `${safeTitle}_${safeName}_${datePart}.pdf`;
};

export const buildDocumentNumber = (prefix: string, leaseId: string): string => {
  const shortId = leaseId.replace(/-/g, "").slice(-6).toUpperCase();
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  return `${prefix}-${yearMonth}-${shortId}`;
};

export const openPdfInNewTab = (doc: jsPDF, fileName: string): void => {
  doc.setProperties({ title: fileName.replace(/\.pdf$/, "") });
  const blob = doc.output("blob");
  const file = new File([blob], fileName, { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(file);
  window.open(blobUrl, "_blank", "noopener,noreferrer");
};

export const drawPdfHeader = (doc: jsPDF, title: string, documentNumber: string): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const topY = 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...PDF_COLORS.black);
  doc.text("RMS", PAGE_MARGIN, topY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.textMuted);
  doc.text("Rent Management System", PAGE_MARGIN, topY + 5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.black);
  doc.text(title.toUpperCase(), pageWidth - PAGE_MARGIN, topY, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.textMuted);
  doc.text(`No. ${documentNumber}`, pageWidth - PAGE_MARGIN, topY + 5, { align: "right" });
  doc.text(`Date: ${formatDate(new Date(), PDF_LOCALE)}`, pageWidth - PAGE_MARGIN, topY + 9.5, {
    align: "right",
  });

  doc.setDrawColor(...PDF_COLORS.black);
  doc.setLineWidth(0.5);
  doc.line(PAGE_MARGIN, topY + 12, pageWidth - PAGE_MARGIN, topY + 12);

  doc.setTextColor(...PDF_COLORS.text);
  return topY + 12;
};

export const trimTrailingWhitespace = (
  doc: jsPDF,
  contentBottomY: number,
  bottomMargin = PAGE_MARGIN,
): void => {
  const pageContext = doc.getPageInfo(doc.getNumberOfPages()).pageContext as IPdfPageContext;
  const { mediaBox } = pageContext;
  const scaleFactor = doc.internal.scaleFactor;
  const originalHeightMm = (mediaBox.topRightY - mediaBox.bottomLeftY) / scaleFactor;
  const fittedHeightMm = contentBottomY + bottomMargin;

  if (fittedHeightMm < originalHeightMm) {
    mediaBox.bottomLeftY = mediaBox.topRightY - fittedHeightMm * scaleFactor;
  }
};

export const drawInfoSection = (doc: jsPDF, startY: number, fields: IPdfInfoField[]): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const cardWidth = pageWidth - PAGE_MARGIN * 2;
  const rowHeight = 9;
  const rows = Math.ceil(fields.length / 2);

  fields.forEach((field, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = PAGE_MARGIN + column * (cardWidth / 2);
    const y = startY + 5 + row * rowHeight;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...PDF_COLORS.textMuted);
    doc.text(field.label.toUpperCase(), x, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...PDF_COLORS.black);
    doc.text(field.value, x, y + 4);
  });

  const sectionBottom = startY + rows * rowHeight + 2;
  doc.setDrawColor(...PDF_COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(PAGE_MARGIN, sectionBottom, pageWidth - PAGE_MARGIN, sectionBottom);

  doc.setTextColor(...PDF_COLORS.text);
  return sectionBottom + 4;
};

export const drawTotalBox = (doc: jsPDF, startY: number, label: string, value: string): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const boxWidth = 70;
  const boxHeight = 14;
  const boxX = pageWidth - PAGE_MARGIN - boxWidth;

  doc.setDrawColor(...PDF_COLORS.black);
  doc.setLineWidth(0.4);
  doc.rect(boxX, startY, boxWidth, boxHeight);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.black);
  doc.text(label.toUpperCase(), boxX + 5, startY + 9);

  doc.setFontSize(13);
  doc.text(value, boxX + boxWidth - 5, startY + 9.5, { align: "right" });

  doc.setTextColor(...PDF_COLORS.text);
  return startY + boxHeight;
};
