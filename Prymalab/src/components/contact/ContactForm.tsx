'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getBrowserAnalyticsContext } from '@/components/analytics/GrowthAnalytics';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'Tư vấn chương trình', message: '', website: '' });
  const [state, setState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setState('submitting');
    setError('');
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, _analytics: getBrowserAnalyticsContext() }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Chưa thể gửi yêu cầu.');
      setState('success');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Chưa thể gửi yêu cầu.');
      setState('idle');
    }
  };

  if (state === 'success') {
    return <div className="flex min-h-[28rem] flex-col items-center justify-center rounded-[2rem] border border-[#cce2d9] bg-[#edf8f3] p-8 text-center"><CheckCircle2 className="h-12 w-12 text-[#0b8a78]" /><h2 className="mt-5 text-2xl font-semibold text-[#153339]">PrymaLab đã nhận được lời nhắn.</h2><p className="mt-3 max-w-md text-sm leading-7 text-[#5f777b]">Đội ngũ sẽ phản hồi trong khung giờ làm việc qua email hoặc số điện thoại bạn đã cung cấp.</p><button type="button" onClick={() => { setState('idle'); setForm({ name: '', email: '', phone: '', subject: 'Tư vấn chương trình', message: '', website: '' }); }} className="mt-7 text-sm font-bold text-[#0b7f72]">Gửi lời nhắn khác</button></div>;
  }

  const inputClass = 'mt-2 min-h-12 w-full rounded-xl border border-[#d4dfda] bg-[#fbfcfa] px-4 text-sm font-normal outline-none transition focus:border-[#0b8a78] focus:bg-white';
  return <form onSubmit={submit} className="rounded-[2rem] border border-[#dce5e0] bg-white p-6 shadow-[0_30px_80px_-55px_rgba(18,56,62,0.45)] sm:p-9">
    <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} className="absolute -left-[9999px] h-px w-px" />
    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#0b7f72]">Gửi yêu cầu</p><h2 className="mt-3 text-2xl font-semibold text-[#153339]">Bạn muốn PrymaLab hỗ trợ điều gì?</h2>
    {error && <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="mt-7 grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold text-[#36545a]">Họ và tên<input required minLength={2} className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label className="text-sm font-bold text-[#36545a]">Số điện thoại<input className={inputClass} inputMode="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label></div>
    <label className="mt-5 block text-sm font-bold text-[#36545a]">Email<input required type="email" className={inputClass} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
    <label className="mt-5 block text-sm font-bold text-[#36545a]">Chủ đề<select className={inputClass} value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })}><option>Tư vấn chương trình</option><option>Hỗ trợ đơn hàng</option><option>Hợp tác nội dung</option><option>Góp ý khác</option></select></label>
    <label className="mt-5 block text-sm font-bold text-[#36545a]">Lời nhắn<textarea required minLength={10} className={`${inputClass} min-h-32 py-3`} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Mục tiêu, lịch sinh hoạt hoặc điều bạn muốn được giải đáp..." /></label>
    <button data-analytics="contact-submit" disabled={state === 'submitting'} className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#153339] px-6 text-sm font-bold text-white transition hover:bg-[#0b7f72] disabled:opacity-60">{state === 'submitting' ? 'Đang gửi...' : 'Gửi lời nhắn'} <ArrowRight className="h-4 w-4" /></button>
  </form>;
}
