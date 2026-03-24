type CurrencyFormatOptions = {
  amount: number
  currency: string
  exchangeRate?: number | null
  referenceCurrency?: string
  showEquivalent?: boolean
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  MXN: '$',
  COP: '$',
  ARS: '$',
  VES: 'Bs',
  EUR: '€',
}

const CURRENCY_LOCALES: Record<string, string> = {
  USD: 'en-US',
  MXN: 'es-MX',
  COP: 'es-CO',
  ARS: 'es-AR',
  VES: 'es-VE',
  EUR: 'de-DE',
}

export function formatMoney({
  amount,
  currency,
  exchangeRate,
  referenceCurrency = 'USD',
  showEquivalent = true,
}: CurrencyFormatOptions): string {
  const locale = CURRENCY_LOCALES[currency] || 'en-US'
  
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const formatted = formatter.format(amount)

  if (showEquivalent && exchangeRate && exchangeRate > 0 && currency !== referenceCurrency) {
    const equivalentAmount = amount / exchangeRate
    const refFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: referenceCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return `${formatted} (≈ ${refFormatter.format(equivalentAmount)})`
  }

  return formatted
}

export function formatSimpleCurrency(amount: number, currency: string): string {
  const locale = CURRENCY_LOCALES[currency] || 'en-US'
  
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formatter.format(amount)
}

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] || '$'
}
