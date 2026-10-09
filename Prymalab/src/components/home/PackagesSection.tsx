import Link from 'next/link';
import { ArrowRight, Check, Minus } from 'lucide-react';
import type { SitePackage } from '@/lib/db';
import { DEFAULT_SITE_PACKAGES } from '@/lib/db';

export default function PackagesSection({ packages }: { packages?: SitePackage[] }) {
  const displayPackages = packages?.length ? packages : DEFAULT_SITE_PACKAGES;
  return <section id="goi-dich-vu" className="scroll-mt-28 bg-[#edf2ec] px-5 py-24 sm:px-8 lg:py-28">
    <div className="mx-auto max-w-[88rem]">
      <div className="grid items-end gap-6 lg:grid-cols-[1fr_0.7fr]"><div><p className="section-kicker">Ba mức đồng hành</p><h2 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">Chọn mức hỗ trợ phù hợp với nhịp sống.</h2></div><p className="max-w-lg text-sm leading-6 text-[#657a7e] lg:justify-self-end">Mỗi chương trình ghi rõ thời lượng, nội dung và mức đầu tư.</p></div>
      {!displayPackages.length && <div className="mt-10 rounded-2xl border border-[#d8e2dd] bg-white p-6"><p className="text-base text-[#526a6f]">Chưa tải được thông tin chương trình. Liên hệ để được gửi nội dung và chi phí hiện tại.</p><Link href="/contact" className="mt-4 inline-flex min-h-11 items-center font-semibold text-[#0b7f72]">Trao đổi về chương trình <ArrowRight className="ml-2 h-4 w-4" /></Link></div>}
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {displayPackages.map((pkg, index) => {
          const featured = pkg.id === 'transformation' || index === 1;
          return <article key={pkg.id} className={`relative flex flex-col overflow-hidden rounded-[2rem] border p-7 sm:p-8 ${featured ? 'border-[#153339] bg-[#153339] text-white shadow-[0_35px_80px_-50px_rgba(18,56,62,0.95)]' : 'border-[#d8e2dd] bg-white text-[#153339]'}`}>
            {pkg.badge && <span className={`w-fit rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${featured ? 'bg-[#d9f46f] text-[#153339]' : 'bg-[#e6f5ef] text-[#0b7f72]'}`}>{pkg.badge}</span>}
            <h3 className="mt-6 text-2xl font-semibold">{pkg.name}</h3><p className={`mt-3 min-h-12 text-sm leading-6 ${featured ? 'text-white/80' : 'text-[#687d81]'}`}>{pkg.desc}</p>
            <div className="mt-7 flex flex-wrap items-baseline gap-x-2 gap-y-1"><strong className="text-[clamp(1.6rem,2.8vw,2rem)] tracking-[-0.03em]">{pkg.price}</strong><span className={`pb-1 text-xs ${featured ? 'text-white/75' : 'text-[#829397]'}`}>{pkg.period}</span></div>{pkg.subprice && <p className={`mt-2 text-xs font-semibold ${featured ? 'text-[#8ed7cb]' : 'text-[#0b7f72]'}`}>{pkg.subprice}</p>}
            <div className={`my-7 h-px ${featured ? 'bg-white/10' : 'bg-[#e1e8e4]'}`} />
            <ul className="flex-grow space-y-3">{pkg.features.map((feature) => <li key={feature.text} className={`flex gap-3 text-sm leading-6 ${feature.included ? featured ? 'text-white/85' : 'text-[#526a6f]' : featured ? 'text-white/65' : 'text-[#9aabaa]'}`}><span className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${feature.included ? featured ? 'bg-[#d9f46f] text-[#153339]' : 'bg-[#e4f5ef] text-[#0b7f72]' : 'bg-[#e6ebe8] text-[#8c9c9e]'}`}>{feature.included ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : <Minus className="h-2.5 w-2.5" />}</span>{feature.text}</li>)}</ul>
            <Link href={`/checkout?package=${pkg.id}`} className={`mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition hover:-translate-y-0.5 ${featured ? 'bg-[#d9f46f] text-[#153339]' : 'bg-[#153339] text-white'}`}>Chọn chương trình <ArrowRight className="h-4 w-4" /></Link>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
