"use client";

import { useEffect, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { tenantSchema } from "@/features/tenants/schemas/tenant-schema";
import { useSaveTenant } from "@/features/tenants/hooks/use-save-tenant";
import { useFormState } from "@/hooks/use-form-state";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/utils/api";
import { emptyToUndefined } from "@/utils/string";
import { toTranslatedFieldErrors } from "@/utils/zod";
import type { ITenant, ITenantFormValues } from "@/types/tenant";
import type { ITenantFormDialogProps } from "@/features/tenants/types/tenant-components";

const toFormValues = (tenant: ITenant | null): ITenantFormValues => ({
  name: tenant?.name ?? "",
  email: tenant?.email ?? "",
  phone: tenant?.phone ?? "",
  status: tenant?.status ?? true,
});

const toPayload = (values: ITenantFormValues) => ({
  name: values.name.trim(),
  email: emptyToUndefined(values.email),
  phone: emptyToUndefined(values.phone),
  status: values.status,
});

export const TenantFormDialog = ({ isOpen, tenant, onClose }: ITenantFormDialogProps) => {
  const t = useTranslations("tenants");
  const tCommon = useTranslations("common");
  const { showToast } = useToast();
  const { values, errors, setValue, setErrors, reset } = useFormState(
    toFormValues(tenant),
  );
  const { mutate, isPending, error, reset: resetMutation } = useSaveTenant();

  useEffect(() => {
    if (!isOpen) return;

    reset(toFormValues(tenant));
    resetMutation();
  }, [isOpen, tenant, reset, resetMutation]);

  const statusOptions = [
    { value: "true", label: tCommon("active") },
    { value: "false", label: tCommon("deactivated") },
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = tenantSchema.safeParse(toPayload(values));

    if (!parsed.success) {
      setErrors(
        toTranslatedFieldErrors<ITenantFormValues>(parsed.error, (key) =>
          t(`errors.${key}`),
        ),
      );
      return;
    }

    mutate(
      { id: tenant?.id, payload: parsed.data },
      {
        onSuccess: (saved) => {
          showToast(
            tenant ? t("updated", { name: saved.name }) : t("created", { name: saved.name }),
          );
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      title={tenant ? t("editTitle") : t("createTitle")}
      description={tenant ? t("editSubtitle") : t("createSubtitle")}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit" form="tenant-form" isLoading={isPending}>
            {tCommon("save")}
          </Button>
        </>
      }
    >
      <form id="tenant-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {error ? <Alert>{getApiErrorMessage(error, tCommon("error"))}</Alert> : null}

        <FormField id="name" label={t("fields.name")} error={errors.name}>
          <Input
            id="name"
            value={values.name}
            onChange={(event) => setValue("name", event.target.value)}
            hasError={Boolean(errors.name)}
            disabled={isPending}
            autoFocus
          />
        </FormField>

        <FormField id="email" label={t("fields.email")} error={errors.email}>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(event) => setValue("email", event.target.value)}
            hasError={Boolean(errors.email)}
            disabled={isPending}
          />
        </FormField>

        <FormField
          id="phone"
          label={t("fields.phone")}
          error={errors.phone}
          hint={t("phoneHint")}
        >
          <Input
            id="phone"
            value={values.phone}
            onChange={(event) => setValue("phone", event.target.value)}
            hasError={Boolean(errors.phone)}
            disabled={isPending}
            placeholder="03296789539"
          />
        </FormField>

        <FormField id="status" label={t("fields.status")}>
          <Select
            id="status"
            value={String(values.status)}
            onChange={(value) => setValue("status", value === "true")}
            options={statusOptions}
            disabled={isPending}
          />
        </FormField>
      </form>
    </Modal>
  );
};
