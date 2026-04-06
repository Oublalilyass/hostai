'use client';
// src/components/layout/Sidebar.tsx

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, CalendarDays, MessageSquareText,
  Sparkles, LogOut, ChevronDown, Globe, BellRing,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { t, type Lang } from '@/lib/i18n';
import { useState } from 'react';
import clsx from 'clsx';

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export default function Sidebar() {
  const { user, lang, setLang, logout } = useAuth();
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);

  const nav = [
    { href: '/dashboard', icon: LayoutDashboard, key: 'dashboard' as const },
    { href: '/properties', icon: Building2, key: 'properties' as const },
    { href: '/bookings', icon: CalendarDays, key: 'bookings' as const },
    { href: '/ai-chat', icon: Sparkles, key: 'aiChat' as const },
    { href: '/cleaning', icon: MessageSquareText, key: 'cleaning' as const },
  ];

  const currentLang = LANGS.find(l => l.code === lang);

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-white border-r border-sand overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-sand">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold" style={{ color: '#222' }}>HostAI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, icon: Icon, key }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={clsx('nav-item', active && 'active')}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{t(lang, key)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-sand space-y-1">
        {/* Language switcher */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="nav-item w-full justify-between"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4" />
              <span>{currentLang?.flag} {currentLang?.label}</span>
            </div>
            <ChevronDown className={clsx('w-3 h-3 transition-transform', langOpen && 'rotate-180')} />
          </button>
          {langOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-sand rounded-xl shadow-lg py-1 z-50">
              {LANGS.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setLangOpen(false); }}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-beach transition-colors',
                    lang === l.code && 'font-semibold text-rausch'
                  )}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications link */}
        <Link href="/dashboard" className="nav-item">
          <BellRing className="w-4 h-4" />
          <span>{t(lang, 'recentNotifications')}</span>
        </Link>

        {/* User + Logout */}
        <div className="pt-2 mt-2 border-t border-sand">
          <div className="flex items-center gap-3 px-4 py-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: '#222' }}>
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs truncate" style={{ color: '#717171' }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="nav-item w-full text-left">
            <LogOut className="w-4 h-4" />
            <span>{t(lang, 'logout')}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
