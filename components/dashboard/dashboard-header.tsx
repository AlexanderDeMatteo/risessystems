'use client'

import { Link, usePathname } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { User, LayoutDashboard, Users, Scan, DollarSign, LogOut, Dumbbell, MapPin, CreditCard, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NotificationsPopover } from '@/components/dashboard/notifications-popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function DashboardHeader() {
  const pathname = usePathname()
  const tNav = useTranslations('nav')

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
    { href: '/dashboard/members', labelKey: 'members', icon: Users },
    { href: '/dashboard/plans', labelKey: 'plans', icon: CreditCard },
    { href: '/dashboard/trainers', labelKey: 'trainers', icon: Dumbbell },
    { href: '/dashboard/branches', labelKey: 'branches', icon: MapPin },
    { href: '/dashboard/qr-scanner', labelKey: 'qrScanner', icon: Scan },
    { href: '/dashboard/competitions', labelKey: 'competitions', icon: Trophy },
    { href: '/dashboard/accounting', labelKey: 'accounting', icon: DollarSign },
  ]

  return (
    <header className="border-b border-border/50 bg-card neon-glow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top bar */}
        <div className="py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center neon-glow transition-all duration-300 group-hover:neon-glow">
              <span className="text-primary-foreground font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-wider">RISESYSTEM</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Gym Management</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <NotificationsPopover />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border/50 shadow-[0_0_20px_hsl(var(--primary)_/_0.1)]">
                <Link href="/dashboard/profile">
                  <DropdownMenuItem className="uppercase text-xs tracking-wider cursor-pointer hover:bg-secondary/50 hover:text-primary transition-colors">
                    {tNav('profile')}
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard/settings">
                  <DropdownMenuItem className="uppercase text-xs tracking-wider cursor-pointer hover:bg-secondary/50 hover:text-primary transition-colors">
                    {tNav('settings')}
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-border/30" />
                <Link href="/logout">
                  <DropdownMenuItem className="text-destructive uppercase text-xs tracking-wider cursor-pointer hover:bg-destructive/10 transition-colors">
                    <LogOut className="w-4 h-4 mr-2" />
                    {tNav('logout')}
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex gap-1 border-t border-border/30 pt-4 pb-0">
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-all duration-300 uppercase tracking-wider text-xs font-semibold ${
                  isActive(item.href)
                    ? 'bg-secondary/50 border-primary text-primary shadow-[0_0_10px_hsl(var(--primary)_/_0.2)]'
                    : 'border-transparent text-muted-foreground hover:text-primary hover:border-primary/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tNav(item.labelKey)}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
