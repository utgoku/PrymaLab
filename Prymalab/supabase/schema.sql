-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- site_settings
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- packages
CREATE TABLE packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  price_numeric INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'VND',
  period TEXT NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 0,
  subprice TEXT,
  badge TEXT,
  theme TEXT DEFAULT 'teal',
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  features JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- testimonials
CREATE TABLE testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  quote TEXT NOT NULL,
  avatar_color TEXT DEFAULT 'bg-teal-100 text-teal-700',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- blog_posts
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  published_date TEXT NOT NULL,
  read_time TEXT,
  gradient TEXT,
  slug TEXT UNIQUE,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- faqs
CREATE TABLE faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- team_members
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_color TEXT DEFAULT 'bg-teal-500',
  bio TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- leads (quiz results)
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email_or_phone TEXT NOT NULL,
  bmi NUMERIC,
  bmi_category TEXT,
  tdee NUMERIC,
  sleep_score NUMERIC,
  sleep_category TEXT,
  goals TEXT
);

-- contacts (form submissions)
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL
);

-- orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  package_id TEXT REFERENCES packages(id),
  package_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- ========================================
-- Row Level Security (RLS) Policies
-- ========================================

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public READ access for content tables
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read packages" ON packages FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public read team_members" ON team_members FOR SELECT TO anon USING (is_active = true);

-- Public INSERT for form submissions
CREATE POLICY "Public insert leads" ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public insert contacts" ON contacts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public insert orders" ON orders FOR INSERT TO anon WITH CHECK (true);

-- Service role has full access (for admin API routes)
CREATE POLICY "Service role full access site_settings" ON site_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access packages" ON packages FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access testimonials" ON testimonials FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access blog_posts" ON blog_posts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access faqs" ON faqs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access team_members" ON team_members FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access leads" ON leads FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access contacts" ON contacts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access orders" ON orders FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ========================================
-- SEED DATA
-- ========================================

-- Site Settings
INSERT INTO site_settings (key, value) VALUES
  ('phone', '0948 348 444'),
  ('email', 'hung@prymalab.com'),
  ('address', 'Nguyễn Tất Thành - Đà Nẵng'),
  ('workingHours', '08:30 - 17:00 (Thứ 2 - Thứ 6)'),
  ('heroCustomers', '1000'),
  ('heroSatisfaction', '95'),
  ('heroExperts', '30');

-- Packages
INSERT INTO packages (id, name, description, price, price_numeric, currency, period, duration_days, subprice, badge, theme, is_popular, sort_order, features) VALUES
  ('starter', 'Pryma Start', 'Hiểu nhịp hiện tại và thiết lập nền tảng đầu tiên.', '99,000 VNĐ', 99000, 'VND', '/tháng', 7, NULL, NULL, 'teal', false, 1, '[{"text":"Tính toán TDEE cơ bản","included":true},{"text":"Gợi ý thực đơn mẫu","included":true},{"text":"Nhật ký giấc ngủ (7 ngày)","included":true},{"text":"Chuyên gia tư vấn 1-1","included":false}]'),
  ('transformation', 'Pryma Reset 30', 'Tái thiết nhịp ăn, ngủ và năng lượng trong 30 ngày.', '1,490,000 VNĐ', 1490000, 'VND', '/30 ngày', 30, 'Chỉ ~49,000 VNĐ/ngày', 'Lộ trình trọng tâm', 'teal', false, 2, '[{"text":"Thực đơn cá nhân hóa mỗi ngày","included":true},{"text":"Phác đồ giấc ngủ chuyên sâu","included":true},{"text":"Theo dõi và tinh chỉnh hàng tuần","included":true},{"text":"2 buổi tư vấn 1-1 với chuyên gia","included":true},{"text":"Hỗ trợ qua chat 24/7","included":true}]'),
  ('elite', 'Pryma Signature 90', 'Đồng hành chuyên sâu 90 ngày với lộ trình được tinh chỉnh liên tục.', '3,990,000 VNĐ', 3990000, 'VND', '/90 ngày', 90, NULL, NULL, 'blue', false, 3, '[{"text":"Mọi quyền lợi của Pryma Reset 30","included":true},{"text":"Phân tích xét nghiệm máu định kỳ","included":true},{"text":"6 buổi tư vấn chuyên gia cao cấp","included":true},{"text":"Ưu tiên hỗ trợ kỹ thuật và y tế","included":true}]');

-- Testimonials
-- Testimonials are intentionally empty. Add only verified client feedback with consent.

-- Blog Posts
INSERT INTO blog_posts (title, excerpt, category, author, published_date, read_time, gradient, slug) VALUES
  ('10 Thực Phẩm Giúp Bạn Ngủ Ngon Hơn', 'Khám phá những loại thực phẩm tự nhiên chứa melatonin và magie giúp bạn dễ dàng chìm vào giấc ngủ.', 'Giấc ngủ', 'BS. Lê Nam', '20 Oct, 2023', '5 phút', 'from-blue-400 to-indigo-500', '10-thuc-pham-giup-ban-ngu-ngon-hon'),
  ('Hướng Dẫn Tính TDEE Chính Xác', 'Làm thế nào để tính tổng năng lượng tiêu hao hàng ngày (TDEE) để thiết lập mục tiêu giảm cân hoặc tăng cơ an toàn.', 'Dinh dưỡng', 'ThS. Trần Hương', '18 Oct, 2023', '8 phút', 'from-teal-400 to-emerald-500', 'huong-dan-tinh-tdee-chinh-xac'),
  ('Thực Đơn Giảm Cân 7 Ngày Cho Người Bận Rộn', 'Gợi ý chuẩn bị bữa ăn nhanh gọn, đủ chất, giúp tối ưu thời gian mà vẫn duy trì vóc dáng.', 'Thực đơn', 'ThS. Trần Hương', '15 Oct, 2023', '10 phút', 'from-orange-400 to-rose-400', 'thuc-don-giam-can-7-ngay'),
  ('5 Thói Quen Buổi Tối Cải Thiện Giấc Ngủ', 'Thay đổi nhỏ trong thói quen sinh hoạt buổi tối mang lại hiệu quả lớn cho chất lượng giấc ngủ của bạn.', 'Lối sống', 'BS. Lê Nam', '12 Oct, 2023', '6 phút', 'from-purple-400 to-fuchsia-500', '5-thoi-quen-buoi-toi-cai-thien-giac-ngu'),
  ('Protein: Bao Nhiêu Là Đủ?', 'Tìm hiểu nhu cầu protein thực sự của cơ thể dựa trên mức độ vận động và độ tuổi.', 'Dinh dưỡng', 'BS. Nguyễn Minh', '10 Oct, 2023', '7 phút', 'from-teal-500 to-blue-500', 'protein-bao-nhieu-la-du'),
  ('Yoga Trước Khi Ngủ: 5 Bài Tập Đơn Giản', 'Thư giãn cơ bắp và tâm trí với các động tác yoga nhẹ nhàng ngay trên giường trước giờ đi ngủ.', 'Lối sống', 'HLV. Phạm Thanh', '05 Oct, 2023', '4 phút', 'from-pink-400 to-rose-500', 'yoga-truoc-khi-ngu-5-bai-tap');

-- FAQs
INSERT INTO faqs (question, answer, sort_order) VALUES
  ('Gói dịch vụ bao gồm những gì?', 'Mỗi gói dịch vụ đều bao gồm một đánh giá sức khỏe toàn diện, thực đơn cá nhân hóa thiết kế riêng, và quyền truy cập vào cộng đồng PrymaLab. Các gói cao cấp hơn có thêm đặc quyền theo dõi 1:1 với chuyên gia.', 1),
  ('Làm sao để liên hệ chuyên gia?', 'Sau khi đăng ký, bạn sẽ được kết nối với chuyên gia qua nền tảng nhắn tin tích hợp của chúng tôi. Với gói Premium, bạn có thể gọi video trực tiếp hàng tuần.', 2),
  ('Tôi có thể hủy gói không?', 'Có, bạn có thể hủy gia hạn bất kỳ lúc nào qua bảng điều khiển cá nhân. Chúng tôi cũng có chính sách hoàn tiền trong 7 ngày đầu nếu bạn không hài lòng.', 3),
  ('Thực đơn có phù hợp với người ăn chay?', 'Hoàn toàn phù hợp. Trước khi lên thực đơn, chúng tôi sẽ khảo sát chi tiết về sở thích, dị ứng và chế độ ăn đặc biệt của bạn (ăn chay, keto, không gluten, v.v.).', 4),
  ('Thanh toán bằng cách nào?', 'Sau khi chọn lộ trình, bạn có thể chuyển khoản Vietcombank theo thông tin và mã VietQR hiển thị ở bước thanh toán.', 5);

-- Team Members
INSERT INTO team_members (name, role, avatar_color, sort_order) VALUES
  ('BS. Nguyễn Minh', 'Giám đốc Y khoa', 'bg-teal-500', 1),
  ('ThS. Trần Hương', 'Chuyên gia Dinh dưỡng', 'bg-blue-500', 2),
  ('BS. Lê Nam', 'Chuyên gia Giấc ngủ', 'bg-indigo-500', 3),
  ('HLV. Phạm Thanh', 'Huấn luyện viên Thể lực', 'bg-cyan-500', 4);
