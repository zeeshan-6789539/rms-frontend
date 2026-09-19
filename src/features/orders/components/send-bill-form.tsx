"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { ISendBillFormProps } from "@/features/orders/types/order-components";
import { formatCurrency, formatDateTime } from "@/utils/format";
import { buildWhatsAppWebUrl } from "@/utils/whatsapp";

const PAKISTANI_MOBILE_PATTERN = /^(?:\+92|0)3\d{9}$/;

const buildBillMessage = (
  order: ISendBillFormProps["order"],
  locale: string,
  t: ReturnType<typeof useTranslations<"orders">>,
  tStatus: ReturnType<typeof useTranslations<"orders.statuses">>,
): string => {
  const itemLines = order.items.map(
    (item) =>
      `${item.productName ?? t("removedProduct")} x${item.quantity} - ${formatCurrency(item.price * item.quantity, locale)}`,
  );

  return [
    `*${t("orderRef", { ref: order.id.slice(-8).toUpperCase() })}*`,
    formatDateTime(order.createdAt, locale),
    `${t("fields.status")}: ${tStatus(order.status)}`,
    "",
    itemLines.join("\n\n"),
    "",
    "――――――――――――――",
    `*${t("fields.total")}: ${formatCurrency(order.total, locale)}*`,
  ].join("\n");
};

export const SendBillForm = ({ order }: ISendBillFormProps) => {
  const t = useTranslations("orders");
  const tStatus = useTranslations("orders.statuses");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!PAKISTANI_MOBILE_PATTERN.test(phone)) {
      setError(t("billErrors.phoneInvalid"));
      return;
    }

    const message = buildBillMessage(order, locale, t, tStatus);
    window.open(buildWhatsAppWebUrl(phone, message), "_blank", "noopener,noreferrer");

    setIsOpen(false);
    setPhone("");
    setError(null);
  };

  if (!isOpen) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Send className="h-4 w-4" aria-hidden />
        {t("sendBill")}
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <FormField
        id="whatsapp-number"
        label={t("whatsappNumber")}
        error={error ?? undefined}
        hint={error ? undefined : t("whatsappNumberHint")}
      >
        <Input
          id="whatsapp-number"
          type="tel"
          inputMode="tel"
          autoFocus
          hasError={Boolean(error)}
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value);
            setError(null);
          }}
          placeholder="03296789539"
          className="w-48"
        />
      </FormField>

      <Button type="submit" size="sm">
        {t("send")}
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>
        {tCommon("cancel")}
      </Button>
    </form>
  );
};
