"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/features/auth/hooks/use-login";
import { loginSchema } from "@/features/auth/schemas/login-schema";
import { useFormState } from "@/hooks/use-form-state";
import { getApiErrorMessage } from "@/utils/api";
import { toTranslatedFieldErrors } from "@/utils/zod";
import type { ILoginPayload } from "@/types/auth";

const EMPTY_VALUES: ILoginPayload = { email: "", password: "" };

export const LoginForm = () => {
  const t = useTranslations("auth");
  const { values, errors, setValue, setErrors } = useFormState(EMPTY_VALUES);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { mutate, isPending, error } = useLogin();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(
        toTranslatedFieldErrors<ILoginPayload>(parsed.error, (key) =>
          t(`errors.${key}`),
        ),
      );
      return;
    }

    mutate(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error ? <Alert>{getApiErrorMessage(error, t("errors.generic"))}</Alert> : null}

      <FormField id="email" label={t("email")} error={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          placeholder={t("emailPlaceholder")}
          value={values.email}
          onChange={(event) => setValue("email", event.target.value)}
          hasError={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          disabled={isPending}
        />
      </FormField>

      <FormField id="password" label={t("password")} error={errors.password}>
        <Input
          id="password"
          name="password"
          type={isPasswordVisible ? "text" : "password"}
          autoComplete="current-password"
          placeholder={t("passwordPlaceholder")}
          value={values.password}
          onChange={(event) => setValue("password", event.target.value)}
          hasError={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          disabled={isPending}
          trailing={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsPasswordVisible((current) => !current)}
              aria-label={isPasswordVisible ? t("hidePassword") : t("showPassword")}
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

      <Button type="submit" isLoading={isPending} className="h-11 w-full">
        {!isPending ? <LogIn className="h-4 w-4" aria-hidden /> : null}
        {isPending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
};
