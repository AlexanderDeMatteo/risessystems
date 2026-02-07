'use client'

import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Bell, Lock, Palette, Moon, Save } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-wider">SETTINGS</h1>
            <p className="text-muted-foreground mt-2 uppercase text-xs tracking-widest">Configure your preferences</p>
          </div>

          {/* Notifications Settings */}
          <Card className="card-cyber">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Bell className="w-6 h-6 text-primary" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
                <div>
                  <p className="font-semibold uppercase text-sm tracking-wider">In-App Notifications</p>
                  <p className="text-xs text-muted-foreground mt-1">Receive notifications within the app</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
                <div>
                  <p className="font-semibold uppercase text-sm tracking-wider">Email Alerts</p>
                  <p className="text-xs text-muted-foreground mt-1">Get important updates via email</p>
                </div>
                <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="card-cyber">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Lock className="w-6 h-6 text-primary" />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
                <div>
                  <p className="font-semibold uppercase text-sm tracking-wider">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground mt-1">Add extra layer of security</p>
                </div>
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
              </div>

              <Button variant="outline" className="w-full justify-start hover:border-primary/50 hover:bg-secondary/30 uppercase text-xs tracking-wider bg-transparent">
                <span>Change Password</span>
              </Button>

              <Button variant="outline" className="w-full justify-start hover:border-primary/50 hover:bg-secondary/30 uppercase text-xs tracking-wider bg-transparent">
                <span>Manage Active Sessions</span>
              </Button>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="card-cyber">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Palette className="w-6 h-6 text-primary" />
                <span>Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
                <div>
                  <p className="font-semibold uppercase text-sm tracking-wider flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Always use dark theme</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="p-4 bg-secondary/20 rounded-lg border border-border/30">
                <p className="font-semibold uppercase text-sm tracking-wider mb-4">Color Scheme</p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="h-10 rounded-lg bg-primary border-2 border-primary neon-glow shadow-[0_0_12px_rgba(163,230,53,0.4)] cursor-pointer transition-all" title="Neon Acid" />
                  <div className="h-10 rounded-lg bg-emerald-500 border-2 border-border cursor-pointer hover:border-emerald-500 transition-colors" title="Emerald" />
                  <div className="h-10 rounded-lg bg-blue-500 border-2 border-border cursor-pointer hover:border-blue-500 transition-colors" title="Blue" />
                  <div className="h-10 rounded-lg bg-orange-500 border-2 border-border cursor-pointer hover:border-orange-500 transition-colors" title="Orange" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="card-cyber border-destructive/30">
            <CardHeader>
              <CardTitle className="text-xl text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full justify-start border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive uppercase text-xs tracking-wider bg-transparent">
                <span>Delete Account</span>
              </Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase text-xs tracking-widest font-bold flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button variant="outline" className="hover:border-primary/50 hover:bg-secondary/30 uppercase text-xs tracking-widest font-bold bg-transparent">
              Cancel
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
