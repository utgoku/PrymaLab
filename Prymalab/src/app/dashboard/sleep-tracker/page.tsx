'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { 
  Moon, 
  Sun, 
  Star, 
  Clock, 
  Flame, 
  Thermometer, 
  Wind, 
  Smartphone, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useHydrated } from '@/lib/use-hydrated';
import type { TooltipContentProps } from 'recharts';

// Since Recharts uses browser APIs, we import it dynamically
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const ReferenceLine = dynamic(() => import('recharts').then(mod => mod.ReferenceLine), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

// Using inline types to ensure it works strictly as requested for demo
export interface SleepLog {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  notes: string;
}

// Generate realistic mock data for 30 days
const generateMockData = (): SleepLog[] => {
  const data: SleepLog[] = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Randomize duration between 6 and 9 hours
    const duration = 6 + Math.random() * 3;
    
    // Base quality on duration loosely
    let quality = 3;
    if (duration > 7.5) quality = 5;
    else if (duration > 6.8) quality = 4;
    else if (duration < 6.5) quality = Math.floor(Math.random() * 2) + 1;
    else quality = 3;
    
    // Calculate bed time and wake time based on duration
    // Target wake time around 6:30 AM (6.5 in decimal)
    const wakeTimeDec = 6 + Math.random() * 1.5; 
    const wakeHours = Math.floor(wakeTimeDec);
    const wakeMins = Math.floor((wakeTimeDec - wakeHours) * 60);
    
    // Bed time = wake time - duration
    let bedTimeDec = wakeTimeDec - duration;
    if (bedTimeDec < 0) bedTimeDec += 24;
    
    const bedHours = Math.floor(bedTimeDec);
    const bedMins = Math.floor((bedTimeDec - bedHours) * 60);
    
    data.push({
      id: `sleep-${i}`,
      date: date.toISOString().split('T')[0],
      bedTime: `${bedHours.toString().padStart(2, '0')}:${bedMins.toString().padStart(2, '0')}`,
      wakeTime: `${wakeHours.toString().padStart(2, '0')}:${wakeMins.toString().padStart(2, '0')}`,
      duration: Number(duration.toFixed(1)),
      quality,
      notes: i === 0 ? 'Hơi khó ngủ lúc đầu' : ''
    });
  }
  
  return data.reverse(); // Newest first
};

function CustomTooltip({ active, payload, label }: Partial<TooltipContentProps<number, string>>) {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-sm">
          <p className="font-semibold text-gray-800 mb-1">{`Ngày ${label}`}</p>
          {payload.map((entry, index) => {
            const value = Number(entry.value ?? 0);
            let valStr: string | number = value;
            if (entry.dataKey === 'duration') {
              const hours = Math.floor(value);
              const mins = Math.round((value - hours) * 60);
              valStr = `${hours} giờ ${mins} phút`;
            } else if (entry.dataKey === 'quality') {
              valStr = `${entry.value}/5 sao`;
            } else if (entry.dataKey === 'bedTimeNum' || entry.dataKey === 'wakeTimeNum') {
              let val = value;
              if (val < 0) val += 24;
              const h = Math.floor(val);
              const m = Math.round((val - h) * 60);
              valStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            }
            return (
              <p key={index} style={{ color: entry.color || entry.fill }}>
                {entry.name === 'duration' ? 'Thời lượng' :
                 entry.name === 'quality' ? 'Chất lượng' :
                 entry.name === 'bedTimeNum' ? 'Giờ ngủ' : 'Giờ dậy'}: {valStr}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  }

export default function SleepTrackerPage() {
  const isClient = useHydrated();
  const [activeTab, setActiveTab] = useState<'7' | '30'>('7');
  const [logs, setLogs] = useState<SleepLog[]>(generateMockData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form state
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formBedTime, setFormBedTime] = useState('22:30');
  const [formWakeTime, setFormWakeTime] = useState('06:30');
  const [formQuality, setFormQuality] = useState(4);
  const [formNotes, setFormNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate duration string for form
  const formDuration = useMemo(() => {
    const [bedH, bedM] = formBedTime.split(':').map(Number);
    const [wakeH, wakeM] = formWakeTime.split(':').map(Number);
    
    const bedTimeMins = bedH * 60 + bedM;
    let wakeTimeMins = wakeH * 60 + wakeM;
    
    if (wakeTimeMins < bedTimeMins) {
      wakeTimeMins += 24 * 60;
    }
    
    const totalMins = wakeTimeMins - bedTimeMins;
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    
    return { hours, mins, decimal: totalMins / 60 };
  }, [formBedTime, formWakeTime]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLog: SleepLog = {
      id: `sleep-new-${Date.now()}`,
      date: formDate,
      bedTime: formBedTime,
      wakeTime: formWakeTime,
      duration: Number(formDuration.decimal.toFixed(1)),
      quality: formQuality,
      notes: formNotes
    };
    
    setLogs(prev => [newLog, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setIsFormOpen(false);
      // Reset form
      setFormDate(new Date().toISOString().split('T')[0]);
      setFormBedTime('22:30');
      setFormWakeTime('06:30');
      setFormQuality(4);
      setFormNotes('');
    }, 2000);
  };

  // Data for charts based on active tab
  const chartData = useMemo(() => {
    const daysCount = activeTab === '7' ? 7 : 30;
    const data = logs.slice(0, daysCount).reverse(); // Oldest first for charts
    
    return data.map(log => {
      const [bedH, bedM] = log.bedTime.split(':').map(Number);
      const [wakeH, wakeM] = log.wakeTime.split(':').map(Number);
      
      return {
        ...log,
        displayDate: new Date(log.date).toLocaleDateString('vi-VN', { month: '2-digit', day: '2-digit' }),
        bedTimeNum: bedH >= 12 ? bedH + bedM / 60 - 24 : bedH + bedM / 60, // Normalize to help charting (negative for before midnight)
        wakeTimeNum: wakeH + wakeM / 60
      };
    });
  }, [logs, activeTab]);



  if (!isClient) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">Theo Dõi Giấc Ngủ</h1>
          <p className="text-gray-500 mt-1">Phân tích và cải thiện chất lượng giấc ngủ của bạn</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Moon className="w-6 h-6 text-[#2563EB]" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Điểm Giấc Ngủ</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#2563EB]">78</span>
              <span className="text-sm text-gray-400">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sleep Log Form */}
      <Card className="overflow-hidden border border-gray-100 shadow-sm rounded-2xl bg-white">
        <div 
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-[#2563EB]">
              <Plus className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Ghi nhận giấc ngủ hôm nay</h2>
          </div>
          {isFormOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
        </div>
        
        {isFormOpen && (
          <div className="p-5 border-t border-gray-100 bg-gray-50/50">
            {showSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center text-teal-600 animate-in zoom-in duration-300">
                <CheckCircle2 className="w-12 h-12 mb-3" />
                <p className="font-medium text-lg">Đã lưu nhật ký thành công!</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Ngày</label>
                    <Input 
                      type="date" 
                      value={formDate} 
                      onChange={(e) => setFormDate(e.target.value)} 
                      required 
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Giờ đi ngủ</label>
                    <Input 
                      type="time" 
                      value={formBedTime} 
                      onChange={(e) => setFormBedTime(e.target.value)} 
                      required 
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Giờ thức dậy</label>
                    <Input 
                      type="time" 
                      value={formWakeTime} 
                      onChange={(e) => setFormWakeTime(e.target.value)} 
                      required 
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-white p-4 rounded-xl border border-gray-100">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">Thời gian ngủ tính toán:</p>
                    <p className="text-xl font-bold text-[#2563EB]">
                      {formDuration.hours} giờ {formDuration.mins} phút
                    </p>
                  </div>
                  
                  <div className="space-y-2 w-full sm:w-auto">
                    <label className="text-sm font-medium text-gray-700 block">Đánh giá chất lượng</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormQuality(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            className={`w-8 h-8 ${star <= formQuality ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Ghi chú (Tùy chọn)</label>
                  <textarea 
                    className="w-full min-h-[80px] p-3 rounded-lg border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none text-sm transition-all"
                    placeholder="Bạn cảm thấy thế nào khi thức dậy? Có hay thức giấc giữa đêm không?"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="bg-[#2563EB] hover:bg-blue-700 text-white px-8">
                    Lưu nhật ký
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </Card>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Trung bình ngủ', value: '7.3 giờ', icon: Clock, color: 'text-[#2563EB]', bg: 'bg-blue-50' },
          { title: 'Chất lượng TB', value: '3.8/5', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
          { title: 'Giờ ngủ tốt nhất', value: '22:00', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { title: 'Chuỗi ngày tốt', value: '5 ngày', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' }
        ].map((stat, i) => (
          <Card key={i} className="p-5 border-none shadow-sm bg-white rounded-2xl flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics Dashboard */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 font-serif">Phân tích chi tiết</h2>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('7')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === '7' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              7 Ngày
            </button>
            <button
              onClick={() => setActiveTab('30')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === '30' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              30 Ngày
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Duration Area Chart */}
          <Card className="p-6 border-none shadow-sm bg-white rounded-2xl col-span-1 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Thời gian ngủ</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis domain={[4, 12]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dx={-10} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={8} stroke="#10B981" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: '8h Tối ưu', fill: '#10B981', fontSize: 12 }} />
                  <Area type="monotone" dataKey="duration" name="duration" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorDuration)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 2: Quality Bar Chart */}
          <Card className="p-6 border-none shadow-sm bg-white rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Chất lượng giấc ngủ</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dx={-10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="quality" name="quality" radius={[4, 4, 0, 0]} barSize={activeTab === '7' ? 40 : 12}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        entry.quality <= 2 ? '#EF4444' : 
                        entry.quality === 3 ? '#F59E0B' : 
                        '#2563EB'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 3: Schedule Line Chart */}
          <Card className="p-6 border-none shadow-sm bg-white rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Giờ đi ngủ & thức dậy</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis 
                    domain={[-4, 12]} 
                    ticks={[-2, 0, 2, 4, 6, 8, 10]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#6B7280' }} 
                    dx={-10}
                    tickFormatter={(val) => {
                      let h = val;
                      if (h < 0) h += 24;
                      return `${h}:00`;
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="bedTimeNum" name="bedTimeNum" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="wakeTimeNum" name="wakeTimeNum" stroke="#0D9488" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Sleep Tips */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-serif mb-6">Gợi ý cải thiện giấc ngủ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Moon, text: 'Hãy cố gắng đi ngủ trước 23:00 để tối ưu chu kỳ giấc ngủ', bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
            { icon: Smartphone, text: 'Hạn chế sử dụng điện thoại 30 phút trước giờ ngủ', bg: 'bg-rose-50', iconColor: 'text-rose-600' },
            { icon: Thermometer, text: 'Giữ phòng ngủ mát mẻ, nhiệt độ lý tưởng 18-22°C', bg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
            { icon: Wind, text: 'Thực hành hít thở 4-7-8 giúp thư giãn trước khi ngủ', bg: 'bg-teal-50', iconColor: 'text-teal-600' }
          ].map((tip, i) => (
            <Card key={i} className="p-4 border border-gray-100 shadow-sm bg-white rounded-xl flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-xl ${tip.bg}`}>
                <tip.icon className={`w-6 h-6 ${tip.iconColor}`} />
              </div>
              <p className="text-gray-700 font-medium mt-1 leading-relaxed">{tip.text}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* History Table */}
      <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 font-serif">Lịch sử giấc ngủ</h2>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm font-medium">
                <th className="p-4 border-b border-gray-100">Ngày</th>
                <th className="p-4 border-b border-gray-100">Giờ ngủ</th>
                <th className="p-4 border-b border-gray-100">Giờ dậy</th>
                <th className="p-4 border-b border-gray-100">Thời lượng</th>
                <th className="p-4 border-b border-gray-100">Chất lượng</th>
                <th className="p-4 border-b border-gray-100">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.slice(0, 7).map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">
                    {new Date(log.date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-4 text-gray-600">{log.bedTime}</td>
                  <td className="p-4 text-gray-600">{log.wakeTime}</td>
                  <td className="p-4">
                    <Badge variant="secondary" className="bg-blue-50 text-[#2563EB] hover:bg-blue-100">
                      {log.duration}h
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < log.quality ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500 truncate max-w-[200px]">
                    {log.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {logs.slice(0, 7).map((log) => (
            <div key={log.id} className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{new Date(log.date).toLocaleDateString('vi-VN')}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < log.quality ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Moon className="w-4 h-4" /> {log.bedTime}
                </div>
                <div className="w-8 h-px bg-gray-300"></div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Sun className="w-4 h-4" /> {log.wakeTime}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-gray-500">Thời lượng:</span>
                <span className="font-medium text-[#2563EB]">{log.duration} giờ</span>
              </div>
              
              {log.notes && (
                <div className="bg-gray-50 p-2.5 rounded-lg text-sm text-gray-600 italic mt-2">
                  &ldquo;{log.notes}&rdquo;
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
