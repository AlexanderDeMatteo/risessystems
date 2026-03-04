'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Shield, CheckCircle, Edit2, Save, X } from 'lucide-react'
import { updateUserProfile } from '@/app/actions/profile'
import { updatePassword } from '@/app/actions/auth'
import { toast } from 'sonner'
import type { ProfileUser } from '@/app/actions/profile'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  if (parts[0]) return parts[0].slice(0, 2).toUpperCase()
  return '—'
}

type AdminProfileClientProps = {
  userProfile: ProfileUser
}

export function AdminProfileClient({ userProfile }: AdminProfileClientProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(userProfile.name)
  const [editPhone, setEditPhone] = useState(userProfile.phone ?? '')
  const [editLocation, setEditLocation] = useState(userProfile.location ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handleSave = useCallback(async () => {
    setError(null)
    setSaving(true)
    const result = await updateUserProfile({
      name: editName.trim() || undefined,
      phone: editPhone.trim() || null,
      location: editLocation.trim() || null,
    })
    setSaving(false)
    if (result.ok) {
      setIsEditing(false)
      router.refresh()
    } else {
      setError(result.error)
    }
  }, [editName, editPhone, editLocation, router])

  const handleCancel = useCallback(() => {
    setEditName(userProfile.name)
    setEditPhone(userProfile.phone ?? '')
    setEditLocation(userProfile.location ?? '')
    setError(null)
    setIsEditing(false)
  }, [userProfile.name, userProfile.phone, userProfile.location])

  const handleUpdatePassword = useCallback(async () => {
    setPasswordError(null)
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }
    setPasswordSaving(true)
    const result = await updatePassword(newPassword)
    setPasswordSaving(false)
    if (result.ok) {
      toast.success('Password updated successfully.')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setPasswordError(result.error)
    }
  }, [newPassword, confirmPassword])

  useEffect(() => {
    if (!isEditing) {
      setEditName(userProfile.name)
      setEditPhone(userProfile.phone ?? '')
      setEditLocation(userProfile.location ?? '')
    }
  }, [userProfile.name, userProfile.phone, userProfile.location, isEditing])

  const initials = getInitials(isEditing ? editName : userProfile.name)
  const displayPhone = userProfile.phone ?? '—'
  const displayLocation = userProfile.location ?? '—'

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-wider">ADMIN PROFILE</h1>
          <p className="text-muted-foreground mt-2 uppercase text-xs tracking-widest">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <Card className="card-cyber">
          <CardHeader>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center neon-glow">
                <span className="text-4xl font-bold text-primary">{initials}</span>
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Name</Label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-secondary border-border font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-3xl font-mono">{userProfile.name}</CardTitle>
                    <p className="text-sm text-primary uppercase tracking-wider mt-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Platform Administrator
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">{error}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="font-semibold uppercase text-sm tracking-wider text-primary border-b border-primary/30 pb-2">Personal Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                      <p className="text-sm font-mono text-foreground mt-1">{userProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                      {isEditing ? (
                        <Input
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="Your phone number"
                          className="bg-secondary border-border font-mono mt-1"
                        />
                      ) : (
                        <p className="text-sm font-mono text-foreground mt-1">{displayPhone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                      {isEditing ? (
                        <Input
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          placeholder="Your location"
                          className="bg-secondary border-border font-mono mt-1"
                        />
                      ) : (
                        <p className="text-sm font-mono text-foreground mt-1">{displayLocation}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="space-y-4">
                <h3 className="font-semibold uppercase text-sm tracking-wider text-primary border-b border-primary/30 pb-2">Account</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-success mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Member Since</p>
                      <p className="text-sm font-mono text-success mt-1">{userProfile.joinDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-5 h-5 rounded-full bg-success/50 border border-success mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                      <p className="text-sm font-mono text-success mt-1">ACTIVE</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit / Save / Cancel */}
            <div className="pt-6 border-t border-border/50 flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase text-xs tracking-widest font-bold gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={saving} className="uppercase text-xs tracking-widest gap-2">
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase text-xs tracking-widest font-bold gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Shield className="w-6 h-6 text-primary" />
              <span>Security Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Change Password</h4>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-xs uppercase tracking-wider">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-secondary border-border font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-wider">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-secondary border-border font-mono"
                />
              </div>
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
              <Button
                onClick={handleUpdatePassword}
                disabled={passwordSaving || !newPassword || !confirmPassword}
                className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase text-xs tracking-widest font-bold"
              >
                {passwordSaving ? 'Updating...' : 'Update password'}
              </Button>
            </div>
            <Button variant="outline" className="w-full justify-start text-left hover:border-primary/50 hover:bg-secondary/30 bg-transparent" disabled>
              <span>Two-Factor Authentication (coming soon)</span>
            </Button>
            <Button variant="outline" className="w-full justify-start text-left hover:border-primary/50 hover:bg-secondary/30 bg-transparent" disabled>
              <span>Active Sessions (coming soon)</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
