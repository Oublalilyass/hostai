'use client';
// src/app/ai-chat/page.tsx
// AI Guest Messaging Hub with chat UI and message generation

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles, Send, Copy, Check, MessageSquare,
  LogIn, LogOut, HelpCircle, ChevronDown
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { EmptyState, Spinner, Select } from '@/components/ui';
import { aiAPI, bookingsAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { t } from '@/lib/i18n';
import { format } from 'date-fns';
import clsx from 'clsx';

type MessageType = 'checkin' | 'checkout' | 'faq' | 'cleaning' | 'custom';

interface ChatMessage {
  id: string;
  direction: 'inbound' | 'outbound';
  content: string;
  message_type: MessageType;
  created_at: string;
  ai_generated: boolean;
}

const TYPE_CONFIG: Record<MessageType | string, { icon: any; label: string; color: string }> = {
  checkin: { icon: LogIn, label: 'Check-in', color: '#00A699' },
  checkout: { icon: LogOut, label: 'Check-out', color: '#FC642D' },
  faq: { icon: HelpCircle, label: 'FAQ', color: '#6366F1' },
  cleaning: { icon: MessageSquare, label: 'Cleaning', color: '#F59E0B' },
  custom: { icon: Sparkles, label: 'Custom', color: '#FF385C' },
};

export default function AIChatPage() {
  const { lang } = useAuth();
  const searchParams = useSearchParams();
  const initialBookingId = searchParams.get('booking') || '';

  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState(initialBookingId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [generating, setGenerating] = useState<MessageType | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  // Load bookings
  useEffect(() => {
    bookingsAPI.list().then(res => {
      const active = res.data.bookings.filter((b: any) =>
        ['confirmed', 'checked_in'].includes(b.status)
      );
      setBookings(active);
      if (!initialBookingId && active.length > 0) {
        setSelectedBookingId(active[0].id);
      }
    });
  }, []);

  // Load messages for selected booking
  useEffect(() => {
    if (!selectedBookingId) return;
    setLoadingMessages(true);
    aiAPI.messages({ booking_id: selectedBookingId }).then(res => {
      setMessages(res.data.messages);
    }).finally(() => setLoadingMessages(false));
  }, [selectedBookingId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateMessage = async (type: MessageType) => {
    if (!selectedBookingId) return;
    setGenerating(type);
    try {
      const res = await aiAPI.generate({
        booking_id: selectedBookingId,
        message_type: type,
        language: selectedBooking?.guest_language || lang,
      });
      const newMsg: ChatMessage = {
        id: res.data.message.id,
        direction: 'outbound',
        content: res.data.content,
        message_type: type,
        created_at: new Date().toISOString(),
        ai_generated: true,
      };
      setMessages(prev => [newMsg, ...prev]);
    } finally {
      setGenerating(null);
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim() || !selectedBookingId) return;
    const userMsg: ChatMessage = {
      id: `tmp-${Date.now()}`,
      direction: 'inbound',
      content: chatInput,
      message_type: 'faq',
      created_at: new Date().toISOString(),
      ai_generated: false,
    };
    setMessages(prev => [userMsg, ...prev]);
    setChatInput('');
    setGenerating('faq');

    try {
      const res = await aiAPI.chat({
        booking_id: selectedBookingId,
        user_message: userMsg.content,
        language: selectedBooking?.guest_language || lang,
      });
      const aiMsg: ChatMessage = {
        id: res.data.message.id,
        direction: 'outbound',
        content: res.data.response,
        message_type: 'faq',
        created_at: new Date().toISOString(),
        ai_generated: true,
      };
      setMessages(prev => [aiMsg, ...prev]);
    } finally {
      setGenerating(null);
    }
  };

  const copyMessage = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const langFlag = selectedBooking?.guest_language === 'fr' ? '🇫🇷'
    : selectedBooking?.guest_language === 'es' ? '🇪🇸' : '🇬🇧';

  return (
    <DashboardLayout>
      <div className="flex gap-6 h-[calc(100vh-8rem)]">

        {/* Left panel - booking selector + quick actions */}
        <div className="w-72 flex flex-col gap-4 flex-shrink-0">
          {/* Booking selector */}
          <div className="bg-white rounded-2xl p-4 border border-sand">
            <p className="label mb-2">{t(lang, 'selectBooking')}</p>
            <Select value={selectedBookingId} onChange={e => setSelectedBookingId(e.target.value)}>
              <option value="">-- Select booking --</option>
              {bookings.map(b => (
                <option key={b.id} value={b.id}>
                  {b.guest_name} · {b.title_en?.substring(0, 20)}...
                </option>
              ))}
            </Select>

            {selectedBooking && (
              <div className="mt-3 p-3 rounded-xl" style={{ background: '#F7F7F7' }}>
                <p className="text-sm font-semibold" style={{ color: '#222' }}>
                  {selectedBooking.guest_name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#717171' }}>
                  {format(new Date(selectedBooking.check_in), 'MMM d')} →{' '}
                  {format(new Date(selectedBooking.check_out), 'MMM d')}
                </p>
                <p className="text-xs mt-1" style={{ color: '#717171' }}>
                  {langFlag} {selectedBooking.guest_language?.toUpperCase()} · {selectedBooking.status}
                </p>
              </div>
            )}
          </div>

          {/* Quick action buttons */}
          {selectedBookingId && (
            <div className="bg-white rounded-2xl p-4 border border-sand">
              <p className="label mb-3">Quick Generate</p>
              <div className="space-y-2">
                {[
                  { type: 'checkin' as const, label: t(lang, 'generateCheckin') },
                  { type: 'checkout' as const, label: t(lang, 'generateCheckout') },
                ].map(({ type, label }) => {
                  const cfg = TYPE_CONFIG[type];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => generateMessage(type)}
                      disabled={!!generating}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border hover:shadow-sm"
                      style={{
                        borderColor: `${cfg.color}40`,
                        color: cfg.color,
                        background: `${cfg.color}08`,
                      }}>
                      {generating === type ? (
                        <Spinner size="sm" />
                      ) : (
                        <Icon className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span>{label}</span>
                      {generating !== type && <Sparkles className="w-3 h-3 ml-auto opacity-50" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Message type legend */}
          <div className="bg-white rounded-2xl p-4 border border-sand">
            <p className="label mb-3">Message Types</p>
            <div className="space-y-2">
              {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <div key={type} className="flex items-center gap-2.5 text-xs">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cfg.color}18`, color: cfg.color }}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <span style={{ color: '#717171' }}>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right panel - chat history */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-sand overflow-hidden">
          {/* Chat header */}
          <div className="px-5 py-4 border-b border-sand flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#222' }}>
                  {selectedBooking ? `${selectedBooking.guest_name}` : 'AI Guest Messaging'}
                </p>
                <p className="text-xs" style={{ color: '#717171' }}>
                  {selectedBooking ? selectedBooking.title_en : 'Select a booking to start'}
                </p>
              </div>
            </div>
            {messages.length > 0 && (
              <span className="text-xs" style={{ color: '#717171' }}>
                {messages.length} messages
              </span>
            )}
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ flexDirection: 'column-reverse', display: 'flex' }}>
            <div ref={messagesEndRef} />

            {!selectedBookingId ? (
              <EmptyState
                icon={<Sparkles className="w-8 h-8" />}
                title={t(lang, 'aiChat')}
                description="Select an active booking to view and generate AI messages"
              />
            ) : loadingMessages ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : messages.length === 0 ? (
              <EmptyState
                icon={<MessageSquare className="w-8 h-8" />}
                title={t(lang, 'noMessages')}
                description="Use the quick actions to generate your first AI message"
              />
            ) : (
              messages.map((msg) => {
                const cfg = TYPE_CONFIG[msg.message_type] || TYPE_CONFIG.custom;
                const Icon = cfg.icon;
                const isOutbound = msg.direction === 'outbound';
                return (
                  <div key={msg.id}
                    className={clsx('flex gap-3 animate-fade-in-up', isOutbound ? 'flex-row-reverse' : 'flex-row')}>
                    {/* Avatar */}
                    <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white',
                      isOutbound ? 'bg-gradient-to-br from-violet-500 to-purple-600' : 'bg-sand'
                    )}>
                      {isOutbound ? <Sparkles className="w-4 h-4" /> : <span className="text-sm" style={{ color: '#717171' }}>👤</span>}
                    </div>

                    {/* Bubble */}
                    <div className={clsx('max-w-[70%] group', isOutbound ? 'items-end' : 'items-start', 'flex flex-col gap-1')}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                          style={{ background: `${cfg.color}20`, color: cfg.color }}>
                          <Icon className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#717171' }}>{cfg.label}</span>
                        <span className="text-xs" style={{ color: '#AAAAAA' }}>
                          {format(new Date(msg.created_at), 'HH:mm')}
                        </span>
                      </div>

                      <div className={clsx(
                        'rounded-2xl px-4 py-3 text-sm leading-relaxed relative',
                        isOutbound
                          ? 'text-white rounded-tr-sm'
                          : 'border rounded-tl-sm'
                      )}
                        style={{
                          background: isOutbound ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : '#F7F7F7',
                          borderColor: isOutbound ? 'transparent' : '#DDDDDD',
                          color: isOutbound ? 'white' : '#222',
                        }}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>

                        {/* Copy button */}
                        {isOutbound && (
                          <button
                            onClick={() => copyMessage(msg.id, msg.content)}
                            className="absolute -bottom-6 right-0 flex items-center gap-1 text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: '#717171', background: 'white', border: '1px solid #DDDDDD' }}>
                            {copiedId === msg.id ? (
                              <><Check className="w-3 h-3" />{t(lang, 'copied')}</>
                            ) : (
                              <><Copy className="w-3 h-3" />{t(lang, 'copyMessage')}</>
                            )}
                          </button>
                        )}
                      </div>

                      {msg.ai_generated && isOutbound && (
                        <p className="text-xs flex items-center gap-1 mt-1" style={{ color: '#AAAAAA' }}>
                          <Sparkles className="w-2.5 h-2.5" /> AI generated
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat input */}
          {selectedBookingId && (
            <div className="px-4 py-3 border-t border-sand">
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <textarea
                    className="input pr-4 resize-none"
                    rows={1}
                    placeholder={t(lang, 'typeMessage')}
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendChat();
                      }
                    }}
                    style={{ minHeight: '42px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={sendChat}
                  disabled={!chatInput.trim() || !!generating}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white' }}>
                  {generating === 'faq' ? <Spinner size="sm" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs mt-1.5 text-center" style={{ color: '#AAAAAA' }}>
                Press Enter to send · Shift+Enter for new line · AI answers are simulated (connect API to activate)
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
