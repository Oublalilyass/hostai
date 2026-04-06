'use client';
// src/app/cleaning/page.tsx

import { useEffect, useState } from 'react';
import { Plus, CheckCircle2, Clock, AlertCircle, Trash2, Mail } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Modal, EmptyState, Field, Select, Textarea, ConfirmDialog, Spinner, Badge } from '@/components/ui';
import { cleaningAPI, propertiesAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { t } from '@/lib/i18n';
import { format } from 'date-fns';
import clsx from 'clsx';

const STATUS_ICONS: Record<string, any> = {
  pending: Clock,
  in_progress: AlertCircle,
  done: CheckCircle2,
};

const EMPTY_FORM = {
  property_id: '', title: '', description: '',
  scheduled_date: '', status: 'pending', cleaner_notified: false,
};

export default function CleaningPage() {
  const { lang } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const [tk, pr] = await Promise.all([cleaningAPI.list(), propertiesAPI.list()]);
    setTasks(tk.data.tasks);
    setProperties(pr.data.properties);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = filter ? tasks.filter(t => t.status === filter) : tasks;

  const counts = {
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  const openCreate = () => {
    setEditTask(null);
    setForm({ ...EMPTY_FORM, property_id: properties[0]?.id || '' });
    setModalOpen(true);
  };

  const openEdit = (task: any) => {
    setEditTask(task);
    setForm({
      property_id: task.property_id,
      title: task.title,
      description: task.description || '',
      scheduled_date: task.scheduled_date?.split('T')[0] || '',
      status: task.status,
      cleaner_notified: task.cleaner_notified,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editTask) {
        await cleaningAPI.update(editTask.id, form);
      } else {
        await cleaningAPI.create(form);
      }
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (task: any) => {
    const next = task.status === 'pending' ? 'in_progress'
      : task.status === 'in_progress' ? 'done' : 'pending';
    await cleaningAPI.update(task.id, { ...task, status: next });
    load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await cleaningAPI.delete(deleteId);
    setDeleting(false);
    setDeleteId(null);
    load();
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  const STATUS_FILTERS = [
    { value: '', label: 'All', count: tasks.length },
    { value: 'pending', label: 'Pending', count: counts.pending },
    { value: 'in_progress', label: 'In Progress', count: counts.in_progress },
    { value: 'done', label: 'Done', count: counts.done },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#222' }}>{t(lang, 'cleaning')}</h1>
          <p className="text-sm mt-0.5" style={{ color: '#717171' }}>
            {counts.pending} {t(lang, 'pending')} · {counts.in_progress} {t(lang, 'inProgress')} · {counts.done} {t(lang, 'done')}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-4 h-4" />
          {t(lang, 'addTask')}
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6">
        {STATUS_FILTERS.map(({ value, label, count }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={clsx(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              filter === value
                ? 'text-white shadow-sm'
                : 'border hover:bg-beach'
            )}
            style={{
              background: filter === value ? '#FF385C' : undefined,
              borderColor: filter === value ? 'transparent' : '#DDDDDD',
              color: filter === value ? 'white' : '#717171',
            }}>
            {label} <span className="ml-1.5 text-xs opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {/* Tasks */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<span className="text-3xl">🧹</span>}
          title={t(lang, 'noTasks')}
          description="Cleaning tasks are auto-created when guests check out"
          action={
            <button onClick={openCreate} className="btn-primary">
              <Plus className="w-4 h-4" />
              {t(lang, 'addTask')}
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => {
            const StatusIcon = STATUS_ICONS[task.status] || Clock;
            const isPast = task.scheduled_date && new Date(task.scheduled_date) < new Date() && task.status !== 'done';

            return (
              <div key={task.id}
                className={clsx(
                  'bg-white rounded-2xl border p-4 flex items-center gap-4 transition-all',
                  task.status === 'done' ? 'opacity-60' : 'hover:shadow-card',
                  isPast ? 'border-orange-200 bg-orange-50' : 'border-sand'
                )}>
                {/* Status toggle */}
                <button
                  onClick={() => toggleStatus(task)}
                  className={clsx(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all',
                    task.status === 'done'
                      ? 'bg-green-100 text-green-600'
                      : task.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-orange-100 text-orange-600'
                  )}>
                  <StatusIcon className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={clsx('font-semibold text-sm', task.status === 'done' && 'line-through')}
                      style={{ color: '#222' }}>
                      {task.title}
                    </p>
                    <Badge status={task.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs" style={{ color: '#717171' }}>
                    <span>🏠 {task.title_en}</span>
                    {task.scheduled_date && (
                      <span className={clsx('flex items-center gap-1', isPast && 'text-orange-600 font-medium')}>
                        📅 {format(new Date(task.scheduled_date), 'MMM d, yyyy')}
                        {isPast && ' ⚠️ Overdue'}
                      </span>
                    )}
                    {task.guest_name && (
                      <span>After: {task.guest_name}</span>
                    )}
                  </div>

                  {task.description && (
                    <p className="text-xs mt-1 line-clamp-1" style={{ color: '#AAAAAA' }}>
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Cleaner notified badge */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {task.cleaner_notified ? (
                    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: '#E8F5E9', color: '#2E7D32' }}>
                      <Mail className="w-3 h-3" /> Notified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: '#F7F7F7', color: '#717171' }}>
                      Not notified
                    </span>
                  )}

                  <button onClick={() => openEdit(task)}
                    className="p-2 rounded-xl hover:bg-beach transition-colors"
                    style={{ color: '#717171' }}>
                    <span className="text-sm">✏️</span>
                  </button>

                  <button onClick={() => setDeleteId(task.id)}
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

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTask ? 'Edit Task' : t(lang, 'addTask')}
        size="sm">
        <div className="space-y-4">
          <Field label={t(lang, 'property')}>
            <Select value={form.property_id} onChange={set('property_id')}>
              <option value="">Select property</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>
                  {p[`title_${lang}`] || p.title_en}
                </option>
              ))}
            </Select>
          </Field>

          <Field label={t(lang, 'taskTitle')}>
            <input className="input" value={form.title} onChange={set('title')} required />
          </Field>

          <Field label="Description">
            <Textarea value={form.description} onChange={set('description')} rows={2} />
          </Field>

          <Field label={t(lang, 'scheduledDate')}>
            <input type="date" className="input" value={form.scheduled_date} onChange={set('scheduled_date')} />
          </Field>

          <Field label={t(lang, 'status')}>
            <Select value={form.status} onChange={set('status')}>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </Select>
          </Field>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox"
              checked={form.cleaner_notified}
              onChange={e => setForm(p => ({ ...p, cleaner_notified: e.target.checked }))}
              className="w-4 h-4 rounded" />
            <span className="text-sm font-medium" style={{ color: '#222' }}>
              {t(lang, 'notifyCleaner')}
            </span>
          </label>

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
