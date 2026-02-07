'use client'

import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Building, Shield, CheckCircle } from 'lucide-react'

export default function ProfilePage() {
  const user = {
    name: 'Alex Johnson',
    email: 'alex@gymnastics-pro.com',
    phone: '+1 (555) 123-4567',
    gym: 'Gymnastics Pro',
    location: 'New York, NY',
    plan: 'Premium',
    joinDate: 'January 15, 2024',
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-wider">PROFILE</h1>
            <p className="text-muted-foreground mt-2 uppercase text-xs tracking-widest">Manage your account information</p>
          </div>

          {/* Profile Card */}
          <Card className="card-cyber">
            <CardHeader>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center neon-glow">
                  <span className="text-4xl font-bold text-primary">AJ</span>
                </div>
                <div>
                  <CardTitle className="text-3xl font-mono">{user.name}</CardTitle>
                  <p className="text-sm text-primary uppercase tracking-wider mt-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {user.gym}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold uppercase text-sm tracking-wider text-primary border-b border-primary/30 pb-2">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Mail className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                        <p className="text-sm font-mono text-foreground mt-1">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                        <p className="text-sm font-mono text-foreground mt-1">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                        <p className="text-sm font-mono text-foreground mt-1">{user.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscription Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold uppercase text-sm tracking-wider text-primary border-b border-primary/30 pb-2">Subscription</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Building className="w-5 h-5 text-success mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Plan</p>
                        <p className="text-sm font-mono text-success mt-1">{user.plan}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-5 h-5 text-success mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Member Since</p>
                        <p className="text-sm font-mono text-success mt-1">{user.joinDate}</p>
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

              {/* Edit Button */}
              <div className="pt-6 border-t border-border/50">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase text-xs tracking-widest font-bold">
                  Edit Profile
                </Button>
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
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-left hover:border-primary/50 hover:bg-secondary/30 bg-transparent">
                <span>Change Password</span>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left hover:border-primary/50 hover:bg-secondary/30 bg-transparent">
                <span>Two-Factor Authentication</span>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left hover:border-primary/50 hover:bg-secondary/30 bg-transparent">
                <span>Active Sessions</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
