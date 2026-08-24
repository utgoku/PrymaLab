import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  CalendarCheck2,
  Check,
  ChevronRight,
  Clock3,
  Headphones,
  Leaf,
  LockKeyhole,
  MessageCircle,
  Moon,
  Salad,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Utensils,
} from 'lucide-react';
import type { SitePackage, SiteSettings } from '@/lib/db';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import RhythmCheck from './RhythmCheck';

interface HomeExperienceProps {
  packages: SitePackage[];
  settings: SiteSettings;
}

function brandCopy(value: string): string {
  return value
    .replace(/(?:[\p{L}]+\s*&\s*[\p{L}]+\s+)?Transformation(?: 30 Days)?/giu, 'Pryma Reset 30')
    .replace(/(?:[\p{L}]+\s*&\s*[\p{L}]+\s+)?Elite Care(?: 90 Days)?/giu, 'Pryma Signature 90')
    .replace(/(?:[\p{L}]+\s*&\s*[\p{L}]+\s+)?Starter/giu, 'Pryma Start')
    .replace(/(?:[\p{L}]+\s*&\s*[\p{L}]+\s+)?Platform/giu, 'PrymaLab');
}

const journeySteps = [
  {
    number: '01',
    title: 'Hiểu nhịp hiện tại',
    description: 'Bài đánh giá ngắn kết nối thói quen ăn uống, giấc ngủ, năng lượng và mục tiêu cá nhân.',
    icon: Target,
  },
  {
    number: '02',
    title: 'Nhận lộ trình vừa sức',
    description: 'Biến kết quả thành các hành động nhỏ theo ngày, phù hợp lịch sống thay vì một khuôn mẫu cứng nhắc.',
    icon: CalendarCheck2,
  },
  {
    number: '03',
    title: 'Theo dõi điều thực sự đổi',
    description: 'Ghi nhận bữa ăn, thời lượng ngủ và năng lượng để nhìn thấy xu hướng một cách trực quan.',
    icon: BarChart3,
  },
  {
    number: '04',
    title: 'Tinh chỉnh trong buổi 1-1',
    description: 'Theo quyền lợi từng gói, bạn có thể trao đổi để lộ trình bám sát phản hồi thật của cơ thể.',
    icon: MessageCircle,
  },
];

const faqs = [
  {
    question: 'PrymaLab Việt Nam tại prymalab.com là đơn vị nào?',
    answer: 'PrymaLab Việt Nam tại prymalab.com là dự án độc lập về giáo dục dinh dưỡng, chất lượng giấc ngủ và xây dựng thói quen cho người trưởng thành tại Việt Nam. Dự án không bán peptide hoặc hóa chất nghiên cứu và không liên kết, không được ủy quyền, không cùng chủ sở hữu với prymalab.net.',
  },
  {
    question: 'PrymaLab kết hợp dinh dưỡng và giấc ngủ như thế nào?',
    answer: 'PrymaLab xem hai yếu tố này như một vòng phản hồi: ăn uống ảnh hưởng đến năng lượng và khả năng thư giãn, còn giấc ngủ tác động tới cảm giác đói, lựa chọn thực phẩm và khả năng duy trì thói quen. Lộ trình được thiết kế để hai phần hỗ trợ nhau theo từng ngày.',
  },
  {
    question: 'Tôi cần dành bao nhiêu thời gian mỗi ngày?',
    answer: 'Thông thường bạn chỉ cần vài phút để xem kế hoạch và ghi nhận tiến độ. Những thay đổi chính được lồng vào bữa ăn, giờ ngủ và lịch sinh hoạt vốn có, thay vì tạo thêm một danh sách nhiệm vụ dài.',
  },
  {
    question: 'Kết quả đánh giá có phải là chẩn đoán y khoa không?',
    answer: 'Không. Kết quả trên PrymaLab là thông tin định hướng lối sống và không thay thế chẩn đoán, điều trị hoặc tư vấn từ bác sĩ. Nếu có triệu chứng kéo dài hay bất thường, bạn nên trao đổi trực tiếp với cơ sở y tế phù hợp.',
  },
  {
    question: 'Tôi có thể bắt đầu trước khi chọn gói dịch vụ không?',
    answer: 'Có. Bạn có thể thực hiện bài đánh giá miễn phí để hiểu điểm khởi đầu, sau đó mới cân nhắc lộ trình phù hợp với mục tiêu và mức độ đồng hành mong muốn.',
  },
];

export default function HomeExperience({ packages, settings }: HomeExperienceProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8f4] text-[#153339]">
      <Navigation />

      <section className="relative isolate min-h-[92vh] overflow-hidden bg-[#f4f7f2] pb-20 pt-32 sm:pt-36 lg:flex lg:items-center lg:pb-24">
        <div className="hero-grid absolute inset-0 -z-20 opacity-70" aria-hidden="true" />
        <div className="absolute -left-40 top-24 -z-10 h-[34rem] w-[34rem] rounded-full bg-[#d8f0e8] blur-[100px]" aria-hidden="true" />
        <div className="absolute -right-48 bottom-[-12rem] -z-10 h-[36rem] w-[36rem] rounded-full bg-[#d9e4ff] blur-[110px]" aria-hidden="true" />

        <div className="mx-auto grid w-full max-w-[88rem] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-10 xl:gap-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bcded5] bg-white/75 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0b7f72] shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              PrymaLab Việt Nam · Dinh dưỡng × Giấc ngủ
            </div>

            <h1 className="hero-heading mt-7 font-[family-name:var(--font-display)] text-[clamp(3.15rem,6.45vw,6.35rem)] font-medium tracking-[-0.028em] text-[#16383d]">
              Ăn đúng nhịp.
              <span className="mt-2 block text-[#0b8a78]">Ngủ sâu hơn.</span>
              <span className="mt-2 block">Sống sáng hơn.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-[#587075] sm:text-lg sm:leading-8">
              PrymaLab Việt Nam là nền tảng kết nối dữ liệu về bữa ăn, giấc ngủ và năng lượng thành một lộ trình cá nhân hóa dễ thực hiện — để bạn biết hôm nay nên bắt đầu từ đâu.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/quiz"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#123a3f] px-7 text-sm font-bold text-white shadow-[0_16px_35px_-18px_rgba(18,58,63,0.85)] transition hover:-translate-y-0.5 hover:bg-[#0b7f72]"
              >
                Khám phá nhịp sống của bạn <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/phuong-phap"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-[#cfdad6] bg-white/70 px-7 text-sm font-bold text-[#27474c] transition hover:border-[#8dbeb2] hover:bg-white"
              >
                Xem cách PrymaLab hoạt động <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-semibold text-[#60767a]">
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#0b8a78]" aria-hidden="true" /> Đánh giá khoảng 2 phút</span>
              <span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-[#315fca]" aria-hidden="true" /> Tôn trọng dữ liệu cá nhân</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#c18428]" aria-hidden="true" /> Định hướng an toàn, rõ ràng</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[42rem] lg:ml-auto">
            <div className="absolute -left-8 top-14 h-32 w-32 rounded-full border border-[#7dbbae]/30" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-[#112f35] p-3 shadow-[0_40px_100px_-42px_rgba(11,50,56,0.72)] sm:p-4">
              <div className="relative h-[26rem] overflow-hidden rounded-[1.65rem] sm:h-[34rem]">
                <Image
                  src="/images/hero_wellness.jpg"
                  alt="Bữa ăn cân bằng trong không gian nghỉ ngơi yên tĩnh"
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 44vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d292f] via-[#0d292f]/15 to-transparent" />

                <div className="absolute inset-x-4 bottom-4 rounded-[1.5rem] border border-white/15 bg-[#102f35]/88 p-4 text-white shadow-2xl backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-6">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8ed7cb]">Bản đồ nhịp sống</p>
                      <p className="mt-2 text-xl font-semibold sm:text-2xl">Hôm nay đang khá cân bằng</p>
                    </div>
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[6px] border-[#d9f46f] bg-white/5 text-lg font-bold sm:h-20 sm:w-20 sm:text-2xl">78</div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="rounded-2xl bg-white/[0.07] p-3">
                      <Salad className="h-4 w-4 text-[#77d3bd]" aria-hidden="true" />
                      <p className="mt-3 text-lg font-bold">82</p>
                      <p className="mt-0.5 text-[10px] text-white/55">Dinh dưỡng</p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.07] p-3">
                      <Moon className="h-4 w-4 text-[#8fb0ff]" aria-hidden="true" />
                      <p className="mt-3 text-lg font-bold">71</p>
                      <p className="mt-0.5 text-[10px] text-white/55">Giấc ngủ</p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.07] p-3">
                      <Sun className="h-4 w-4 text-[#f5c867]" aria-hidden="true" />
                      <p className="mt-3 text-lg font-bold">80</p>
                      <p className="mt-0.5 text-[10px] text-white/55">Năng lượng</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-5 top-[18%] hidden rounded-2xl border border-white bg-white/90 p-4 shadow-xl backdrop-blur sm:block">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f7f2] text-[#0b8a78]"><Leaf className="h-5 w-5" aria-hidden="true" /></span>
                <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#829397]">Gợi ý hôm nay</p><p className="mt-1 text-xs font-bold text-[#27474c]">Thêm 20g protein bữa sáng</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dde5e0] bg-white py-7">
        <div className="mx-auto flex max-w-[88rem] flex-col items-center justify-between gap-5 px-5 text-center sm:px-8 lg:flex-row lg:text-left">
          <p className="max-w-2xl text-sm font-semibold leading-6 text-[#3c595e]">Một hệ thống liền mạch thay cho nhiều lời khuyên rời rạc.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-bold uppercase tracking-[0.12em] text-[#778b8f]">
            <span className="flex items-center gap-2"><Utensils className="h-4 w-4 text-[#0b8a78]" aria-hidden="true" /> Thực đơn cá nhân</span>
            <span className="flex items-center gap-2"><Moon className="h-4 w-4 text-[#315fca]" aria-hidden="true" /> Nhật ký giấc ngủ</span>
            <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[#bd7d24]" aria-hidden="true" /> Buổi tinh chỉnh 1-1</span>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-kicker">Thử ngay trên trang</p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#153339] sm:text-5xl">
              Ba tín hiệu nhỏ có thể nói khá nhiều về nhịp sống của bạn.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#657a7e]">Điều chỉnh các thanh bên dưới để nhận một gợi ý tức thì, sau đó làm bài đánh giá đầy đủ khi bạn sẵn sàng.</p>
          </div>
          <div className="mt-12">
            <RhythmCheck />
          </div>
        </div>
      </section>

      <section id="phuong-phap" className="relative bg-[#112f35] px-5 py-24 text-white sm:px-8 lg:py-32">
        <div className="night-grid absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative mx-auto max-w-[88rem]">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="section-kicker section-kicker-dark">Phương pháp Pryma</p>
              <h2 className="mt-5 max-w-xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.1] tracking-[-0.035em] sm:text-5xl lg:text-6xl">Một thay đổi tốt phải sống được trong lịch thật.</h2>
              <p className="mt-6 max-w-lg text-base leading-7 text-white/62">Vì thế PrymaLab bắt đầu từ dữ liệu vừa đủ, tạo hành động nhỏ, rồi liên tục tinh chỉnh theo phản hồi của chính bạn.</p>
              <Link href="/services" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#d9f46f] transition hover:gap-3">Khám phá chương trình <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>

            <div className="space-y-3">
              {journeySteps.map((step) => (
                <div key={step.number} className="group grid gap-5 rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 transition hover:border-[#79caba]/35 hover:bg-white/[0.075] sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-8">
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white/[0.08] text-[#8ed7cb]">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3"><span className="text-xs font-bold tracking-[0.18em] text-[#7fc8bb]">{step.number}</span><h3 className="text-xl font-semibold">{step.title}</h3></div>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/58">{step.description}</p>
                  </div>
                  <ChevronRight className="hidden h-5 w-5 text-white/25 transition group-hover:translate-x-1 group-hover:text-[#d9f46f] sm:block" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eef2ec] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-[88rem]">
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_0.7fr]">
            <div>
              <p className="section-kicker">Hai hệ thống, một mục tiêu</p>
              <h2 className="mt-4 max-w-4xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.1] tracking-[-0.035em] sm:text-5xl lg:text-6xl">Dinh dưỡng tạo năng lượng ban ngày. Giấc ngủ hoàn tất quá trình phục hồi.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-[#657a7e] lg:justify-self-end">PrymaLab kết nối hai mảnh ghép trên cùng một dòng thời gian để bạn không phải tự ghép hàng chục lời khuyên trái chiều.</p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            <article className="group overflow-hidden rounded-[2rem] border border-[#d8e2dd] bg-white">
              <div className="relative h-72 overflow-hidden sm:h-96">
                <Image src="/images/nutrition_premium.jpg" alt="Bữa ăn giàu rau xanh và đạm chất lượng" fill sizes="(max-width: 1024px) 92vw, 45vw" className="object-cover transition duration-700 group-hover:scale-[1.025]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102f35]/85 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                  <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a6e3d6]">Ban ngày</p><h3 className="mt-2 text-3xl font-semibold">Dinh dưỡng theo nhịp</h3></div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur"><Salad className="h-5 w-5" aria-hidden="true" /></span>
                </div>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                <div className="rounded-2xl bg-[#eef8f4] p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#0b7f72]">Thực đơn</p><p className="mt-2 text-sm leading-6 text-[#496368]">Gợi ý theo mục tiêu, mức năng lượng và nhịp sinh hoạt thực tế.</p></div>
                <div className="rounded-2xl bg-[#f5f7f3] p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#587075]">Theo dõi</p><p className="mt-2 text-sm leading-6 text-[#496368]">Đánh dấu bữa ăn và nhìn tiến độ mà không cần đếm mọi thứ.</p></div>
              </div>
            </article>

            <article className="group overflow-hidden rounded-[2rem] border border-[#d8e2dd] bg-white">
              <div className="relative h-72 overflow-hidden sm:h-96">
                <Image src="/images/sleep_serene.jpg" alt="Không gian phòng ngủ yên tĩnh vào buổi tối" fill sizes="(max-width: 1024px) 92vw, 45vw" className="object-cover transition duration-700 group-hover:scale-[1.025]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101d42]/85 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                  <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8c9ff]">Ban đêm</p><h3 className="mt-2 text-3xl font-semibold">Phục hồi có dữ liệu</h3></div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur"><Moon className="h-5 w-5" aria-hidden="true" /></span>
                </div>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                <div className="rounded-2xl bg-[#edf2ff] p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#315fca]">Nhật ký</p><p className="mt-2 text-sm leading-6 text-[#496368]">Ghi giờ ngủ, giờ dậy và cảm nhận để nhận ra xu hướng.</p></div>
                <div className="rounded-2xl bg-[#f5f7f3] p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#587075]">Hạ nhịp</p><p className="mt-2 text-sm leading-6 text-[#496368]">Routine thư giãn, bài thở và nội dung hỗ trợ trước khi ngủ.</p></div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#112f35] px-5 py-24 text-white sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[88rem]">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="section-kicker section-kicker-dark">Niềm tin có thể kiểm chứng</p>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.1] tracking-[-0.035em] sm:text-5xl">Uy tín không cần lời khen dựng sẵn.</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/55">PrymaLab chỉ công bố phản hồi khách hàng khi có trải nghiệm thật và sự đồng ý phù hợp. Trong lúc chưa có dữ liệu xác minh, quy trình minh bạch là bằng chứng tốt hơn.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Đơn có mã riêng', 'QR gắn đúng số tiền và nội dung để đối soát.', ShieldCheck],
                ['Phạm vi rõ ràng', 'Định hướng lối sống, không đóng vai chẩn đoán y khoa.', Target],
                ['Dữ liệu tối thiểu', 'Chỉ thu thập thông tin cần cho đánh giá và hỗ trợ.', LockKeyhole],
                ['Phản hồi có xác minh', 'Không tự viết review hoặc dùng danh tính khách hàng khi chưa được phép.', MessageCircle],
              ].map(([title, copy, Icon]) => (
                <article key={String(title)} className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6">
                  <Icon className="h-5 w-5 text-[#d9f46f]" aria-hidden="true" />
                  <h3 className="mt-5 text-base font-bold">{String(title)}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/50">{String(copy)}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-[88rem]">
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="section-kicker">Sau khi chọn chương trình</p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.1] tracking-[-0.035em] sm:text-5xl">Từ mã QR đến buổi bắt đầu, mọi bước đều rõ ràng.</h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#657a7e]">Bạn nhận đúng mã đơn, đúng nội dung chuyển khoản và biết đơn đang ở bước nào trước khi PrymaLab bắt đầu đồng hành.</p>
              <div className="mt-8 space-y-4">
                {[
                  ['Mã đơn riêng', 'Mỗi đơn có mã đối soát và nội dung chuyển khoản riêng.'],
                  ['Xác nhận minh bạch', 'Bạn chủ động báo đã chuyển; PrymaLab kiểm tra trước khi kích hoạt.'],
                  ['Onboarding có người thật', 'Sau đối soát, PrymaLab liên hệ để xác nhận mục tiêu và lịch bắt đầu.'],
                ].map(([title, description]) => (
                  <div key={title} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#dff3ed] text-[#0b7f72]"><Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /></span>
                    <div><p className="text-sm font-bold text-[#27474c]">{title}</p><p className="mt-1 text-sm leading-6 text-[#6a7e82]">{description}</p></div>
                  </div>
                ))}
              </div>
              <Link href="/services" className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-full border border-[#b8d3cc] px-6 text-sm font-bold text-[#0b7f72] transition hover:bg-[#eef8f4]">Xem chương trình phù hợp <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>

            <div className="relative rounded-[2.25rem] bg-[#102f35] p-3 shadow-[0_35px_90px_-45px_rgba(17,47,53,0.7)] sm:p-5">
              <div className="rounded-[1.6rem] bg-[#f5f7f3] p-4 sm:p-6">
                <div className="flex items-center justify-between border-b border-[#dfe6e2] pb-4">
                  <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0b7f72]">Quy trình bắt đầu</p><p className="mt-1 text-xl font-semibold text-[#153339]">Đơn PrymaLab của bạn</p></div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9f46f] text-sm font-bold text-[#153339]">2/4</span>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between"><p className="text-sm font-bold text-[#27474c]">Tiến độ khởi động</p><TrendingUp className="h-4 w-4 text-[#0b8a78]" aria-hidden="true" /></div>
                    <div className="mt-5 space-y-4">
                      {[['Tạo đơn', 'Hoàn tất', '100%'], ['Đối soát', 'Đang chờ', '58%'], ['Onboarding', 'Tiếp theo', '12%']].map(([label, value, width]) => (
                        <div key={label}>
                          <div className="flex justify-between text-xs"><span className="font-semibold text-[#5e7478]">{label}</span><span className="text-[#8a999c]">{value}</span></div>
                          <div className="mt-2 h-1.5 rounded-full bg-[#e7ece8]"><div className="h-full rounded-full bg-[#0b8a78]" style={{ width }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#173b42] p-5 text-white">
                    <Moon className="h-5 w-5 text-[#9cb7ff]" aria-hidden="true" />
                    <p className="mt-5 text-xs text-white/55">Thanh toán</p><p className="mt-1 text-2xl font-semibold">QR theo đơn</p>
                    <div className="mt-5 flex h-14 items-end gap-1.5">
                      {[38, 56, 44, 72, 64, 82, 74].map((height, index) => <span key={index} className="flex-1 rounded-t bg-[#799bf3]" style={{ height: `${height}%`, opacity: 0.45 + index * 0.07 }} />)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-[#dfe6e2] bg-white p-4">
                  <div className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff4d9] text-[#a56e1d]"><Headphones className="h-5 w-5" aria-hidden="true" /></span><div className="flex-1"><p className="text-sm font-bold text-[#27474c]">Bước tiếp theo</p><p className="mt-1 text-xs text-[#7b8d90]">PrymaLab đối soát và liên hệ xác nhận lịch bắt đầu.</p></div><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#153339] text-white"><ChevronRight className="h-4 w-4" aria-hidden="true" /></span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="goi-dich-vu" className="bg-[#f3f6f1] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-[88rem]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-kicker">Chọn mức đồng hành</p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">Bắt đầu nhỏ. Nâng cấp khi bạn cần đi xa hơn.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#657a7e]">Mỗi gói được thiết kế theo một mức độ hỗ trợ rõ ràng — từ tự khám phá đến đồng hành chuyên sâu.</p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-stretch">
            {packages.map((servicePackage, index) => {
              const isFeatured = Boolean(servicePackage.badge) || index === 1;
              return (
                <article key={servicePackage.id} className={`relative flex flex-col rounded-[2rem] border p-6 sm:p-8 ${isFeatured ? 'border-[#0b7f72] bg-[#12383e] text-white shadow-[0_30px_70px_-40px_rgba(18,56,62,0.8)]' : 'border-[#d9e2dd] bg-white text-[#153339]'}`}>
                  {isFeatured && <span className="absolute right-6 top-6 max-w-[9.5rem] rounded-full bg-[#d9f46f] px-3 py-1 text-center text-[10px] font-extrabold uppercase leading-4 tracking-[0.1em] text-[#153339]">{servicePackage.badge || 'Lộ trình trọng tâm'}</span>}
                  <p className={`text-xs font-bold uppercase tracking-[0.16em] ${isFeatured ? 'text-[#8ed7cb]' : 'text-[#0b7f72]'}`}>Lộ trình {index === 0 ? 'khởi động' : index === 1 ? 'chuyển đổi' : 'toàn diện'}</p>
                  <h3 className="mt-5 max-w-[75%] text-2xl font-semibold">{brandCopy(servicePackage.name)}</h3>
                  <p className={`mt-3 min-h-12 text-sm leading-6 ${isFeatured ? 'text-white/60' : 'text-[#6a7e82]'}`}>{brandCopy(servicePackage.desc)}</p>
                  <div className="mt-7 flex items-end gap-2"><span className="text-3xl font-bold tracking-tight">{servicePackage.price}</span><span className={`pb-1 text-xs ${isFeatured ? 'text-white/45' : 'text-[#829397]'}`}>{servicePackage.period}</span></div>
                  {servicePackage.subprice && <p className={`mt-2 text-xs ${isFeatured ? 'text-[#9bd8cd]' : 'text-[#0b7f72]'}`}>{servicePackage.subprice}</p>}

                  <div className={`my-7 h-px ${isFeatured ? 'bg-white/10' : 'bg-[#e4e9e6]'}`} />
                  <ul className="flex-1 space-y-3">
                    {servicePackage.features.map((feature) => (
                      <li key={feature.text} className={`flex gap-3 text-sm leading-6 ${feature.included ? (isFeatured ? 'text-white/78' : 'text-[#526a6f]') : (isFeatured ? 'text-white/28 line-through' : 'text-[#a6b1b3] line-through')}`}>
                        <span className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${feature.included ? (isFeatured ? 'bg-[#d9f46f] text-[#153339]' : 'bg-[#dff3ed] text-[#0b7f72]') : 'bg-current/10'}`}><Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" /></span>
                        {brandCopy(feature.text)}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/checkout?package=${servicePackage.id}`} className={`mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition ${isFeatured ? 'bg-[#d9f46f] text-[#153339] hover:bg-[#e5fa8d]' : 'border border-[#bdd2cc] text-[#0b7f72] hover:bg-[#eef8f4]'}`}>Chọn lộ trình <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-white px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="section-kicker">Câu hỏi thường gặp</p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#153339]">Hiểu rõ trước khi bắt đầu.</h2>
            <p className="mt-5 text-sm leading-6 text-[#6a7e82]">Nếu bạn cần trao đổi thêm về tình trạng hoặc mục tiêu cá nhân, đội ngũ PrymaLab sẵn sàng lắng nghe.</p>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#0b7f72]">Gửi câu hỏi cho PrymaLab <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          <div className="divide-y divide-[#dfe6e2] border-y border-[#dfe6e2]">
            {faqs.map((faq, index) => (
              <details key={faq.question} className="faq-item group" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-base font-bold text-[#27474c] sm:text-lg">
                  {faq.question}
                  <span className="relative h-8 w-8 shrink-0 rounded-full border border-[#cdd9d4] transition group-open:rotate-45"><span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-[#0b7f72]" /><span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-[#0b7f72]" /></span>
                </summary>
                <p className="max-w-3xl pb-7 pr-8 text-sm leading-7 text-[#657a7e]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-6 sm:px-8">
        <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-[2.5rem] bg-[#d9f46f] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[55px] border-[#153339]/5" aria-hidden="true" />
          <div className="relative grid items-end gap-9 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#466038]">Bắt đầu bằng sự thấu hiểu</p>
              <h2 className="mt-4 max-w-4xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.1] tracking-[-0.035em] text-[#153339] sm:text-5xl lg:text-6xl">Hai phút hôm nay có thể mở ra một nhịp sống tốt hơn.</h2>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-[#45604e]">Hoàn thành bài đánh giá để nhận điểm khởi đầu và gợi ý ưu tiên phù hợp với bạn.</p>
            </div>
            <Link href="/quiz" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#153339] px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0b7f72]">Làm bài đánh giá miễn phí <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </main>
  );
}

export { faqs };
