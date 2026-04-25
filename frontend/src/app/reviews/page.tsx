'use client';
// frontend/src/app/reviews/page.tsx

import { useEffect, useState, Suspense } from 'react';
import {
  Star, Send, Sparkles, Plus, CheckCircle2,
  Clock, XCircle, SkipForward, Copy, Check,
  Pencil, Trash2, BarChart3, Zap, AlertTriangle,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Modal, EmptyState, Field, Select, Textarea, ConfirmDialog, Spinner, StatCard } from '@/components/ui';
import { reviewsAPI, bookingsAPI, propertiesAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { format, formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

// ── Types ──────────────────────────────────────────────────────────────────────
interface ReviewRequest {
  id: string;
  booking_id: string;
  guest_name: string;
  guest_email: string;
  guest_language: string;
  message: string;
  platform: string;
  status: 'pending' | 'sent' | 'failed' | 'review_received' | 'skipped';
  review_received: boolean;
  review_rating: number | null;
  review_note: string | null;
  sent_at: string | null;
  scheduled_at: string | null;
  title_en: string;
  title_fr: string;
  title_es: string;
  city: string;
  images: string[];
  check_in: string;
  check_out: string;
  stay_nights: number;
  created_at: string;
}

interface Stats {
  total: string; pending: string; sent: string;
  received: string; skipped: string;
  avg_rating: string | null; conversion_rate: string | null;
}

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
  pending:         { label: 'Pending',         icon: Clock,        color: '#F59E0B', bg: 'rgba(245,158,11,.1)',  border: 'rgba(245,158,11,.25)'  },
  sent:            { label: 'Sent',             icon: Send,         color: '#6366F1', bg: 'rgba(99,102,241,.1)',  border: 'rgba(99,102,241,.25)'  },
  review_received: { label: 'Review Received',  icon: CheckCircle2, color: '#00A699', bg: 'rgba(0,166,153,.1)',   border: 'rgba(0,166,153,.25)'   },
  failed:          { label: 'Failed',           icon: XCircle,      color: '#FF385C', bg: 'rgba(255,56,92,.1)',   border: 'rgba(255,56,92,.25)'   },
  skipped:         { label: 'Skipped',          icon: SkipForward,  color: '#717171', bg: 'rgba(113,113,113,.1)', border: 'rgba(113,113,113,.2)'  },
};

const PLATFORMS = ['airbnb', 'booking.com', 'vrbo', 'email', 'whatsapp', 'manual'];

// ── StarRating ─────────────────────────────────────────────────────────────────
function StarRating({ value, onChange, readonly = false }: {
  value: number | null; onChange?: (v: number) => void; readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button"
          onClick={() => !readonly && onChange?.(n)}
          onMouseEnter={() => !readonly && setHovered(n)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{ background: 'none', border: 'none', padding: 0, cursor: readonly ? 'default' : 'pointer' }}>
          <Star className="w-5 h-5 transition-all"
            fill={(hovered || value || 0) >= n ? '#FBBF24' : 'none'}
            style={{ color: (hovered || value || 0) >= n ? '#FBBF24' : '#DDDDDD' }} />
        </button>
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ReviewsPage() {
  const { lang } = useAuth();
  const [reviews, setReviews]         = useState<ReviewRequest[]>([]);
  const [stats, setStats]             = useState<Stats | null>(null);
  const [bookings, setBookings]       = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [migrationNeeded, setMigrationNeeded] = useState(false);

  // Generate modal
  const [genOpen, setGenOpen]         = useState(false);
  const [genForm, setGenForm]         = useState({ booking_id: '', platform: 'airbnb', send_after_hours: '2', special_note: '' });
  const [generating, setGenerating]   = useState(false);
  const [generated, setGenerated]     = useState<ReviewRequest | null>(null);

  // Edit modal
  const [editOpen, setEditOpen]       = useState(false);
  const [selected, setSelected]       = useState<ReviewRequest | null>(null);
  const [editMsg, setEditMsg]         = useState('');
  const [editRating, setEditRating]   = useState<number | null>(null);
  const [editNote, setEditNote]       = useState('');
  const [editStatus, setEditStatus]   = useState('');
  const [saving, setSaving]           = useState(false);

  // Delete / bulk
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [deleting, setDeleting]       = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [copiedId, setCopiedId]       = useState<string | null>(null);

  // ── Load data ────────────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    try {
      const [rv, bk] = await Promise.all([
        reviewsAPI.list(statusFilter ? { status: statusFilter } : {}),
        bookingsAPI.list({ status: 'checked_out' }),
      ]);
      setReviews(rv.data.reviews  || []);
      setStats(rv.data.stats      || null);
      setBookings(bk.data.bookings || []);
      setMigrationNeeded(!!rv.data.migration_needed);
    } catch (err: any) {
      console.error('Reviews load error:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [statusFilter]);

  // ── Actions ──────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!genForm.booking_id) return;
    setGenerating(true);
    try {
      const res = await reviewsAPI.generate(genForm);
      setGenerated(res.data.reviewRequest);
      load();
    } catch (err: any) {
      alert('Error: ' + (err?.response?.data?.error || err.message));
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = async (id: string) => {
    try {
      await reviewsAPI.send(id);
      load();
    } catch (err: any) {
      alert('Error: ' + (err?.response?.data?.error || err.message));
    }
  };

  const openEdit = (rv: ReviewRequest) => {
    setSelected(rv);
    setEditMsg(rv.message);
    setEditRating(rv.review_rating);
    setEditNote(rv.review_note || '');
    setEditStatus(rv.status);
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await reviewsAPI.update(selected.id, {
        message: editMsg, status: editStatus,
        review_received: editStatus === 'review_received',
        review_rating: editRating, review_note: editNote,
      });
      setEditOpen(false);
      load();
    } catch (err: any) {
      alert('Error: ' + (err?.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await reviewsAPI.delete(deleteId); load(); }
    catch (err: any) { alert('Error: ' + (err?.response?.data?.error || err.message)); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  const handleBulkGenerate = async () => {
    setBulkLoading(true);
    try {
      const res = await reviewsAPI.bulkGenerate({ platform: 'airbnb', send_after_hours: 2 });
      const { created, errors } = res.data;
      if (created === 0) {
        alert('ℹ️ No eligible bookings found.\nMake sure you have bookings with status "checked_out" that don\'t already have a review request.');
      } else {
        alert(`✅ Created ${created} review request${created !== 1 ? 's' : ''}.${errors?.length ? `\n⚠️ ${errors.length} failed — check backend logs.` : ''}`);
      }
      load();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message;
      alert(`❌ Failed: ${msg}`);
    } finally {
      setBulkLoading(false);
    }
  };

  const copyMsg = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTitle = (rv: ReviewRequest) =>
    (rv as any)[`title_${lang}`] || rv.title_en || '';

  // ── Render ───────────────────────────────────────────────────
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#222' }}>Review Requests</h1>
          <p className="text-sm mt-0.5" style={{ color: '#717171' }}>Automate guest review requests after checkout</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleBulkGenerate} disabled={bulkLoading || migrationNeeded}
            className="btn-secondary text-sm py-2.5 px-4 flex items-center gap-2">
            {bulkLoading ? <Spinner size="sm" /> : <Zap className="w-4 h-4" />}
            Bulk generate
          </button>
          <button onClick={() => { setGenOpen(true); setGenerated(null); }}
            disabled={migrationNeeded}
            className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New request
          </button>
        </div>
      </div>

      {/* Migration banner */}
      {migrationNeeded && (
        <div className="mb-6 p-4 rounded-2xl border flex items-start gap-3"
          style={{ background: '#FFF8E1', borderColor: '#F9A825' }}>
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#F57F17' }} />
          <div className="min-w-0">
            <p className="font-semibold text-sm" style={{ color: '#E65100' }}>
              Database migration required
            </p>
            <p className="text-sm mt-1" style={{ color: '#7B5800' }}>
              The <code className="px-1 py-0.5 rounded" style={{ background: '#FFF3CD' }}>review_requests</code> table doesn't exist yet. Run this command once:
            </p>
            <code className="block mt-2 px-3 py-2 rounded-xl text-xs font-mono"
              style={{ background: '#fff', border: '1px solid #F9A825', color: '#4A3500' }}>
              psql -U postgres -d hostai_mvp -f database/migrate_reviews.sql
            </code>
            <p className="text-xs mt-2" style={{ color: '#8D6E00' }}>
              Then restart your backend (<code style={{ background: '#FFF3CD', padding: '1px 4px', borderRadius: 3 }}>npm run dev</code>) and refresh this page.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      {stats && !migrationNeeded && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total"            value={Number(stats.total)}    icon={<BarChart3 className="w-5 h-5" />} color="#717171" />
          <StatCard title="Pending"          value={Number(stats.pending)}  icon={<Clock className="w-5 h-5" />}     color="#F59E0B" />
          <StatCard title="Sent"             value={Number(stats.sent)}     icon={<Send className="w-5 h-5" />}      color="#6366F1" />
          <StatCard title="Reviews Received" value={Number(stats.received)} icon={<Star className="w-5 h-5" />}     color="#00A699" />
          <div className="stat-card">
            <p className="text-sm font-medium mb-1" style={{ color: '#717171' }}>Avg Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold" style={{ color: '#222' }}>
                {stats.avg_rating ? Number(stats.avg_rating).toFixed(1) : '—'}
              </p>
              {stats.avg_rating && <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
            </div>
            {stats.conversion_rate && (
              <p className="text-xs mt-1" style={{ color: '#717171' }}>
                {Number(stats.conversion_rate).toFixed(0)}% conversion
              </p>
            )}
          </div>
        </div>
      )}

      {/* Status filters */}
      {!migrationNeeded && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['', 'pending', 'sent', 'review_received', 'skipped'] as const).map(s => (
            <button key={s}
              onClick={() => setStatusFilter(s)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all border"
              style={{
                background: statusFilter === s ? '#FF385C' : undefined,
                borderColor: statusFilter === s ? 'transparent' : '#DDDDDD',
                color: statusFilter === s ? 'white' : '#717171',
              }}>
              {s === '' ? 'All' : STATUS[s]?.label ?? s}
              {s === '' && stats && <span className="ml-1.5 opacity-70 text-xs">({stats.total})</span>}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>
      ) : migrationNeeded ? null : reviews.length === 0 ? (
        <EmptyState
          icon={<Star className="w-8 h-8" />}
          title="No review requests yet"
          description="Generate AI-powered review requests for your checked-out guests"
          action={
            <button onClick={() => setGenOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Generate first request
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {reviews.map(rv => {
            const cfg = STATUS[rv.status] || STATUS.pending;
            const Icon = cfg.icon;
            const img = rv.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400';

            return (
              <div key={rv.id}
                className="bg-white rounded-2xl border p-4 flex items-start gap-4 hover:shadow-card transition-all"
                style={{ borderColor: '#DDDDDD' }}>

                <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="font-semibold text-sm" style={{ color: '#222' }}>{rv.guest_name}</p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                          <Icon className="w-3 h-3" />{cfg.label}
                        </span>
                        {rv.review_rating && (
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(n => (
                              <Star key={n} className="w-3.5 h-3.5"
                                fill={n <= rv.review_rating! ? '#FBBF24' : 'none'}
                                style={{ color: n <= rv.review_rating! ? '#FBBF24' : '#DDD' }} />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: '#717171' }}>
                        🏠 {getTitle(rv)}{rv.city ? ` · ${rv.city}` : ''}
                        {rv.check_out ? ` · out ${format(new Date(rv.check_out), 'MMM d, yyyy')}` : ''}
                        {rv.stay_nights ? ` · ${rv.stay_nights}n` : ''}
                        console.log("BOOKING DEBUG:", rv.id, rv.check_out);
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium"
                        style={{ background: '#F7F7F7', color: '#717171' }}>{rv.platform}</span>
                      {rv.sent_at && (
                        <p className="text-xs mt-1" style={{ color: '#AAAAAA' }}>
                          {formatDistanceToNow(new Date(rv.sent_at), { addSuffix: true })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 p-2.5 rounded-xl text-xs leading-relaxed line-clamp-2"
                    style={{ background: '#F7F7F7', color: '#484848' }}>
                    {rv.message}
                  </div>

                  {rv.review_note && (
                    <p className="text-xs mt-1.5 italic" style={{ color: '#717171' }}>📝 {rv.review_note}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button onClick={() => copyMsg(rv.id, rv.message)}
                    className="p-2 rounded-xl transition-colors hover:bg-beach"
                    title="Copy message" style={{ color: '#717171' }}>
                    {copiedId === rv.id
                      ? <Check className="w-4 h-4 text-green-500" />
                      : <Copy className="w-4 h-4" />}
                  </button>
                  {rv.status === 'pending' && (
                    <button onClick={() => handleSend(rv.id)}
                      className="p-2 rounded-xl transition-colors hover:bg-purple-50"
                      title="Mark as sent" style={{ color: '#6366F1' }}>
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => openEdit(rv)}
                    className="p-2 rounded-xl transition-colors hover:bg-beach"
                    style={{ color: '#717171' }}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(rv.id)}
                    className="p-2 rounded-xl transition-colors hover:bg-red-50"
                    style={{ color: '#FF385C' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Generate Modal ── */}
      <Modal open={genOpen} onClose={() => setGenOpen(false)} title="Generate Review Request" size="md">
        {!generated ? (
          <div className="space-y-4">
            <Field label="Booking (checked-out guests)">
              <Select value={genForm.booking_id}
                onChange={e => setGenForm(p => ({ ...p, booking_id: e.target.value }))}>
                <option value="">— Select a booking —</option>
                {bookings.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.guest_name} · {b.title_en?.substring(0, 25)}
                    {b.check_out ? ` · ${format(new Date(b.check_out), 'MMM d')}` : ''}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Platform">
              <Select value={genForm.platform}
                onChange={e => setGenForm(p => ({ ...p, platform: e.target.value }))}>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </Select>
            </Field>
            <Field label="Send after checkout (hours)">
              <input type="number" className="input" min={0} max={72}
                value={genForm.send_after_hours}
                onChange={e => setGenForm(p => ({ ...p, send_after_hours: e.target.value }))} />
            </Field>
            <Field label="Special note for AI (optional)">
              <Textarea rows={2} placeholder="e.g. The guest loved the terrace..."
                value={genForm.special_note}
                onChange={e => setGenForm(p => ({ ...p, special_note: e.target.value }))} />
            </Field>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setGenOpen(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleGenerate} disabled={generating || !genForm.booking_id}
                className="btn-primary flex-1">
                {generating
                  ? <><Spinner size="sm" /> Generating...</>
                  : <><Sparkles className="w-4 h-4" /> Generate with AI</>}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border" style={{ background: '#F0FDF4', borderColor: '#86EFAC' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <p className="text-sm font-semibold text-green-800">Generated!</p>
              </div>
              <p className="text-xs text-green-700 leading-relaxed">{generated.message}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => copyMsg(generated.id, generated.message)}
                className="btn-secondary flex-1 text-sm">
                {copiedId === generated.id ? '✓ Copied!' : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
              <button onClick={() => { handleSend(generated.id); setGenOpen(false); }}
                className="btn-primary flex-1 text-sm">
                <Send className="w-3.5 h-3.5" /> Mark as sent
              </button>
            </div>
            <button onClick={() => setGenOpen(false)}
              className="w-full text-sm text-center py-1.5" style={{ color: '#717171' }}>
              Close (keep as pending)
            </button>
          </div>
        )}
      </Modal>

      {/* ── Edit Modal ── */}
      {selected && (
        <Modal open={editOpen} onClose={() => setEditOpen(false)}
          title={`Request — ${selected.guest_name}`} size="md">
          <div className="space-y-4">
            <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: '#F7F7F7' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: 'linear-gradient(135deg,#FF385C,#E31C5F)', flexShrink: 0 }}>
                {selected.guest_name[0]}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#222' }}>{selected.guest_name}</p>
                <p className="text-xs" style={{ color: '#717171' }}>{getTitle(selected)}</p>
              </div>
            </div>

            <Field label="Status">
              <Select value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                {Object.entries(STATUS).map(([k, v]) =>
                  <option key={k} value={k}>{v.label}</option>
                )}
              </Select>
            </Field>

            <Field label="Message">
              <Textarea value={editMsg} onChange={e => setEditMsg(e.target.value)} rows={5} />
            </Field>

            {editStatus === 'review_received' && (
              <>
                <Field label="Star Rating">
                  <StarRating value={editRating} onChange={setEditRating} />
                </Field>
                <Field label="Internal note">
                  <Textarea rows={2} placeholder="Your notes about this review..."
                    value={editNote} onChange={e => setEditNote(e.target.value)} />
                </Field>
              </>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditOpen(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                {saving ? <Spinner size="sm" /> : 'Save changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        open={!!deleteId} title="Delete Review Request"
        message="This will permanently remove this review request."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting}
      />
    </DashboardLayout>
  );
}
