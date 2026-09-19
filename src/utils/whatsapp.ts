const PAKISTAN_COUNTRY_CODE = "92";

// WhatsApp's click-to-chat link needs the full country code and no leading zero or "+"
export const toWhatsAppPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");

  return digits.startsWith("0") ? PAKISTAN_COUNTRY_CODE + digits.slice(1) : digits;
};

export const buildWhatsAppWebUrl = (phone: string, message: string): string => {
  const params = new URLSearchParams({ phone: toWhatsAppPhone(phone), text: message });

  return `https://web.whatsapp.com/send?${params.toString()}`;
};
