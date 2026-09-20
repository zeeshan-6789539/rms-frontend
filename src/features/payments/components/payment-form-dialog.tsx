"use client";

import { useEffect, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLeaseOptions } from "@/features/leases/hooks/use-lease-options";
import { paymentSchema } from "@/features/payments/schemas/payment-schema";
import { useCreatePayment } from "@/features/payments/hooks/use-create-payment";
import { useFormState } from "@/hooks/use-form-state";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/utils/api";
import { getTodayIsoDate } from "@/utils/format";
import { emptyToUndefined } from "@/utils/string";
import { toTranslatedFieldErrors } from "@/utils/zod";
import type { IPaymentFormValues, TPaymentMethod } from "@/types/payment";
import type { IPaymentFormDialogProps } from "@/features/payments/types/payment-components";

const EMPTY_VALUES: IPaymentFormValues = {
  leaseId: "",
  amountPaid: "",
  paymentDate: "",
  paymentMethod: "cash",
  receiptNumber: "",
  referenceNumber: "",
  bankName: "",
  chequeClearanceDate: "",
  notes: "",
};

const METHODS: TPaymentMethod[] = ["cash", "bank_transfer", "cheque", "online"];

export const PaymentFormDialog = ({
  isOpen,
  onClose,
  defaultLeaseId,
  defaultLeaseLabel,
}: IPaymentFormDialogProps) => {
  const t = useTranslations("payments");
  const tMethod = useTranslations("payments.methods");
  const tCommon = useTranslations("common");
  const { showToast } = useToast();
  const { values, errors, setValue, setErrors, reset } = useFormState(EMPTY_VALUES);
  const { mutate, isPending, error, reset: resetMutation } = useCreatePayment();
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

    const parsed = paymentSchema.safeParse({
      leaseId: values.leaseId,
      amountPaid: values.amountPaid,
      paymentDate: values.paymentDate,
      paymentMethod: values.paymentMethod,
      receiptNumber: emptyToUndefined(values.receiptNumber),
      referenceNumber: emptyToUndefined(values.referenceNumber),
      bankName: emptyToUndefined(values.bankName),
      chequeClearanceDate: emptyToUndefined(values.chequeClearanceDate),
      notes: emptyToUndefined(values.notes),
    });

    if (!parsed.success) {
      setErrors(
        toTranslatedFieldErrors<IPaymentFormValues>(parsed.error, (key) => t(`errors.${key}`)),
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
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit" form="payment-form" isLoading={isPending}>
            {tCommon("save")}
          </Button>
        </>
      }
    >
      <form id="payment-form" onSubmit={handleSubmit} noValidate className="space-y-4">
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

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="amountPaid" label={t("fields.amountPaid")} error={errors.amountPaid}>
            <Input
              id="amountPaid"
              inputMode="decimal"
              value={values.amountPaid}
              onChange={(event) => setValue("amountPaid", event.target.value)}
              hasError={Boolean(errors.amountPaid)}
              disabled={isPending}
              placeholder="50000.00"
            />
          </FormField>

          <FormField
            id="paymentDate"
            label={t("fields.paymentDate")}
            error={errors.paymentDate}
          >
            <Input
              id="paymentDate"
              type="date"
              value={values.paymentDate}
              max={getTodayIsoDate()}
              onChange={(event) => setValue("paymentDate", event.target.value)}
              hasError={Boolean(errors.paymentDate)}
              disabled={isPending}
            />
          </FormField>

          <FormField id="paymentMethod" label={t("fields.paymentMethod")}>
            <Select
              id="paymentMethod"
              value={values.paymentMethod}
              onChange={(value) => setValue("paymentMethod", value as TPaymentMethod)}
              options={METHODS.map((value) => ({ value, label: tMethod(value) }))}
              disabled={isPending}
            />
          </FormField>

          <FormField
            id="referenceNumber"
            label={t("fields.referenceNumber")}
            error={errors.referenceNumber}
          >
            <Input
              id="referenceNumber"
              value={values.referenceNumber}
              onChange={(event) => setValue("referenceNumber", event.target.value)}
              hasError={Boolean(errors.referenceNumber)}
              disabled={isPending}
            />
          </FormField>

          <FormField
            id="receiptNumber"
            label={t("fields.receiptNumber")}
            error={errors.receiptNumber}
          >
            <Input
              id="receiptNumber"
              value={values.receiptNumber}
              onChange={(event) => setValue("receiptNumber", event.target.value)}
              hasError={Boolean(errors.receiptNumber)}
              disabled={isPending}
            />
          </FormField>

          {values.paymentMethod === "cheque" || values.paymentMethod === "bank_transfer" ? (
            <FormField id="bankName" label={t("fields.bankName")} error={errors.bankName}>
              <Input
                id="bankName"
                value={values.bankName}
                onChange={(event) => setValue("bankName", event.target.value)}
                hasError={Boolean(errors.bankName)}
                disabled={isPending}
              />
            </FormField>
          ) : null}

          {values.paymentMethod === "cheque" ? (
            <FormField
              id="chequeClearanceDate"
              label={t("fields.chequeClearanceDate")}
              error={errors.chequeClearanceDate}
            >
              <Input
                id="chequeClearanceDate"
                type="date"
                value={values.chequeClearanceDate}
                onChange={(event) => setValue("chequeClearanceDate", event.target.value)}
                hasError={Boolean(errors.chequeClearanceDate)}
                disabled={isPending}
              />
            </FormField>
          ) : null}
        </div>

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
