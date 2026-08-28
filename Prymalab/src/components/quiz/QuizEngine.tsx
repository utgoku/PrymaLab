'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Clock3, Leaf, LockKeyhole, Moon, Sparkles } from 'lucide-react';
import QuizResult, { type QuizResults } from './QuizResult';
import {
  type ActivityLevel,
  type EnergyEquationSex,
  type SleepQuizAnswers,
  calculateBMI,
  calculateBMR,
  calculateEnergyRange,
  calculateSleepScore,
  calculateTDEE,
  generateHealthRecommendations,
  getBMICategory,
  getSleepScoreCategory,
} from '@/lib/quiz-scoring';
import { getBrowserAnalyticsContext, trackGrowthEvent } from '@/components/analytics/GrowthAnalytics';

type Answers = {
  fullName: string;
  contact: string;
  age: string;
  sex: EnergyEquationSex | '';
  weightKg: string;
  heightCm: string;
  targetGoal: string;
  activityLevel: ActivityLevel | '';
  averageSleepHours: number;
  sleepLatencyMinutes: number | null;
  nightWakeups: number | null;
  feelsRested: boolean | null;
  usesScreensBeforeBed: boolean | null;
  caffeineAfternoon: boolean | null;
  consistentSchedule: boolean | null;
  consent: boolean;
};

const stepNames = ['Hồ sơ', 'Cơ thể', 'Mục tiêu', 'Thời lượng ngủ', 'Chất lượng ngủ', 'Nhịp buổi tối', 'Xác nhận'];
const fieldClass = 'mt-2 min-h-12 w-full rounded-xl border border-[#d4dfda] bg-[#fbfcfa] px-4 text-[#153339] outline-none transition placeholder:text-[#9aabaa] focus:border-[#0b8a78] focus:bg-white focus:ring-4 focus:ring-[#0b8a78]/8';

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm font-bold transition ${active ? 'border-[#0b8a78] bg-[#e8f7f2] text-[#0b7f72] shadow-[inset_0_0_0_1px_#0b8a78]' : 'border-[#dbe4df] bg-white text-[#526a6f] hover:border-[#8fc7bb] hover:bg-[#f7faf8]'}`}
    >
      <span className="flex items-center justify-between gap-3">{children}{active && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}</span>
    </button>
  );
}

function StepTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mb-8">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0b7f72]">{eyebrow}</p>
      <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-medium leading-[1.15] tracking-[-0.025em] text-[#1d4146] sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#657a7e]">{copy}</p>
    </div>
  );
}

export default function QuizEngine() {
  const hasTrackedStart = useRef(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<QuizResults | null>(null);
  const [answers, setAnswers] = useState<Answers>({
    fullName: '',
    contact: '',
    age: '',
    sex: '',
    weightKg: '',
    heightCm: '',
    targetGoal: '',
    activityLevel: '',
    averageSleepHours: 7,
    sleepLatencyMinutes: null,
    nightWakeups: null,
    feelsRested: null,
    usesScreensBeforeBed: null,
    caffeineAfternoon: null,
    consistentSchedule: null,
    consent: false,
  });

  const update = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((previous) => ({ ...previous, [key]: value }));
    setError('');
  };

  const validateStep = () => {
    const age = Number(answers.age);
    const weight = Number(answers.weightKg);
    const height = Number(answers.heightCm);
    if (currentStep === 0 && (answers.fullName.trim().length < 2 || age < 18 || age > 80 || !answers.sex)) return 'Vui lòng nhập họ tên, tuổi từ 18–80 và chọn dữ liệu dùng cho công thức năng lượng.';
    if (currentStep === 1 && (weight < 35 || weight > 250 || height < 130 || height > 220)) return 'Vui lòng kiểm tra cân nặng (35–250 kg) và chiều cao (130–220 cm).';
    if (currentStep === 2 && (!answers.targetGoal || !answers.activityLevel)) return 'Vui lòng chọn mục tiêu chính và mức vận động gần với tuần điển hình của bạn.';
    if (currentStep === 3 && answers.sleepLatencyMinutes === null) return 'Vui lòng chọn thời gian thường cần để vào giấc.';
    if (currentStep === 4 && (answers.nightWakeups === null || answers.feelsRested === null)) return 'Vui lòng cho biết số lần thức giấc và cảm nhận khi thức dậy.';
    if (currentStep === 5 && (answers.usesScreensBeforeBed === null || answers.caffeineAfternoon === null || answers.consistentSchedule === null)) return 'Vui lòng hoàn thành ba tín hiệu về nhịp buổi tối.';
    if (currentStep === 6) {
      const contact = answers.contact.trim();
      const validContact = /^\S+@\S+\.\S+$/.test(contact) || contact.replace(/\D/g, '').length >= 9;
      if (!validContact || !answers.consent) return 'Vui lòng nhập email hoặc số điện thoại hợp lệ và xác nhận chính sách dữ liệu.';
    }
    return '';
  };

  const next = () => {
    const message = validateStep();
    if (message) {
      setError(message);
      return;
    }
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      trackGrowthEvent('quiz_started');
    }
    if (currentStep < stepNames.length - 1) setCurrentStep((step) => step + 1);
    else void submit();
  };

  const submit = async () => {
    setIsSubmitting(true);
    setError('');

    const bmi = calculateBMI(Number(answers.weightKg), Number(answers.heightCm));
    const bmiCategory = getBMICategory(bmi);
    const bmr = calculateBMR(Number(answers.weightKg), Number(answers.heightCm), Number(answers.age), answers.sex as EnergyEquationSex);
    const tdee = calculateTDEE(bmr, answers.activityLevel as ActivityLevel);
    const sleepAnswers: SleepQuizAnswers = {
      durationHours: answers.averageSleepHours,
      latencyMinutes: answers.sleepLatencyMinutes ?? 30,
      wakeupsPerNight: answers.nightWakeups ?? 1,
      feelsRested: answers.feelsRested ?? false,
      usesScreensBeforeBed: answers.usesScreensBeforeBed ?? false,
      caffeineAfternoon: answers.caffeineAfternoon ?? false,
      consistentSchedule: answers.consistentSchedule ?? false,
    };
    const sleepScore = calculateSleepScore(sleepAnswers);
    const sleepCategory = getSleepScoreCategory(sleepScore);
    const baseScores = { bmi, bmiCategory, bmr, tdee, sleepScore, sleepCategory, dailyCalories: tdee };
    const finalResults: QuizResults = {
      ...baseScores,
      energyRange: calculateEnergyRange(tdee),
      recommendations: generateHealthRecommendations(baseScores, sleepAnswers),
      targetGoal: answers.targetGoal,
    };

    try {
      const response = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: answers.fullName.trim(),
          emailOrPhone: answers.contact.trim(),
          bmi,
          bmiCategory,
          tdee,
          sleepScore,
          sleepCategory,
          goals: answers.targetGoal,
          consent: true,
          _analytics: getBrowserAnalyticsContext(),
        }),
      });
      if (!response.ok) console.warn('Lead capture was not accepted.');
    } catch {
      console.warn('Lead capture is temporarily unavailable.');
    }

    setResults(finalResults);
    setIsSubmitting(false);
  };

  if (results) return <QuizResult scores={results} onRestart={() => { setResults(null); setCurrentStep(0); hasTrackedStart.current = false; }} />;

  const progress = ((currentStep + 1) / stepNames.length) * 100;

  return (
    <div className="w-full overflow-hidden rounded-[2rem] border border-[#dbe4df] bg-white shadow-[0_35px_90px_-55px_rgba(17,47,53,0.55)] lg:grid lg:grid-cols-[0.38fr_0.62fr]">
      <aside className="relative overflow-hidden bg-[#112f35] p-6 text-white sm:p-9 lg:p-10">
        <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[#0b8a78]/25 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.08] text-[#d9f46f]"><Sparkles className="h-5 w-5" aria-hidden="true" /></span>
          <p className="mt-7 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#8ed7cb]">Pryma Baseline</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-medium leading-[1.12] tracking-[-0.03em] sm:text-4xl">Hiểu điểm xuất phát trước khi chọn lộ trình.</h1>
          <p className="mt-4 text-sm leading-7 text-white/55">Bài đánh giá người trưởng thành kết nối cơ thể, năng lượng và các tín hiệu giấc ngủ trong khoảng 2 phút.</p>
        </div>

        <div className="relative mt-8 grid grid-cols-3 gap-2 lg:mt-12 lg:grid-cols-1">
          {[
            [Clock3, 'Khoảng 2 phút'],
            [LockKeyhole, 'Dữ liệu tối thiểu'],
            [Leaf, 'Không chẩn đoán'],
          ].map(([Icon, label]) => (
            <div key={String(label)} className="flex flex-col gap-2 rounded-xl border border-white/8 bg-white/[0.045] p-3 text-[10px] font-bold text-white/65 sm:flex-row sm:items-center sm:text-xs">
              <Icon className="h-4 w-4 shrink-0 text-[#8ed7cb]" aria-hidden="true" /> {String(label)}
            </div>
          ))}
        </div>

        <ol className="relative mt-10 hidden space-y-3 lg:block" aria-label="Tiến độ bài đánh giá">
          {stepNames.map((name, index) => (
            <li key={name} className={`flex items-center gap-3 text-xs font-bold ${index === currentStep ? 'text-white' : index < currentStep ? 'text-[#8ed7cb]' : 'text-white/28'}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full border ${index <= currentStep ? 'border-[#8ed7cb]/50 bg-[#0b8a78]/25' : 'border-white/10'}`}>{index < currentStep ? <Check className="h-3.5 w-3.5" /> : index + 1}</span>
              {name}
            </li>
          ))}
        </ol>
      </aside>

      <section className="flex min-h-[42rem] flex-col p-6 sm:p-9 lg:p-12">
        <div className="flex items-center justify-between text-xs font-bold text-[#6a7e82]">
          <span>Bước {currentStep + 1} / {stepNames.length}</span><span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8eeea]" aria-hidden="true"><div className="h-full rounded-full bg-[#0b8a78] transition-[width] duration-500" style={{ width: `${progress}%` }} /></div>

        <div className="flex-1 py-8">
          {currentStep === 0 && <>
            <StepTitle eyebrow="Hồ sơ cơ bản" title="Bắt đầu từ dữ liệu vừa đủ." copy="Các chỉ số năng lượng bên dưới chỉ áp dụng cho người trưởng thành và mang tính ước tính." />
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold text-[#36545a] sm:col-span-2">Họ và tên<input autoComplete="name" value={answers.fullName} onChange={(event) => update('fullName', event.target.value)} className={fieldClass} placeholder="Nguyễn Minh Anh" /></label>
              <label className="text-sm font-bold text-[#36545a]">Tuổi<input inputMode="numeric" type="number" min="18" max="80" value={answers.age} onChange={(event) => update('age', event.target.value)} className={fieldClass} placeholder="Ví dụ: 32" /></label>
              <div><p className="text-sm font-bold text-[#36545a]">Dữ liệu cho công thức năng lượng</p><div className="mt-2 grid grid-cols-2 gap-2"><Choice active={answers.sex === 'MALE'} onClick={() => update('sex', 'MALE')}>Nam</Choice><Choice active={answers.sex === 'FEMALE'} onClick={() => update('sex', 'FEMALE')}>Nữ</Choice></div></div>
            </div>
          </>}

          {currentStep === 1 && <>
            <StepTitle eyebrow="Chỉ số cơ thể" title="Hai con số để tạo khoảng tham chiếu." copy="BMI là công cụ sàng lọc đơn giản, không đo trực tiếp mỡ cơ thể và không thay thế đánh giá lâm sàng." />
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold text-[#36545a]">Cân nặng hiện tại (kg)<input inputMode="decimal" type="number" min="35" max="250" step="0.1" value={answers.weightKg} onChange={(event) => update('weightKg', event.target.value)} className={fieldClass} placeholder="Ví dụ: 65" /></label>
              <label className="text-sm font-bold text-[#36545a]">Chiều cao (cm)<input inputMode="numeric" type="number" min="130" max="220" value={answers.heightCm} onChange={(event) => update('heightCm', event.target.value)} className={fieldClass} placeholder="Ví dụ: 170" /></label>
            </div>
          </>}

          {currentStep === 2 && <>
            <StepTitle eyebrow="Bối cảnh sống" title="Mục tiêu nào quan trọng nhất lúc này?" copy="Chọn một ưu tiên chính và mức vận động gần với tuần điển hình, không phải tuần tốt nhất của bạn." />
            <p className="mb-3 text-sm font-bold text-[#36545a]">Mục tiêu chính</p>
            <div className="grid gap-2 sm:grid-cols-2">{['Giảm mỡ bền vững', 'Tăng sức mạnh', 'Cải thiện giấc ngủ', 'Ổn định năng lượng', 'Duy trì sức khỏe'].map((goal) => <Choice key={goal} active={answers.targetGoal === goal} onClick={() => update('targetGoal', goal)}>{goal}</Choice>)}</div>
            <p className="mb-3 mt-7 text-sm font-bold text-[#36545a]">Mức vận động hàng tuần</p>
            <div className="grid gap-2 sm:grid-cols-2">{[
              ['sedentary', 'Ít vận động'], ['light', 'Nhẹ · 1–3 buổi'], ['moderate', 'Vừa · 3–5 buổi'], ['active', 'Nhiều · 6–7 buổi'], ['very_active', 'Rất nhiều · lao động/tập nặng'],
            ].map(([value, label]) => <Choice key={value} active={answers.activityLevel === value} onClick={() => update('activityLevel', value as ActivityLevel)}>{label}</Choice>)}</div>
          </>}

          {currentStep === 3 && <>
            <StepTitle eyebrow="Thời lượng & vào giấc" title="Một đêm điển hình của bạn." copy="Người trưởng thành thường được khuyến nghị ngủ ít nhất 7 giờ; nhu cầu cá nhân vẫn có thể khác nhau." />
            <label className="block rounded-2xl border border-[#dbe4df] bg-[#f8faf7] p-5">
              <span className="flex items-center justify-between gap-4 text-sm font-bold text-[#36545a]"><span className="flex items-center gap-2"><Moon className="h-4 w-4 text-[#315fca]" />Thời lượng ngủ trung bình</span><strong className="rounded-full bg-[#edf2ff] px-3 py-1 text-[#315fca]">{answers.averageSleepHours.toFixed(1)} giờ</strong></span>
              <input aria-label="Thời lượng ngủ trung bình" className="rhythm-range mt-6 w-full" type="range" min="4" max="11" step="0.5" value={answers.averageSleepHours} onChange={(event) => update('averageSleepHours', Number(event.target.value))} />
              <span className="mt-2 flex justify-between text-xs text-[#829397]"><span>4 giờ</span><span>11 giờ</span></span>
            </label>
            <p className="mb-3 mt-7 text-sm font-bold text-[#36545a]">Bạn thường cần bao lâu để vào giấc?</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{[[10, 'Dưới 15 phút'], [22, '15–30 phút'], [45, '30–60 phút'], [75, 'Trên 60 phút']].map(([value, label]) => <Choice key={String(value)} active={answers.sleepLatencyMinutes === value} onClick={() => update('sleepLatencyMinutes', Number(value))}>{String(label)}</Choice>)}</div>
          </>}

          {currentStep === 4 && <>
            <StepTitle eyebrow="Tính liên tục" title="Bạn thức dậy như thế nào?" copy="Số lần thức giấc chỉ là một phần; cảm giác được phục hồi vào buổi sáng cũng rất quan trọng." />
            <p className="mb-3 text-sm font-bold text-[#36545a]">Số lần thường thức giấc giữa đêm</p>
            <div className="grid grid-cols-4 gap-2">{[[0, '0'], [1, '1'], [2, '2'], [3, '3+']].map(([value, label]) => <Choice key={String(value)} active={answers.nightWakeups === value} onClick={() => update('nightWakeups', Number(value))}>{String(label)}</Choice>)}</div>
            <p className="mb-3 mt-7 text-sm font-bold text-[#36545a]">Bạn thường cảm thấy tỉnh táo sau khi thức dậy?</p>
            <div className="grid grid-cols-2 gap-2"><Choice active={answers.feelsRested === true} onClick={() => update('feelsRested', true)}>Phần lớn là có</Choice><Choice active={answers.feelsRested === false} onClick={() => update('feelsRested', false)}>Phần lớn là không</Choice></div>
          </>}

          {currentStep === 5 && <>
            <StepTitle eyebrow="Nhịp buổi tối" title="Ba tín hiệu có thể thay đổi được." copy="Các câu hỏi này giúp chọn ưu tiên thực hành, không dùng để chẩn đoán rối loạn giấc ngủ." />
            <div className="space-y-6">
              {[
                ['Bạn thường dùng màn hình trong 30 phút trước khi ngủ?', 'usesScreensBeforeBed'],
                ['Bạn thường dùng caffeine sau 14:00?', 'caffeineAfternoon'],
                ['Giờ ngủ và giờ dậy thường lệch dưới 60 phút giữa các ngày?', 'consistentSchedule'],
              ].map(([question, key]) => (
                <div key={key}><p className="mb-3 text-sm font-bold text-[#36545a]">{question}</p><div className="grid grid-cols-2 gap-2"><Choice active={answers[key as keyof Answers] === true} onClick={() => update(key as keyof Answers, true as never)}>Có</Choice><Choice active={answers[key as keyof Answers] === false} onClick={() => update(key as keyof Answers, false as never)}>Không</Choice></div></div>
              ))}
            </div>
          </>}

          {currentStep === 6 && <>
            <StepTitle eyebrow="Nhận kết quả" title="Một bản đọc rõ ràng, không phóng đại." copy="Kết quả gồm BMI tham chiếu, khoảng năng lượng ước tính và các tín hiệu giấc ngủ để chọn một việc nên ưu tiên." />
            <div className="grid gap-3 rounded-2xl bg-[#f4f7f3] p-5 text-sm text-[#526a6f] sm:grid-cols-2">
              <p><strong className="text-[#153339]">Mục tiêu:</strong> {answers.targetGoal}</p><p><strong className="text-[#153339]">Vận động:</strong> {answers.activityLevel}</p><p><strong className="text-[#153339]">Cơ thể:</strong> {answers.weightKg} kg · {answers.heightCm} cm</p><p><strong className="text-[#153339]">Giấc ngủ:</strong> {answers.averageSleepHours.toFixed(1)} giờ</p>
            </div>
            <label className="mt-6 block text-sm font-bold text-[#36545a]">Email hoặc số điện thoại<input autoComplete="email" value={answers.contact} onChange={(event) => update('contact', event.target.value)} className={fieldClass} placeholder="Để lưu kết quả và PrymaLab hỗ trợ khi bạn yêu cầu" /></label>
            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#dbe4df] p-4 text-sm leading-6 text-[#61777b]"><input type="checkbox" checked={answers.consent} onChange={(event) => update('consent', event.target.checked)} className="mt-1 h-4 w-4 accent-[#0b8a78]" /><span>Tôi đồng ý để PrymaLab xử lý thông tin này nhằm trả kết quả và liên hệ hỗ trợ theo <a href="/privacy" className="font-bold text-[#0b7f72] underline underline-offset-2">chính sách bảo mật</a>. Tôi hiểu đây không phải chẩn đoán y khoa.</span></label>
          </>}
        </div>

        {error && <p className="mb-4 rounded-xl border border-[#f0c9ba] bg-[#fff7f3] px-4 py-3 text-sm font-semibold leading-6 text-[#a14d2e]" role="alert">{error}</p>}

        <div className="flex items-center justify-between gap-4 border-t border-[#e2e9e5] pt-6">
          <button type="button" onClick={() => { setCurrentStep((step) => Math.max(0, step - 1)); setError(''); }} disabled={currentStep === 0} className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-sm font-bold text-[#61777b] transition hover:bg-[#f1f5f2] disabled:invisible"><ArrowLeft className="h-4 w-4" /> Quay lại</button>
          <button type="button" onClick={next} disabled={isSubmitting} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#153339] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0b7f72] disabled:opacity-60">{currentStep === stepNames.length - 1 ? (isSubmitting ? 'Đang tạo bản đọc…' : 'Xem bản đọc của tôi') : 'Tiếp tục'}<ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>
    </div>
  );
}
