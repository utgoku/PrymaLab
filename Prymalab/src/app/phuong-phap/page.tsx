import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator, CheckCircle2, ExternalLink, Moon, Scale, ShieldCheck } from 'lucide-react';
import { Footer } from '@/components/ui/Footer';
import { Navigation } from '@/components/ui/Navigation';
import { getPublicHomeData } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Phương pháp PrymaLab',
  description: 'Cách PrymaLab ước tính BMI, TDEE và tín hiệu giấc ngủ; nguồn tham khảo, giới hạn và nguyên tắc biên tập minh bạch.',
  alternates: { canonical: '/phuong-phap' },
  openGraph: {
    title: 'Phương pháp PrymaLab | Dữ liệu rõ, giới hạn rõ',
    description: 'Cách PrymaLab biến dữ liệu dinh dưỡng, giấc ngủ và nhịp sống thành điểm khởi đầu có thể thực hành.',
    url: '/phuong-phap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phương pháp PrymaLab | Dữ liệu rõ, giới hạn rõ',
    description: 'Nguồn tham khảo, cách tính và giới hạn của bài đánh giá PrymaLab.',
  },
};

const sources = [
  { label: 'Mifflin–St Jeor: phương trình ước tính năng lượng nghỉ', publisher: 'The American Journal of Clinical Nutrition / PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/' },
  { label: 'Định nghĩa và cách đọc BMI ở người trưởng thành', publisher: 'World Health Organization', url: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight' },
  { label: 'Khuyến nghị thời lượng ngủ cho người trưởng thành', publisher: 'AASM & Sleep Research Society', url: 'https://aasm.org/resources/pdf/pressroom/adult-sleep-duration-consensus.pdf' },
  { label: 'Thói quen hỗ trợ giấc ngủ', publisher: 'NHLBI, National Institutes of Health', url: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits' },
];

export default async function MethodPage() {
  const { settings } = await getPublicHomeData();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://prymalab.com/phuong-phap#webpage',
    url: 'https://prymalab.com/phuong-phap',
    name: 'Phương pháp PrymaLab',
    description: 'Nguồn, cách tính và giới hạn của bài đánh giá dinh dưỡng và giấc ngủ PrymaLab.',
    inLanguage: 'vi-VN',
    isPartOf: { '@id': 'https://prymalab.com/#website' },
    dateModified: '2026-08-19',
    publisher: { '@id': 'https://prymalab.com/#organization' },
  };

  return (
    <div className="min-h-screen bg-[#f5f7f3] text-[#153339]">
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <main>
        <section className="relative overflow-hidden px-5 pb-24 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
          <div className="hero-grid absolute inset-0 opacity-65" />
          <div className="absolute -right-32 top-16 h-[30rem] w-[30rem] rounded-full bg-[#d8e6ff] blur-[110px]" />
          <div className="relative mx-auto grid max-w-[88rem] gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div><p className="section-kicker">Minh bạch phương pháp</p><h1 className="mt-6 max-w-4xl font-[family-name:var(--font-display)] text-4xl font-medium tracking-[-0.035em] sm:text-5xl lg:text-6xl">Dữ liệu rõ. Giới hạn rõ. Hành động vừa sức.</h1></div>
            <div className="rounded-[2rem] border border-[#d6e3dd] bg-white/80 p-7 shadow-[0_25px_65px_-50px_rgba(21,51,57,0.5)] backdrop-blur">
              <p className="text-sm leading-7 text-[#5b7378]">PrymaLab dùng công thức tham chiếu công khai để tạo điểm khởi đầu, sau đó ưu tiên xu hướng và phản hồi thật. Đây là công cụ giáo dục lối sống, không phải chẩn đoán y khoa.</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#0b7f72]">Cập nhật phương pháp: 19/08/2026</p>
            </div>
          </div>
        </section>

        <section className="bg-[#102f35] px-5 py-24 text-white sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-[88rem] gap-4 md:grid-cols-3">
            {[
              { icon: Calculator, label: 'Năng lượng', title: 'BMR & TDEE', text: 'BMR dùng Mifflin–St Jeor; TDEE nhân với hệ số vận động do người dùng lựa chọn.' },
              { icon: Scale, label: 'Cấu trúc cơ thể', title: 'BMI tham chiếu', text: 'BMI theo ngưỡng người trưởng thành và luôn đi cùng cảnh báo về giới hạn của chỉ số.' },
              { icon: Moon, label: 'Phục hồi', title: 'Tín hiệu giấc ngủ', text: 'Thang nội bộ tổng hợp thời lượng, vào giấc, thức giấc, cảm giác phục hồi và routine.' },
            ].map((item) => <article key={item.title} className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-7"><item.icon className="h-6 w-6 text-[#d9f46f]" /><p className="mt-8 text-xs font-extrabold uppercase tracking-[0.16em] text-[#8ed7cb]">{item.label}</p><h2 className="mt-3 text-2xl font-semibold">{item.title}</h2><p className="mt-4 text-sm leading-7 text-white/58">{item.text}</p></article>)}
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div><p className="section-kicker">Cách chấm tín hiệu ngủ</p><h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-medium tracking-[-0.03em] sm:text-4xl">Một tín hiệu định hướng, không phải điểm sức khỏe.</h2></div>
            <div className="space-y-5 text-[15px] leading-7 text-[#5b7277]">
              <p>Thang 100 điểm nội bộ phân bổ tối đa 30 điểm cho thời lượng, 20 cho thời gian vào giấc, 15 cho tính liên tục, 15 cho cảm giác phục hồi và 20 cho routine. Routine xem xét màn hình trước ngủ, caffeine buổi chiều và tính đều đặn.</p>
              <p>Trọng số được thiết kế để tạo cuộc trò chuyện về thói quen, chưa được thẩm định như công cụ lâm sàng. Điểm không dùng để phát hiện mất ngủ, ngưng thở khi ngủ hoặc bất kỳ bệnh lý nào.</p>
              <div className="rounded-[1.75rem] border border-[#d7e2dd] bg-white p-6"><h3 className="font-bold text-[#153339]">Cách đọc đúng</h3><ul className="mt-4 space-y-3">{['So sánh xu hướng của chính bạn, không so với người khác.', 'Xem từng thành phần thay vì chỉ nhìn tổng điểm.', 'Tìm hỗ trợ y tế khi có triệu chứng kéo dài hoặc ảnh hưởng an toàn.'].map((item) => <li key={item} className="flex gap-3 text-sm leading-7"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#0b8a78]" />{item}</li>)}</ul></div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 sm:px-8 lg:pb-28">
          <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-[#e7efe9] p-8"><ShieldCheck className="h-6 w-6 text-[#0b7f72]" /><h2 className="mt-6 text-2xl font-semibold">PrymaLab làm gì</h2><ul className="mt-5 space-y-3 text-sm leading-7 text-[#526b70]">{['Biến dữ liệu tự khai thành điểm bắt đầu dễ hiểu.', 'Đề xuất hành động nhỏ trong phạm vi lối sống.', 'Theo dõi xu hướng và công khai nguồn, giới hạn.'].map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-[2rem] bg-[#f0e9df] p-8"><ShieldCheck className="h-6 w-6 text-[#a56e1d]" /><h2 className="mt-6 text-2xl font-semibold">PrymaLab không làm gì</h2><ul className="mt-5 space-y-3 text-sm leading-7 text-[#6e655b]">{['Không chẩn đoán, điều trị hoặc kê đơn.', 'Không bảo đảm giảm cân hay chữa mất ngủ.', 'Không dùng danh xưng chuyên môn chưa xác minh.'].map((item) => <li key={item}>• {item}</li>)}</ul></div>
          </div>
        </section>

        <section className="border-y border-[#d9e2de] bg-white px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-5xl"><p className="section-kicker">Nguồn chính</p><h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-medium tracking-[-0.03em] sm:text-4xl">Có thể kiểm tra độc lập.</h2><div className="mt-8 grid gap-4 sm:grid-cols-2">{sources.map((source, index) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="rounded-[1.5rem] border border-[#dce4e0] p-5 hover:border-[#9bcac0]"><span className="text-xs font-extrabold text-[#0b7f72]">0{index + 1}</span><span className="mt-3 flex items-start justify-between gap-4 text-sm font-bold leading-6">{source.label}<ExternalLink className="mt-1 h-4 w-4 shrink-0" /></span><span className="mt-2 block text-xs text-[#7a8d8f]">{source.publisher}</span></a>)}</div></div>
        </section>

        <section className="px-5 py-10 sm:px-8"><div className="mx-auto flex max-w-[88rem] flex-col gap-7 rounded-[2.5rem] bg-[#d9f46f] p-8 sm:p-12 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#48613e]">Bắt đầu từ dữ liệu của bạn</p><h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold">Khám phá nhịp sống trong khoảng 2 phút.</h2></div><Link href="/quiz" className="inline-flex min-h-13 items-center gap-2 rounded-full bg-[#153339] px-7 text-sm font-bold text-white">Làm bài đánh giá <ArrowRight className="h-4 w-4" /></Link></div></section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
