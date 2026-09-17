"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { IConfirmDialogProps } from "@/types/modal";

export const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmLabel,
  isDestructive = false,
  isPending = false,
  onConfirm,
  onClose,
}: IConfirmDialogProps) => {
  const t = useTranslations("common");

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {t("cancel")}
          </Button>
          <Button
            variant={isDestructive ? "danger" : "primary"}
            onClick={onConfirm}
            isLoading={isPending}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">{description}</p>
    </Modal>
  );
};
