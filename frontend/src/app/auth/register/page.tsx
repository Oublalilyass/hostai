'use client';
// src/app/auth/register/page.tsx

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { t, type Lang } from '@/lib/i18n';
import { Select } from '@/components/ui';

export default function RegisterPage() {
  const { register, lang } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    email: '', password: '', first_name: '', last_name: '',
    preferred_language: 'en' as Lang,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || t(lang, 'error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#F7F7F7' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold" style={{ color: '#222' }}>HostAI</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-card">
          <h2 className="text-2xl font-bold mb-1 text-center" style={{ color: '#222' }}>
            {t(lang, 'createAccount')}
          </h2>
          <p className="text-sm text-center mb-6" style={{ color: '#717171' }}>
            Join thousands of hosts automating their workflow
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl flex items-center gap-2"
              style={{ background: '#FFF0F3', color: '#FF385C' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">{t(lang, 'firstName')}</label>
                <input type="text" className="input" placeholder="Sophie"
                  value={form.first_name} onChange={set('first_name')} required />
              </div>
              <div>
                <label className="label">{t(lang, 'lastName')}</label>
                <input type="text" className="input" placeholder="Martin"
                  value={form.last_name} onChange={set('last_name')} required />
              </div>
            </div>

            <div>
              <label className="label">{t(lang, 'email')}</label>
              <input type="email" className="input" placeholder="you@example.com"
                value={form.email} onChange={set('email')} required />
            </div>

            <div>
              <label className="label">{t(lang, 'password')}</label>
              <input type="password" className="input" placeholder="Min. 8 characters"
                value={form.password} onChange={set('password')} required minLength={8} />
            </div>

            <div>
              <label className="label">{t(lang, 'language')}</label>
              <Select value={form.preferred_language} onChange={set('preferred_language')}>
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="es">🇪🇸 Español</option>
              </Select>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? t(lang, 'loading') : t(lang, 'register')}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: '#717171' }}>
            {t(lang, 'alreadyHaveAccount')}{' '}
            <Link href="/auth/login" className="font-semibold underline" style={{ color: '#222' }}>
              {t(lang, 'login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
