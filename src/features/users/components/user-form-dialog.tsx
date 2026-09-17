"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { useCompanyOptions } from "@/features/companies/hooks/use-company-options";
import { useSaveUser } from "@/features/users/hooks/use-save-user";
import {
  createUserSchema,
  updateUserSchema,
} from "@/features/users/schemas/user-schema";
import { useFormState } from "@/hooks/use-form-state";
import { useToast } from "@/hooks/use-toast";
import { USER_ROLES } from "@/config/roles";
import { getApiErrorMessage } from "@/utils/api";
import { emptyToUndefined } from "@/utils/string";
import { toTranslatedFieldErrors } from "@/utils/zod";
import type { TFormErrors } from "@/types/form";
import type { IUser, IUserFormValues, TUserRole } from "@/types/user";
import type { IUserFormDialogProps } from "@/features/users/types/user-components";

const toFormValues = (user: IUser | null): IUserFormValues => ({
  username: user?.username ?? "",
  email: user?.email ?? "",
  password: "",
  firstName: user?.firstName ?? "",
  lastName: user?.lastName ?? "",
  phone: user?.phone ?? "",
  companyId: user?.companyId ?? "",
  role: user?.role ?? "staff",
  status: user?.status ?? true,
});

const toPayload = (values: IUserFormValues) => ({
  username: values.username.trim(),
  email: values.email.trim(),
  password: values.password,
  firstName: values.firstName.trim(),
  lastName: values.lastName.trim(),
  phone: emptyToUndefined(values.phone),
  companyId: emptyToUndefined(values.companyId),
  role: values.role,
  status: values.status,
});

export const UserFormDialog = ({ isOpen, user, onClose }: IUserFormDialogProps) => {
  const t = useTranslations("users");
  const tCommon = useTranslations("common");
  const tRoles = useTranslations("account.roles");
  const { showToast } = useToast();
  const { options: companyOptions } = useCompanyOptions(isOpen);
  const { values, errors, setValue, setErrors, reset } = useFormState(
    toFormValues(user),
  );
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { mutate, isPending, error, reset: resetMutation } = useSaveUser();

  useEffect(() => {
    if (!isOpen) return;

    reset(toFormValues(user));
    resetMutation();
  }, [isOpen, user, reset, resetMutation]);

  const isPlatformLevel = values.role === "super_admin";

  const roleOptions = USER_ROLES.map((role) => ({
    value: role,
    label: tRoles(role),
  }));

  const companySelectOptions = [
    { value: "", label: isPlatformLevel ? t("platformLevel") : t("noCompany") },
    ...companyOptions,
  ];

  const statusOptions = [
    { value: "true", label: tCommon("active") },
    { value: "false", label: tCommon("deactivated") },
  ];

  const handleRoleChange = (role: TUserRole) => {
    setValue("role", role);

    // A super_admin is platform-level, so its company is cleared for it
    if (role === "super_admin") setValue("companyId", "");
  };

  const showErrors = (fieldErrors: TFormErrors<IUserFormValues>) =>
    setErrors(fieldErrors);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const translate = (key: string) => t(`errors.${key}`);

    if (user) {
      // Blank password means "keep the current one" — dropped before sending
      const payload = { ...toPayload(values), password: emptyToUndefined(values.password) };
      const parsed = updateUserSchema.safeParse(payload);

      if (!parsed.success) {
        showErrors(toTranslatedFieldErrors<IUserFormValues>(parsed.error, translate));
        return;
      }

      mutate(
        { mode: "update", id: user.id, payload: parsed.data },
        {
          onSuccess: (saved) => {
            showToast(t("updated", { name: saved.username }));
            onClose();
          },
        },
      );
      return;
    }

    const payload = toPayload(values);
    const parsed = createUserSchema.safeParse(payload);

    if (!parsed.success) {
      showErrors(toTranslatedFieldErrors<IUserFormValues>(parsed.error, translate));
      return;
    }

    mutate(
      { mode: "create", payload: parsed.data },
      {
        onSuccess: (saved) => {
          showToast(t("created", { name: saved.username }));
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      title={user ? t("editTitle") : t("createTitle")}
      description={user ? t("editSubtitle") : t("createSubtitle")}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit" form="user-form" isLoading={isPending}>
            {tCommon("save")}
          </Button>
        </>
      }
    >
      <form id="user-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {error ? <Alert>{getApiErrorMessage(error, tCommon("error"))}</Alert> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="firstName" label={t("fields.firstName")} error={errors.firstName}>
            <Input
              id="firstName"
              value={values.firstName}
              onChange={(event) => setValue("firstName", event.target.value)}
              hasError={Boolean(errors.firstName)}
              disabled={isPending}
              autoFocus
            />
          </FormField>

          <FormField id="lastName" label={t("fields.lastName")} error={errors.lastName}>
            <Input
              id="lastName"
              value={values.lastName}
              onChange={(event) => setValue("lastName", event.target.value)}
              hasError={Boolean(errors.lastName)}
              disabled={isPending}
            />
          </FormField>

          <FormField
            id="username"
            label={t("fields.username")}
            error={errors.username}
            hint={t("usernameHint")}
          >
            <Input
              id="username"
              value={values.username}
              onChange={(event) => setValue("username", event.target.value)}
              hasError={Boolean(errors.username)}
              disabled={isPending}
              autoComplete="off"
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
            id="password"
            label={t("fields.password")}
            error={errors.password}
            hint={user ? t("passwordHintUpdate") : t("passwordHint")}
          >
            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              value={values.password}
              onChange={(event) => setValue("password", event.target.value)}
              hasError={Boolean(errors.password)}
              disabled={isPending}
              autoComplete="new-password"
              trailing={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPasswordVisible((current) => !current)}
                  aria-label={
                    isPasswordVisible
                      ? t("fields.hidePassword")
                      : t("fields.showPassword")
                  }
                  tabIndex={-1}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                </Button>
              }
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

          <FormField id="role" label={t("fields.role")} error={errors.role}>
            <Select
              id="role"
              value={values.role}
              onChange={(event) => handleRoleChange(event.target.value as TUserRole)}
              options={roleOptions}
              hasError={Boolean(errors.role)}
              disabled={isPending}
            />
          </FormField>

          <FormField
            id="companyId"
            label={t("fields.company")}
            error={errors.companyId}
            hint={isPlatformLevel ? t("superAdminHint") : undefined}
          >
            <Select
              id="companyId"
              value={values.companyId}
              onChange={(event) => setValue("companyId", event.target.value)}
              options={companySelectOptions}
              hasError={Boolean(errors.companyId)}
              disabled={isPending || isPlatformLevel}
            />
          </FormField>

          <FormField id="status" label={t("fields.status")}>
            <Select
              id="status"
              value={String(values.status)}
              onChange={(event) => setValue("status", event.target.value === "true")}
              options={statusOptions}
              disabled={isPending}
            />
          </FormField>
        </div>
      </form>
    </Modal>
  );
};
