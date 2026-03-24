'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const LANGUAGES = [
  { value: 'en', labelKey: 'english', flag: '🇺🇸' },
  { value: 'es', labelKey: 'spanish', flag: '🇪🇸' },
] as const

type LanguageSwitcherProps = {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'icon'
  showLabel?: boolean
}

export function LanguageSwitcher({
  variant = 'ghost',
  size = 'sm',
  showLabel = true,
}: LanguageSwitcherProps) {
  const t = useTranslations('settings')
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as 'en' | 'es' })
  }

  const currentLang = LANGUAGES.find((l) => l.value === currentLocale) || LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Globe className="h-4 w-4" />
          {showLabel && (
            <span className="text-xs uppercase tracking-wider">
              {currentLocale.toUpperCase()}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => handleLanguageChange(lang.value)}
            className={currentLocale === lang.value ? 'bg-secondary' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            {t(lang.labelKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
