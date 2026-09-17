import type { IPaginationMeta } from "@/types/api";

export interface IPaginationProps {
  meta: IPaginationMeta;
  onPageChange: (page: number) => void;
}
