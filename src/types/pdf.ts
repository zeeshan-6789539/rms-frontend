export interface IPdfInfoField {
  label: string;
  value: string;
}

export interface IPdfMediaBox {
  bottomLeftX: number;
  bottomLeftY: number;
  topRightX: number;
  topRightY: number;
}

export interface IPdfPageContext {
  mediaBox: IPdfMediaBox;
}
