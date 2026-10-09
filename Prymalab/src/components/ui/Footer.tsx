import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import type { SiteSettings } from '@/lib/db';
import { BrandMark } from './BrandMark';

const footerGroups = [
  {
    title: 'Khám phá',
    links: [
      { label: 'Phương pháp Pryma', href: '/phuong-phap' },
      { label: 'Chương trình', href: '/services' },
      { label: 'Bài đánh giá', href: '/quiz' },
      { label: 'Kiến thức', href: '/blog' },
    ],
  },
  {
    title: 'PrymaLab',
    links: [
      { label: 'Câu chuyện thương hiệu', href: '/about' },
      { label: 'Liên hệ', href: '/contact' },
      { label: 'Câu hỏi thường gặp', href: '/#faq' },
      { label: 'Bắt đầu đánh giá', href: '/quiz' },
    ],
  },
  {
    title: 'Pháp lý',
    links: [
      { label: 'Chính sách bảo mật', href: '/privacy' },
      { label: 'Điều khoản dịch vụ', href: '/terms' },
      { label: 'Chính sách biên tập', href: '/chinh-sach-bien-tap' },
      { label: 'Phạm vi sức khỏe', href: '/services#pham-vi' },
    ],
  },
];

export function Footer({ settings }: { settings?: SiteSettings }) {
  const phone = settings?.phone || '0948 348 444';
  const email = settings?.email || 'hung@prymalab.com';
  const address = settings?.address || 'Đà Nẵng, Việt Nam';

  return (
    <footer className="mt-6 bg-[#102f35] px-5 pb-8 pt-16 text-white sm:px-8 lg:pt-20">
      <div className="mx-auto max-w-[88rem]">
        <div className="grid gap-14 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1.05fr]">
          <div>
            <BrandMark inverse />
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">PrymaLab Việt Nam kết nối dinh dưỡng, giấc ngủ và nhịp sống thành một lộ trình cá nhân rõ ràng, tinh tế và dễ duy trì.</p>
            <p className="mt-6 max-w-sm text-xs leading-6 text-white/35">Nội dung trên PrymaLab mang tính giáo dục và định hướng lối sống, không thay thế chẩn đoán hay điều trị y khoa.</p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8ed7cb]">{group.title}</p>
              <ul className="mt-6 space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}><Link href={link.href} className="text-sm text-white/58 transition hover:text-white">{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8ed7cb]">Kết nối</p>
            <div className="mt-6 space-y-4">
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-start gap-3 text-sm text-white/58 transition hover:text-white"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#d9f46f]" aria-hidden="true" />{phone}</a>
              <a href={`mailto:${email}`} className="flex items-start gap-3 break-all text-sm text-white/58 transition hover:text-white"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#d9f46f]" aria-hidden="true" />{email}</a>
              <p className="flex items-start gap-3 text-sm leading-6 text-white/58"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d9f46f]" aria-hidden="true" />{address}</p>
            </div>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 border-b border-[#d9f46f]/45 pb-1 text-xs font-bold text-[#d9f46f] transition hover:border-[#d9f46f]">Đặt lịch trao đổi <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PrymaLab Việt Nam · prymalab.com</p>
          <p>Designed for better days & deeper nights.</p>
        </div>
      </div>
    </footer>
  );
}
