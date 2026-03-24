'use client'

import { Link, usePathname } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { User, LayoutDashboard, Building2, BarChart3, DollarSign, CreditCard, LogOut, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminNotificationsPopover } from '@/components/admin/admin-notifications-popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AdminHeader() {
  const pathname = usePathname()
  const t = useTranslations('admin')

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/admin', labelKey: 'dashboard', icon: LayoutDashboard },
    { href: '/admin/clients', labelKey: 'clients', icon: Building2 },
    { href: '/admin/plans', labelKey: 'plansAndPricing', icon: CreditCard },
    { href: '/admin/analytics', labelKey: 'analytics', icon: BarChart3 },
    { href: '/admin/competitions', labelKey: 'competitions', icon: Trophy },
    { href: '/admin/accounting', labelKey: 'accounting', icon: DollarSign },
  ]

  return (
    <header className="border-b border-border/50 bg-card neon-glow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top bar */}
        <div className="py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center neon-glow transition-all duration-300 group-hover:neon-glow">
              <span className="text-primary-foreground font-bold text-lg">RS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">RisesSystem Admin</h1>
              <p className="text-xs text-muted-foreground">{t('subtitle')}</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <AdminNotificationsPopover />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border/50 shadow-[0_0_20px_hsl(var(--primary)_/_0.1)]">
                <Link href="/admin/profile">
                  <DropdownMenuItem className="uppercase text-xs tracking-wider cursor-pointer hover:bg-secondary/50 hover:text-primary transition-colors">{t('profile')}</DropdownMenuItem>
                </Link>
                <Link href="/admin/settings">
                  <DropdownMenuItem className="uppercase text-xs tracking-wider cursor-pointer hover:bg-secondary/50 hover:text-primary transition-colors">{t('settings')}</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-border/30" />
                <Link href="/logout">
                  <DropdownMenuItem className="text-destructive uppercase text-xs tracking-wider cursor-pointer hover:bg-destructive/10">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('logout')}
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
                <span>{t(item.labelKey)}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
