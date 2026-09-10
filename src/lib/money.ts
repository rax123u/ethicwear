import type { SiteSettings } from "@/types/orbit";
import { asNumber } from "@/lib/catalog";

export function formatMoney(
  value: number | string | null | undefined,
  settings?: SiteSettings | null,
) {
  const amount = asNumber(value);
  if (amount == null) return "";

  const symbol = settings?.currencySymbol || settings?.currency || "";
  const format = settings?.shop?.priceFormat || "SYMBOL_BEFORE";
  const digits = format === "NO_DECIMALS" ? 0 : 2;
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  if (!symbol) return formatted;
  if (format === "SYMBOL_AFTER") return `${formatted} ${symbol}`;
  return `${symbol}${formatted}`;
}
