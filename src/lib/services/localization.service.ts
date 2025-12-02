/**
 * PropertyPro - Localization Service
 * Centralized service for multi-currency and localization support
 */

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  symbolPosition: "before" | "after";
  thousandsSeparator: string;
  decimalSeparator: string;
}

export interface Locale {
  code: string;
  name: string;
  nativeName: string;
  currency: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  firstDayOfWeek: number; // 0 = Sunday, 1 = Monday
  rtl: boolean;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
}

// Supported currencies
export const CURRENCIES: Record<string, Currency> = {
  USD: {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },
  GBP: {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  CAD: {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  AUD: {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  JPY: {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    decimals: 0,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  CHF: {
    code: "CHF",
    name: "Swiss Franc",
    symbol: "CHF",
    decimals: 2,
    symbolPosition: "after",
    thousandsSeparator: "'",
    decimalSeparator: ".",
  },
  CNY: {
    code: "CNY",
    name: "Chinese Yuan",
    symbol: "¥",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  INR: {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  BRL: {
    code: "BRL",
    name: "Brazilian Real",
    symbol: "R$",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },
  // South Asian Currencies
  BDT: {
    code: "BDT",
    name: "Bangladeshi Taka",
    symbol: "৳",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  PKR: {
    code: "PKR",
    name: "Pakistani Rupee",
    symbol: "₨",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  LKR: {
    code: "LKR",
    name: "Sri Lankan Rupee",
    symbol: "Rs",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  // Middle Eastern Currencies
  AED: {
    code: "AED",
    name: "UAE Dirham",
    symbol: "د.إ",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  SAR: {
    code: "SAR",
    name: "Saudi Riyal",
    symbol: "﷼",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  QAR: {
    code: "QAR",
    name: "Qatari Riyal",
    symbol: "ر.ق",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  KWD: {
    code: "KWD",
    name: "Kuwaiti Dinar",
    symbol: "د.ك",
    decimals: 3,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  BHD: {
    code: "BHD",
    name: "Bahraini Dinar",
    symbol: "د.ب",
    decimals: 3,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  OMR: {
    code: "OMR",
    name: "Omani Rial",
    symbol: "ر.ع.",
    decimals: 3,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  JOD: {
    code: "JOD",
    name: "Jordanian Dinar",
    symbol: "د.ا",
    decimals: 3,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  LBP: {
    code: "LBP",
    name: "Lebanese Pound",
    symbol: "ل.ل",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  IQD: {
    code: "IQD",
    name: "Iraqi Dinar",
    symbol: "د.ع",
    decimals: 3,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  EGP: {
    code: "EGP",
    name: "Egyptian Pound",
    symbol: "ج.م",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  // Southeast Asian Currencies
  THB: {
    code: "THB",
    name: "Thai Baht",
    symbol: "฿",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  VND: {
    code: "VND",
    name: "Vietnamese Dong",
    symbol: "₫",
    decimals: 0,
    symbolPosition: "after",
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },
  IDR: {
    code: "IDR",
    name: "Indonesian Rupiah",
    symbol: "Rp",
    decimals: 0,
    symbolPosition: "before",
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },
  MYR: {
    code: "MYR",
    name: "Malaysian Ringgit",
    symbol: "RM",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  SGD: {
    code: "SGD",
    name: "Singapore Dollar",
    symbol: "S$",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  PHP: {
    code: "PHP",
    name: "Philippine Peso",
    symbol: "₱",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  HKD: {
    code: "HKD",
    name: "Hong Kong Dollar",
    symbol: "HK$",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  KRW: {
    code: "KRW",
    name: "South Korean Won",
    symbol: "₩",
    decimals: 0,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  // European Currencies
  NOK: {
    code: "NOK",
    name: "Norwegian Krone",
    symbol: "kr",
    decimals: 2,
    symbolPosition: "after",
    thousandsSeparator: " ",
    decimalSeparator: ",",
  },
  SEK: {
    code: "SEK",
    name: "Swedish Krona",
    symbol: "kr",
    decimals: 2,
    symbolPosition: "after",
    thousandsSeparator: " ",
    decimalSeparator: ",",
  },
  DKK: {
    code: "DKK",
    name: "Danish Krone",
    symbol: "kr",
    decimals: 2,
    symbolPosition: "after",
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },
  PLN: {
    code: "PLN",
    name: "Polish Złoty",
    symbol: "zł",
    decimals: 2,
    symbolPosition: "after",
    thousandsSeparator: " ",
    decimalSeparator: ",",
  },
  CZK: {
    code: "CZK",
    name: "Czech Koruna",
    symbol: "Kč",
    decimals: 2,
    symbolPosition: "after",
    thousandsSeparator: " ",
    decimalSeparator: ",",
  },
  HUF: {
    code: "HUF",
    name: "Hungarian Forint",
    symbol: "Ft",
    decimals: 0,
    symbolPosition: "after",
    thousandsSeparator: " ",
    decimalSeparator: ",",
  },
  RON: {
    code: "RON",
    name: "Romanian Leu",
    symbol: "lei",
    decimals: 2,
    symbolPosition: "after",
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },
  BGN: {
    code: "BGN",
    name: "Bulgarian Lev",
    symbol: "лв",
    decimals: 2,
    symbolPosition: "after",
    thousandsSeparator: " ",
    decimalSeparator: ",",
  },
  HRK: {
    code: "HRK",
    name: "Croatian Kuna",
    symbol: "kn",
    decimals: 2,
    symbolPosition: "after",
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },
  RUB: {
    code: "RUB",
    name: "Russian Ruble",
    symbol: "₽",
    decimals: 2,
    symbolPosition: "after",
    thousandsSeparator: " ",
    decimalSeparator: ",",
  },
  UAH: {
    code: "UAH",
    name: "Ukrainian Hryvnia",
    symbol: "₴",
    decimals: 2,
    symbolPosition: "after",
    thousandsSeparator: " ",
    decimalSeparator: ",",
  },
  TRY: {
    code: "TRY",
    name: "Turkish Lira",
    symbol: "₺",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },
  // African Currencies
  ZAR: {
    code: "ZAR",
    name: "South African Rand",
    symbol: "R",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: " ",
    decimalSeparator: ".",
  },
  NGN: {
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  KES: {
    code: "KES",
    name: "Kenyan Shilling",
    symbol: "KSh",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  MAD: {
    code: "MAD",
    name: "Moroccan Dirham",
    symbol: "د.م.",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  TND: {
    code: "TND",
    name: "Tunisian Dinar",
    symbol: "د.ت",
    decimals: 3,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  // Latin American Currencies
  MXN: {
    code: "MXN",
    name: "Mexican Peso",
    symbol: "MX$",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  ARS: {
    code: "ARS",
    name: "Argentine Peso",
    symbol: "$",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },
  CLP: {
    code: "CLP",
    name: "Chilean Peso",
    symbol: "$",
    decimals: 0,
    symbolPosition: "before",
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },
  COP: {
    code: "COP",
    name: "Colombian Peso",
    symbol: "$",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },
  PEN: {
    code: "PEN",
    name: "Peruvian Sol",
    symbol: "S/",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  UYU: {
    code: "UYU",
    name: "Uruguayan Peso",
    symbol: "$U",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },
  // Oceania
  NZD: {
    code: "NZD",
    name: "New Zealand Dollar",
    symbol: "NZ$",
    decimals: 2,
    symbolPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
};

// Supported locales
export const LOCALES: Record<string, Locale> = {
  "en-US": {
    code: "en-US",
    name: "English (United States)",
    nativeName: "English (United States)",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
  },
  "en-GB": {
    code: "en-GB",
    name: "English (United Kingdom)",
    nativeName: "English (United Kingdom)",
    currency: "GBP",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
  },
  "en-CA": {
    code: "en-CA",
    name: "English (Canada)",
    nativeName: "English (Canada)",
    currency: "CAD",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
  },
  "en-AU": {
    code: "en-AU",
    name: "English (Australia)",
    nativeName: "English (Australia)",
    currency: "AUD",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
  },
  "es-ES": {
    code: "es-ES",
    name: "Spanish (Spain)",
    nativeName: "Español (España)",
    currency: "EUR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
  },
  "es-MX": {
    code: "es-MX",
    name: "Spanish (Mexico)",
    nativeName: "Español (México)",
    currency: "USD", // Many Mexican properties use USD
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
  },
  "fr-FR": {
    code: "fr-FR",
    name: "French (France)",
    nativeName: "Français (France)",
    currency: "EUR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
  },
  "fr-CA": {
    code: "fr-CA",
    name: "French (Canada)",
    nativeName: "Français (Canada)",
    currency: "CAD",
    dateFormat: "YYYY-MM-DD",
    timeFormat: "24h",
    firstDayOfWeek: 0,
    rtl: false,
  },
  "de-DE": {
    code: "de-DE",
    name: "German (Germany)",
    nativeName: "Deutsch (Deutschland)",
    currency: "EUR",
    dateFormat: "DD.MM.YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
  },
  "it-IT": {
    code: "it-IT",
    name: "Italian (Italy)",
    nativeName: "Italiano (Italia)",
    currency: "EUR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
  },
  "pt-BR": {
    code: "pt-BR",
    name: "Portuguese (Brazil)",
    nativeName: "Português (Brasil)",
    currency: "BRL",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 0,
    rtl: false,
  },
  "ja-JP": {
    code: "ja-JP",
    name: "Japanese (Japan)",
    nativeName: "日本語 (日本)",
    currency: "JPY",
    dateFormat: "YYYY/MM/DD",
    timeFormat: "24h",
    firstDayOfWeek: 0,
    rtl: false,
  },
  "zh-CN": {
    code: "zh-CN",
    name: "Chinese (Simplified)",
    nativeName: "中文 (简体)",
    currency: "CNY",
    dateFormat: "YYYY/MM/DD",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
  },
  "hi-IN": {
    code: "hi-IN",
    name: "Hindi (India)",
    nativeName: "हिन्दी (भारत)",
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
  },
};

export class LocalizationService {
  private static instance: LocalizationService;
  private currentLocale: string = "en-US";
  private currentCurrency: string = "USD";
  private exchangeRates: Map<string, ExchangeRate> = new Map();

  private constructor() {
    // Initialize with browser locale if available
    if (typeof window !== "undefined") {
      this.currentLocale = navigator.language || "en-US";
      if (!LOCALES[this.currentLocale]) {
        // Fallback to language code only
        const langCode = this.currentLocale.split("-")[0];
        const fallbackLocale = Object.keys(LOCALES).find((locale) =>
          locale.startsWith(langCode)
        );
        this.currentLocale = fallbackLocale || "en-US";
      }
      this.currentCurrency = LOCALES[this.currentLocale]?.currency || "USD";
    }
  }

  public static getInstance(): LocalizationService {
    if (!LocalizationService.instance) {
      LocalizationService.instance = new LocalizationService();
    }
    return LocalizationService.instance;
  }

  // Getters
  public getCurrentLocale(): string {
    return this.currentLocale;
  }

  public getCurrentCurrency(): string {
    return this.currentCurrency;
  }

  public getLocale(code: string): Locale | undefined {
    return LOCALES[code];
  }

  public getCurrency(code: string): Currency | undefined {
    return CURRENCIES[code];
  }

  public getAllLocales(): Locale[] {
    return Object.values(LOCALES);
  }

  public getAllCurrencies(): Currency[] {
    return Object.values(CURRENCIES);
  }

  // Setters
  public setLocale(localeCode: string): void {
    if (LOCALES[localeCode]) {
      this.currentLocale = localeCode;
      // Auto-update currency based on locale
      this.currentCurrency = LOCALES[localeCode].currency;
    }
  }

  public setCurrency(currencyCode: string): void {
    if (CURRENCIES[currencyCode]) {
      this.currentCurrency = currencyCode;
    }
  }

  // Currency formatting
  public formatCurrency(
    amount: number,
    currencyCode?: string,
    options?: {
      showSymbol?: boolean;
      showCode?: boolean;
      minimumFractionDigits?: number;
      maximumFractionDigits?: number;
    }
  ): string {
    const currency = CURRENCIES[currencyCode || this.currentCurrency];
    if (!currency) {
      return amount.toString();
    }

    const {
      showSymbol = true,
      showCode = false,
      minimumFractionDigits = currency.decimals,
      maximumFractionDigits = currency.decimals,
    } = options || {};

    // Format the number
    const formattedNumber = new Intl.NumberFormat(this.currentLocale, {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount);

    // Build the formatted string
    let result = formattedNumber;

    if (showSymbol) {
      if (currency.symbolPosition === "before") {
        result = `${currency.symbol}${result}`;
      } else {
        result = `${result} ${currency.symbol}`;
      }
    }

    if (showCode) {
      result = `${result} ${currency.code}`;
    }

    return result;
  }

  // Date formatting
  public formatDate(
    date: Date | string,
    options?: {
      format?: "short" | "medium" | "long" | "full";
      localeCode?: string;
    }
  ): string {
    const { format = "medium", localeCode = this.currentLocale } =
      options || {};
    const dateObj = typeof date === "string" ? new Date(date) : date;

    const formatOptions: Intl.DateTimeFormatOptions = {
      short: { year: "numeric", month: "numeric", day: "numeric" },
      medium: { year: "numeric", month: "short", day: "numeric" },
      long: { year: "numeric", month: "long", day: "numeric" },
      full: { weekday: "long", year: "numeric", month: "long", day: "numeric" },
    };

    return new Intl.DateTimeFormat(localeCode, formatOptions[format]).format(
      dateObj
    );
  }

  // Time formatting
  public formatTime(
    date: Date | string,
    options?: {
      format?: "12h" | "24h";
      showSeconds?: boolean;
      localeCode?: string;
    }
  ): string {
    const locale = LOCALES[this.currentLocale];
    const {
      format = locale?.timeFormat || "12h",
      showSeconds = false,
      localeCode = this.currentLocale,
    } = options || {};

    const dateObj = typeof date === "string" ? new Date(date) : date;

    const formatOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: format === "12h",
    };

    if (showSeconds) {
      formatOptions.second = "2-digit";
    }

    return new Intl.DateTimeFormat(localeCode, formatOptions).format(dateObj);
  }

  // Number formatting
  public formatNumber(
    number: number,
    options?: {
      minimumFractionDigits?: number;
      maximumFractionDigits?: number;
      localeCode?: string;
    }
  ): string {
    const {
      minimumFractionDigits = 0,
      maximumFractionDigits = 2,
      localeCode = this.currentLocale,
    } = options || {};

    return new Intl.NumberFormat(localeCode, {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(number);
  }

  // Percentage formatting
  public formatPercentage(
    value: number,
    options?: {
      minimumFractionDigits?: number;
      maximumFractionDigits?: number;
      localeCode?: string;
    }
  ): string {
    const {
      minimumFractionDigits = 1,
      maximumFractionDigits = 1,
      localeCode = this.currentLocale,
    } = options || {};

    return new Intl.NumberFormat(localeCode, {
      style: "percent",
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value / 100);
  }

  // Exchange rate management
  public async updateExchangeRates(): Promise<void> {
    try {
      // In a real implementation, this would fetch from an exchange rate API
      // For now, we'll use mock data
      const mockRates = [
        { from: "USD", to: "EUR", rate: 0.85, lastUpdated: new Date() },
        { from: "USD", to: "GBP", rate: 0.73, lastUpdated: new Date() },
        { from: "USD", to: "CAD", rate: 1.25, lastUpdated: new Date() },
        { from: "USD", to: "AUD", rate: 1.35, lastUpdated: new Date() },
        { from: "USD", to: "JPY", rate: 110, lastUpdated: new Date() },
      ];

      mockRates.forEach((rate) => {
        this.exchangeRates.set(`${rate.from}-${rate.to}`, rate);
        // Add reverse rate
        this.exchangeRates.set(`${rate.to}-${rate.from}`, {
          from: rate.to,
          to: rate.from,
          rate: 1 / rate.rate,
          lastUpdated: rate.lastUpdated,
        });
      });
    } catch (error) {
      console.error("Failed to update exchange rates:", error);
    }
  }

  public convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const rateKey = `${fromCurrency}-${toCurrency}`;
    const exchangeRate = this.exchangeRates.get(rateKey);

    if (!exchangeRate) {
      console.warn(
        `Exchange rate not found for ${fromCurrency} to ${toCurrency}`
      );
      return amount;
    }

    return amount * exchangeRate.rate;
  }

  // Utility methods
  public isRTL(localeCode?: string): boolean {
    const locale = LOCALES[localeCode || this.currentLocale];
    return locale?.rtl || false;
  }

  public getFirstDayOfWeek(localeCode?: string): number {
    const locale = LOCALES[localeCode || this.currentLocale];
    return locale?.firstDayOfWeek || 0;
  }
}

// Export singleton instance
export const localizationService = LocalizationService.getInstance();
