/**
 * i18n Dictionary and Locale Helpers
 * Fatoora AI is designed to be Arabic/RTL ready.
 */

export type Locale = "en" | "ar";

export const defaultLocale: Locale = "en";

export const dictionaries = {
  en: {
    common: {
      dashboard: "Dashboard",
      invoices: "Invoices",
      expenses: "Expenses",
      settings: "Settings",
    },
    invoices: {
      new: "New Invoice",
      issue: "Issue",
      void: "Void",
    }
  },
  ar: {
    common: {
      dashboard: "لوحة القيادة",
      invoices: "الفواتير",
      expenses: "المصروفات",
      settings: "الإعدادات",
    },
    invoices: {
      new: "فاتورة جديدة",
      issue: "إصدار",
      void: "إلغاء",
    }
  }
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale] || dictionaries[defaultLocale];
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function formatCurrency(amount: number | string, locale: Locale = "en", currency: string = "AED") {
  return new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", {
    style: "currency",
    currency: currency,
  }).format(Number(amount));
}
