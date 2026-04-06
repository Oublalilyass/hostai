'use client';
// src/components/ui/index.tsx
// Reusable Airbnb-inspired UI components

import React from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

// ============================================================
// MODAL
// ============================================================
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  if (!open) return null;
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}>
      <div
        className={clsx('bg-white rounded-2xl w-full shadow-2xl animate-fade-in-up', widths[size])}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand">
          <h2 className="text-lg font-semibold" style={{ color: '#222' }}>{title}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// BADGE
// ============================================================
interface BadgeProps {
  status: string;
  label?: string;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'badge-confirmed',
  checked_in: 'badge-checked_in',
  checked_out: 'badge-checked_out',
  pending: 'badge-pending',
  cancelled: 'badge-cancelled',
  done: 'badge-done',
  in_progress: 'badge-in_progress',
};

export function Badge({ status, label }: BadgeProps) {
  return (
    <span className={clsx('badge', STATUS_STYLES[status] || 'badge-pending')}>
      {label || status.replace('_', ' ')}
    </span>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: '#FFF0F3', color: '#FF385C' }}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-1" style={{ color: '#222' }}>{title}</h3>
      {description && <p className="text-sm mb-4" style={{ color: '#717171' }}>{description}</p>}
      {action}
    </div>
  );
}

// ============================================================
// FORM FIELD
// ============================================================
interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="text-xs mt-1" style={{ color: '#FF385C' }}>{error}</p>}
    </div>
  );
}

// ============================================================
// SELECT
// ============================================================
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export function Select({ children, className, ...props }: SelectProps) {
  return (
    <select
      className={clsx('input appearance-none pr-8 cursor-pointer', className)}
      {...props}>
      {children}
    </select>
  );
}

// ============================================================
// TEXTAREA
// ============================================================
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={clsx('input resize-none', className)}
      rows={3}
      {...props}
    />
  );
}

// ============================================================
// LOADING SPINNER
// ============================================================
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div className={clsx('border-2 rounded-full animate-spin', sizes[size])}
      style={{ borderColor: '#FF385C', borderTopColor: 'transparent' }} />
  );
}

// ============================================================
// STAT CARD
// ============================================================
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  subtitle?: string;
}

export function StatCard({ title, value, icon, color = '#FF385C', subtitle }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: '#717171' }}>{title}</p>
          <p className="text-3xl font-bold" style={{ color: '#222' }}>{value}</p>
          {subtitle && <p className="text-xs mt-1" style={{ color: '#717171' }}>{subtitle}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, color }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CONFIRM DIALOG
// ============================================================
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#222' }}>{title}</h3>
        <p className="text-sm mb-6" style={{ color: '#717171' }}>{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: '#FF385C' }}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
