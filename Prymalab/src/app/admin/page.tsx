/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Download,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Package,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
} from 'lucide-react';
import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import GrowthAnalyticsPanel from '@/components/admin/GrowthAnalyticsPanel';

type Tab = 'overview' | 'analytics' | 'orders' | 'leads' | 'contacts' | 'settings' | 'packages';

const ORDER_LABELS: Record<string, string> = {
  awaiting_payment: 'Chờ thanh toán',
  payment_review: 'Cần đối soát',
  paid: 'Đã thanh toán',
  onboarding: 'Đang onboarding',
  active: 'Đang phục vụ',
  completed: 'Hoàn tất',
  cancelled: 'Đã hủy',
};
const LEAD_LABELS: Record<string, string> = { new: 'Mới', contacted: 'Đã liên hệ', qualified: 'Tiềm năng', converted: 'Đã chuyển đổi', archived: 'Lưu trữ' };
const CONTACT_LABELS: Record<string, string> = { new: 'Mới', contacted: 'Đã phản hồi', resolved: 'Đã xử lý', archived: 'Lưu trữ' };

const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value || 0);
const when = (value: string) => new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAdminConfigured, setIsAdminConfigured] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [db, setDb] = useState<any>(null);
  const [settingsForm, setSettingsForm] = useState<any>(null);
  const [packagesForm, setPackagesForm] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const fetchData = async (resetForms = false) => {
    const response = await fetch('/api/admin/db', { cache: 'no-store' });
    if (response.status === 401) {
      setIsAuthenticated(false);
      return;
    }
    if (!response.ok) throw new Error('Không thể tải dữ liệu CRM.');
    const data = await response.json();
    setDb(data);
    if (resetForms || !settingsForm) setSettingsForm(data.settings);
    if (resetForms || !packagesForm.length) setPackagesForm(data.packages);
  };

  useEffect(() => {
    fetch('/api/admin/session', { cache: 'no-store' })
      .then((response) => response.json())
      .then(async (session) => {
        setIsAdminConfigured(Boolean(session.configured));
        setIsAuthenticated(Boolean(session.authenticated));
        if (session.authenticated) await fetchData(true);
      })
      .catch(() => setLoginError('Không thể kiểm tra phiên quản trị.'))
      .finally(() => setIsCheckingSession(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const metrics = useMemo(() => {
    const orders = db?.orders || [];
    return {
      paidRevenue: orders.filter((order: any) => ['paid', 'onboarding', 'active', 'completed'].includes(order.status)).reduce((total: number, order: any) => total + Number(order.amount || 0), 0),
      review: orders.filter((order: any) => order.status === 'payment_review').length,
      active: orders.filter((order: any) => ['onboarding', 'active'].includes(order.status)).length,
      newLeads: (db?.leads || []).filter((lead: any) => lead.status === 'new').length,
    };
  }, [db]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoginError('');
    const response = await fetch('/api/admin/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return setLoginError(data.error || 'Không thể đăng nhập.');
    setPassword('');
    setIsAuthenticated(true);
    await fetchData(true);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/session', { method: 'DELETE' });
    setIsAuthenticated(false);
    setDb(null);
  };

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settingsForm) });
      if (!response.ok) throw new Error();
      await fetchData(true);
      flash('Đã lưu cấu hình website và thanh toán.');
    } catch { flash('Lưu cấu hình thất bại.'); }
    finally { setIsSaving(false); }
  };

  const savePackages = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/packages', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(packagesForm) });
      if (!response.ok) throw new Error();
      await fetchData(true);
      flash('Đã cập nhật chương trình.');
    } catch { flash('Cập nhật chương trình thất bại.'); }
    finally { setIsSaving(false); }
  };

  const updateLocalRow = (collection: 'orders' | 'leads' | 'contacts', id: string, changes: Record<string, string>) => {
    setDb((current: any) => ({ ...current, [collection]: current[collection].map((row: any) => row.id === id ? { ...row, ...changes } : row) }));
  };

  const saveRow = async (collection: 'orders' | 'leads' | 'contacts', row: any) => {
    const response = await fetch(`/api/admin/${collection}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: row.id, status: row.status, adminNote: row.adminNote || '' }) });
    if (!response.ok) return flash('Không thể cập nhật. Vui lòng thử lại.');
    flash('Đã cập nhật CRM.');
    await fetchData();
  };

  const exportCsv = (collection: 'orders' | 'leads' | 'contacts') => {
    const rows = db?.[collection] || [];
    if (!rows.length) return;
    const keys = Object.keys(rows[0]);
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = `\uFEFF${keys.join(',')}\n${rows.map((row: any) => keys.map((key) => escape(row[key])).join(',')).join('\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `prymalab-${collection}-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const filtered = (collection: 'orders' | 'leads' | 'contacts') => {
    const query = search.toLowerCase().trim();
    return (db?.[collection] || []).filter((row: any) => !query || JSON.stringify(row).toLowerCase().includes(query));
  };

  if (isCheckingSession) return <div className="flex min-h-screen items-center justify-center bg-[#f4f7f2] text-sm font-semibold text-[#5f7478]">Đang kiểm tra phiên quản trị...</div>;

  if (!isAuthenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#edf3ee] p-5">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#cfeae2] blur-[110px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#dce4ff] blur-[110px]" />
        <Card className="relative w-full max-w-md rounded-[2rem] border border-white bg-white/90 p-8 shadow-[0_40px_100px_-55px_rgba(18,56,62,0.65)] backdrop-blur sm:p-10">
          <BrandMark className="mb-10" />
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0b7f72]">PrymaLab Command Center</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[#153339]">Quản trị tăng trưởng</h1>
          <p className="mt-3 text-sm leading-6 text-[#718589]">Đơn hàng, đối soát, khách hàng tiềm năng và cấu hình website trong một nơi.</p>
          {!isAdminConfigured && <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs leading-5 text-amber-800">CRM đang khóa vì máy chủ chưa có biến môi trường quản trị.</div>}
          {loginError && <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-xs leading-5 text-red-700">{loginError}</div>}
          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <Input type="password" autoComplete="current-password" placeholder="Mật khẩu quản trị" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <Button type="submit" disabled={!isAdminConfigured} className="w-full bg-[#153339] text-white hover:bg-[#0b7f72]"><ShieldCheck className="mr-2 h-4 w-4" /> Đăng nhập an toàn</Button>
          </form>
        </Card>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'analytics', label: 'Tăng trưởng', icon: BarChart3 },
    { id: 'orders', label: 'Đơn & thanh toán', icon: ClipboardList, count: db?.orders?.length },
    { id: 'leads', label: 'Leads từ Quiz', icon: Users, count: db?.leads?.length },
    { id: 'contacts', label: 'Hộp thư', icon: Inbox, count: db?.contacts?.length },
    { id: 'settings', label: 'Cấu hình', icon: Settings },
    { id: 'packages', label: 'Chương trình', icon: Package },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f3f6f2] text-[#18373d] lg:flex">
      <aside className="border-b border-[#dbe4df] bg-[#102f35] p-5 text-white lg:fixed lg:inset-y-0 lg:w-72 lg:border-b-0 lg:p-6">
        <BrandMark inverse />
        <p className="mt-3 pl-[3.8rem] text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">Command Center</p>
        <nav className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {navItems.map((item) => (
            <button key={item.id} type="button" onClick={() => { setActiveTab(item.id); setSearch(''); }} className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-left text-xs font-bold transition ${activeTab === item.id ? 'bg-[#d9f46f] text-[#153339]' : 'text-white/60 hover:bg-white/[0.07] hover:text-white'}`}>
              <item.icon className="h-4 w-4" /><span>{item.label}</span>{'count' in item && <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px]">{item.count || 0}</span>}
            </button>
          ))}
        </nav>
        <button type="button" onClick={handleLogout} className="mt-5 flex w-full items-center gap-3 rounded-xl border border-white/10 px-3.5 py-3 text-xs font-bold text-white/50 transition hover:border-red-300/30 hover:bg-red-300/10 hover:text-red-100 lg:absolute lg:bottom-6 lg:left-6 lg:w-[calc(100%-3rem)]"><LogOut className="h-4 w-4" /> Đăng xuất</button>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:ml-72 lg:p-10 xl:p-12">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#0b7f72]">PrymaLab CRM</p><h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.025em]">{navItems.find((item) => item.id === activeTab)?.label}</h1></div>
          <div className="flex gap-2"><Button onClick={() => fetchData(true).then(() => flash('Dữ liệu đã được làm mới.'))} variant="outline" size="sm" className="bg-white"><RefreshCw className="mr-2 h-3.5 w-3.5" /> Làm mới</Button></div>
        </header>

        {notice && <div className="fixed right-5 top-5 z-50 rounded-2xl bg-[#153339] px-5 py-3 text-xs font-bold text-white shadow-2xl">{notice}</div>}
        {!db ? <div className="py-24 text-center text-sm text-[#718589]">Đang tải dữ liệu...</div> : null}

        {db && activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Doanh thu đã ghi nhận', value: money(metrics.paidRevenue), icon: CircleDollarSign, color: 'bg-[#e4f5ef] text-[#0b7f72]' },
                { label: 'Cần đối soát', value: metrics.review, icon: WalletCards, color: 'bg-amber-50 text-amber-700' },
                { label: 'Khách đang phục vụ', value: metrics.active, icon: BarChart3, color: 'bg-blue-50 text-blue-700' },
                { label: 'Lead mới', value: metrics.newLeads, icon: Users, color: 'bg-violet-50 text-violet-700' },
              ].map((metric) => <Card key={metric.label} className="rounded-[1.5rem] border border-[#dfe6e2] bg-white p-5 shadow-sm"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.color}`}><metric.icon className="h-5 w-5" /></span><p className="mt-5 text-2xl font-extrabold text-[#18373d]">{metric.value}</p><p className="mt-1 text-xs font-semibold text-[#718589]">{metric.label}</p></Card>)}
            </div>
            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <Card className="rounded-[1.75rem] border border-[#dfe6e2] bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#0b7f72]">Dòng tiền</p><h2 className="mt-2 text-xl font-semibold">Đơn gần nhất</h2></div><button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-[#0b7f72]">Xem tất cả</button></div><div className="mt-5 divide-y divide-[#e6ebe8]">{db.orders.slice(0, 5).map((order: any) => <div key={order.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold">{order.customerName} · {order.orderCode}</p><p className="mt-1 text-xs text-[#7a8d90]">{order.packageName} · {when(order.createdAt)}</p></div><div className="text-left sm:text-right"><p className="text-sm font-extrabold text-[#0b7f72]">{money(order.amount)}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#7a8d90]">{ORDER_LABELS[order.status] || order.status}</p></div></div>)}{!db.orders.length && <p className="py-10 text-center text-sm text-[#829397]">Chưa có đơn hàng.</p>}</div></Card>
              <Card className="rounded-[1.75rem] border border-[#dfe6e2] bg-[#153339] p-6 text-white shadow-sm"><CheckCircle2 className="h-7 w-7 text-[#d9f46f]" /><h2 className="mt-5 text-xl font-semibold">Việc cần làm mỗi ngày</h2><ol className="mt-5 space-y-4 text-sm leading-6 text-white/62"><li>1. Đối soát các đơn “Cần đối soát”.</li><li>2. Liên hệ lead mới trong giờ làm việc gần nhất.</li><li>3. Chuyển trạng thái để pipeline luôn phản ánh đúng.</li><li>4. Chỉ ghi nhận “Đã thanh toán” sau khi thấy giao dịch thật.</li></ol></Card>
            </div>
          </div>
        )}

        {db && activeTab === 'analytics' && <GrowthAnalyticsPanel />}

        {db && ['orders', 'leads', 'contacts'].includes(activeTab) && (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90a09f]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên, điện thoại, email hoặc mã đơn..." className="min-h-12 w-full rounded-xl border border-[#d8e2dd] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#0b8a78]" /></label><Button variant="outline" className="bg-white" onClick={() => exportCsv(activeTab as 'orders' | 'leads' | 'contacts')}><Download className="mr-2 h-4 w-4" /> Xuất CSV</Button></div>

            {activeTab === 'orders' && filtered('orders').map((order: any) => (
              <Card key={order.id} className="rounded-[1.5rem] border border-[#dfe6e2] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#e4f5ef] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#0b7f72]">{order.orderCode}</span><span className="text-xs text-[#829397]">{when(order.createdAt)}</span></div><h3 className="mt-4 text-xl font-semibold">{order.customerName}</h3><div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#61777b]"><a href={`tel:${order.customerPhone}`} className="font-semibold text-[#0b7f72]">{order.customerPhone}</a><a href={`mailto:${order.customerEmail}`}>{order.customerEmail}</a></div>{order.customerNote && <p className="mt-4 max-w-2xl rounded-xl bg-[#f5f7f4] p-3 text-xs leading-5 text-[#657a7e]">Khách ghi chú: {order.customerNote}</p>}</div>
                  <div className="grid min-w-full gap-3 sm:grid-cols-3 xl:min-w-[36rem]"><div className="rounded-xl bg-[#f4f7f3] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#849598]">Chương trình</p><p className="mt-1 text-sm font-bold">{order.packageName}</p></div><div className="rounded-xl bg-[#f4f7f3] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#849598]">Số tiền</p><p className="mt-1 text-sm font-extrabold text-[#0b7f72]">{money(order.amount)}</p></div><div className="rounded-xl bg-[#f4f7f3] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#849598]">Nội dung CK</p><p className="mt-1 break-all text-xs font-bold">{order.transferContent}</p></div></div>
                </div>
                <div className="mt-5 grid gap-3 border-t border-[#e7ece9] pt-5 md:grid-cols-[14rem_1fr_auto]"><select value={order.status} onChange={(event) => updateLocalRow('orders', order.id, { status: event.target.value })} className="min-h-11 rounded-xl border border-[#d4dfda] bg-white px-3 text-xs font-bold outline-none focus:border-[#0b8a78]">{Object.entries(ORDER_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><Input value={order.adminNote || ''} onChange={(event) => updateLocalRow('orders', order.id, { adminNote: event.target.value })} placeholder="Ghi chú nội bộ: thời gian gọi lại, giao dịch..." /><Button onClick={() => saveRow('orders', order)} className="bg-[#153339] text-white"><Save className="mr-2 h-4 w-4" /> Lưu</Button></div>
              </Card>
            ))}

            {activeTab === 'leads' && filtered('leads').map((lead: any) => (
              <Card key={lead.id} className="rounded-[1.5rem] border border-[#dfe6e2] bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:justify-between"><div><div className="flex items-center gap-3"><h3 className="text-lg font-semibold">{lead.name}</h3><span className="text-xs text-[#829397]">{when(lead.createdAt)}</span></div><p className="mt-1 text-sm font-semibold text-[#0b7f72]">{lead.emailOrPhone}</p></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Stat label="Mục tiêu" value={lead.goals || '—'} /><Stat label="BMI" value={`${lead.bmi || '—'} · ${lead.bmiCategory || ''}`} /><Stat label="TDEE" value={`${lead.tdee || '—'} kcal`} /><Stat label="Sleep" value={`${lead.sleepScore || '—'}/100`} /></div></div><div className="mt-5 grid gap-3 border-t border-[#e7ece9] pt-5 md:grid-cols-[14rem_1fr_auto]"><select value={lead.status} onChange={(event) => updateLocalRow('leads', lead.id, { status: event.target.value })} className="min-h-11 rounded-xl border border-[#d4dfda] bg-white px-3 text-xs font-bold">{Object.entries(LEAD_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><Input value={lead.adminNote || ''} onChange={(event) => updateLocalRow('leads', lead.id, { adminNote: event.target.value })} placeholder="Ghi chú tư vấn..." /><Button onClick={() => saveRow('leads', lead)} className="bg-[#153339] text-white"><Save className="mr-2 h-4 w-4" /> Lưu</Button></div></Card>
            ))}

            {activeTab === 'contacts' && filtered('contacts').map((contact: any) => (
              <Card key={contact.id} className="rounded-[1.5rem] border border-[#dfe6e2] bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:justify-between"><div><h3 className="text-lg font-semibold">{contact.name}</h3><p className="mt-1 text-sm text-[#61777b]"><a className="font-semibold text-[#0b7f72]" href={`mailto:${contact.email}`}>{contact.email}</a>{contact.phone ? ` · ${contact.phone}` : ''}</p></div><span className="text-xs text-[#829397]">{when(contact.createdAt)}</span></div><div className="mt-4 rounded-xl bg-[#f5f7f4] p-4"><p className="text-[10px] font-extrabold uppercase tracking-wider text-[#0b7f72]">{contact.subject || 'Liên hệ chung'}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#566e73]">{contact.message}</p></div><div className="mt-5 grid gap-3 md:grid-cols-[14rem_1fr_auto]"><select value={contact.status} onChange={(event) => updateLocalRow('contacts', contact.id, { status: event.target.value })} className="min-h-11 rounded-xl border border-[#d4dfda] bg-white px-3 text-xs font-bold">{Object.entries(CONTACT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><Input value={contact.adminNote || ''} onChange={(event) => updateLocalRow('contacts', contact.id, { adminNote: event.target.value })} placeholder="Ghi chú phản hồi..." /><Button onClick={() => saveRow('contacts', contact)} className="bg-[#153339] text-white"><Save className="mr-2 h-4 w-4" /> Lưu</Button></div></Card>
            ))}
          </div>
        )}

        {db && activeTab === 'settings' && settingsForm && (
          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="rounded-[1.75rem] border border-[#dfe6e2] bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e4f5ef] text-[#0b7f72]"><Mail className="h-5 w-5" /></span><div><h2 className="text-lg font-semibold">Thông tin kinh doanh</h2><p className="text-xs text-[#7a8d90]">Hiển thị ở footer và trang liên hệ.</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Số điện thoại" value={settingsForm.phone} onChange={(value) => setSettingsForm({ ...settingsForm, phone: value })} /><Field label="Email" value={settingsForm.email} onChange={(value) => setSettingsForm({ ...settingsForm, email: value })} /><div className="sm:col-span-2"><Field label="Địa chỉ" value={settingsForm.address} onChange={(value) => setSettingsForm({ ...settingsForm, address: value })} /></div><div className="sm:col-span-2"><Field label="Giờ làm việc" value={settingsForm.workingHours} onChange={(value) => setSettingsForm({ ...settingsForm, workingHours: value })} /></div></div></Card>
            <Card className="rounded-[1.75rem] border border-[#dfe6e2] bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><WalletCards className="h-5 w-5" /></span><div><h2 className="text-lg font-semibold">Nhận chuyển khoản</h2><p className={`text-xs ${settingsForm.bankAccountNumber && settingsForm.bankAccountName ? 'text-[#0b7f72]' : 'text-amber-700'}`}>{settingsForm.bankAccountNumber && settingsForm.bankAccountName ? 'VietQR đã sẵn sàng.' : 'Cần điền số và chủ tài khoản để bật QR.'}</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Ngân hàng" value={settingsForm.bankName || ''} onChange={(value) => setSettingsForm({ ...settingsForm, bankName: value })} /><Field label="BIN VietQR" value={settingsForm.bankBin || ''} onChange={(value) => setSettingsForm({ ...settingsForm, bankBin: value })} /><Field label="Số tài khoản" value={settingsForm.bankAccountNumber || ''} onChange={(value) => setSettingsForm({ ...settingsForm, bankAccountNumber: value })} /><Field label="Tên chủ tài khoản (không dấu)" value={settingsForm.bankAccountName || ''} onChange={(value) => setSettingsForm({ ...settingsForm, bankAccountName: value.toUpperCase() })} /><div className="sm:col-span-2"><Field label="Chi nhánh (không bắt buộc)" value={settingsForm.bankBranch || ''} onChange={(value) => setSettingsForm({ ...settingsForm, bankBranch: value })} /></div></div></Card>
            <div className="xl:col-span-2"><Button onClick={saveSettings} disabled={isSaving} className="min-w-44 bg-[#153339] text-white"><Save className="mr-2 h-4 w-4" /> {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}</Button></div>
          </div>
        )}

        {db && activeTab === 'packages' && (
          <div className="space-y-5">{packagesForm.map((pkg: any, index: number) => <Card key={pkg.id} className="rounded-[1.5rem] border border-[#dfe6e2] bg-white p-6 shadow-sm"><div className="grid gap-4 sm:grid-cols-2"><Field label="Tên chương trình" value={pkg.name} onChange={(value) => setPackagesForm(packagesForm.map((item, itemIndex) => itemIndex === index ? { ...item, name: value } : item))} /><Field label="Giá hiển thị" value={pkg.price} onChange={(value) => setPackagesForm(packagesForm.map((item, itemIndex) => itemIndex === index ? { ...item, price: value } : item))} /><div className="sm:col-span-2"><Field label="Mô tả" value={pkg.desc} onChange={(value) => setPackagesForm(packagesForm.map((item, itemIndex) => itemIndex === index ? { ...item, desc: value } : item))} /></div><Field label="Nhãn nổi bật" value={pkg.badge || ''} onChange={(value) => setPackagesForm(packagesForm.map((item, itemIndex) => itemIndex === index ? { ...item, badge: value } : item))} /><Field label="Dòng giá phụ" value={pkg.subprice || ''} onChange={(value) => setPackagesForm(packagesForm.map((item, itemIndex) => itemIndex === index ? { ...item, subprice: value } : item))} /></div></Card>)}<Button onClick={savePackages} disabled={isSaving} className="bg-[#153339] text-white"><Save className="mr-2 h-4 w-4" /> {isSaving ? 'Đang lưu...' : 'Lưu chương trình'}</Button></div>
        )}
      </main>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-xs font-bold text-[#526a6f]">{label}<Input className="mt-2" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="min-w-28 rounded-xl bg-[#f5f7f4] p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-[#849598]">{label}</p><p className="mt-1 line-clamp-2 text-xs font-bold">{value}</p></div>;
}
