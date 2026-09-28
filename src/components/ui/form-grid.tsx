import type { IFormGridProps } from "@/types/ui";

// Shared modal form layout: 1 column on phones, 2 on small screens, 3 once the modal is wide
export const FormGrid = ({ children }: IFormGridProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
);
