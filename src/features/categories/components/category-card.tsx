"use client";

import { useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { Check, Pencil, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type {
  ICategoryCardProps,
  IInlineEditableNameProps,
} from "@/features/categories/types/category-components";

// Shared by the category title and every subcategory pill below it
const InlineEditableName = ({
  name,
  productCount,
  disabled,
  onSave,
  titleClassName,
}: IInlineEditableNameProps) => {
  const t = useTranslations("categories");
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  const startEditing = () => {
    setDraft(name);
    setIsEditing(true);
  };

  const commit = () => {
    setIsEditing(false);
    if (draft.trim() && draft.trim() !== name) onSave(draft.trim());
  };

  const cancel = () => {
    setDraft(name);
    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") commit();
    if (event.key === "Escape") cancel();
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="h-8 text-sm"
        />
        <Button variant="ghost" size="icon" onClick={commit} aria-label={t("save")}>
          <Check className="h-4 w-4 text-success" aria-hidden />
        </Button>
        <Button variant="ghost" size="icon" onClick={cancel} aria-label={t("cancelEdit")}>
          <X className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-1.5">
      <span className={titleClassName}>{name}</span>
      <Badge variant="muted">{t("productCount", { count: productCount })}</Badge>
      <Button
        variant="ghost"
        size="icon"
        onClick={startEditing}
        disabled={disabled}
        aria-label={t("rename")}
        className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden />
      </Button>
    </div>
  );
};

export const CategoryCard = ({
  category,
  isSaving,
  onRenameCategory,
  onAddSubcategory,
  onRenameSubcategory,
}: ICategoryCardProps) => {
  const t = useTranslations("categories");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");

  const handleAddSubcategory = () => {
    const trimmed = newSubcategoryName.trim();
    if (!trimmed) return;

    onAddSubcategory(category, trimmed);
    setNewSubcategoryName("");
  };

  return (
    <Card className="space-y-3">
      <InlineEditableName
        name={category.name}
        productCount={category.productCount}
        disabled={isSaving}
        onSave={(name) => onRenameCategory(category, name)}
        titleClassName="font-semibold tracking-tight"
      />

      <div className="flex flex-wrap gap-2">
        {category.subcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            className="rounded-full border border-border bg-muted/40 px-3 py-1"
          >
            <InlineEditableName
              name={subcategory.name}
              productCount={subcategory.productCount}
              disabled={isSaving}
              onSave={(name) => onRenameSubcategory(subcategory, name)}
              titleClassName="text-sm"
            />
          </div>
        ))}

        {category.subcategories.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noSubcategories")}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-3">
        <Input
          value={newSubcategoryName}
          onChange={(event) => setNewSubcategoryName(event.target.value)}
          placeholder={t("newSubcategoryPlaceholder")}
          className="h-9 flex-1 text-sm"
          disabled={isSaving}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleAddSubcategory();
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddSubcategory}
          disabled={isSaving || !newSubcategoryName.trim()}
        >
          <Plus className="h-4 w-4" aria-hidden />
          {t("addSubcategory")}
        </Button>
      </div>
    </Card>
  );
};
