'use client';
// src/app/bookings/page.tsx

import { useEffect, useState } from 'react';
import {
  CalendarDays, Plus, Search, User, MapPin,
  Pencil, Trash2, MessageSquare, ArrowRight
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Modal, EmptyState, Badge, Field, Select, Textarea, ConfirmDialog, Spinner } from '@/components/ui';
import { bookingsAPI, propertiesAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { t } from '@/lib/i18n';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';

const STATUSES = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];
const SOURCES = ['manual', 'airbnb', 'booking.com', 'vrbo', 'other'];

const EMPTY_FORM = {
  property_id: '', guest_name: '', guest_email: '', guest_phone: '',
  guest_language: 'en', num_guests: 1,
  check_in: '', check_out: '',
  special_instructions: '', source: 'manual', status: 'confirmed',
};

export default function BookingsPage() {
  const { lang } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editBooking, setEditBooking] = useState<any>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const [b, p] = await Promise.all([bookingsAPI.list(), propertiesAPI.list()]);
    setBookings(b.data.bookings);
    setProperties(p.data.properties);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const match = !q || b.guest_name?.toLowerCase().includes(q) || b.title_en?.toLowerCase().includes(q);
    const st = !statusFilter || b.status === statusFilter;
    return match && st;
  });

  const openCreate = () => {
    setEditBooking(null);
    setForm({ ...EMPTY_FORM, property_id: properties[0]?.id || '' });
    setModalOpen(true);
  };

  const openEdit = (b: any) => {
    setEditBooking(b);
    setForm({
      property_id: b.property_id,
      guest_name: b.guest_name, guest_email: b.guest_email || '',
      guest_phone: b.guest_phone || '', guest_language: b.guest_language,
      num_guests: b.num_guests,
      check_in: b.check_in?.split('T')[0] || '',
      check_out: b.check_out?.split('T')[0] || '',
      special_instructions: b.special_instructions || '',
      source: b.source, status: b.status,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { ...form, num_guests: Number(form.num_guests) };
      if (editBooking) {
        await bookingsAPI.update(editBooking.id, data);
      } else {
        await bookingsAPI.create(data);
      }
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await bookingsAPI.delete(deleteId);
    setDeleting(false);
    setDeleteId(null);
    load();
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  const nights = (b: any) => {
    const n = differenceInDays(new Date(b.check_out), new Date(b.check_in));
    return isNaN(n) ? 0 : n;
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#222' }}>{t(lang, 'bookings')}</h1>
          <p className="text-sm mt-0.5" style={{ color: '#717171' }}>
            {filtered.length} {filtered.length === 1 ? 'booking' : 'bookings'}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-4 h-4" />
          {t(lang, 'addBooking')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#717171' }} />
          <input className="input pl-9" placeholder="Search guests or properties..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-44"
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {/* Bookings list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="w-8 h-8" />}
          title={t(lang, 'noBookings')}
          description="Add your first booking to get started"
          action={
            <button onClick={openCreate} className="btn-primary">
              <Plus className="w-4 h-4" />
              {t(lang, 'addBooking')}
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const propImg = b.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400';
            const n = nights(b);
            return (
              <div key={b.id}
                className="bg-white rounded-2xl border border-sand p-4 flex items-center gap-4 hover:shadow-card transition-all group">
                {/* Property thumbnail */}
                <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={propImg} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm" style={{ color: '#222' }}>{b.guest_name}</p>
                        <Badge status={b.status} />
                      </div>
                      <p className="text-xs truncate" style={{ color: '#717171' }}>
                        <MapPin className="w-3 h-3 inline mr-0.5" />
                        {b.title_en}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#717171' }}>
                    <span>📅 {format(new Date(b.check_in), 'MMM d')} → {format(new Date(b.check_out), 'MMM d, yyyy')}</span>
                    <span>🌙 {n} {t(lang, 'nights')}</span>
                    <span>👥 {b.num_guests} {t(lang, 'guests')}</span>
                    {b.source !== 'manual' && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                        style={{ background: '#F3E5F5', color: '#6A1B9A' }}>
                        {b.source}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/ai-chat?booking=${b.id}`}
                    className="p-2 rounded-xl hover:bg-beach transition-colors"
                    title="AI Messages"
                    style={{ color: '#6366F1' }}>
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                  <button onClick={() => openEdit(b)}
                    className="p-2 rounded-xl hover:bg-beach transition-colors"
                    style={{ color: '#717171' }}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(b.id)}
                    className="p-2 rounded-xl hover:bg-red-50 transition-colors"
                    style={{ color: '#FF385C' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editBooking ? t(lang, 'editBooking') : t(lang, 'addBooking')}
        size="md">
        <div className="space-y-4">
          <Field label={t(lang, 'property')}>
            <Select value={form.property_id} onChange={set('property_id')} required>
              <option value="">Select a property</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>
                  {p[`title_${lang}`] || p.title_en}
                </option>
              ))}
            </Select>
          </Field>

          <Field label={t(lang, 'guestName')}>
            <input className="input" value={form.guest_name} onChange={set('guest_name')} required />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t(lang, 'guestEmail')}>
              <input type="email" className="input" value={form.guest_email} onChange={set('guest_email')} />
            </Field>
            <Field label={t(lang, 'guestPhone')}>
              <input type="tel" className="input" value={form.guest_phone} onChange={set('guest_phone')} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t(lang, 'guestLanguage')}>
              <Select value={form.guest_language} onChange={set('guest_language')}>
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="es">🇪🇸 Español</option>
              </Select>
            </Field>
            <Field label={t(lang, 'numGuests')}>
              <input type="number" className="input" value={form.num_guests}
                onChange={set('num_guests')} min={1} max={20} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t(lang, 'checkIn')}>
              <input type="date" className="input" value={form.check_in} onChange={set('check_in')} required />
            </Field>
            <Field label={t(lang, 'checkOut')}>
              <input type="date" className="input" value={form.check_out} onChange={set('check_out')} required />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t(lang, 'source')}>
              <Select value={form.source} onChange={set('source')}>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label={t(lang, 'status')}>
              <Select value={form.status} onChange={set('status')}>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </Select>
            </Field>
          </div>

          <Field label={t(lang, 'specialInstructions')}>
            <Textarea value={form.special_instructions} onChange={set('special_instructions')} rows={2} />
          </Field>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
              {t(lang, 'cancel')}
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
              {saving ? <Spinner size="sm" /> : t(lang, 'save')}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title={t(lang, 'delete')}
        message={t(lang, 'deleteConfirm')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </DashboardLayout>
  );
}
