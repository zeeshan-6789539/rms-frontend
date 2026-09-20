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
import { usePropertyOptions } from "@/features/properties/hooks/use-property-options";
import { useTenantOptions } from "@/features/tenants/hooks/use-tenant-options";
import { createLeaseSchema, updateLeaseSchema } from "@/features/leases/schemas/lease-schema";
import { useSaveLease } from "@/features/leases/hooks/use-save-lease";
import { useFormState } from "@/hooks/use-form-state";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/utils/api";
import { emptyToUndefined } from "@/utils/string";
import { toTranslatedFieldErrors } from "@/utils/zod";
import type { ILease, ILeaseFormValues } from "@/types/lease";
import type { ILeaseFormDialogProps } from "@/features/leases/types/lease-components";

const toFormValues = (lease: ILease | null): ILeaseFormValues => ({
  propertyId: lease?.propertyId ?? "",
  tenantId: lease?.tenantId ?? "",
  startDate: lease?.startDate ?? "",
  endDate: lease?.endDate ?? "",
  monthlyRent: lease?.currentRent ?? "",
  advanceAmount: lease?.advanceAmount ?? "",
});

export const LeaseFormDialog = ({ isOpen, lease, onClose }: ILeaseFormDialogProps) => {
  const t = useTranslations("leases");
  const tCommon = useTranslations("common");
  const { showToast } = useToast();
  const { values, errors, setValue, setErrors, reset } = useFormState(
    toFormValues(lease),
  );
  const { mutate, isPending, error, reset: resetMutation } = useSaveLease();
  const { options: propertyOptions, isPending: isPropertiesPending } = usePropertyOptions(
    isOpen && !lease,
  );
  const { options: tenantOptions, isPending: isTenantsPending } = useTenantOptions(
    isOpen && !lease,
  );

  useEffect(() => {
    if (!isOpen) return;

    reset(toFormValues(lease));
    resetMutation();
  }, [isOpen, lease, reset, resetMutation]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (lease) {
      const parsed = updateLeaseSchema.safeParse({
        startDate: values.startDate,
        endDate: values.endDate,
        advanceAmount: emptyToUndefined(values.advanceAmount),
      });

      if (!parsed.success) {
        setErrors(
          toTranslatedFieldErrors<ILeaseFormValues>(parsed.error, (key) => t(`errors.${key}`)),
        );
        return;
      }

      mutate(
        { mode: "update", id: lease.id, payload: parsed.data },
        {
          onSuccess: () => {
            showToast(t("updated", { property: lease.propertyName }));
            onClose();
          },
        },
      );
      return;
    }

    const parsed = createLeaseSchema.safeParse({
      propertyId: values.propertyId,
      tenantId: values.tenantId,
      startDate: values.startDate,
      endDate: values.endDate,
      monthlyRent: values.monthlyRent,
      advanceAmount: emptyToUndefined(values.advanceAmount),
    });

    if (!parsed.success) {
      setErrors(
        toTranslatedFieldErrors<ILeaseFormValues>(parsed.error, (key) => t(`errors.${key}`)),
      );
      return;
    }

    mutate(
      { mode: "create", payload: parsed.data },
      {
        onSuccess: (saved) => {
          showToast(t("created", { property: saved.propertyName }));
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      title={lease ? t("editTitle") : t("createTitle")}
      description={lease ? t("editSubtitle") : t("createSubtitle")}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit" form="lease-form" isLoading={isPending}>
            {tCommon("save")}
          </Button>
        </>
      }
    >
      <form id="lease-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {error ? <Alert>{getApiErrorMessage(error, tCommon("error"))}</Alert> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {lease ? (
            <>
              <FormField id="propertyName" label={t("fields.property")}>
                <Input id="propertyName" value={lease.propertyName} disabled />
              </FormField>

              <FormField id="tenantName" label={t("fields.tenant")}>
                <Input id="tenantName" value={lease.tenantName} disabled />
              </FormField>
            </>
          ) : (
            <>
              <FormField id="propertyId" label={t("fields.property")} error={errors.propertyId}>
                <Select
                  id="propertyId"
                  value={values.propertyId}
                  onChange={(value) => setValue("propertyId", value)}
                  options={[{ value: "", label: t("selectProperty") }, ...propertyOptions]}
                  hasError={Boolean(errors.propertyId)}
                  disabled={isPending || isPropertiesPending}
                />
              </FormField>

              <FormField id="tenantId" label={t("fields.tenant")} error={errors.tenantId}>
                <Select
                  id="tenantId"
                  value={values.tenantId}
                  onChange={(value) => setValue("tenantId", value)}
                  options={[{ value: "", label: t("selectTenant") }, ...tenantOptions]}
                  hasError={Boolean(errors.tenantId)}
                  disabled={isPending || isTenantsPending}
                />
              </FormField>
            </>
          )}

          <FormField id="startDate" label={t("fields.startDate")} error={errors.startDate}>
            <DatePicker
              id="startDate"
              value={values.startDate}
              onChange={(date) => setValue("startDate", date)}
              hasError={Boolean(errors.startDate)}
              disabled={isPending}
            />
          </FormField>

          <FormField id="endDate" label={t("fields.endDate")} error={errors.endDate}>
            <DatePicker
              id="endDate"
              value={values.endDate}
              min={values.startDate || undefined}
              onChange={(date) => setValue("endDate", date)}
              hasError={Boolean(errors.endDate)}
              disabled={isPending}
            />
          </FormField>

          {!lease ? (
            <FormField
              id="monthlyRent"
              label={t("fields.monthlyRent")}
              error={errors.monthlyRent}
            >
              <Input
                id="monthlyRent"
                inputMode="decimal"
                value={values.monthlyRent}
                onChange={(event) => setValue("monthlyRent", event.target.value)}
                hasError={Boolean(errors.monthlyRent)}
                disabled={isPending}
                placeholder="50000.00"
              />
            </FormField>
          ) : null}

          <FormField
            id="advanceAmount"
            label={t("fields.advanceAmount")}
            error={errors.advanceAmount}
          >
            <Input
              id="advanceAmount"
              inputMode="decimal"
              value={values.advanceAmount}
              onChange={(event) => setValue("advanceAmount", event.target.value)}
              hasError={Boolean(errors.advanceAmount)}
              disabled={isPending}
              placeholder="0.00"
            />
          </FormField>
        </div>
      </form>
    </Modal>
  );
};
