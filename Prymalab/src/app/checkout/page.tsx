'use client';

import { FormEvent, Suspense, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Landmark,
  LockKeyhole,
  MessageCircle,
  QrCode,
  ReceiptText,
  ShieldCheck,
} from 'lucide-react';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { SERVICE_PACKAGES } from '@/lib/constants';
import { getBrowserAnalyticsContext } from '@/components/analytics/GrowthAnalytics';

interface CheckoutResult {
  order: {
    orderCode: string;
    packageName: string;
    amount: number;
    transferContent: string;
    customerPhone: string;
  };
  payment: {
    ready: boolean;
    bankName: string;
    bankBin: string;
    accountNumber: string;
    accountName: string;
    branch: string;
    qrUrl: string;
  };
}

const formatPrice = (value: number) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
}).format(value);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const requestedSlug = searchParams.get('package') || 'transformation';
  const selectedPackage = useMemo(() => {
    const aliases: Record<string, string> = {
      transformation: 'transformation-30-days',
      elite: 'elite-care-90-days',
    };
    const normalizedSlug = aliases[requestedSlug] || requestedSlug;
    return SERVICE_PACKAGES.find((item) => item.slug === normalizedSlug || item.id === normalizedSlug) || SERVICE_PACKAGES[0];
  }, [requestedSlug]);

  const [form, setForm] = useState({ name: '', phone: '', email: '', note: '', website: '', consent: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [isPaymentSubmitted, setIsPaymentSubmitted] = useState(false);
  const [isMarkingPayment, setIsMarkingPayment] = useState(false);
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(''), 1600);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage.slug,
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          customerNote: form.note,
          website: form.website,
          consent: form.consent,
          _analytics: getBrowserAnalyticsContext(),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.order) throw new Error(data.error || 'Không thể tạo đơn lúc này.');
      setResult(data as CheckoutResult);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Hệ thống chưa ghi nhận được đơn.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const markPaymentSubmitted = async () => {
    if (!result) return;
    setIsMarkingPayment(true);
    setError('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode: result.order.orderCode, phone: result.order.customerPhone, _analytics: getBrowserAnalyticsContext() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Chưa gửi được xác nhận.');
      setIsPaymentSubmitted(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Chưa gửi được xác nhận.');
    } finally {
      setIsMarkingPayment(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-[#f4f7f2] text-[#153339]">
        <Navigation />
        <main className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8 lg:pt-40">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e4f5ef] text-[#0b8a78]">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </span>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0b7f72]">Đơn {result.order.orderCode}</p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
              {result.payment.ready ? 'Quét mã để hoàn tất chuyển khoản.' : 'Đơn của bạn đã được ghi nhận.'}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#657a7e]">
              {result.payment.ready
                ? 'Số tiền và nội dung đã gắn với mã đơn. Vui lòng giữ nguyên để PrymaLab đối soát nhanh.'
                : 'Thông tin nhận chuyển khoản đang được hoàn thiện. PrymaLab sẽ liên hệ theo số điện thoại bạn đã cung cấp trước khi thu tiền.'}
            </p>
          </div>

          {result.payment.ready ? (
            <section className="mt-12 grid overflow-hidden rounded-[2.25rem] border border-[#dce5e0] bg-white shadow-[0_35px_90px_-55px_rgba(18,56,62,0.58)] lg:grid-cols-[0.86fr_1.14fr]">
              <div className="flex flex-col items-center justify-center bg-[#eef4ee] p-7 sm:p-10">
                <div className="rounded-[1.75rem] border border-[#d6e1dc] bg-white p-4 shadow-[0_18px_45px_-35px_rgba(21,51,57,0.7)]">
                  <Image src={result.payment.qrUrl} alt={`Mã VietQR cho đơn ${result.order.orderCode}`} width={360} height={360} unoptimized className="h-auto w-full max-w-[22rem] rounded-2xl" />
                </div>
                <p className="mt-5 flex items-center gap-2 text-xs font-bold text-[#557075]"><QrCode className="h-4 w-4 text-[#0b8a78]" /> VietQR · Quét bằng ứng dụng ngân hàng</p>
              </div>

              <div className="p-7 sm:p-10 lg:p-12">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#153339] text-white"><Landmark className="h-5 w-5" /></span>
                  <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#819297]">Chuyển khoản tới</p><h2 className="mt-1 text-xl font-semibold">{result.payment.bankName}</h2></div>
                </div>

                <dl className="mt-8 divide-y divide-[#e2e8e4] border-y border-[#e2e8e4]">
                  {[
                    ['Số tài khoản', result.payment.accountNumber, 'account'],
                    ['Chủ tài khoản', result.payment.accountName, 'name'],
                    ['Số tiền', formatPrice(result.order.amount), 'amount'],
                    ['Nội dung', result.order.transferContent, 'content'],
                  ].map(([label, value, key]) => (
                    <div key={key} className="grid gap-2 py-4 sm:grid-cols-[8.5rem_1fr_auto] sm:items-center">
                      <dt className="text-xs font-semibold text-[#74878b]">{label}</dt>
                      <dd className={`break-all text-sm font-extrabold ${key === 'amount' || key === 'content' ? 'text-[#0b7f72]' : 'text-[#213f45]'}`}>{value}</dd>
                      <button type="button" onClick={() => copyValue(key, value)} className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#d6e1dc] px-3 py-1.5 text-[11px] font-bold text-[#5e7377] transition hover:border-[#0b8a78] hover:text-[#0b7f72]">
                        <Copy className="h-3.5 w-3.5" /> {copied === key ? 'Đã sao chép' : 'Sao chép'}
                      </button>
                    </div>
                  ))}
                </dl>

                {error && <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
                {isPaymentSubmitted ? (
                  <div className="mt-6 rounded-2xl border border-[#bfe0d5] bg-[#eaf7f2] p-5 text-sm leading-6 text-[#226357]">
                    <strong className="block">Đã gửi yêu cầu đối soát.</strong>
                    PrymaLab sẽ kiểm tra giao dịch và liên hệ để bắt đầu chương trình.
                  </div>
                ) : (
                  <button data-analytics="payment-submitted" type="button" onClick={markPaymentSubmitted} disabled={isMarkingPayment} className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#153339] px-6 text-sm font-bold text-white transition hover:bg-[#0b7f72] disabled:opacity-60">
                    <ReceiptText className="h-4 w-4" /> {isMarkingPayment ? 'Đang gửi xác nhận...' : 'Tôi đã chuyển khoản — yêu cầu kiểm tra'}
                  </button>
                )}
                <p className="mt-4 text-center text-[11px] leading-5 text-[#87979a]">Không đóng trang ngân hàng cho tới khi ứng dụng báo giao dịch thành công. PrymaLab chỉ kích hoạt chương trình sau khi đối soát.</p>
              </div>
            </section>
          ) : (
            <section className="mx-auto mt-10 max-w-2xl rounded-[2rem] border border-amber-200 bg-amber-50 p-7 text-center sm:p-10">
              <Landmark className="mx-auto h-8 w-8 text-amber-700" />
              <h2 className="mt-4 text-xl font-semibold text-amber-950">Chưa yêu cầu bạn chuyển tiền lúc này</h2>
              <p className="mt-3 text-sm leading-7 text-amber-800">Đội ngũ sẽ xác nhận đúng tài khoản Vietcombank, quyền lợi và lịch bắt đầu qua điện thoại trước khi bạn thanh toán.</p>
            </section>
          )}

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#cddad5] bg-white px-6 text-sm font-bold text-[#27474c]"><ArrowLeft className="h-4 w-4" /> Về trang chủ</Link>
            <Link href="/terms" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-[#0b7f72]">Xem điều khoản <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f2] text-[#153339]">
      <Navigation />
      <main className="mx-auto max-w-[82rem] px-5 pb-24 pt-32 sm:px-8 lg:pt-40">
        <div className="mb-10 max-w-3xl">
          <p className="section-kicker">Thanh toán chuyển khoản</p>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">Một đơn rõ ràng. Một mã chuyển khoản riêng.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#657a7e]">Điền thông tin để tạo mã đơn. PrymaLab không yêu cầu số thẻ và chỉ ghi nhận thanh toán sau khi giao dịch ngân hàng được đối soát.</p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <aside className="rounded-[2rem] bg-[#153339] p-7 text-white shadow-[0_35px_80px_-50px_rgba(18,56,62,0.95)] sm:p-9">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#8ed7cb]">Bạn đang chọn</p>
            <h2 className="mt-4 text-3xl font-semibold">{selectedPackage.name}</h2>
            <p className="mt-2 text-sm leading-6 text-white/58">{selectedPackage.durationDays} ngày đồng hành theo nhịp sống cá nhân.</p>
            <p className="mt-7 text-3xl font-bold">{formatPrice(selectedPackage.price)}</p>
            <div className="my-7 h-px bg-white/10" />
            <ul className="space-y-3">
              {selectedPackage.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-6 text-white/75">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#d9f46f] text-[#153339]"><Check className="h-2.5 w-2.5" strokeWidth={3} /></span>{feature}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-3 border-t border-white/10 pt-6 text-xs text-white/60">
              <span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-[#8ed7cb]" /> Không thu thập dữ liệu thẻ</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#d9f46f]" /> Mỗi đơn có nội dung đối soát riêng</span>
              <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[#9cb7ff]" /> Có người thật xác nhận trước khi bắt đầu</span>
            </div>
          </aside>

          <section className="rounded-[2rem] border border-[#dce5e0] bg-white p-6 shadow-[0_30px_80px_-55px_rgba(18,56,62,0.45)] sm:p-9 lg:p-10">
            <div className="mb-8"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#0b7f72]">Thông tin đơn hàng</p><h2 className="mt-3 text-2xl font-semibold">PrymaLab nên liên hệ với bạn thế nào?</h2></div>
            {error && <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-700">{error}</div>}
            <form onSubmit={submit} className="space-y-5">
              <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} className="absolute -left-[9999px] h-px w-px opacity-0" />
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-bold text-[#36545a]">Họ và tên<input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-[#d4dfda] bg-[#fbfcfa] px-4 font-normal outline-none transition focus:border-[#0b8a78] focus:bg-white" placeholder="Nguyễn Minh Anh" /></label>
                <label className="text-sm font-bold text-[#36545a]">Số điện thoại<input required inputMode="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-[#d4dfda] bg-[#fbfcfa] px-4 font-normal outline-none transition focus:border-[#0b8a78] focus:bg-white" placeholder="09xx xxx xxx" /></label>
              </div>
              <label className="block text-sm font-bold text-[#36545a]">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-[#d4dfda] bg-[#fbfcfa] px-4 font-normal outline-none transition focus:border-[#0b8a78] focus:bg-white" placeholder="ban@email.com" /></label>
              <label className="block text-sm font-bold text-[#36545a]">Điều bạn muốn PrymaLab hiểu thêm <span className="font-normal text-[#869699]">(không bắt buộc)</span><textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} className="mt-2 min-h-28 w-full resize-y rounded-xl border border-[#d4dfda] bg-[#fbfcfa] px-4 py-3 font-normal leading-6 outline-none transition focus:border-[#0b8a78] focus:bg-white" placeholder="Mục tiêu, lịch sinh hoạt hoặc điều bạn đang gặp khó khăn..." /></label>
              <label className="flex gap-3 rounded-2xl bg-[#f3f6f1] p-4 text-xs leading-5 text-[#667b7f]"><input required type="checkbox" checked={form.consent} onChange={(event) => setForm({ ...form, consent: event.target.checked })} className="mt-0.5 h-4 w-4 accent-[#0b8a78]" /><span>Tôi đồng ý để PrymaLab xử lý thông tin nhằm tạo đơn và liên hệ triển khai; tôi đã đọc <Link href="/privacy" className="font-bold text-[#0b7f72] underline">Chính sách bảo mật</Link>.</span></label>
              <button data-analytics="checkout-submit" disabled={isSubmitting} className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#153339] px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0b7f72] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Đang tạo mã đơn...' : 'Tạo mã chuyển khoản'} <ArrowRight className="h-4 w-4" /></button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#f4f7f2]" />}><CheckoutContent /></Suspense>;
}
