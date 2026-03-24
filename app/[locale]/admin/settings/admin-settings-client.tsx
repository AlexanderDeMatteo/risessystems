'use client'

import { useState, useCallback } from 'react'
import { useRouter, usePathname } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Palette, Globe, Lock, Languages } from 'lucide-react'
import { toast } from 'sonner'
import { updateUserSettings, type UserSettings } from '@/app/actions/settings'
import { updatePassword } from '@/app/actions/auth'

const COLOR_SCHEMES = [
  { id: 'neon-acid', label: 'Neon Acid', color: 'bg-lime-400' },
  { id: 'emerald', label: 'Emerald', color: 'bg-emerald-500' },
  { id: 'blue', label: 'Blue', color: 'bg-blue-500' },
  { id: 'orange', label: 'Orange', color: 'bg-orange-500' },
] as const

const CURRENCIES = [
  { value: 'USD', label: '$ USD' },
  { value: 'MXN', label: '$ MXN' },
  { value: 'COP', label: '$ COP' },
  { value: 'ARS', label: '$ ARS' },
  { value: 'VES', label: 'Bs VES' },
  { value: 'EUR', label: '€ EUR' },
] as const

const CURRENCIES_WITH_EXCHANGE_RATE = ['VES', 'ARS']

const TIMEZONES = [
  { value: 'America/Mexico_City', label: 'Mexico City (GMT-6)' },
  { value: 'America/Caracas', label: 'Caracas (GMT-4)' },
  { value: 'America/Bogota', label: 'Bogota (GMT-5)' },
  { value: 'America/Lima', label: 'Lima (GMT-5)' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (GMT-3)' },
  { value: 'America/Sao_Paulo', label: 'Sao Paulo (GMT-3)' },
  { value: 'America/New_York', label: 'New York (GMT-5)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)' },
  { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
  { value: 'Europe/London', label: 'London (GMT+0)' },
] as const

const LANGUAGES = [
  { value: 'en', labelKey: 'english' },
  { value: 'es', labelKey: 'spanish' },
] as const

type AdminSettingsClientProps = {
  initialSettings: UserSettings
}

export function AdminSettingsClient({ initialSettings }: AdminSettingsClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')
  const [settings, setSettings] = useState<UserSettings>(initialSettings)
  const [saving, setSaving] = useState(false)

  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSaving, setPasswordSaving] = useState(false)

  const handleUpdateSetting = useCallback(
    async <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
      const prev = settings[key]
      setSettings((s) => ({ ...s, [key]: value }))

      if (key === 'colorScheme') {
        const validSchemes = ['neon-acid', 'emerald', 'blue', 'orange']
        if (validSchemes.includes(value as string) && value !== 'neon-acid') {
          document.documentElement.dataset.colorScheme = value as string
        } else {
          delete document.documentElement.dataset.colorScheme
        }
      }

      setSaving(true)
      const result = await updateUserSettings({ [key]: value })
      setSaving(false)

      if (!result.ok) {
        setSettings((s) => ({ ...s, [key]: prev }))
        toast.error(result.error)
      }
    },
    [settings]
  )

  const handleLanguageChange = useCallback(
    async (newLocale: string) => {
      if (newLocale === currentLocale) return

      setSaving(true)
      const result = await updateUserSettings({ locale: newLocale })
      setSaving(false)

      if (result.ok) {
        const newPath = `/${newLocale}${pathname}`
        window.location.href = newPath
      } else {
        toast.error(result.error)
      }
    },
    [pathname, currentLocale]
  )

  const handleChangePassword = useCallback(async () => {
    setPasswordError(null)
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    setPasswordSaving(true)
    const result = await updatePassword(newPassword)
    setPasswordSaving(false)
    if (result.ok) {
      toast.success('Password updated successfully')
      setNewPassword('')
      setConfirmPassword('')
      setChangePasswordOpen(false)
    } else {
      setPasswordError(result.error)
    }
  }, [newPassword, confirmPassword])

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-wider">{t('title').toUpperCase()}</h1>
          <p className="text-muted-foreground mt-2 uppercase text-xs tracking-widest">
            {t('adminSubtitle')}
          </p>
        </div>

        {/* Appearance */}
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Palette className="w-6 h-6 text-primary" />
              <span>{t('appearance')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-secondary/20 rounded-lg border border-border/30">
              <p className="font-semibold uppercase text-sm tracking-wider mb-4">{t('colorScheme')}</p>
              <div className="grid grid-cols-4 gap-3">
                {COLOR_SCHEMES.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => handleUpdateSetting('colorScheme', scheme.id)}
                    disabled={saving}
                    className={`h-10 rounded-lg ${scheme.color} border-2 cursor-pointer transition-all ${
                      settings.colorScheme === scheme.id
                        ? 'border-white neon-glow scale-105'
                        : 'border-border hover:border-white/50'
                    }`}
                    title={scheme.label}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regional */}
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Globe className="w-6 h-6 text-primary" />
              <span>{t('regional')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="uppercase text-xs tracking-wider text-muted-foreground">
                  {t('currency')}
                </Label>
                <Select
                  value={settings.currency}
                  onValueChange={(v) => handleUpdateSetting('currency', v)}
                  disabled={saving}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="uppercase text-xs tracking-wider text-muted-foreground">
                  {t('timezone')}
                </Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(v) => handleUpdateSetting('timezone', v)}
                  disabled={saving}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {CURRENCIES_WITH_EXCHANGE_RATE.includes(settings.currency) && (
              <div className="p-4 bg-secondary/20 rounded-lg border border-border/30 space-y-3">
                <Label className="uppercase text-xs tracking-wider text-muted-foreground">
                  {t('exchangeRate')}
                </Label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">1 USD =</span>
                  <Input
                    type="number"
                    step="0.0001"
                    min="0"
                    placeholder="0.00"
                    value={settings.exchangeRate ?? ''}
                    onChange={(e) => {
                      const val = e.target.value ? parseFloat(e.target.value) : null
                      setSettings((s) => ({ ...s, exchangeRate: val }))
                    }}
                    onBlur={() => {
                      handleUpdateSetting('exchangeRate', settings.exchangeRate)
                    }}
                    className="w-32 bg-secondary border-border"
                    disabled={saving}
                  />
                  <span className="text-sm text-muted-foreground">{settings.currency}</span>
                </div>
                {settings.exchangeRate && settings.exchangeRate > 0 && (
                  <p className="text-xs text-muted-foreground">
                    1 {settings.currency} = ${(1 / settings.exchangeRate).toFixed(4)} USD
                  </p>
                )}
              </div>
            )}

            {/* Language Selector */}
            <div className="p-4 bg-secondary/20 rounded-lg border border-border/30 space-y-3">
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 text-primary" />
                <div>
                  <Label className="uppercase text-xs tracking-wider text-muted-foreground">
                    {t('language')}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('languageDesc')}
                  </p>
                </div>
              </div>
              <Select
                value={currentLocale}
                onValueChange={handleLanguageChange}
                disabled={saving}
              >
                <SelectTrigger className="bg-secondary border-border w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {t(lang.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Lock className="w-6 h-6 text-primary" />
              <span>{t('security')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full justify-start hover:border-primary/50 hover:bg-secondary/30 uppercase text-xs tracking-wider bg-transparent"
              onClick={() => {
                setChangePasswordOpen(true)
                setPasswordError(null)
                setNewPassword('')
                setConfirmPassword('')
              }}
            >
              <Lock className="w-4 h-4 mr-2" />
              <span>{t('changePassword')}</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t('changePassword')}</DialogTitle>
            <DialogDescription>
              {t('deleteAccountWarning')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {passwordError && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                {passwordError}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="new-password">{t('newPassword')}</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-secondary border-border"
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t('confirmNewPassword')}</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-secondary border-border"
                autoComplete="new-password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChangePasswordOpen(false)}
              disabled={passwordSaving}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={passwordSaving || !newPassword || !confirmPassword}
            >
              {passwordSaving ? tCommon('saving') : tCommon('update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
