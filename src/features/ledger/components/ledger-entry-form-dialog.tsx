"use client";

import { useEffect, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLeaseOptions } from "@/features/leases/hooks/use-lease-options";
import { ledgerEntrySchema } from "@/features/ledger/schemas/ledger-schema";
import { useCreateLedgerEntry } from "@/features/ledger/hooks/use-create-ledger-entry";
import { useFormState } from "@/hooks/use-form-state";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/utils/api";
import { emptyToUndefined } from "@/utils/string";
import { toTranslatedFieldErrors } from "@/utils/zod";
import type { ILedgerFormValues, TPostableChargeType } from "@/types/ledger";
import type { ILedgerEntryFormDialogProps } from "@/features/ledger/types/ledger-components";

const ENTRY_TYPES: TPostableChargeType[] = [
  "electricity_bill",
  "water_bill",
  "maintenance_charge",
  "other_charge",
  "advance_payment",
  "discount_adjustment",
  "advance_refund",
];

const EMPTY_VALUES: ILedgerFormValues = {
  leaseId: "",
  entryType: "other_charge",
  amount: "",
  dueDate: "",
  description: "",
};

export const LedgerEntryFormDialog = ({
  isOpen,
  onClose,
  defaultLeaseId,
  defaultLeaseLabel,
}: ILedgerEntryFormDialogProps) => {
  const t = useTranslations("ledger");
  const tEntryType = useTranslations("ledger.entryTypes");
  const tCommon = useTranslations("common");
  const { showToast } = useToast();
  const { values, errors, setValue, setErrors, reset } = useFormState(EMPTY_VALUES);
  const { mutate, isPending, error, reset: resetMutation } = useCreateLedgerEntry();
  const { options: leaseOptions, isPending: isLeasesPending } = useLeaseOptions(
    isOpen && !defaultLeaseId,
  );

  useEffect(() => {
    if (!isOpen) return;

    reset({ ...EMPTY_VALUES, leaseId: defaultLeaseId ?? "" });
    resetMutation();
  }, [isOpen, defaultLeaseId, reset, resetMutation]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = ledgerEntrySchema.safeParse({
      leaseId: values.leaseId,
      entryType: values.entryType,
      amount: values.amount,
      dueDate: emptyToUndefined(values.dueDate),
      description: emptyToUndefined(values.description),
    });

    if (!parsed.success) {
      setErrors(
        toTranslatedFieldErrors<ILedgerFormValues>(parsed.error, (key) => t(`errors.${key}`)),
      );
      return;
    }

    mutate(parsed.data, {
      onSuccess: () => {
        showToast(t("created"));
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title={t("createTitle")}
      description={t("createSubtitle")}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit" form="ledger-entry-form" isLoading={isPending}>
            {tCommon("save")}
          </Button>
        </>
      }
    >
      <form id="ledger-entry-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {error ? <Alert>{getApiErrorMessage(error, tCommon("error"))}</Alert> : null}

        <FormField id="leaseId" label={t("fields.lease")} error={errors.leaseId}>
          {defaultLeaseId ? (
            <Input id="leaseId" value={defaultLeaseLabel ?? ""} disabled readOnly />
          ) : (
            <Select
              id="leaseId"
              value={values.leaseId}
              onChange={(value) => setValue("leaseId", value)}
              options={[{ value: "", label: t("selectLease") }, ...leaseOptions]}
              hasError={Boolean(errors.leaseId)}
              disabled={isPending || isLeasesPending}
            />
          )}
        </FormField>

        <FormField id="entryType" label={t("fields.entryType")}>
          <Select
            id="entryType"
            value={values.entryType}
            onChange={(value) => setValue("entryType", value as TPostableChargeType)}
            options={ENTRY_TYPES.map((value) => ({ value, label: tEntryType(value) }))}
            disabled={isPending}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="amount" label={t("fields.amount")} error={errors.amount}>
            <Input
              id="amount"
              inputMode="decimal"
              value={values.amount}
              onChange={(event) => setValue("amount", event.target.value)}
              hasError={Boolean(errors.amount)}
              disabled={isPending}
              placeholder="2500.00"
            />
          </FormField>

          <FormField id="dueDate" label={t("fields.dueDate")} error={errors.dueDate}>
            <DatePicker
              id="dueDate"
              value={values.dueDate}
              onChange={(date) => setValue("dueDate", date)}
              hasError={Boolean(errors.dueDate)}
              disabled={isPending}
            />
          </FormField>
        </div>

        <FormField id="description" label={t("fields.description")} error={errors.description}>
          <Textarea
            id="description"
            value={values.description}
            onChange={(event) => setValue("description", event.target.value)}
            hasError={Boolean(errors.description)}
            disabled={isPending}
          />
        </FormField>
      </form>
    </Modal>
  );
};
