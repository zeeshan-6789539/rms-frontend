"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { useLeaseStatus } from "@/features/leases/hooks/use-lease-status";
import { useFormState } from "@/hooks/use-form-state";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/utils/api";
import type { TLeaseStatus } from "@/types/lease";
import type { ILeaseStatusDialogProps } from "@/features/leases/types/lease-components";

const STATUSES: TLeaseStatus[] = ["active", "terminated", "expired"];

interface ILeaseStatusFormValues {
  status: TLeaseStatus;
}

export const LeaseStatusDialog = ({ isOpen, lease, onClose }: ILeaseStatusDialogProps) => {
  const t = useTranslations("leases");
  const tStatus = useTranslations("leases.status");
  const tCommon = useTranslations("common");
  const { showToast } = useToast();
  const { values, setValue, reset } = useFormState<ILeaseStatusFormValues>({
    status: lease?.status ?? "active",
  });
  const { mutate, isPending, error, reset: resetMutation } = useLeaseStatus();

  useEffect(() => {
    if (!isOpen) return;

    reset({ status: lease?.status ?? "active" });
    resetMutation();
  }, [isOpen, lease, reset, resetMutation]);

  if (!lease) return null;

  const handleConfirm = () => {
    mutate(
      { id: lease.id, status: values.status },
      {
        onSuccess: () => {
          showToast(t("statusUpdated", { property: lease.propertyName }));
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      title={t("changeStatusTitle")}
      description={t("changeStatusSubtitle", { property: lease.propertyName })}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button onClick={handleConfirm} isLoading={isPending}>
            {tCommon("save")}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error ? <Alert>{getApiErrorMessage(error, tCommon("error"))}</Alert> : null}

        <FormField id="leaseStatus" label={t("fields.status")}>
          <Select
            id="leaseStatus"
            value={values.status}
            onChange={(value) => setValue("status", value as TLeaseStatus)}
            options={STATUSES.map((value) => ({ value, label: tStatus(value) }))}
            disabled={isPending}
          />
        </FormField>
      </div>
    </Modal>
  );
};
