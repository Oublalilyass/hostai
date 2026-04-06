'use client';
// src/app/auth/login/page.tsx

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { t } from '@/lib/i18n';

export default function LoginPage() {
  const { login, lang } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || t(lang, 'error'));
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: 'host@hostai.demo', password: 'password123' });

  return (
    <div className="min-h-screen flex" style={{ background: '#F7F7F7' }}>
      {/* Left - Hero */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #FF385C 0%, #E31C5F 50%, #C0135A 100%)' }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">HostAI</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight mb-4">
            AI-powered hosting,<br />effortlessly automated
          </h1>
          <p className="text-white/80 text-lg">
            Automate check-ins, guest messaging, and cleaning notifications across all your properties.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { stat: '3x', label: 'Faster guest response' },
            { stat: '80%', label: 'Less manual work' },
            { stat: '3', label: 'Languages supported' },
            { stat: '24/7', label: 'AI assistance' },
          ].map(({ stat, label }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-2xl font-bold">{stat}</div>
              <div className="text-sm text-white/70 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">HostAI</span>
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ color: '#222' }}>
            {t(lang, 'welcomeBack')} 👋
          </h2>
          <p className="text-sm mb-8" style={{ color: '#717171' }}>
            {t(lang, 'loginSubtitle')}
          </p>

          {/* Demo credentials banner */}
          <div className="mb-6 p-4 rounded-xl border flex items-start gap-3 cursor-pointer hover:bg-blue-50 transition-colors"
            style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}
            onClick={fillDemo}>
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#2563EB' }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: '#1D4ED8' }}>Demo credentials (click to fill)</p>
              <p className="text-xs" style={{ color: '#3B82F6' }}>host@hostai.demo / password123</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl flex items-center gap-2"
              style={{ background: '#FFF0F3', color: '#FF385C' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t(lang, 'email')}</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="label">{t(lang, 'password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#717171' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? t(lang, 'loading') : t(lang, 'login')}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#717171' }}>
            {t(lang, 'noAccount')}{' '}
            <Link href="/auth/register" className="font-semibold underline" style={{ color: '#222' }}>
              {t(lang, 'register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
