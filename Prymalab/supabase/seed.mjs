/**
 * Script to run SQL on Supabase using the Management API
 * Usage: node supabase/run-sql.mjs
 * 
 * This script reads the schema.sql file and executes it on Supabase
 * using the postgrest rpc endpoint or direct SQL execution.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before seeding.');
}

// We'll use the Supabase REST API to insert data directly
// For table creation, we need the SQL Editor or service_role key

async function seedData() {
  console.log('🌱 Starting Supabase data seeding...\n');

  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
  };

  // Helper function
  async function insertData(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`❌ Error inserting into ${table}:`, err);
      return false;
    }
    console.log(`✅ Inserted ${Array.isArray(data) ? data.length : 1} row(s) into ${table}`);
    return true;
  }

  // 1. Site Settings
  await insertData('site_settings', [
    { key: 'phone', value: '0948 348 444' },
    { key: 'email', value: 'hung@prymalab.com' },
    { key: 'address', value: 'Nguyễn Tất Thành - Đà Nẵng' },
    { key: 'workingHours', value: '08:30 - 17:00 (Thứ 2 - Thứ 6)' },
    { key: 'heroCustomers', value: '1000' },
    { key: 'heroSatisfaction', value: '95' },
    { key: 'heroExperts', value: '30' },
  ]);

  // 2. Packages
  await insertData('packages', [
    {
      id: 'starter',
      name: 'Pryma Start',
      description: 'Trải nghiệm nền tảng, thiết lập thói quen.',
      price: '99,000 VNĐ',
      price_numeric: 99000,
      currency: 'VND',
      period: '/tháng',
      duration_days: 7,
      theme: 'teal',
      is_popular: false,
      sort_order: 1,
      features: [
        { text: 'Tính toán TDEE cơ bản', included: true },
        { text: 'Gợi ý thực đơn mẫu', included: true },
        { text: 'Nhật ký giấc ngủ (7 ngày)', included: true },
        { text: 'Chuyên gia tư vấn 1-1', included: false },
      ]
    },
    {
      id: 'transformation',
      name: 'Pryma Reset 30',
      description: 'Thay đổi toàn diện vóc dáng và sinh học trong 30 ngày.',
      price: '1,490,000 VNĐ',
      price_numeric: 1490000,
      currency: 'VND',
      period: '/30 ngày',
      duration_days: 30,
      subprice: 'Chỉ ~49,000 VNĐ/ngày',
      badge: 'Lộ trình trọng tâm',
      theme: 'teal',
      is_popular: true,
      sort_order: 2,
      features: [
        { text: 'Thực đơn cá nhân hóa mỗi ngày', included: true },
        { text: 'Phác đồ giấc ngủ chuyên sâu', included: true },
        { text: 'Theo dõi và tinh chỉnh hàng tuần', included: true },
        { text: '2 buổi tư vấn 1-1 với chuyên gia', included: true },
        { text: 'Hỗ trợ qua chat 24/7', included: true },
      ]
    },
    {
      id: 'elite',
      name: 'Pryma Signature 90',
      description: 'Chăm sóc cao cấp 90 ngày. Đồng hành trọn vẹn.',
      price: '3,990,000 VNĐ',
      price_numeric: 3990000,
      currency: 'VND',
      period: '/90 ngày',
      duration_days: 90,
      theme: 'blue',
      is_popular: false,
      sort_order: 3,
      features: [
        { text: 'Mọi quyền lợi của Pryma Reset 30', included: true },
        { text: 'Phân tích xét nghiệm máu định kỳ', included: true },
        { text: '6 buổi tư vấn chuyên gia cao cấp', included: true },
        { text: 'Ưu tiên hỗ trợ kỹ thuật và y tế', included: true },
      ]
    }
  ]);

  // 3. Testimonials
  // Testimonials are intentionally not seeded. Publish only feedback collected
  // from real clients with explicit permission.

  // 4. Blog Posts
  await insertData('blog_posts', [
    { title: '10 Thực Phẩm Giúp Bạn Ngủ Ngon Hơn', excerpt: 'Khám phá những loại thực phẩm tự nhiên chứa melatonin và magie giúp bạn dễ dàng chìm vào giấc ngủ.', category: 'Giấc ngủ', author: 'BS. Lê Nam', published_date: '20 Oct, 2023', read_time: '5 phút', gradient: 'from-blue-400 to-indigo-500', slug: '10-thuc-pham-giup-ban-ngu-ngon-hon' },
    { title: 'Hướng Dẫn Tính TDEE Chính Xác', excerpt: 'Làm thế nào để tính tổng năng lượng tiêu hao hàng ngày (TDEE) để thiết lập mục tiêu giảm cân hoặc tăng cơ an toàn.', category: 'Dinh dưỡng', author: 'ThS. Trần Hương', published_date: '18 Oct, 2023', read_time: '8 phút', gradient: 'from-teal-400 to-emerald-500', slug: 'huong-dan-tinh-tdee-chinh-xac' },
    { title: 'Thực Đơn Giảm Cân 7 Ngày Cho Người Bận Rộn', excerpt: 'Gợi ý chuẩn bị bữa ăn nhanh gọn, đủ chất, giúp tối ưu thời gian mà vẫn duy trì vóc dáng.', category: 'Thực đơn', author: 'ThS. Trần Hương', published_date: '15 Oct, 2023', read_time: '10 phút', gradient: 'from-orange-400 to-rose-400', slug: 'thuc-don-giam-can-7-ngay' },
    { title: '5 Thói Quen Buổi Tối Cải Thiện Giấc Ngủ', excerpt: 'Thay đổi nhỏ trong thói quen sinh hoạt buổi tối mang lại hiệu quả lớn cho chất lượng giấc ngủ của bạn.', category: 'Lối sống', author: 'BS. Lê Nam', published_date: '12 Oct, 2023', read_time: '6 phút', gradient: 'from-purple-400 to-fuchsia-500', slug: '5-thoi-quen-buoi-toi' },
    { title: 'Protein: Bao Nhiêu Là Đủ?', excerpt: 'Tìm hiểu nhu cầu protein thực sự của cơ thể dựa trên mức độ vận động và độ tuổi.', category: 'Dinh dưỡng', author: 'BS. Nguyễn Minh', published_date: '10 Oct, 2023', read_time: '7 phút', gradient: 'from-teal-500 to-blue-500', slug: 'protein-bao-nhieu-la-du' },
    { title: 'Yoga Trước Khi Ngủ: 5 Bài Tập Đơn Giản', excerpt: 'Thư giãn cơ bắp và tâm trí với các động tác yoga nhẹ nhàng ngay trên giường trước giờ đi ngủ.', category: 'Lối sống', author: 'HLV. Phạm Thanh', published_date: '05 Oct, 2023', read_time: '4 phút', gradient: 'from-pink-400 to-rose-500', slug: 'yoga-truoc-khi-ngu' },
  ]);

  // 5. FAQs
  await insertData('faqs', [
    { question: 'Gói dịch vụ bao gồm những gì?', answer: 'Mỗi gói dịch vụ đều bao gồm một đánh giá sức khỏe toàn diện, thực đơn cá nhân hóa thiết kế riêng, và quyền truy cập vào cộng đồng PrymaLab. Các gói cao cấp hơn có thêm đặc quyền theo dõi 1:1 với chuyên gia.', sort_order: 1 },
    { question: 'Làm sao để liên hệ chuyên gia?', answer: 'Sau khi đăng ký, bạn sẽ được kết nối với chuyên gia qua nền tảng nhắn tin tích hợp của chúng tôi. Với gói Premium, bạn có thể gọi video trực tiếp hàng tuần.', sort_order: 2 },
    { question: 'Tôi có thể hủy gói không?', answer: 'Có, bạn có thể hủy gia hạn bất kỳ lúc nào qua bảng điều khiển cá nhân. Chúng tôi cũng có chính sách hoàn tiền trong 7 ngày đầu nếu bạn không hài lòng.', sort_order: 3 },
    { question: 'Thực đơn có phù hợp với người ăn chay?', answer: 'Hoàn toàn phù hợp. Trước khi lên thực đơn, chúng tôi sẽ khảo sát chi tiết về sở thích, dị ứng và chế độ ăn đặc biệt của bạn (ăn chay, keto, không gluten, v.v.).', sort_order: 4 },
    { question: 'Thanh toán bằng cách nào?', answer: 'Sau khi chọn lộ trình, bạn có thể chuyển khoản Vietcombank theo thông tin và mã VietQR hiển thị ở bước thanh toán.', sort_order: 5 },
  ]);

  // 6. Team Members
  await insertData('team_members', [
    { name: 'BS. Nguyễn Minh', role: 'Giám đốc Y khoa', avatar_color: 'bg-teal-500', sort_order: 1 },
    { name: 'ThS. Trần Hương', role: 'Chuyên gia Dinh dưỡng', avatar_color: 'bg-blue-500', sort_order: 2 },
    { name: 'BS. Lê Nam', role: 'Chuyên gia Giấc ngủ', avatar_color: 'bg-indigo-500', sort_order: 3 },
    { name: 'HLV. Phạm Thanh', role: 'Huấn luyện viên Thể lực', avatar_color: 'bg-cyan-500', sort_order: 4 },
  ]);

  console.log('\n🎉 Seeding complete!');
}

seedData().catch(console.error);
