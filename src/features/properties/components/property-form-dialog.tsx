"use client";

import { useEffect, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { propertySchema } from "@/features/properties/schemas/property-schema";
import { useSaveProperty } from "@/features/properties/hooks/use-save-property";
import { useFormState } from "@/hooks/use-form-state";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/utils/api";
import { emptyToUndefined } from "@/utils/string";
import { toTranslatedFieldErrors } from "@/utils/zod";
import type { IProperty, IPropertyFormValues } from "@/types/property";
import type { IPropertyFormDialogProps } from "@/features/properties/types/property-components";

const toFormValues = (property: IProperty | null): IPropertyFormValues => ({
  name: property?.name ?? "",
  addressLine1: property?.addressLine1 ?? "",
  addressLine2: property?.addressLine2 ?? "",
  city: property?.city ?? "",
  state: property?.state ?? "",
  postalCode: property?.postalCode ?? "",
  status: property?.status ?? true,
});

const toPayload = (values: IPropertyFormValues) => ({
  name: values.name.trim(),
  addressLine1: values.addressLine1.trim(),
  addressLine2: emptyToUndefined(values.addressLine2),
  city: values.city.trim(),
  state: emptyToUndefined(values.state),
  postalCode: emptyToUndefined(values.postalCode),
  status: values.status,
});

export const PropertyFormDialog = ({
  isOpen,
  property,
  onClose,
}: IPropertyFormDialogProps) => {
  const t = useTranslations("properties");
  const tCommon = useTranslations("common");
  const { showToast } = useToast();
  const { values, errors, setValue, setErrors, reset } = useFormState(
    toFormValues(property),
  );
  const { mutate, isPending, error, reset: resetMutation } = useSaveProperty();

  useEffect(() => {
    if (!isOpen) return;

    reset(toFormValues(property));
    resetMutation();
  }, [isOpen, property, reset, resetMutation]);

  const statusOptions = [
    { value: "true", label: tCommon("active") },
    { value: "false", label: tCommon("deactivated") },
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = propertySchema.safeParse(toPayload(values));

    if (!parsed.success) {
      setErrors(
        toTranslatedFieldErrors<IPropertyFormValues>(parsed.error, (key) =>
          t(`errors.${key}`),
        ),
      );
      return;
    }

    mutate(
      { id: property?.id, payload: parsed.data },
      {
        onSuccess: (saved) => {
          showToast(
            property ? t("updated", { name: saved.name }) : t("created", { name: saved.name }),
          );
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      title={property ? t("editTitle") : t("createTitle")}
      description={property ? t("editSubtitle") : t("createSubtitle")}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit" form="property-form" isLoading={isPending}>
            {tCommon("save")}
          </Button>
        </>
      }
    >
      <form id="property-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {error ? <Alert>{getApiErrorMessage(error, tCommon("error"))}</Alert> : null}

        <div className="grid gap-4 sm:grid-cols-2">
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

          <FormField id="status" label={t("fields.status")}>
            <Select
              id="status"
              value={String(values.status)}
              onChange={(value) => setValue("status", value === "true")}
              options={statusOptions}
              disabled={isPending}
            />
          </FormField>

          <FormField
            id="addressLine1"
            label={t("fields.addressLine1")}
            error={errors.addressLine1}
          >
            <Input
              id="addressLine1"
              value={values.addressLine1}
              onChange={(event) => setValue("addressLine1", event.target.value)}
              hasError={Boolean(errors.addressLine1)}
              disabled={isPending}
            />
          </FormField>

          <FormField
            id="addressLine2"
            label={t("fields.addressLine2")}
            error={errors.addressLine2}
          >
            <Input
              id="addressLine2"
              value={values.addressLine2}
              onChange={(event) => setValue("addressLine2", event.target.value)}
              hasError={Boolean(errors.addressLine2)}
              disabled={isPending}
            />
          </FormField>

          <FormField id="city" label={t("fields.city")} error={errors.city}>
            <Input
              id="city"
              value={values.city}
              onChange={(event) => setValue("city", event.target.value)}
              hasError={Boolean(errors.city)}
              disabled={isPending}
            />
          </FormField>

          <FormField id="state" label={t("fields.state")} error={errors.state}>
            <Input
              id="state"
              value={values.state}
              onChange={(event) => setValue("state", event.target.value)}
              hasError={Boolean(errors.state)}
              disabled={isPending}
            />
          </FormField>

          <FormField
            id="postalCode"
            label={t("fields.postalCode")}
            error={errors.postalCode}
          >
            <Input
              id="postalCode"
              value={values.postalCode}
              onChange={(event) => setValue("postalCode", event.target.value)}
              hasError={Boolean(errors.postalCode)}
              disabled={isPending}
            />
          </FormField>
        </div>
      </form>
    </Modal>
  );
};
