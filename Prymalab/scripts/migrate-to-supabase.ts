import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  console.log('Starting migration to Supabase...');

  // 1. Read db.json
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  let data;
  try {
    data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    console.log('Loaded db.json');
  } catch (err) {
    console.error('Could not read db.json:', err);
    data = { leads: [], contacts: [], orders: [] };
  }

  // 2. Migrate Contacts
  if (data.contacts && data.contacts.length > 0) {
    console.log(`Migrating ${data.contacts.length} contacts...`);
    for (const contact of data.contacts) {
      const { error } = await supabase.from('contacts').insert({
        name: contact.name,
        email: contact.email,
        phone: contact.phone || '',
        subject: contact.subject || '',
        message: contact.message || '',
        status: contact.status || 'new',
        created_at: contact.createdAt || new Date().toISOString(),
      });
      if (error) {
        console.error('Error inserting contact:', contact.name, error);
      } else {
        console.log('Inserted contact:', contact.name);
      }
    }
  }

  // 3. Migrate Orders
  if (data.orders && data.orders.length > 0) {
    console.log(`Migrating ${data.orders.length} orders...`);
    for (const order of data.orders) {
      const { error } = await supabase.from('orders').insert({
        id: randomUUID(),
        package_id: order.packageId,
        package_name: order.packageName,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_email: order.customerEmail || '',
        amount: order.amount || 0,
        status: order.status || 'awaiting_payment',
        order_code: `PL-OLD-${randomUUID().slice(0, 8).toUpperCase()}`,
        created_at: order.createdAt || new Date().toISOString(),
      });
      if (error) {
        console.error('Error inserting order:', order.customerName, error);
      } else {
        console.log('Inserted order:', order.customerName);
      }
    }
  }
  
  // 4. Migrate Leads
  if (data.leads && data.leads.length > 0) {
    console.log(`Migrating ${data.leads.length} leads...`);
    for (const lead of data.leads) {
      const { error } = await supabase.from('leads').insert({
        name: lead.name,
        email_or_phone: lead.emailOrPhone,
        bmi: lead.bmi || 0,
        bmi_category: lead.bmiCategory || '',
        tdee: lead.tdee || 0,
        sleep_score: lead.sleepScore || 0,
        sleep_category: lead.sleepCategory || '',
        goals: lead.goals || '',
        status: lead.status || 'new',
        created_at: lead.createdAt || new Date().toISOString(),
      });
      if (error) {
        console.error('Error inserting lead:', lead.name, error);
      } else {
        console.log('Inserted lead:', lead.name);
      }
    }
  }

  // 5. Migrate Default Settings
  console.log('Migrating site settings...');
  const DEFAULT_SITE_SETTINGS = {
    phone: '0948 348 444',
    email: 'hung@prymalab.com',
    address: 'Nguyễn Tất Thành - Đà Nẵng',
    workingHours: '08:30 - 17:00 (Thứ 2 - Thứ 6)',
    heroCustomers: '1000',
    heroSatisfaction: '95',
    heroExperts: '30',
    bankName: 'Vietcombank',
    bankBin: '970436',
    bankAccountNumber: '',
    bankAccountName: '',
    bankBranch: '',
  };
  const settingsEntries = Object.entries(DEFAULT_SITE_SETTINGS).map(([key, value]) => ({ key, value }));
  const { error: settingsError } = await supabase.from('site_settings').upsert(settingsEntries, { onConflict: 'key' });
  if (settingsError) {
    console.error('Error inserting site settings:', settingsError);
  } else {
    console.log('Inserted site settings.');
  }

  // 6. Migrate Default Packages
  console.log('Migrating packages...');
  const DEFAULT_SITE_PACKAGES = [
    {
      id: 'starter',
      name: 'Pryma Start',
      desc: 'Bản khởi động 7 ngày để hiểu nhịp ăn, ngủ và chọn đúng ưu tiên.',
      price: '99,000 VNĐ',
      period: '/7 ngày',
      theme: 'teal',
      features: [
        { text: 'Bản đọc nhịp sống cá nhân', included: true },
        { text: 'Khung bữa ăn thực hành 7 ngày', included: true },
        { text: 'Routine thư giãn trước ngủ', included: true },
        { text: 'Mẫu theo dõi năng lượng mỗi ngày', included: true },
      ]
    },
    {
      id: 'transformation',
      name: 'Pryma Reset 30',
      desc: 'Thiết lập lại nhịp ăn, ngủ và năng lượng trong 30 ngày có người đồng hành.',
      price: '1,490,000 VNĐ',
      period: '/30 ngày',
      subprice: 'Chỉ ~49,000 VNĐ/ngày',
      badge: 'Lộ trình trọng tâm',
      theme: 'teal',
      features: [
        { text: 'Đánh giá đầu vào có cấu trúc', included: true },
        { text: 'Khung bữa ăn cá nhân hóa 30 ngày', included: true },
        { text: 'Routine giấc ngủ theo lịch sống', included: true },
        { text: '2 buổi trao đổi 1-1', included: true },
        { text: 'Check-in và tinh chỉnh hàng tuần', included: true },
        { text: 'Hỗ trợ trong giờ làm việc', included: true },
      ]
    },
    {
      id: 'elite',
      name: 'Pryma Signature 90',
      desc: 'Đồng hành 90 ngày để biến thay đổi ngắn hạn thành hệ thống có thể duy trì.',
      price: '3,990,000 VNĐ',
      period: '/90 ngày',
      theme: 'blue',
      features: [
        { text: 'Toàn bộ Pryma Reset 30', included: true },
        { text: '3 chu kỳ mục tiêu 30 ngày', included: true },
        { text: '6 buổi trao đổi 1-1', included: true },
        { text: 'Báo cáo xu hướng theo tuần', included: true },
        { text: 'Tinh chỉnh ưu tiên xuyên suốt', included: true },
        { text: 'Phản hồi ưu tiên trong ngày làm việc', included: true },
      ]
    }
  ];

  const packagesInserts = DEFAULT_SITE_PACKAGES.map((p, index) => ({
    id: p.id,
    name: p.name,
    description: p.desc,
    price: p.price,
    price_numeric: Number(p.price.replace(/\\D/g, '')) || 0,
    currency: 'VND',
    period: p.period,
    duration_days: p.id === 'starter' ? 7 : p.id === 'transformation' ? 30 : 90,
    subprice: p.subprice || '',
    badge: p.badge || '',
    theme: p.theme,
    is_popular: false,
    features: p.features,
    sort_order: index
  }));
  
  // Clean existing and insert
  await supabase.from('packages').delete().gte('sort_order', 0);
  const { error: packagesError } = await supabase.from('packages').insert(packagesInserts);
  if (packagesError) {
    console.error('Error inserting packages:', packagesError);
  } else {
    console.log('Inserted packages.');
  }

  console.log('Migration complete!');
}

migrateData();
