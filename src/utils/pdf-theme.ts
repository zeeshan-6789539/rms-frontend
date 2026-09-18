type TRgb = [number, number, number];

export const PDF_COLORS: Record<
  "black" | "text" | "textMuted" | "border" | "rowStripe" | "white" | "paymentHighlight",
  TRgb
> = {
  black: [0, 0, 0],
  text: [20, 20, 20],
  textMuted: [110, 110, 110],
  border: [180, 180, 180],
  rowStripe: [245, 245, 245],
  white: [255, 255, 255],
  paymentHighlight: [225, 225, 225],
};
