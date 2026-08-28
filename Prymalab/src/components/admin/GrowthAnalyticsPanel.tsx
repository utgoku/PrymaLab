'use client';

import { useEffect, useState } from 'react';
import { Activity, BarChart3, Eye, MousePointerClick, RefreshCw, ShoppingBag, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type Summary = {
  days: number;
  totals: {
    pageViews: number;
    uniqueSessions: number;
    quizStarts: number;
    leads: number;
    contacts: number;
    orders: number;
    payments: number;
    leadConversionRate: number;
    orderConversionRate: number;
  };
  topPages: { path: string; views: number }[];
  topSources: { source: string; views: number }[];
  webVitals: { name: string; p75: number | null; samples: number }[];
};

function vitalLabel(name: string, value: number | null) {
  if (value === null) return 'Chưa đủ mẫu';
  if (name === 'CLS') return value.toFixed(3);
  return `${Math.round(value)} ms`;
}

export default function GrowthAnalyticsPanel() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (windowDays = days) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/analytics?days=${windowDays}`, { cache: 'no-store' });
      if (!response.ok) throw new Error();
      setSummary(await response.json());
    } catch {
      setError('Chưa tải được analytics. Hãy chắc chắn migration mới đã được áp dụng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch(`/api/admin/analytics?days=${days}`, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data) => { if (active) setSummary(data); })
      .catch(() => { if (active) setError('Chưa tải được analytics. Hãy chắc chắn migration mới đã được áp dụng.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [days]);

  if (loading && !summary) return <div className="py-24 text-center text-sm text-[#718589]">Đang tổng hợp dữ liệu tăng trưởng...</div>;

  const metricCards = summary ? [
    { label: 'Lượt xem', value: summary.totals.pageViews, Icon: Eye, color: 'bg-blue-50 text-blue-700' },
    { label: 'Phiên truy cập', value: summary.totals.uniqueSessions, Icon: Users, color: 'bg-violet-50 text-violet-700' },
    { label: 'Lead từ quiz', value: summary.totals.leads, Icon: MousePointerClick, color: 'bg-[#e4f5ef] text-[#0b7f72]' },
    { label: 'Đơn được tạo', value: summary.totals.orders, Icon: ShoppingBag, color: 'bg-amber-50 text-amber-700' },
  ] : [];

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-sm font-bold">Đo lường first-party, không lưu email, điện thoại hoặc IP.</p><p className="mt-1 text-xs text-[#74878a]">Dữ liệu bắt đầu được ghi từ bản phát hành này.</p></div>
        <div className="flex gap-2"><select value={days} onChange={(event) => setDays(Number(event.target.value))} className="min-h-10 rounded-xl border border-[#d8e2dd] bg-white px-3 text-xs font-bold"><option value={7}>7 ngày</option><option value={30}>30 ngày</option><option value={90}>90 ngày</option></select><Button variant="outline" size="sm" className="bg-white" onClick={() => load()}><RefreshCw className="mr-2 h-3.5 w-3.5" /> Làm mới</Button></div>
      </div>
      {error && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">{error}</div>}
      {summary && <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map(({ label, value, Icon, color }) => <Card key={label} className="rounded-[1.5rem] border border-[#dfe6e2] bg-white p-5 shadow-sm"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></span><p className="mt-5 text-2xl font-extrabold">{value}</p><p className="mt-1 text-xs font-semibold text-[#718589]">{label}</p></Card>)}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="rounded-[1.75rem] border border-[#dfe6e2] bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><BarChart3 className="h-5 w-5 text-[#0b7f72]" /><h2 className="text-lg font-semibold">Phễu chuyển đổi</h2></div><div className="mt-6 space-y-4">{[
            ['Phiên truy cập', summary.totals.uniqueSessions],
            ['Bắt đầu quiz', summary.totals.quizStarts],
            ['Gửi lead', summary.totals.leads],
            ['Tạo đơn', summary.totals.orders],
            ['Báo đã chuyển khoản', summary.totals.payments],
          ].map(([label, value]) => <div key={String(label)} className="flex items-center justify-between border-b border-[#edf0ee] pb-3 text-sm"><span className="text-[#65797d]">{String(label)}</span><strong>{String(value)}</strong></div>)}</div><p className="mt-5 text-xs text-[#718589]">Tỷ lệ lead/phiên: <strong>{summary.totals.leadConversionRate}%</strong> · Đơn/phiên: <strong>{summary.totals.orderConversionRate}%</strong></p></Card>
          <Card className="rounded-[1.75rem] border border-[#dfe6e2] bg-[#153339] p-6 text-white shadow-sm"><div className="flex items-center gap-3"><Activity className="h-5 w-5 text-[#d9f46f]" /><h2 className="text-lg font-semibold">Core Web Vitals p75</h2></div><div className="mt-6 grid gap-3 sm:grid-cols-3">{summary.webVitals.map((vital) => <div key={vital.name} className="rounded-xl bg-white/[0.07] p-4"><p className="text-xs font-bold text-white/55">{vital.name}</p><p className="mt-2 text-lg font-extrabold">{vitalLabel(vital.name, vital.p75)}</p><p className="mt-1 text-[10px] text-white/35">{vital.samples} mẫu</p></div>)}</div><p className="mt-5 text-xs leading-5 text-white/45">Đánh giá khi có đủ dữ liệu người dùng thật; lab test chỉ dùng để chẩn đoán.</p></Card>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="rounded-[1.75rem] border border-[#dfe6e2] bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold">Trang được xem nhiều</h2><div className="mt-5 divide-y divide-[#edf0ee]">{summary.topPages.map((item) => <div key={item.path} className="flex items-center justify-between gap-4 py-3 text-sm"><span className="truncate font-semibold text-[#36545a]">{item.path}</span><strong>{item.views}</strong></div>)}{!summary.topPages.length && <p className="py-8 text-center text-sm text-[#819194]">Chưa có dữ liệu.</p>}</div></Card>
          <Card className="rounded-[1.75rem] border border-[#dfe6e2] bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold">Nguồn truy cập</h2><div className="mt-5 divide-y divide-[#edf0ee]">{summary.topSources.map((item) => <div key={item.source} className="flex items-center justify-between gap-4 py-3 text-sm"><span className="truncate font-semibold text-[#36545a]">{item.source}</span><strong>{item.views}</strong></div>)}{!summary.topSources.length && <p className="py-8 text-center text-sm text-[#819194]">Chưa có dữ liệu.</p>}</div></Card>
        </div>
      </>}
    </div>
  );
}
