'use client';
// src/app/dashboard/page.tsx

import { useEffect, useState } from 'react';
import { Building2, CalendarDays, Sparkles, Bell, ArrowRight, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StatCard, Badge } from '@/components/ui';
import { dashboardAPI, bookingsAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { t } from '@/lib/i18n';
import Link from 'next/link';
import { format } from 'date-fns';

function getGreeting(lang: string): string {
  const h = new Date().getHours();
  if (lang === 'fr') return h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
  if (lang === 'es') return h < 12 ? 'Buenos días' : h < 18 ? 'Buenas tardes' : 'Buenas noches';
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export default function DashboardPage() {
  const { user, lang } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardAPI.stats(),
      bookingsAPI.list(),
      dashboardAPI.notifications(),
    ]).then(([s, b, n]) => {
      setStats(s.data.stats);
      setBookings(b.data.bookings.slice(0, 5));
      setNotifications(n.data.notifications.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await dashboardAPI.markAllRead();
    setNotifications(n => n.map(x => ({ ...x, read: true })));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-sand rounded-xl w-64" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-sand rounded-2xl" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#222' }}>
            {getGreeting(lang)}, {user?.first_name} 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#717171' }}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Link href="/bookings" className="btn-primary">
          <CalendarDays className="w-4 h-4" />
          {t(lang, 'addBooking')}
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title={t(lang, 'totalProperties')}
          value={stats?.totalProperties ?? 0}
          icon={<Building2 className="w-5 h-5" />}
          color="#FF385C"
        />
        <StatCard
          title={t(lang, 'activeBookings')}
          value={stats?.activeBookings ?? 0}
          icon={<CalendarDays className="w-5 h-5" />}
          color="#00A699"
          subtitle={`${stats?.upcomingCheckins ?? 0} check-ins this week`}
        />
        <StatCard
          title={t(lang, 'pendingCleaning')}
          value={stats?.pendingCleaning ?? 0}
          icon={<span className="text-lg">🧹</span>}
          color="#FC642D"
        />
        <StatCard
          title={t(lang, 'aiMessages')}
          value={stats?.aiMessagesThisMonth ?? 0}
          icon={<Sparkles className="w-5 h-5" />}
          color="#6366F1"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-sand">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg" style={{ color: '#222' }}>
              {t(lang, 'recentBookings')}
            </h2>
            <Link href="/bookings" className="text-sm font-medium flex items-center gap-1 hover:underline"
              style={{ color: '#FF385C' }}>
              {t(lang, 'viewAll')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: '#717171' }}>{t(lang, 'noBookings')}</p>
              <Link href="/bookings" className="btn-primary mt-3 inline-flex text-sm py-2">
                {t(lang, 'addBooking')}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <Link key={booking.id} href={`/bookings?id=${booking.id}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-beach transition-colors group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
                    {booking.guest_name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: '#222' }}>{booking.guest_name}</p>
                    <p className="text-xs truncate" style={{ color: '#717171' }}>
                      {booking.title_en} · {format(new Date(booking.check_in), 'MMM d')} → {format(new Date(booking.check_out), 'MMM d')}
                    </p>
                  </div>
                  <Badge status={booking.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg" style={{ color: '#222' }}>
              <Bell className="w-4 h-4 inline mr-1.5 mb-0.5" />
              {t(lang, 'recentNotifications')}
            </h2>
            {notifications.some(n => !n.read) && (
              <button onClick={markAllRead} className="text-xs font-medium" style={{ color: '#717171' }}>
                {t(lang, 'markAllRead')}
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: '#00A699' }} />
              <p className="text-sm" style={{ color: '#717171' }}>{t(lang, 'noNotifications')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div key={n.id}
                  className="p-3 rounded-xl transition-colors"
                  style={{ background: n.read ? 'transparent' : '#FFF0F3' }}>
                  <div className="flex items-start gap-2">
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#FF385C' }} />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium" style={{ color: '#222' }}>{n.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#717171' }}>{n.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
