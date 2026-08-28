import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, CalendarCheck2, ClipboardCheck, Moon, Salad, ShieldCheck } from 'lucide-react';
import PackagesSection from '@/components/home/PackagesSection';
import { Footer } from '@/components/ui/Footer';
import { Navigation } from '@/components/ui/Navigation';
import { getPublicHomeData } from '@/lib/db';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Chương trình dinh dưỡng & giấc ngủ cá nhân hóa',
  description: 'Chương trình PrymaLab Việt Nam kết nối dinh dưỡng, giấc ngủ và theo dõi thói quen trong 7, 30 hoặc 90 ngày, với phạm vi và chi phí rõ ràng.',
  alternates: { canonical: '/services' },
};

const steps = [
  { number: '01', title: 'Chụp nhịp hiện tại', copy: 'Ghi nhận lịch ăn, ngủ, năng lượng, mục tiêu và những giới hạn thật trong tuần của bạn.', icon: ClipboardCheck },
  { number: '02', title: 'Chọn một ưu tiên', copy: 'Không thay mọi thứ cùng lúc. PrymaLab chọn điểm tác động lớn nhất và chuyển thành hành động nhỏ.', icon: CalendarCheck2 },
  { number: '03', title: 'Theo dõi phản hồi', copy: 'Dữ liệu theo ngày giúp nhìn xu hướng thay vì đánh giá thành công chỉ bằng cảm giác nhất thời.', icon: BarChart3 },
  { number: '04', title: 'Tinh chỉnh theo tuần', copy: 'Giữ điều đang hiệu quả, bỏ phần gây quá tải và điều chỉnh cho phù hợp lịch sống mới.', icon: ShieldCheck },
];

const faqs = [
  ['Tôi chưa chắc nên chọn gói nào?', 'Hãy bắt đầu bằng bài đánh giá miễn phí hoặc gửi lời nhắn. PrymaLab sẽ đề xuất mức đồng hành phù hợp và bạn vẫn có thể quyết định không mua.'],
  ['PrymaLab có cam kết giảm cân hay chữa mất ngủ không?', 'Không. Kết quả phụ thuộc nhiều yếu tố cá nhân. Dịch vụ tập trung vào giáo dục, cấu trúc hành vi và theo dõi lối sống; không chẩn đoán hoặc điều trị bệnh.'],
  ['Sau khi chuyển khoản, điều gì xảy ra?', 'PrymaLab đối soát mã đơn, liên hệ xác nhận và gửi hướng dẫn bắt đầu theo chương trình đã chọn. Trạng thái đơn được quản lý trong hệ thống CRM.'],
  ['Tôi có bệnh nền hoặc triệu chứng kéo dài thì sao?', 'Bạn nên trao đổi với bác sĩ hoặc cơ sở y tế trước. PrymaLab có thể hỗ trợ tổ chức thói quen sinh hoạt trong phạm vi phù hợp, không thay thế chỉ định y khoa.'],
];

export default async function ServicesPage() {
  const { packages, settings } = await getPublicHomeData();
  const pageUrl = `${SITE_URL}/services`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${pageUrl}#service`,
        name: 'Chương trình dinh dưỡng và giấc ngủ cá nhân hóa PrymaLab',
        description: 'Chương trình giáo dục và đồng hành lối sống kết nối bữa ăn, giấc ngủ, năng lượng và theo dõi thói quen cho người trưởng thành.',
        url: pageUrl,
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: { '@type': 'Country', name: 'Việt Nam' },
        audience: { '@type': 'PeopleAudience', suggestedMinAge: 18 },
        serviceType: 'Đồng hành dinh dưỡng, giấc ngủ và xây dựng thói quen',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Các mức đồng hành PrymaLab',
          itemListElement: packages.map((item) => ({
            '@type': 'Offer',
            name: item.name,
            description: item.desc,
            price: Number(item.price.replace(/\D/g, '')),
            priceCurrency: 'VND',
            url: `${pageUrl}#goi-dich-vu`,
            availability: 'https://schema.org/InStock',
            itemOffered: {
              '@type': 'Service',
              name: item.name,
              provider: { '@id': `${SITE_URL}/#organization` },
            },
          })),
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: faqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Chương trình dinh dưỡng và giấc ngủ | ${SITE_NAME}`,
        inLanguage: 'vi-VN',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${pageUrl}#service` },
      },
    ],
  };
  return <div className="min-h-screen bg-[#f5f7f3] text-[#153339]">
    <Navigation />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <main>
      <section className="relative overflow-hidden px-5 pb-24 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="hero-grid absolute inset-0 opacity-65" /><div className="absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-[#d8e6ff] blur-[110px]" />
        <div className="relative mx-auto grid max-w-[88rem] items-end gap-10 lg:grid-cols-[1fr_0.7fr]">
          <div><p className="section-kicker">Chương trình Pryma</p><h1 className="mt-6 max-w-4xl font-[family-name:var(--font-display)] text-4xl font-medium tracking-[-0.035em] sm:text-5xl lg:text-6xl">Đủ cấu trúc để thay đổi. Đủ linh hoạt để duy trì.</h1></div>
          <div className="lg:pb-2"><p className="max-w-lg text-[15px] leading-7 text-[#60767a]">Một hệ thống giúp bạn hiểu mối liên hệ giữa bữa ăn, giấc ngủ và năng lượng, rồi điều chỉnh theo dữ liệu thật.</p><Link href="/quiz" className="mt-7 inline-flex min-h-13 items-center gap-2 rounded-full bg-[#153339] px-6 text-sm font-bold text-white">Đánh giá miễn phí <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <section className="bg-[#112f35] px-5 py-20 text-white sm:px-8 lg:py-24"><div className="mx-auto max-w-[88rem]"><div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]"><div><p className="section-kicker section-kicker-dark">Một vòng lặp thực hành</p><h2 className="mt-5 max-w-lg font-[family-name:var(--font-display)] text-3xl font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">Không ép cơ thể theo một khuôn cố định.</h2><div className="mt-8 flex gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.07] text-[#8ed7cb]"><Salad className="h-5 w-5" /></span><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.07] text-[#9cb7ff]"><Moon className="h-5 w-5" /></span></div></div><div className="grid gap-3 sm:grid-cols-2">{steps.map((step) => <article key={step.number} className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 sm:p-7"><div className="flex items-center justify-between"><span className="text-xs font-extrabold tracking-[0.18em] text-[#8ed7cb]">{step.number}</span><step.icon className="h-5 w-5 text-white/35" /></div><h3 className="mt-6 text-lg font-semibold">{step.title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{step.copy}</p></article>)}</div></div></div></section>

      <section id="pham-vi" className="scroll-mt-28 px-5 py-24 sm:px-8 lg:py-28"><div className="mx-auto max-w-[88rem]"><div className="grid gap-8 rounded-[2.25rem] border border-[#dbe4df] bg-white p-7 sm:p-10 lg:grid-cols-3 lg:p-12"><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0b7f72]">Phạm vi rõ ràng</p><h2 className="mt-4 text-3xl font-semibold">Bạn đang mua điều gì?</h2></div><div><h3 className="text-sm font-extrabold text-[#153339]">PrymaLab cung cấp</h3><ul className="mt-4 space-y-3 text-sm leading-6 text-[#60767a]"><li>• Cấu trúc đánh giá và theo dõi thói quen.</li><li>• Khung hành động về bữa ăn và giờ ngủ.</li><li>• Buổi trao đổi và tinh chỉnh theo gói.</li></ul></div><div><h3 className="text-sm font-extrabold text-[#153339]">PrymaLab không cung cấp</h3><ul className="mt-4 space-y-3 text-sm leading-6 text-[#60767a]"><li>• Chẩn đoán hoặc điều trị bệnh.</li><li>• Kê đơn thuốc hay thay đổi chỉ định bác sĩ.</li><li>• Cam kết một kết quả giống nhau cho mọi người.</li></ul></div></div></div></section>

      <PackagesSection packages={packages} />

      <section className="px-5 py-20 sm:px-8 lg:py-24"><div className="mx-auto max-w-4xl"><div className="text-center"><p className="section-kicker">Câu hỏi trước khi bắt đầu</p><h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-medium tracking-[-0.03em] sm:text-4xl">Minh bạch trước, cam kết sau.</h2></div><div className="mt-10 divide-y divide-[#dbe4df] border-y border-[#dbe4df]">{faqs.map(([question, answer]) => <details key={question} className="group"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-[15px] font-bold sm:text-base"><span>{question}</span><span className="text-2xl font-light text-[#0b7f72] transition group-open:rotate-45">+</span></summary><p className="max-w-3xl pb-7 text-sm leading-7 text-[#657a7e]">{answer}</p></details>)}</div></div></section>

      <section className="px-5 pb-8 sm:px-8"><div className="mx-auto flex max-w-[88rem] flex-col gap-7 rounded-[2.5rem] bg-[#d9f46f] p-8 sm:p-12 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#48613e]">Chưa cần chọn gói ngay</p><h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.04] tracking-[-0.04em]">Bắt đầu bằng việc hiểu đúng điểm xuất phát.</h2></div><Link href="/quiz" className="inline-flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-[#153339] px-7 text-sm font-bold text-white">Làm bài đánh giá <ArrowRight className="h-4 w-4" /></Link></div></section>
    </main>
    <Footer settings={settings} />
  </div>;
}
