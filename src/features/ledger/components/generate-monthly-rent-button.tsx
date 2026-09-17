"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useGenerateMonthlyRent } from "@/features/ledger/hooks/use-generate-monthly-rent";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/utils/api";

export const GenerateMonthlyRentButton = () => {
  const t = useTranslations("ledger");
  const tCommon = useTranslations("common");
  const { showToast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { mutate, isPending } = useGenerateMonthlyRent();

  const handleConfirm = () => {
    mutate(undefined, {
      onSuccess: (result) => {
        showToast(
          t("generateMonthlyRentResult", {
            generated: result.generated.length,
            skipped: result.skipped.length,
          }),
        );
        setIsConfirmOpen(false);
      },
      onError: (error) => {
        showToast(getApiErrorMessage(error, tCommon("error")), "danger");
        setIsConfirmOpen(false);
      },
    });
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setIsConfirmOpen(true)}>
        <RefreshCw className="h-4 w-4" aria-hidden />
        {t("generateMonthlyRent")}
      </Button>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title={t("generateMonthlyRentTitle")}
        description={t("generateMonthlyRentConfirm")}
        confirmLabel={t("generateMonthlyRent")}
        isPending={isPending}
        onConfirm={handleConfirm}
        onClose={() => setIsConfirmOpen(false)}
      />
    </>
  );
};
