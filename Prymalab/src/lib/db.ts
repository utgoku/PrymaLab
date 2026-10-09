import 'server-only';
import { randomBytes, randomUUID } from 'crypto';
import { supabase } from './supabase';
import { getAdminSupabase } from './supabase-admin';

function normalizeBrandCopy(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/(?:[\p{L}]+\s*&\s*[\p{L}]+\s+)?Transformation(?: 30 Days)?/giu, 'Pryma Reset 30')
    .replace(/(?:[\p{L}]+\s*&\s*[\p{L}]+\s+)?Elite Care(?: 90 Days)?/giu, 'Pryma Signature 90')
    .replace(/(?:[\p{L}]+\s*&\s*[\p{L}]+\s+)?Starter/giu, 'Pryma Start')
    .replace(/[\p{L}]\s*&\s*[\p{L}]\s+Platform/giu, 'PrymaLab')
    .replace(/[\p{L}]\s*&\s*[\p{L}]/giu, 'PrymaLab');
}

export interface Lead {
  id: string;
  createdAt: string;
  name: string;
  emailOrPhone: string;
  bmi: number;
  bmiCategory: string;
  tdee: number;
  sleepScore: number;
  sleepCategory: string;
  goals: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'archived';
  adminNote: string;
}

export interface ContactMessage {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved' | 'archived';
  adminNote: string;
}

export type OrderStatus = 'awaiting_payment' | 'payment_review' | 'paid' | 'onboarding' | 'active' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  createdAt: string;
  packageId: string;
  packageName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  orderCode: string;
  amount: number;
  status: OrderStatus;
  paymentMethod: 'bank_transfer';
  transferContent: string;
  customerNote: string;
  adminNote: string;
  paidAt: string | null;
  updatedAt: string;
}

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  heroCustomers: string;
  heroSatisfaction: string;
  heroExperts: string;
  bankName: string;
  bankBin: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankBranch: string;
  [key: string]: string; // Allows dynamic mapping of rows
}

export interface PackageFeature {
  text: string;
  included: boolean;
}

export interface SitePackage {
  id: string;
  name: string;
  desc: string;
  price: string;
  period: string;
  subprice?: string;
  badge?: string;
  theme: string;
  features: PackageFeature[];
}

export interface DatabaseSchema {
  settings: SiteSettings;
  packages: SitePackage[];
  leads: Lead[];
  contacts: ContactMessage[];
  orders: Order[];
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  phone: '0948 348 444',
  email: 'hung@prymalab.com',
  address: 'Đà Nẵng, Việt Nam',
  workingHours: 'Thứ Hai – Thứ Bảy, 08:00–18:00',
  heroCustomers: '0',
  heroSatisfaction: '0',
  heroExperts: '0',
  bankName: '',
  bankBin: '',
  bankAccountNumber: '',
  bankAccountName: '',
  bankBranch: '',
};

export const DEFAULT_SITE_PACKAGES: SitePackage[] = [];

export interface PublicHomeData {
  settings: SiteSettings;
  packages: SitePackage[];
}

/**
 * Public pages only need brand settings and package information. Keeping this
 * query separate prevents private operational tables from slowing down the
 * landing page, while the short timeout preserves a fast local fallback.
 */
export async function getPublicHomeData(): Promise<PublicHomeData> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const [settingsResult, packagesResult] = await Promise.all([
      supabase
        .from('site_settings')
        .select('key, value')
        .abortSignal(controller.signal),
      supabase
        .from('packages')
        .select('*')
        .order('sort_order')
        .abortSignal(controller.signal),
    ]);

    if (settingsResult.error || packagesResult.error) {
      throw settingsResult.error || packagesResult.error;
    }

    const settings = { ...DEFAULT_SITE_SETTINGS };
    settingsResult.data?.forEach((row) => {
      if (typeof row.key === 'string' && typeof row.value === 'string') {
        settings[row.key] = row.value;
      }
    });

    const packages = packagesResult.data?.length
      ? packagesResult.data.map((item) => ({
          id: item.id,
          name: normalizeBrandCopy(item.name),
          desc: normalizeBrandCopy(item.description),
          price: item.price,
          period: item.period,
          subprice: item.subprice,
          badge: item.badge,
          theme: item.theme,
          features: (item.features || []).map((feature: PackageFeature) => ({
            ...feature,
            text: normalizeBrandCopy(feature.text),
          })),
        }))
      : DEFAULT_SITE_PACKAGES;

    return { settings, packages };
  } catch {
    return {
      settings: { ...DEFAULT_SITE_SETTINGS },
      packages: DEFAULT_SITE_PACKAGES,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function getPaymentSettings(): Promise<SiteSettings> {
  const adminSupabase = getAdminSupabase();
  const { data, error } = await adminSupabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['bankName', 'bankBin', 'bankAccountNumber', 'bankAccountName', 'bankBranch']);
  if (error) throw error;

  const settings = { ...DEFAULT_SITE_SETTINGS };
  data?.forEach((row) => {
    if (typeof row.key === 'string' && typeof row.value === 'string') settings[row.key] = row.value;
  });
  return settings;
}

export async function getDb(): Promise<DatabaseSchema> {
  try {
    const adminSupabase = getAdminSupabase();
    const [
      { data: settingsData },
      { data: packagesData },
      { data: leadsData },
      { data: contactsData },
      { data: ordersData }
    ] = await Promise.all([
      adminSupabase.from('site_settings').select('key, value'),
      adminSupabase.from('packages').select('*').order('sort_order'),
      adminSupabase.from('leads').select('*').order('created_at', { ascending: false }),
      adminSupabase.from('contacts').select('*').order('created_at', { ascending: false }),
      adminSupabase.from('orders').select('*').order('created_at', { ascending: false })
    ]);

    let settings = { ...DEFAULT_SITE_SETTINGS };
    if (settingsData && settingsData.length > 0) {
      const parsedSettings: Record<string, string> = {};
      settingsData.forEach(row => {
        parsedSettings[row.key] = row.value;
      });
      settings = { ...DEFAULT_SITE_SETTINGS, ...parsedSettings };
    }

    let packages = DEFAULT_SITE_PACKAGES;
    if (packagesData && packagesData.length > 0) {
      packages = packagesData.map(p => ({
        id: p.id,
        name: normalizeBrandCopy(p.name),
        desc: normalizeBrandCopy(p.description),
        price: p.price,
        period: p.period,
        subprice: p.subprice,
        badge: p.badge,
        theme: p.theme,
        features: (p.features || []).map((feature: PackageFeature) => ({
          ...feature,
          text: normalizeBrandCopy(feature.text),
        }))
      }));
    }

    let leads: Lead[] = [];
    if (leadsData) {
      leads = leadsData.map(l => ({
        id: l.id,
        createdAt: l.created_at,
        name: l.name,
        emailOrPhone: l.email_or_phone,
        bmi: l.bmi,
        bmiCategory: l.bmi_category,
        tdee: l.tdee,
        sleepScore: l.sleep_score,
        sleepCategory: l.sleep_category,
        goals: l.goals,
        status: l.status || 'new',
        adminNote: l.admin_note || '',
      }));
    }

    let contacts: ContactMessage[] = [];
    if (contactsData) {
      contacts = contactsData.map(c => ({
        id: c.id,
        createdAt: c.created_at,
        name: c.name,
        email: c.email,
        phone: c.phone,
        subject: c.subject,
        message: c.message,
        status: c.status || 'new',
        adminNote: c.admin_note || '',
      }));
    }

    let orders: Order[] = [];
    if (ordersData) {
      orders = ordersData.map(o => ({
        id: o.id,
        createdAt: o.created_at,
        packageId: o.package_id,
        packageName: o.package_name,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        customerEmail: o.customer_email || '',
        orderCode: o.order_code || `PL-OLD-${o.id.slice(0, 8).toUpperCase()}`,
        amount: Number(o.amount || 0),
        status: (o.status || 'awaiting_payment') as OrderStatus,
        paymentMethod: 'bank_transfer',
        transferContent: o.transfer_content || '',
        customerNote: o.customer_note || '',
        adminNote: o.admin_note || '',
        paidAt: o.paid_at || null,
        updatedAt: o.updated_at || o.created_at,
      }));
    }

    return {
      settings,
      packages,
      leads,
      contacts,
      orders
    };
  } catch (error) {
    console.error('Error fetching admin data from Supabase', error);
    throw error;
  }
}

export async function addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status' | 'adminNote'>): Promise<Lead> {
  try {
    const adminSupabase = getAdminSupabase();
    const { data, error } = await adminSupabase.from('leads').insert([{
      name: lead.name,
      email_or_phone: lead.emailOrPhone,
      bmi: lead.bmi,
      bmi_category: lead.bmiCategory,
      tdee: lead.tdee,
      sleep_score: lead.sleepScore,
      sleep_category: lead.sleepCategory,
      goals: lead.goals,
      status: 'new',
    }]).select().single();

    if (error) throw error;
    
    return {
      id: data.id,
      createdAt: data.created_at,
      name: data.name,
      emailOrPhone: data.email_or_phone,
      bmi: data.bmi,
      bmiCategory: data.bmi_category,
      tdee: data.tdee,
      sleepScore: data.sleep_score,
      sleepCategory: data.sleep_category,
      goals: data.goals,
      status: data.status || 'new',
      adminNote: data.admin_note || '',
    };
  } catch (error) {
    console.error('Error adding lead', error);
    throw error;
  }
}

export async function addContact(contact: Omit<ContactMessage, 'id' | 'createdAt' | 'status' | 'adminNote'>): Promise<ContactMessage> {
  try {
    const adminSupabase = getAdminSupabase();
    const { data, error } = await adminSupabase.from('contacts').insert([{
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      subject: contact.subject,
      message: contact.message,
      status: 'new',
    }]).select().single();

    if (error) throw error;

    return {
      id: data.id,
      createdAt: data.created_at,
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      status: data.status || 'new',
      adminNote: data.admin_note || '',
    };
  } catch (error) {
    console.error('Error adding contact', error);
    throw error;
  }
}

export interface CreateOrderInput {
  packageId: string;
  packageName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerNote?: string;
  amount: number;
}

function createOrderCode() {
  const now = new Date();
  const day = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(now.getUTCDate()).padStart(2, '0')}`;
  return `PL${day}-${randomBytes(3).toString('hex').toUpperCase()}`;
}

export async function addOrder(order: CreateOrderInput): Promise<Order> {
  const adminSupabase = getAdminSupabase();
  const id = randomUUID();
  const orderCode = createOrderCode();
  const transferContent = `PRYMALAB ${orderCode}`;
  const createdAt = new Date().toISOString();

  const { data, error } = await adminSupabase.from('orders').insert([{
    id,
    created_at: createdAt,
    package_id: order.packageId,
    package_name: order.packageName,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    customer_email: order.customerEmail,
    customer_note: order.customerNote || '',
    order_code: orderCode,
    amount: order.amount,
    payment_method: 'bank_transfer',
    transfer_content: transferContent,
    status: 'awaiting_payment',
    updated_at: createdAt,
  }]).select().single();

  if (error) throw error;

  return {
    id: data.id,
    createdAt: data.created_at,
    packageId: data.package_id,
    packageName: data.package_name,
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    customerEmail: data.customer_email,
    orderCode: data.order_code,
    amount: Number(data.amount),
    status: data.status as OrderStatus,
    paymentMethod: 'bank_transfer',
    transferContent: data.transfer_content,
    customerNote: data.customer_note || '',
    adminNote: data.admin_note || '',
    paidAt: data.paid_at || null,
    updatedAt: data.updated_at,
  };
}

const LEAD_STATUSES: Lead['status'][] = ['new', 'contacted', 'qualified', 'converted', 'archived'];
const CONTACT_STATUSES: ContactMessage['status'][] = ['new', 'contacted', 'resolved', 'archived'];
const ORDER_STATUSES: OrderStatus[] = ['awaiting_payment', 'payment_review', 'paid', 'onboarding', 'active', 'completed', 'cancelled'];

export async function updateLead(id: string, status: Lead['status'], adminNote = '') {
  if (!LEAD_STATUSES.includes(status)) throw new Error('Invalid lead status.');
  const adminSupabase = getAdminSupabase();
  const { error } = await adminSupabase.from('leads').update({
    status,
    admin_note: adminNote.slice(0, 1000),
    updated_at: new Date().toISOString(),
  }).eq('id', id);
  if (error) throw error;
}

export async function updateContact(id: string, status: ContactMessage['status'], adminNote = '') {
  if (!CONTACT_STATUSES.includes(status)) throw new Error('Invalid contact status.');
  const adminSupabase = getAdminSupabase();
  const { error } = await adminSupabase.from('contacts').update({
    status,
    admin_note: adminNote.slice(0, 1000),
    updated_at: new Date().toISOString(),
  }).eq('id', id);
  if (error) throw error;
}

export async function updateOrder(id: string, status: OrderStatus, adminNote = '') {
  if (!ORDER_STATUSES.includes(status)) throw new Error('Invalid order status.');
  const adminSupabase = getAdminSupabase();
  const updates: Record<string, string | null> = {
    status,
    admin_note: adminNote.slice(0, 1000),
    updated_at: new Date().toISOString(),
  };
  if (status === 'paid') updates.paid_at = new Date().toISOString();
  const { error } = await adminSupabase.from('orders').update(updates).eq('id', id);
  if (error) throw error;
}

export async function markOrderPaymentSubmitted(orderCode: string, phone: string) {
  const adminSupabase = getAdminSupabase();
  const normalizedPhone = phone.replace(/\D/g, '');
  const { data, error } = await adminSupabase
    .from('orders')
    .select('id, customer_phone, status')
    .eq('order_code', orderCode)
    .maybeSingle();

  if (error) throw error;
  if (!data || String(data.customer_phone).replace(/\D/g, '') !== normalizedPhone) return false;
  if (data.status === 'awaiting_payment') {
    const { error: updateError } = await adminSupabase.from('orders').update({
      status: 'payment_review',
      updated_at: new Date().toISOString(),
    }).eq('id', data.id);
    if (updateError) throw updateError;
  }
  return true;
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  try {
    const adminSupabase = getAdminSupabase();
    const entries = Object.entries(settings);
    if (entries.length > 0) {
      const updates = entries.map(([key, value]) => ({ key, value }));
      const { error } = await adminSupabase.from('site_settings').upsert(updates, { onConflict: 'key' });
      if (error) throw error;
    }
    const db = await getDb();
    return db.settings;
  } catch (error) {
    console.error('Error updating settings', error);
    throw error;
  }
}

export async function updatePackages(packages: SitePackage[]): Promise<SitePackage[]> {
  try {
    const adminSupabase = getAdminSupabase();
    const { error: deleteError } = await adminSupabase.from('packages').delete().gte('sort_order', 0);
    if (deleteError) throw deleteError;

    if (packages.length > 0) {
      const inserts = packages.map((p, index) => ({
        id: p.id,
        name: String(p.name || '').slice(0, 100),
        description: String(p.desc || '').slice(0, 400),
        price: String(p.price || '').slice(0, 40),
        price_numeric: Number(String(p.price || '').replace(/\D/g, '')) || 0,
        currency: 'VND',
        period: String(p.period || '').slice(0, 40),
        duration_days: p.id === 'starter' ? 7 : p.id === 'transformation' ? 30 : 90,
        subprice: String(p.subprice || '').slice(0, 80),
        badge: String(p.badge || '').slice(0, 80),
        theme: p.theme,
        is_popular: false,
        features: p.features,
        sort_order: index
      }));

      const { error: insertError } = await adminSupabase.from('packages').insert(inserts);
      if (insertError) throw insertError;
    }

    return packages;
  } catch (error) {
    console.error('Error updating packages', error);
    throw error;
  }
}

export async function getTestimonials() {
  try {
    const { data, error } = await supabase.from('testimonials').select('*').eq('is_active', true).order('sort_order');
    if (error) throw error;
    return (data || []).map((item) => ({
      ...item,
      quote: normalizeBrandCopy(item.quote),
    }));
  } catch (error) {
    console.error('Error getting testimonials', error);
    return [];
  }
}

export async function getBlogPosts() {
  try {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('is_published', true).order('id', { ascending: false });
    if (error) throw error;
    return (data || []).map((item) => ({
      ...item,
      title: normalizeBrandCopy(item.title),
      excerpt: normalizeBrandCopy(item.excerpt),
      content: normalizeBrandCopy(item.content),
    }));
  } catch (error) {
    console.error('Error getting blog posts', error);
    return [];
  }
}

export async function getFaqs() {
  try {
    const { data, error } = await supabase.from('faqs').select('*').eq('is_active', true).order('sort_order');
    if (error) throw error;
    return (data || []).map((item) => ({
      ...item,
      question: normalizeBrandCopy(item.question),
      answer: normalizeBrandCopy(item.answer),
    }));
  } catch (error) {
    console.error('Error getting faqs', error);
    return [];
  }
}

export async function getTeamMembers() {
  try {
    const { data, error } = await supabase.from('team_members').select('*').eq('is_active', true).order('sort_order');
    if (error) throw error;
    return (data || []).map((item) => ({
      ...item,
      bio: normalizeBrandCopy(item.bio),
    }));
  } catch (error) {
    console.error('Error getting team members', error);
    return [];
  }
}
