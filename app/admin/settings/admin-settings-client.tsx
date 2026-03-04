'use client'

import { useState, useCallback } from 'react'
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
import { Palette, Globe, Lock } from 'lucide-react'
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
  { value: 'EUR', label: '€ EUR' },
] as const

const TIMEZONES = [
  { value: 'America/Mexico_City', label: 'Mexico City (GMT-6)' },
  { value: 'America/Bogota', label: 'Bogota (GMT-5)' },
  { value: 'America/Lima', label: 'Lima (GMT-5)' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (GMT-3)' },
  { value: 'America/Sao_Paulo', label: 'Sao Paulo (GMT-3)' },
  { value: 'America/New_York', label: 'New York (GMT-5)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)' },
  { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
  { value: 'Europe/London', label: 'London (GMT+0)' },
] as const

type AdminSettingsClientProps = {
  initialSettings: UserSettings
}

export function AdminSettingsClient({ initialSettings }: AdminSettingsClientProps) {
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
          <h1 className="text-4xl font-bold text-foreground tracking-wider">SETTINGS</h1>
          <p className="text-muted-foreground mt-2 uppercase text-xs tracking-widest">
            Admin preferences
          </p>
        </div>

        {/* Appearance */}
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Palette className="w-6 h-6 text-primary" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-secondary/20 rounded-lg border border-border/30">
              <p className="font-semibold uppercase text-sm tracking-wider mb-4">Color Scheme</p>
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
              <span>Regional</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="uppercase text-xs tracking-wider text-muted-foreground">
                  Currency
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
                  Timezone
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
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Lock className="w-6 h-6 text-primary" />
              <span>Security</span>
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
              <span>Change Password</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Change Password</DialogTitle>
            <DialogDescription>
              Enter your new password. It must be at least 6 characters.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {passwordError && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                {passwordError}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
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
              <Label htmlFor="confirm-password">Confirm password</Label>
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
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={passwordSaving || !newPassword || !confirmPassword}
            >
              {passwordSaving ? 'Updating...' : 'Update password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
