"use client";

import { useEffect, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { updateLeaseRentSchema } from "@/features/leases/schemas/lease-schema";
import { useLeaseRent } from "@/features/leases/hooks/use-lease-rent";
import { useFormState } from "@/hooks/use-form-state";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/utils/api";
import { emptyToUndefined } from "@/utils/string";
import { toTranslatedFieldErrors } from "@/utils/zod";
import type { IUpdateLeaseRentFormValues } from "@/types/lease";
import type { IUpdateLeaseRentDialogProps } from "@/features/leases/types/lease-components";

const EMPTY_VALUES: IUpdateLeaseRentFormValues = {
  rentAmount: "",
  effectiveFrom: "",
  notes: "",
};

export const UpdateLeaseRentDialog = ({
  isOpen,
  lease,
  onClose,
}: IUpdateLeaseRentDialogProps) => {
  const t = useTranslations("leases");
  const tCommon = useTranslations("common");
  const { showToast } = useToast();
  const { values, errors, setValue, setErrors, reset } = useFormState(EMPTY_VALUES);
  const { mutate, isPending, error, reset: resetMutation } = useLeaseRent();

  useEffect(() => {
    if (!isOpen) return;

    reset(EMPTY_VALUES);
    resetMutation();
  }, [isOpen, reset, resetMutation]);

  if (!lease) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = updateLeaseRentSchema.safeParse({
      rentAmount: values.rentAmount,
      effectiveFrom: values.effectiveFrom,
      notes: emptyToUndefined(values.notes),
    });

    if (!parsed.success) {
      setErrors(
        toTranslatedFieldErrors<IUpdateLeaseRentFormValues>(parsed.error, (key) =>
          t(`errors.${key}`),
        ),
      );
      return;
    }

    mutate(
      { id: lease.id, payload: parsed.data },
      {
        onSuccess: () => {
          showToast(t("rentUpdated", { property: lease.propertyName }));
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      title={t("changeRentTitle")}
      description={t("changeRentSubtitle", { property: lease.propertyName })}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit" form="lease-rent-form" isLoading={isPending}>
            {tCommon("save")}
          </Button>
        </>
      }
    >
      <form id="lease-rent-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {error ? <Alert>{getApiErrorMessage(error, tCommon("error"))}</Alert> : null}

        <FormField id="rentAmount" label={t("fields.newRentAmount")} error={errors.rentAmount}>
          <Input
            id="rentAmount"
            inputMode="decimal"
            value={values.rentAmount}
            onChange={(event) => setValue("rentAmount", event.target.value)}
            hasError={Boolean(errors.rentAmount)}
            disabled={isPending}
            placeholder="55000.00"
            autoFocus
          />
        </FormField>

        <FormField
          id="effectiveFrom"
          label={t("fields.effectiveFrom")}
          error={errors.effectiveFrom}
        >
          <DatePicker
            id="effectiveFrom"
            value={values.effectiveFrom}
            onChange={(date) => setValue("effectiveFrom", date)}
            hasError={Boolean(errors.effectiveFrom)}
            disabled={isPending}
          />
        </FormField>

        <FormField id="notes" label={t("fields.notes")} error={errors.notes}>
          <Textarea
            id="notes"
            value={values.notes}
            onChange={(event) => setValue("notes", event.target.value)}
            hasError={Boolean(errors.notes)}
            disabled={isPending}
          />
        </FormField>
      </form>
    </Modal>
  );
};
