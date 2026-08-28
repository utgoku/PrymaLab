import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpenCheck, CheckCircle2, FileSearch, RefreshCcw, Scale, ShieldCheck } from 'lucide-react';
import { Footer } from '@/components/ui/Footer';
import { Navigation } from '@/components/ui/Navigation';
import { getPublicHomeData } from '@/lib/db';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Chính sách biên tập và kiểm chứng',
  description: 'Cách PrymaLab Việt Nam lựa chọn nguồn, biên soạn, cập nhật và sửa lỗi nội dung về dinh dưỡng, giấc ngủ và nhịp sống.',
  alternates: { canonical: '/chinh-sach-bien-tap' },
};

const standards = [
  {
    icon: FileSearch,
    title: 'Nguồn có thể kiểm tra',
    copy: 'Ưu tiên tài liệu của cơ quan y tế, hướng dẫn chuyên môn, nghiên cứu gốc và bài báo khoa học có phản biện. Nguồn được gắn gần nội dung liên quan.',
  },
  {
    icon: Scale,
    title: 'Tách dữ kiện khỏi diễn giải',
    copy: 'Mỗi khẳng định quan trọng phải có phạm vi và giới hạn. PrymaLab không biến một nghiên cứu nhỏ thành kết luận đúng cho mọi người.',
  },
  {
    icon: ShieldCheck,
    title: 'Không bịa uy tín',
    copy: 'Không tạo tác giả, chuyên gia, chứng nhận, review hay kết quả khách hàng khi chưa thể xác minh độc lập và chưa có sự đồng ý phù hợp.',
  },
  {
    icon: RefreshCcw,
    title: 'Cập nhật có lý do',
    copy: 'Ngày cập nhật chỉ thay đổi khi nội dung thực sự được sửa. URL được giữ ổn định để người đọc và công cụ tìm kiếm theo dõi lịch sử.',
  },
];

const sourceOrder = [
  'Cơ quan nhà nước, tổ chức y tế và tài liệu hướng dẫn chính thức.',
  'Nghiên cứu gốc hoặc tổng quan hệ thống được lập chỉ mục trên cơ sở dữ liệu khoa học.',
  'Hiệp hội chuyên môn và cơ sở y tế có trách nhiệm biên tập rõ ràng.',
  'Nguồn thứ cấp chỉ được dùng để bổ trợ, không thay thế bằng chứng chính.',
];

export default async function EditorialPolicyPage() {
  const { settings } = await getPublicHomeData();
  const pageUrl = `${SITE_URL}/chinh-sach-bien-tap`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Chính sách biên tập và kiểm chứng của ${SITE_NAME}`,
        description: 'Quy trình lựa chọn nguồn, biên soạn, kiểm chứng, cập nhật và sửa lỗi nội dung PrymaLab Việt Nam.',
        inLanguage: 'vi-VN',
        datePublished: '2026-08-19',
        dateModified: '2026-08-19',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Chính sách biên tập', item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f5f7f3] text-[#153339]">
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <main>
        <section className="relative isolate overflow-hidden px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
          <div className="hero-grid absolute inset-0 -z-20 opacity-65" aria-hidden="true" />
          <div className="absolute -right-40 top-8 -z-10 h-[34rem] w-[34rem] rounded-full bg-[#d8e6ff] blur-[115px]" aria-hidden="true" />
          <div className="mx-auto max-w-5xl">
            <p className="section-kicker">Tiêu chuẩn nội dung</p>
            <h1 className="mt-6 max-w-4xl font-[family-name:var(--font-display)] text-4xl font-medium tracking-[-0.035em] sm:text-5xl lg:text-6xl">Thông tin sức khỏe phải rõ nguồn, rõ giới hạn và có người chịu trách nhiệm.</h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-7 text-[#5c7378]">Cách PrymaLab biên soạn, kiểm chứng và sửa nội dung về dinh dưỡng, giấc ngủ và nhịp sống.</p>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-[#0b7f72]">Có hiệu lực từ 19/08/2026 · Phiên bản 1.0</p>
          </div>
        </section>

        <section className="bg-[#102f35] px-5 py-20 text-white sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-[88rem] gap-4 md:grid-cols-2 lg:grid-cols-4">
            {standards.map((standard) => (
              <article key={standard.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-7">
                <standard.icon className="h-6 w-6 text-[#d9f46f]" aria-hidden="true" />
                <h2 className="mt-7 text-xl font-semibold">{standard.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/55">{standard.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="section-kicker">Thứ tự ưu tiên nguồn</p>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-medium tracking-[-0.03em] sm:text-4xl">Nguồn mạnh nhất đứng trước lời kể hay nhất.</h2>
            </div>
            <ol className="space-y-3">
              {sourceOrder.map((item, index) => (
                <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-4 rounded-[1.5rem] border border-[#d8e2dd] bg-white p-5 text-sm leading-7 text-[#526b70]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6f4ef] text-xs font-extrabold text-[#0b7f72]">0{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-[#dce4e0] bg-white px-5 py-24 sm:px-8">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-[#e8f3ee] p-8">
              <BookOpenCheck className="h-7 w-7 text-[#0b7f72]" aria-hidden="true" />
              <h2 className="mt-6 text-2xl font-semibold">Quy trình trước khi xuất bản</h2>
              <ul className="mt-6 space-y-4">
                {['Xác định câu hỏi chính và đối tượng người đọc.', 'Kiểm tra khẳng định quan trọng với nguồn sơ cấp phù hợp.', 'Nêu ngoại lệ, giới hạn và dấu hiệu cần tìm hỗ trợ y tế.', 'Rà soát title, heading, liên kết, ngày và dữ liệu cấu trúc.'].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-[#526b70]"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#0b8a78]" aria-hidden="true" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] bg-[#f0e9df] p-8">
              <ShieldCheck className="h-7 w-7 text-[#a56e1d]" aria-hidden="true" />
              <h2 className="mt-6 text-2xl font-semibold">Phạm vi chuyên môn hiện tại</h2>
              <p className="mt-5 text-sm leading-7 text-[#665f57]">Các bài hiện được biên soạn và kiểm tra nguồn bởi Ban biên tập PrymaLab. Khi chưa có người kiểm duyệt lâm sàng đã xác minh, chúng tôi không gắn danh xưng bác sĩ, chuyên gia dinh dưỡng hay tuyên bố “đã được chuyên gia duyệt”.</p>
              <p className="mt-4 text-sm leading-7 text-[#665f57]">Nội dung có triệu chứng kéo dài, bệnh nền, thuốc hoặc điều trị luôn hướng người đọc tới nhân viên y tế phù hợp.</p>
            </div>
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-5xl rounded-[2.25rem] border border-[#d8e2dd] bg-white p-8 sm:p-12">
            <p className="section-kicker">Sửa lỗi và phản hồi</p>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-medium tracking-[-0.03em] sm:text-4xl">Phát hiện nội dung chưa chính xác?</h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#5d7478]">Gửi URL, đoạn cần kiểm tra và nguồn đối chiếu tới <a className="font-bold text-[#0b7f72] underline underline-offset-4" href={`mailto:${settings.email}`}>{settings.email}</a>. PrymaLab sẽ kiểm tra, sửa phần sai và cập nhật ngày khi có thay đổi nội dung thực sự.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#153339] px-6 text-sm font-bold text-white">Báo lỗi nội dung <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <Link href="/phuong-phap" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#bdd2cc] px-6 text-sm font-bold text-[#0b7f72]">Xem phương pháp PrymaLab</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
