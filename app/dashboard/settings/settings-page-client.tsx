'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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
import {
  Palette,
  Bell,
  Globe,
  Lock,
  AlertTriangle,
  CreditCard,
  Scan,
  UserPlus,
  Trash2,
} from 'lucide-react'
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

type SettingsPageClientProps = {
  initialSettings: UserSettings
}

export function SettingsPageClient({ initialSettings }: SettingsPageClientProps) {
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings>(initialSettings)
  const [saving, setSaving] = useState(false)

  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSaving, setPasswordSaving] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

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

  const handleDeleteAccount = useCallback(async () => {
    if (deleteConfirmText !== 'DELETE') return
    toast.error('Account deletion is not yet implemented')
    setDeleteDialogOpen(false)
    setDeleteConfirmText('')
  }, [deleteConfirmText])

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-wider">SETTINGS</h1>
          <p className="text-muted-foreground mt-2 uppercase text-xs tracking-widest">
            Configure your preferences
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

        {/* Notifications */}
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Bell className="w-6 h-6 text-primary" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="font-semibold uppercase text-sm tracking-wider">Expiring Memberships</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get notified when memberships are about to expire
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.notifyExpiring}
                onCheckedChange={(v) => handleUpdateSetting('notifyExpiring', v)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="font-semibold uppercase text-sm tracking-wider">Payments Received</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get notified when you receive payments
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.notifyPayments}
                onCheckedChange={(v) => handleUpdateSetting('notifyPayments', v)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <Scan className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-semibold uppercase text-sm tracking-wider">Member Check-ins</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get notified when members check in
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.notifyCheckins}
                onCheckedChange={(v) => handleUpdateSetting('notifyCheckins', v)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <UserPlus className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold uppercase text-sm tracking-wider">New Registrations</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get notified when new members register
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.notifyNewMembers}
                onCheckedChange={(v) => handleUpdateSetting('notifyNewMembers', v)}
                disabled={saving}
              />
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

        {/* Danger Zone */}
        <Card className="card-cyber border-destructive/30">
          <CardHeader>
            <CardTitle className="text-xl text-destructive flex items-center gap-3">
              <Trash2 className="w-6 h-6" />
              <span>Danger Zone</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full justify-start border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive uppercase text-xs tracking-wider bg-transparent"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span>Delete Account</span>
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
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

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone. All your data including members,
              payments, trainers, and branches will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="delete-confirm">
                Type <span className="font-mono text-destructive">DELETE</span> to confirm
              </Label>
              <Input
                id="delete-confirm"
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="bg-secondary border-border font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setDeleteConfirmText('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'DELETE'}
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
