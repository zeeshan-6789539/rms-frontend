import type { ICategoryTree, ISubcategoryTree } from "@/types/category";

export interface IInlineEditableNameProps {
  name: string;
  productCount: number;
  disabled: boolean;
  onSave: (name: string) => void;
  titleClassName?: string;
}

export interface ICategoryCardProps {
  category: ICategoryTree;
  isSaving: boolean;
  onRenameCategory: (category: ICategoryTree, name: string) => void;
  onAddSubcategory: (category: ICategoryTree, name: string) => void;
  onRenameSubcategory: (subcategory: ISubcategoryTree, name: string) => void;
}
