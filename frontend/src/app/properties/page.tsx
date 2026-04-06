'use client';
// src/app/properties/page.tsx

import { useEffect, useState } from 'react';
import {
  Building2, Plus, MapPin, Users, BedDouble, Bath,
  Pencil, Trash2, ToggleLeft, ToggleRight, Star
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Modal, EmptyState, Field, Select, Textarea, ConfirmDialog, Spinner } from '@/components/ui';
import { propertiesAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { t } from '@/lib/i18n';
import Image from 'next/image';

const EMPTY_FORM = {
  title_en: '', title_fr: '', title_es: '',
  description_en: '', description_fr: '', description_es: '',
  checkin_instructions_en: '', checkin_instructions_fr: '', checkin_instructions_es: '',
  address: '', city: '', country: '',
  property_type: 'apartment', max_guests: 2, bedrooms: 1, bathrooms: 1,
  images: '',
  cleaner_email: '', cleaner_name: '',
};

type Property = any;

export default function PropertiesPage() {
  const { lang } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProp, setEditProp] = useState<Property | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('en');

  const load = async () => {
    setLoading(true);
    const res = await propertiesAPI.list();
    setProperties(res.data.properties);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditProp(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (p: Property) => {
    setEditProp(p);
    setForm({
      ...p,
      images: (p.images || []).join('\n'),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        ...form,
        images: form.images ? form.images.split('\n').filter(Boolean) : [],
        max_guests: Number(form.max_guests),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
      };
      if (editProp) {
        await propertiesAPI.update(editProp.id, data);
      } else {
        await propertiesAPI.create(data);
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
    await propertiesAPI.delete(deleteId);
    setDeleting(false);
    setDeleteId(null);
    load();
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  const getTitle = (p: Property) => p[`title_${lang}`] || p.title_en || 'Untitled';

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#222' }}>{t(lang, 'properties')}</h1>
          <p className="text-sm mt-0.5" style={{ color: '#717171' }}>
            {properties.length} {properties.length === 1 ? 'property' : 'properties'}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-4 h-4" />
          {t(lang, 'addProperty')}
        </button>
      </div>

      {/* Properties grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : properties.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-8 h-8" />}
          title={t(lang, 'noProperties')}
          description={t(lang, 'addFirstProperty')}
          action={
            <button onClick={openCreate} className="btn-primary">
              <Plus className="w-4 h-4" />
              {t(lang, 'addProperty')}
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((p) => {
            const img = p.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800';
            return (
              <div key={p.id} className="card group">
                {/* Property image */}
                <div className="relative h-52 overflow-hidden">
                  <img src={img} alt={getTitle(p)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.is_active ? 'bg-white text-green-700' : 'bg-black/40 text-white'}`}>
                      {p.is_active ? '● Active' : '○ Inactive'}
                    </span>
                  </div>
                  {/* Property type */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs font-medium text-white capitalize bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {p.property_type}
                    </span>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-4">
                  <h3 className="font-semibold text-base mb-1 line-clamp-1" style={{ color: '#222' }}>
                    {getTitle(p)}
                  </h3>
                  <div className="flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#717171' }} />
                    <span className="text-xs truncate" style={{ color: '#717171' }}>
                      {p.city ? `${p.city}, ` : ''}{p.country || p.address}
                    </span>
                  </div>

                  {/* Amenities row */}
                  <div className="flex items-center gap-4 mb-4 text-xs" style={{ color: '#717171' }}>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {p.max_guests} {t(lang, 'guests')}
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5" /> {p.bedrooms} bed
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5" /> {p.bathrooms} bath
                    </span>
                  </div>

                  {/* Counts */}
                  {(Number(p.active_bookings) > 0 || Number(p.pending_cleanings) > 0) && (
                    <div className="flex gap-2 mb-4">
                      {Number(p.active_bookings) > 0 && (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: '#E3F2FD', color: '#1565C0' }}>
                          {p.active_bookings} {t(lang, 'activeBookingsCount')}
                        </span>
                      )}
                      {Number(p.pending_cleanings) > 0 && (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: '#FFF8E1', color: '#F57F17' }}>
                          {p.pending_cleanings} {t(lang, 'pendingCleaningCount')}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-sand">
                    <button onClick={() => openEdit(p)}
                      className="flex-1 btn-secondary text-xs py-2 px-3">
                      <Pencil className="w-3.5 h-3.5" />
                      {t(lang, 'edit')}
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="p-2 rounded-xl hover:bg-red-50 transition-colors"
                      style={{ color: '#FF385C' }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
        title={editProp ? t(lang, 'editProperty') : t(lang, 'addProperty')}
        size="lg">
        {/* Language tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: '#F7F7F7' }}>
          {['en', 'fr', 'es'].map(code => (
            <button key={code}
              onClick={() => setActiveTab(code)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === code ? 'bg-white shadow-sm font-semibold' : ''}`}
              style={{ color: activeTab === code ? '#222' : '#717171' }}>
              {code === 'en' ? '🇬🇧 EN' : code === 'fr' ? '🇫🇷 FR' : '🇪🇸 ES'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* Multilingual fields */}
          {(['en', 'fr', 'es'] as const).map(code => activeTab === code && (
            <div key={code} className="space-y-4">
              <Field label={`${t(lang, 'propertyTitle')} (${code.toUpperCase()})`}>
                <input className="input" value={(form as any)[`title_${code}`]}
                  onChange={set(`title_${code}`)} placeholder={`Title in ${code.toUpperCase()}`} />
              </Field>
              <Field label={`${t(lang, 'description')} (${code.toUpperCase()})`}>
                <Textarea value={(form as any)[`description_${code}`]}
                  onChange={set(`description_${code}`)} rows={2}
                  placeholder={`Description in ${code.toUpperCase()}`} />
              </Field>
              <Field label={`${t(lang, 'checkinInstructions')} (${code.toUpperCase()})`}>
                <Textarea value={(form as any)[`checkin_instructions_${code}`]}
                  onChange={set(`checkin_instructions_${code}`)} rows={2}
                  placeholder={`Check-in instructions in ${code.toUpperCase()}`} />
              </Field>
            </div>
          ))}

          <hr className="border-sand" />

          {/* Location */}
          <Field label={t(lang, 'address')}>
            <input className="input" value={form.address} onChange={set('address')} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t(lang, 'city')}>
              <input className="input" value={form.city} onChange={set('city')} />
            </Field>
            <Field label={t(lang, 'country')}>
              <input className="input" value={form.country} onChange={set('country')} />
            </Field>
          </div>

          {/* Property details */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t(lang, 'propertyType')}>
              <Select value={form.property_type} onChange={set('property_type')}>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="loft">Loft</option>
                <option value="studio">Studio</option>
              </Select>
            </Field>
            <Field label={t(lang, 'maxGuests')}>
              <input type="number" className="input" value={form.max_guests}
                onChange={set('max_guests')} min={1} max={20} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t(lang, 'bedrooms')}>
              <input type="number" className="input" value={form.bedrooms}
                onChange={set('bedrooms')} min={0} />
            </Field>
            <Field label={t(lang, 'bathrooms')}>
              <input type="number" className="input" value={form.bathrooms}
                onChange={set('bathrooms')} min={1} />
            </Field>
          </div>

          {/* Images */}
          <Field label="Image URLs (one per line)">
            <Textarea value={form.images} onChange={set('images')}
              rows={2} placeholder="https://..." />
          </Field>

          <hr className="border-sand" />

          {/* Cleaner info */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t(lang, 'cleanerName')}>
              <input className="input" value={form.cleaner_name} onChange={set('cleaner_name')} />
            </Field>
            <Field label={t(lang, 'cleanerEmail')}>
              <input type="email" className="input" value={form.cleaner_email} onChange={set('cleaner_email')} />
            </Field>
          </div>

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

      {/* Delete confirm */}
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
