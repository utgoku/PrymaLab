import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarCheck2, Check, Moon, Salad, Target } from 'lucide-react';
import type { SitePackage, SiteSettings } from '@/lib/db';
import type { KnowledgeArticle } from '@/lib/editorial';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import PackagesSection from './PackagesSection';

interface HomeExperienceProps {
  packages: SitePackage[];
  settings: SiteSettings;
  articles: KnowledgeArticle[];
}

const faqs = [
  { question: 'PrymaLab dành cho ai?', answer: 'Người trưởng thành muốn sắp xếp lại bữa ăn, giấc ngủ và thói quen trong lịch sống bận rộn. Nếu có bệnh nền hoặc triệu chứng kéo dài, hãy trao đổi với bác sĩ trước khi thay đổi chế độ sinh hoạt.' },
  { question: 'Tôi bắt đầu như thế nào?', answer: 'Làm bài đánh giá miễn phí để chọn một ưu tiên, đọc hướng dẫn trong mục Kiến thức hoặc liên hệ để trao đổi về chương trình. Bạn chưa cần chọn gói ngay.' },
  { question: 'Tôi nhận được gì khi chọn chương trình?', answer: 'Khung hành động, mẫu theo dõi và mức đồng hành theo gói 7, 30 hoặc 90 ngày. Nội dung, số buổi trao đổi và chi phí được ghi rõ tại trang Chương trình.' },
  { question: 'PrymaLab có điều trị mất ngủ hay cam kết giảm cân không?', answer: 'Không. PrymaLab hỗ trợ giáo dục và thực hành lối sống, không chẩn đoán, kê đơn hay thay thế điều trị y khoa. Kết quả tùy thuộc bối cảnh và khả năng thực hiện của mỗi người.' },
];

export default function HomeExperience({ packages, settings, articles }: HomeExperienceProps) {
  return <div className="min-h-screen bg-[#f6f8f4] text-[#153339]">
    <Navigation />
    <main>
      <section className="relative isolate overflow-hidden px-5 pb-16 pt-32 sm:px-8 lg:pb-24 lg:pt-40">
        <div className="hero-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
        <div className="mx-auto grid max-w-[82rem] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="section-kicker">Dinh dưỡng · Giấc ngủ · Nhịp sống</p>
            <h1 className="hero-heading mt-6 max-w-2xl font-[family-name:var(--font-display)] text-[clamp(2.5rem,5vw,4.5rem)] tracking-[-0.035em]">Ăn đúng nhịp.<br />Ngủ sâu hơn.<br /><span className="text-[#0b7f72]">Sống sáng hơn.</span></h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-[#566f73]">Hiểu thói quen hiện tại, chọn một thay đổi vừa sức và có người đồng hành khi bạn cần.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/quiz" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#153339] px-6 text-sm font-semibold text-white transition hover:bg-[#0b7f72]">Đánh giá miễn phí <ArrowRight className="h-4 w-4" /></Link><Link href="/services" className="inline-flex min-h-13 items-center justify-center rounded-full border border-[#bcd2c9] bg-white px-6 text-sm font-semibold text-[#153339] hover:border-[#0b7f72]">Xem chương trình</Link></div>
            <p className="mt-5 text-sm text-[#657a7e]">Khoảng 2 phút · Dành cho người từ 18 tuổi</p>
          </div>
          <div className="relative">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-[#d9e8df]"><Image src="/images/hero_wellness.jpg" alt="Bữa ăn cân bằng trong không gian sống thư thái" fill priority sizes="(max-width: 1024px) 92vw, 44vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#102f35]/70 via-transparent to-transparent" /><div className="absolute inset-x-6 bottom-6 text-white"><p className="text-sm font-medium text-white/85">Một điểm bắt đầu, mỗi ngày</p><p className="mt-2 max-w-sm font-[family-name:var(--font-display)] text-2xl leading-snug sm:text-3xl">Chăm sóc mình từ những điều quen thuộc.</p></div></div>
            <div className="relative mx-4 -mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-[#dce5df] bg-white p-4 shadow-sm sm:mx-6 sm:p-5">{[[Salad, 'Bữa ăn'], [Moon, 'Giấc ngủ'], [CalendarCheck2, 'Thói quen']].map(([Icon, label]) => <div key={String(label)} className="flex flex-col items-center gap-2 text-sm font-semibold text-[#526a6f]"><Icon className="h-5 w-5 text-[#0b7f72]" aria-hidden="true" />{String(label)}</div>)}</div>
          </div>
        </div>
      </section>

      <section className="bg-[#102f35] px-5 py-16 text-white sm:px-8 lg:py-20">
        <div className="mx-auto max-w-[82rem]"><div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div><p className="section-kicker section-kicker-dark">Cách chúng tôi đồng hành</p><h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">Ít thay đổi hơn.<br />Dễ duy trì hơn.</h2><Link href="/phuong-phap" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d9f46f]">Tìm hiểu phương pháp <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="grid gap-4 sm:grid-cols-3">{[
            { title: 'Hiểu nhịp hiện tại', copy: 'Nhìn lại bữa ăn, giờ ngủ và mức năng lượng của bạn.', icon: Target },
            { title: 'Chọn một ưu tiên', copy: 'Bắt đầu từ hành động nhỏ phù hợp lịch sống.', icon: Check },
            { title: 'Theo dõi, tinh chỉnh', copy: 'Ghi nhận phản hồi và điều chỉnh theo từng tuần.', icon: CalendarCheck2 },
          ].map((step, index) => <article key={step.title} className="rounded-2xl border border-white/15 bg-white/5 p-5"><step.icon className="h-5 w-5 text-[#8ed7cb]" /><p className="mt-6 text-sm font-semibold text-[#8ed7cb]">0{index + 1}</p><h3 className="mt-2 text-lg font-semibold">{step.title}</h3><p className="mt-3 text-sm leading-7 text-white/75">{step.copy}</p></article>)}</div>
        </div></div>
      </section>

      <PackagesSection packages={packages} />

      <section className="px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[82rem]">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="section-kicker">Kiến thức để thực hành</p><h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">Một điều hữu ích cho hôm nay.</h2></div><Link href="/blog" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0b7f72]">Tất cả bài viết <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="grid gap-6 md:grid-cols-3">{articles.slice(0, 3).map((article) => <Link key={article.slug} href={`/blog/${article.slug}`} className="group overflow-hidden rounded-3xl border border-[#dbe4df] bg-white transition hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-[16/10]"><Image src={article.image} alt={article.imageAlt} fill sizes="(max-width: 768px) 92vw, 30vw" className="object-cover" /></div><div className="p-6"><p className="text-sm font-semibold text-[#0b7f72]">{article.category}</p><h3 className="mt-3 text-xl font-semibold leading-snug group-hover:text-[#0b7f72]">{article.title}</h3><p className="mt-3 line-clamp-2 text-sm leading-7 text-[#5f7478]">{article.description}</p><p className="mt-5 text-sm text-[#657a7e]">{article.readTime}</p></div></Link>)}</div>
        {!articles.length && <p className="text-[#5f7478]">Khám phá hướng dẫn về bữa ăn, giấc ngủ và thói quen trong <Link href="/blog" className="font-semibold text-[#0b7f72] underline">mục Kiến thức</Link>.</p>}
      </div></section>

      <section id="faq" className="scroll-mt-24 bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto grid max-w-[82rem] gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16"><div><p className="section-kicker">Trước khi bắt đầu</p><h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">Bạn muốn biết thêm?</h2><Link href="/contact" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0b7f72]">Trao đổi với PrymaLab <ArrowRight className="h-4 w-4" /></Link></div><div className="divide-y divide-[#dbe4df] border-y border-[#dbe4df]">{faqs.map((faq) => <details key={faq.question} className="faq-item group"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 text-base font-semibold"><span>{faq.question}</span><span className="text-2xl font-normal text-[#0b7f72] group-open:rotate-45">+</span></summary><p className="max-w-3xl pb-6 pr-6 text-base leading-8 text-[#5f7478]">{faq.answer}</p></details>)}</div></div></section>
    </main>
    <Footer settings={settings} />
  </div>;
}

export { faqs };
