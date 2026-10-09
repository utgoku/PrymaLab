import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Eye, HeartHandshake, Layers3, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import { Footer } from '@/components/ui/Footer';
import { Navigation } from '@/components/ui/Navigation';
import { getPublicHomeData } from '@/lib/db';
import { SITE_FOUNDER_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'PrymaLab Việt Nam là gì?',
  description: SITE_FOUNDER_DESCRIPTION,
  alternates: { canonical: '/about' },
};

const principles = [
  { title: 'Nhìn cả hệ thống', copy: 'Bữa ăn, giấc ngủ, năng lượng và lịch sống ảnh hưởng lẫn nhau. Một thay đổi tốt cần tôn trọng toàn bộ bối cảnh.', icon: Layers3 },
  { title: 'Ít nhưng làm được', copy: 'Ưu tiên hành động nhỏ có thể lặp lại thay vì một kế hoạch đẹp trên giấy nhưng quá nặng để duy trì.', icon: Scale },
  { title: 'Minh bạch giới hạn', copy: 'Không thổi phồng kết quả, không dùng danh xưng chuyên môn chưa xác minh và không biến định hướng lối sống thành chẩn đoán.', icon: ShieldCheck },
  { title: 'Tôn trọng dữ liệu', copy: 'Chỉ thu thập thông tin cần cho trải nghiệm, quản lý quyền truy cập và cho người dùng kênh yêu cầu chỉnh sửa hoặc xóa.', icon: Eye },
];

export default async function AboutPage() {
  const { settings } = await getPublicHomeData();
  const pageUrl = `${SITE_URL}/about`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: 'PrymaLab Việt Nam là gì?',
        description: SITE_FOUNDER_DESCRIPTION,
        inLanguage: 'vi-VN',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: `Về ${SITE_NAME}`, item: pageUrl },
        ],
      },
    ],
  };
  return <div className="min-h-screen bg-[#f5f7f3] text-[#153339]">
    <Navigation />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <main>
      <section className="relative isolate overflow-hidden px-5 pb-20 pt-32 sm:px-8 lg:pb-24 lg:pt-40"><div className="hero-grid absolute inset-0 -z-20 opacity-60" /><div className="absolute -left-44 top-10 -z-10 h-[34rem] w-[34rem] rounded-full bg-[#d8f0e8] blur-[115px]" /><div className="mx-auto max-w-[88rem]"><p className="section-kicker">PrymaLab Việt Nam</p><h1 className="mt-6 max-w-5xl font-[family-name:var(--font-display)] text-4xl font-medium tracking-[-0.035em] sm:text-5xl lg:text-7xl">Dinh dưỡng và giấc ngủ, kết nối trong lịch sống thật.</h1><div className="mt-9 grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-start"><div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-[#0b7f72]"><Sparkles className="h-4 w-4" /> Nutrition · Sleep · Rhythm</div><div className="space-y-4 text-[15px] leading-7 text-[#5f767a]"><p><strong className="text-[#27474c]">PrymaLab Việt Nam tại prymalab.com</strong> kết nối dữ liệu dinh dưỡng, giấc ngủ và năng lượng để tạo một điểm bắt đầu dễ thực hiện.</p><p>Thay vì thêm nhiều lời khuyên rời rạc, PrymaLab chuyển dữ liệu vừa đủ thành lựa chọn thực tế và tinh chỉnh theo phản hồi hằng tuần.</p></div></div></div></section>

      <section className="px-5 pb-24 sm:px-8 lg:pb-28"><div className="mx-auto max-w-[88rem]"><div className="grid overflow-hidden rounded-[2.25rem] border border-[#d8e2dd] bg-white lg:grid-cols-[0.82fr_1.18fr]"><div className="bg-[#d9f46f] p-8 sm:p-10"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#49613e]">Nhận diện chính thức</p><h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.08] tracking-[-0.035em]">PrymaLab Việt Nam là dự án founder-led về lối sống.</h2><p className="mt-5 text-sm leading-7 text-[#4d6550]">{SITE_FOUNDER_DESCRIPTION}</p><p className="mt-5 text-sm leading-7 text-[#4d6550]">PrymaLab tại tên miền <strong>prymalab.com</strong> không kinh doanh peptide, chất phản ứng hoặc vật tư nghiên cứu phòng thí nghiệm. Dự án không liên kết, không được ủy quyền và không cùng chủ sở hữu với <strong>prymalab.net</strong>. Phạm vi của chúng tôi là giáo dục dinh dưỡng, giấc ngủ và xây dựng thói quen.</p></div><dl className="grid gap-px bg-[#e2e9e5] sm:grid-cols-2"><div className="bg-white p-7"><dt className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#7c8f91]">Tên đang sử dụng</dt><dd className="mt-3 text-lg font-bold">PrymaLab Việt Nam</dd></div><div className="bg-white p-7"><dt className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#7c8f91]">Website chính thức</dt><dd className="mt-3 text-lg font-bold">prymalab.com</dd></div><div className="bg-white p-7"><dt className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#7c8f91]">Lĩnh vực</dt><dd className="mt-3 text-sm font-semibold leading-6">Dinh dưỡng · Giấc ngủ · Nhịp sống</dd></div><div className="bg-white p-7"><dt className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#7c8f91]">Khu vực phục vụ</dt><dd className="mt-3 text-sm font-semibold leading-6">Việt Nam · hỗ trợ trực tuyến</dd></div><div className="bg-white p-7"><dt className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#7c8f91]">Người sáng lập</dt><dd className="mt-3 text-sm font-semibold leading-6">Dương Thế Hùng</dd></div><div className="bg-white p-7"><dt className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#7c8f91]">Thành lập</dt><dd className="mt-3 text-sm font-semibold leading-6">17/08/2026</dd></div><div className="bg-white p-7 sm:col-span-2"><dt className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#7c8f91]">Liên hệ công khai</dt><dd className="mt-3 text-sm font-semibold leading-6">0948 348 444 · hung@prymalab.com · Đà Nẵng, Việt Nam</dd></div></dl></div></div></section>

      <section className="bg-[#112f35] px-5 py-24 text-white sm:px-8 lg:py-32"><div className="mx-auto max-w-[88rem]"><div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]"><div><p className="section-kicker section-kicker-dark">Nguyên tắc vận hành</p><h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">Chỉnh chu không chỉ là giao diện. Đó là cách chúng tôi giữ lời.</h2></div><div className="grid gap-3 sm:grid-cols-2">{principles.map((principle) => <article key={principle.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-7"><principle.icon className="h-6 w-6 text-[#8ed7cb]" /><h3 className="mt-7 text-xl font-semibold">{principle.title}</h3><p className="mt-3 text-sm leading-7 text-white/55">{principle.copy}</p></article>)}</div></div></div></section>

      <section className="px-5 py-24 sm:px-8 lg:py-32"><div className="mx-auto grid max-w-[88rem] gap-10 lg:grid-cols-[1fr_1fr] lg:items-center"><div className="rounded-[2.25rem] bg-[#d9f46f] p-8 sm:p-12"><HeartHandshake className="h-8 w-8 text-[#153339]" /><p className="mt-8 text-xs font-extrabold uppercase tracking-[0.18em] text-[#4f6742]">Cam kết về bằng chứng</p><h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] tracking-[-0.04em]">Không dựng niềm tin bằng con số hay lời chứng thực chưa kiểm chứng.</h2><p className="mt-5 text-sm leading-7 text-[#4e6550]">Hồ sơ chuyên môn, case study và kết quả khách hàng chỉ nên xuất hiện khi có dữ liệu thật, sự đồng ý phù hợp và khả năng kiểm chứng. Trong giai đoạn hiện tại, PrymaLab ưu tiên mô tả rõ phương pháp, phạm vi và quy trình.</p></div><div className="lg:pl-10"><p className="section-kicker">Lộ trình phát triển</p><h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Xây giá trị trước khi xây cộng đồng.</h2><div className="mt-8 space-y-6">{[['01', 'Chứng minh trải nghiệm cốt lõi', 'Bài đánh giá hữu ích, chương trình rõ ràng, thanh toán và onboarding trơn tru.'], ['02', 'Đo chất lượng thật', 'Theo dõi tỷ lệ hoàn thành, phản hồi và thay đổi thói quen thay vì dùng số liệu trang trí.'], ['03', 'Mở rộng có kiểm soát', 'Chỉ mở rộng cộng đồng khi mô hình founder-led hiện tại đã có quy trình hỗ trợ, kiểm duyệt và bảo vệ dữ liệu.']].map(([number, title, copy]) => <div key={number} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-[#dbe4df] pb-6"><span className="text-xs font-extrabold text-[#0b7f72]">{number}</span><div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#657a7e]">{copy}</p></div></div>)}</div></div></div></section>

      <section className="px-5 pb-8 sm:px-8"><div className="mx-auto flex max-w-[88rem] flex-col gap-7 rounded-[2.5rem] bg-white p-8 shadow-[0_35px_80px_-60px_rgba(18,56,62,0.45)] sm:p-12 lg:flex-row lg:items-end lg:justify-between"><div><p className="section-kicker">Cùng bắt đầu đúng</p><h2 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.04] tracking-[-0.04em]">Nếu PrymaLab không phù hợp, chúng tôi cũng sẽ nói rõ.</h2></div><Link href="/contact" className="inline-flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-[#153339] px-7 text-sm font-bold text-white">Trao đổi với PrymaLab <ArrowRight className="h-4 w-4" /></Link></div></section>
    </main>
    <Footer settings={settings} />
  </div>;
}
