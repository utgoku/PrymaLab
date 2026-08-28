import type { Metadata } from 'next';
import { Footer } from '@/components/ui/Footer';
import { Navigation } from '@/components/ui/Navigation';
import { getPublicHomeData } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: 'Tìm hiểu cách PrymaLab thu thập vừa đủ, sử dụng minh bạch và bảo vệ dữ liệu cá nhân khi bạn dùng website, bài đánh giá và chương trình.',
  alternates: { canonical: '/privacy' },
};

const sections = [
  ['1. Dữ liệu chúng tôi thu thập', 'PrymaLab có thể thu thập họ tên, email, số điện thoại, nội dung liên hệ, lựa chọn chương trình, dữ liệu bài đánh giá và các ghi nhận về thói quen ăn, ngủ, năng lượng do bạn chủ động cung cấp. Không gửi hồ sơ bệnh án, số định danh, mật khẩu ngân hàng hoặc dữ liệu không cần thiết qua biểu mẫu.'],
  ['2. Mục đích xử lý', 'Dữ liệu được dùng để trả kết quả đánh giá, tạo và đối soát đơn, liên hệ hỗ trợ, triển khai chương trình, cải thiện trải nghiệm, bảo vệ hệ thống và thực hiện nghĩa vụ pháp lý. PrymaLab không bán dữ liệu cá nhân.'],
  ['3. Sự đồng ý và lựa chọn của bạn', 'Trước khi gửi biểu mẫu, bạn được thông báo mục đích và chủ động xác nhận. Bạn có thể không cung cấp dữ liệu; khi đó một số chức năng như tạo đơn hoặc nhận tư vấn sẽ không hoạt động.'],
  ['4. Đơn vị hỗ trợ xử lý', 'Website được vận hành trên Vercel và dữ liệu ứng dụng được lưu trên Supabase theo cấu hình của PrymaLab. VietQR chỉ được dùng để tạo hình ảnh QR chứa thông tin tài khoản nhận, số tiền và mã đơn; PrymaLab không đưa dữ liệu bài đánh giá vào mã QR.'],
  ['5. Đo lường website', 'PrymaLab dùng đo lường first-party để biết trang nào được xem, nguồn truy cập, trạng thái chuyển đổi và Core Web Vitals. Hệ thống tạo một mã phiên ngẫu nhiên chỉ tồn tại trong phiên trình duyệt; không lưu địa chỉ IP, user-agent, email, số điện thoại hoặc URL giới thiệu đầy đủ trong bảng analytics. Dữ liệu đo lường được dùng để cải thiện website và hiệu quả phục vụ.'],
  ['6. Thời gian lưu trữ', 'Dữ liệu được giữ trong thời gian cần thiết cho mục đích đã thông báo, xử lý yêu cầu, quản lý đơn và đáp ứng thời hạn lưu trữ bắt buộc theo pháp luật. Dữ liệu analytics được rà soát định kỳ và dự kiến giữ tối đa 180 ngày, trừ số liệu tổng hợp không còn nhận diện phiên. Khi không còn cần thiết, PrymaLab sẽ xóa, ẩn danh hoặc hạn chế truy cập phù hợp.'],
  ['7. Bảo mật', 'Quyền quản trị được bảo vệ bằng phiên máy chủ và biến bí mật. Dữ liệu vận hành chỉ được truy cập theo nhu cầu công việc. Không hệ thống nào tuyệt đối an toàn; khi phát hiện sự cố, PrymaLab sẽ đánh giá, hạn chế ảnh hưởng và thực hiện thông báo theo quy định áp dụng.'],
  ['8. Quyền của bạn', 'Bạn có thể yêu cầu biết, xem, sửa, rút lại sự đồng ý, hạn chế xử lý hoặc xóa dữ liệu trong phạm vi pháp luật cho phép. PrymaLab có thể cần xác minh danh tính trước khi thực hiện để tránh tiết lộ dữ liệu cho người khác.'],
  ['9. Dữ liệu liên quan sức khỏe', 'Thông tin về cân nặng, giấc ngủ và thói quen có thể nhạy cảm. PrymaLab chỉ dùng cho trải nghiệm đã mô tả và không coi kết quả tự động là chẩn đoán y khoa. Nếu có triệu chứng hoặc bệnh nền, hãy trao đổi với cơ sở y tế phù hợp.'],
];

export default async function PrivacyPage() {
  const { settings } = await getPublicHomeData();
  return (
    <div className="min-h-screen bg-[#f5f7f3] text-[#153339]">
      <Navigation />
      <main className="mx-auto max-w-4xl px-5 pb-24 pt-36 sm:px-8 lg:pt-44">
        <p className="section-kicker">Pháp lý & dữ liệu</p>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-medium tracking-[-0.035em] sm:text-5xl">Chính sách bảo mật</h1>
        <p className="mt-5 text-sm text-[#73878b]">Cập nhật: 28/08/2026</p>
        <div className="mt-10 rounded-[2rem] border border-[#dce5e0] bg-white p-7 sm:p-10">
          <p className="text-base leading-8 text-[#566f73]">PrymaLab tôn trọng quyền riêng tư và áp dụng nguyên tắc thu thập vừa đủ, dùng đúng mục đích và minh bạch với người dùng. Chính sách này áp dụng cho prymalab.com và các biểu mẫu liên quan.</p>
          <div className="mt-9 divide-y divide-[#e1e8e4]">{sections.map(([title, copy]) => <section key={title} className="py-7 first:pt-0 last:pb-0"><h2 className="text-lg font-semibold">{title}</h2><p className="mt-3 text-sm leading-7 text-[#60767a]">{copy}</p></section>)}</div>
        </div>
        <div className="mt-8 rounded-2xl bg-[#153339] p-6 text-white"><h2 className="font-semibold">Liên hệ về dữ liệu cá nhân</h2><p className="mt-2 text-sm leading-6 text-white/60">Email: <a className="font-bold text-[#d9f46f]" href={`mailto:${settings.email}`}>{settings.email}</a> · Điện thoại: {settings.phone}</p></div>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
