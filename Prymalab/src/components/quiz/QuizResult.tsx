'use client';

import Link from 'next/link';
import { ArrowRight, Calculator, CheckCircle2, Info, Moon, RefreshCcw, ShieldCheck } from 'lucide-react';

export interface QuizResults {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  energyRange: { low: number; high: number };
  sleepScore: number;
  sleepCategory: string;
  recommendations: string[];
  targetGoal: string;
}

export default function QuizResult({ scores, onRestart }: { scores: QuizResults; onRestart: () => void }) {
  const circumference = 289;
  const dashOffset = circumference - (circumference * scores.sleepScore) / 100;

  return (
    <div className="w-full overflow-hidden rounded-[2rem] border border-[#dbe4df] bg-white shadow-[0_35px_90px_-55px_rgba(17,47,53,0.55)]">
      <header className="relative overflow-hidden bg-[#112f35] px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#0b8a78]/30 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#8ed7cb]">Bản đọc Pryma Baseline</p>
            <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-medium leading-[1.12] tracking-[-0.03em] sm:text-4xl">Điểm xuất phát đã rõ. Bây giờ chỉ cần chọn đúng ưu tiên.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55">Mục tiêu bạn chọn: <strong className="text-white/85">{scores.targetGoal}</strong>. Các con số bên dưới là ước tính định hướng cho người trưởng thành, không phải kết luận y khoa.</p>
          </div>
          <div className="relative mx-auto h-40 w-40 shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 104 104" aria-hidden="true">
              <circle cx="52" cy="52" r="46" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="7" />
              <circle cx="52" cy="52" r="46" fill="none" stroke="#d9f46f" strokeWidth="7" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center"><strong className="text-4xl">{scores.sleepScore}</strong><span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/45">Tín hiệu ngủ</span></div>
          </div>
        </div>
      </header>

      <div className="p-6 sm:p-10 lg:p-14">
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-[1.5rem] border border-[#dbe4df] bg-[#f8faf7] p-6">
            <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f7f2] text-[#0b7f72]"><Calculator className="h-5 w-5" /></span><span className="rounded-full bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#718589]">Tham chiếu</span></div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-[#718589]">BMI người trưởng thành</p><p className="mt-2 text-4xl font-bold tracking-[-0.04em] text-[#153339]">{scores.bmi.toFixed(1)}</p><p className="mt-2 text-sm font-semibold text-[#0b7f72]">{scores.bmiCategory}</p>
          </article>
          <article className="rounded-[1.5rem] border border-[#dbe4df] bg-[#f8faf7] p-6">
            <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf2ff] text-[#315fca]"><Moon className="h-5 w-5" /></span><span className="rounded-full bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#718589]">Nội bộ</span></div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-[#718589]">Tín hiệu giấc ngủ</p><p className="mt-2 text-4xl font-bold tracking-[-0.04em] text-[#153339]">{scores.sleepScore}<span className="text-lg text-[#9aabaa]">/100</span></p><p className="mt-2 text-sm font-semibold text-[#315fca]">{scores.sleepCategory}</p>
          </article>
          <article className="rounded-[1.5rem] border border-[#dbe4df] bg-[#f8faf7] p-6">
            <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff4d9] text-[#a56e1d]"><ShieldCheck className="h-5 w-5" /></span><span className="rounded-full bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#718589]">Ước tính</span></div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-[#718589]">Khoảng năng lượng duy trì</p><p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#153339]">{scores.energyRange.low.toLocaleString('vi-VN')}–{scores.energyRange.high.toLocaleString('vi-VN')}</p><p className="mt-2 text-sm font-semibold text-[#a56e1d]">kcal/ngày · không phải đơn ăn</p>
          </article>
        </div>

        <section className="mt-8 grid gap-6 rounded-[1.75rem] bg-[#eaf5f0] p-6 sm:p-8 lg:grid-cols-[0.55fr_1fr]">
          <div><p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0b7f72]">Ưu tiên 7 ngày</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold leading-[1.12] tracking-[-0.03em] text-[#153339]">Ít việc hơn, nhưng đúng việc hơn.</h2></div>
          <ul className="space-y-3">{scores.recommendations.map((recommendation) => <li key={recommendation} className="flex gap-3 rounded-xl bg-white/70 p-4 text-sm leading-6 text-[#456066]"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0b8a78]" />{recommendation}</li>)}</ul>
        </section>

        <aside className="mt-8 rounded-[1.5rem] border border-[#dbe4df] p-5 sm:p-6">
          <div className="flex gap-3"><Info className="mt-0.5 h-5 w-5 shrink-0 text-[#315fca]" /><div><h3 className="text-sm font-bold text-[#153339]">Cách đọc kết quả</h3><p className="mt-2 text-sm leading-6 text-[#657a7e]">BMI theo ngưỡng tham chiếu WHO; năng lượng dùng phương trình Mifflin–St Jeor và hệ số vận động; tín hiệu giấc ngủ là thang nội bộ PrymaLab, không phải bảng hỏi lâm sàng đã thẩm định.</p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-[#0b7f72]"><a href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" target="_blank" rel="noreferrer">WHO · BMI</a><a href="https://pubmed.ncbi.nlm.nih.gov/2305711/" target="_blank" rel="noreferrer">Mifflin–St Jeor</a><a href="https://aasm.org/resources/pdf/pressroom/adult-sleep-duration-consensus.pdf" target="_blank" rel="noreferrer">AASM/SRS · giấc ngủ</a></div></div></div>
        </aside>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={onRestart} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#bdd2cc] px-6 text-sm font-bold text-[#0b7f72] transition hover:bg-[#eef8f4]"><RefreshCcw className="h-4 w-4" /> Làm lại đánh giá</button>
          <div className="flex flex-col gap-3 sm:flex-row"><Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#bdd2cc] px-6 text-sm font-bold text-[#0b7f72]">Trao đổi trước</Link><Link href="/services" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#153339] px-6 text-sm font-bold text-white transition hover:bg-[#0b7f72]">Xem lộ trình phù hợp <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </div>
    </div>
  );
}
