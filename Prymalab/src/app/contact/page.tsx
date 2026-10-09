import type { Metadata } from 'next';
import { Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { Footer } from '@/components/ui/Footer';
import { Navigation } from '@/components/ui/Navigation';
import { getPublicHomeData } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Liên hệ',
  description: 'Trao đổi với PrymaLab về chương trình dinh dưỡng, giấc ngủ và hỗ trợ đơn hàng.',
  alternates: { canonical: '/contact' },
};

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const { settings } = await getPublicHomeData();
  const phone = settings.phone || '0948 348 444';
  const email = settings.email || 'ahunglua7@gmail.com';
  const address = settings.address || 'Đà Nẵng, Việt Nam';
  const workingHours = settings.workingHours || 'Thứ Hai – Thứ Bảy, 08:00–18:00';
  const phoneHref = phone.replace(/\D/g, '');
  return <div className="min-h-screen bg-[#f4f7f2] text-[#153339]">
    <Navigation />
    <main className="mx-auto max-w-[82rem] px-5 pb-24 pt-32 sm:px-8 lg:pt-40">
      <section className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-20">
        <div className="lg:sticky lg:top-32">
          <p className="section-kicker">Liên hệ PrymaLab</p>
          <h1 className="mt-5 max-w-xl font-[family-name:var(--font-display)] text-4xl font-medium tracking-[-0.035em] sm:text-5xl lg:text-6xl">Bạn cần PrymaLab hỗ trợ gì?</h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-[#60767a]">Hỏi về chương trình, cách bắt đầu hoặc đơn hàng. Gọi điện, gửi email hoặc để lại lời nhắn qua biểu mẫu.</p>
          <div className="mt-9 grid gap-3">
            <a href={`tel:${phoneHref}`} className="flex items-center gap-4 rounded-2xl border border-[#dbe4df] bg-white p-4 transition hover:border-[#9bc7bc]"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7f5f0] text-[#0b8a78]"><Phone className="h-5 w-5" /></span><span><small className="block text-xs font-bold uppercase tracking-wider text-[#839497]">Điện thoại</small><strong className="mt-1 block text-sm">{phone}</strong></span></a>
            <a href={`mailto:${email}`} className="flex items-center gap-4 rounded-2xl border border-[#dbe4df] bg-white p-4 transition hover:border-[#9bc7bc]"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Mail className="h-5 w-5" /></span><span className="min-w-0"><small className="block text-xs font-bold uppercase tracking-wider text-[#839497]">Email</small><strong className="mt-1 block truncate text-sm">{email}</strong></span></a>
          </div>
          <div className="mt-7 space-y-3 border-t border-[#dbe4df] pt-6 text-sm text-[#657a7e]"><p className="flex gap-3"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#0b8a78]" />{workingHours}</p><p className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0b8a78]" />{address}</p><p className="flex gap-3"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0b8a78]" />Hỗ trợ trực tuyến; hẹn trước nếu cần trao đổi trực tiếp.</p></div>
        </div>
        <ContactForm />
      </section>
    </main>
    <Footer settings={settings} />
  </div>;
}
