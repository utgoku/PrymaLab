import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/ui/Footer';
import { Navigation } from '@/components/ui/Navigation';
import { getPublicHomeData } from '@/lib/db';

export const metadata: Metadata = { title: 'Điều khoản dịch vụ', description: 'Điều khoản sử dụng website, đặt chương trình và thanh toán tại PrymaLab.', alternates: { canonical: '/terms' } };

const sections = [
  ['1. Phạm vi dịch vụ', 'PrymaLab cung cấp nội dung giáo dục, công cụ tự đánh giá, cấu trúc theo dõi thói quen và các chương trình đồng hành về dinh dưỡng, giấc ngủ và nhịp sống. Quyền lợi cụ thể, thời lượng và mức giá được hiển thị tại thời điểm tạo đơn.'],
  ['2. Không phải dịch vụ y tế', 'PrymaLab không chẩn đoán, điều trị, kê đơn hoặc thay thế bác sĩ. Kết quả bài đánh giá và gợi ý chỉ mang tính định hướng lối sống. Người dùng có triệu chứng kéo dài, bệnh nền, đang mang thai, dùng thuốc hoặc có nhu cầu lâm sàng cần trao đổi với cơ sở y tế phù hợp.'],
  ['3. Tạo đơn và thanh toán', 'Mỗi đơn có mã riêng, số tiền và nội dung chuyển khoản. Người dùng chịu trách nhiệm kiểm tra đúng tài khoản nhận được hiển thị trên prymalab.com trước khi chuyển. Đơn chỉ được xem là đã thanh toán sau khi PrymaLab đối soát giao dịch thực tế; ảnh chụp hoặc thao tác bấm “đã chuyển khoản” không tự động xác nhận tiền đã về.'],
  ['4. Kích hoạt chương trình', 'Sau khi đối soát, PrymaLab liên hệ theo thông tin trong đơn để xác nhận lịch bắt đầu và hướng dẫn đầu vào. Thời gian phản hồi được tính trong giờ làm việc và có thể thay đổi theo chương trình hoặc lịch hai bên.'],
  ['5. Hủy và hoàn trả', 'Bạn có thể yêu cầu hủy trước khi buổi khởi động, tài liệu cá nhân hóa hoặc phần việc chính được triển khai. Sau khi chương trình bắt đầu, PrymaLab sẽ xem xét phần dịch vụ đã thực hiện, phần chưa sử dụng và thỏa thuận đã xác nhận cho đơn để đưa ra phương án minh bạch. Giao dịch chuyển nhầm hoặc trùng được kiểm tra và xử lý sau khi xác minh.'],
  ['6. Trách nhiệm người dùng', 'Cung cấp thông tin trung thực, sử dụng tài liệu cho mục đích cá nhân, không chia sẻ tài khoản quản trị hoặc can thiệp hệ thống. Người dùng chịu trách nhiệm cho quyết định sức khỏe của mình và cần dừng hoạt động, tìm hỗ trợ y tế khi có dấu hiệu bất thường.'],
  ['7. Sở hữu nội dung', 'Mã nguồn, thiết kế, tài liệu và nội dung gốc do dự án tạo ra thuộc chủ sở hữu hợp pháp tương ứng, trừ thành phần của bên thứ ba được dùng theo giấy phép riêng. Không sao chép, bán lại hoặc công bố lại với mục đích thương mại nếu chưa có chấp thuận bằng văn bản. Nội dung này không phải là tuyên bố rằng tên thương hiệu đã được cấp văn bằng bảo hộ.'],
  ['8. Nhận diện độc lập', 'PrymaLab Việt Nam tại prymalab.com hoạt động độc lập trong phạm vi giáo dục dinh dưỡng, giấc ngủ và thói quen; không liên kết, không được ủy quyền và không cùng chủ sở hữu với prymalab.net hoặc các đơn vị bán peptide, hóa chất nghiên cứu.'],
  ['9. Thay đổi và giải quyết phản ánh', 'PrymaLab có thể cập nhật điều khoản để phản ánh thay đổi dịch vụ hoặc pháp luật và sẽ ghi ngày cập nhật. Phản ánh được ưu tiên giải quyết qua trao đổi trực tiếp, dựa trên dữ liệu đơn hàng và quyền lợi người tiêu dùng theo pháp luật Việt Nam.'],
];

export default async function TermsPage() {
  const { settings } = await getPublicHomeData();
  return <div className="min-h-screen bg-[#f5f7f3] text-[#153339]"><Navigation /><main className="mx-auto max-w-4xl px-5 pb-24 pt-36 sm:px-8 lg:pt-44"><p className="section-kicker">Giao dịch minh bạch</p><h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">Điều khoản dịch vụ</h1><p className="mt-5 text-sm text-[#73878b]">Cập nhật: 24/08/2026</p><div className="mt-10 rounded-[2rem] border border-[#dce5e0] bg-white p-7 sm:p-10"><p className="text-base leading-8 text-[#566f73]">Bằng việc dùng website hoặc tạo đơn, bạn xác nhận đã đọc phạm vi, cách thanh toán và giới hạn dịch vụ dưới đây. Nếu có điểm chưa rõ, hãy <Link href="/contact" className="font-bold text-[#0b7f72] underline">liên hệ PrymaLab</Link> trước khi chuyển tiền.</p><div className="mt-9 divide-y divide-[#e1e8e4]">{sections.map(([title, copy]) => <section key={title} className="py-7 first:pt-0 last:pb-0"><h2 className="text-lg font-semibold">{title}</h2><p className="mt-3 text-sm leading-7 text-[#60767a]">{copy}</p></section>)}</div></div><div className="mt-8 rounded-2xl bg-[#153339] p-6 text-white"><h2 className="font-semibold">Hỗ trợ giao dịch</h2><p className="mt-2 text-sm leading-6 text-white/60">Email: <a className="font-bold text-[#d9f46f]" href={`mailto:${settings.email}`}>{settings.email}</a> · Điện thoại: {settings.phone}</p></div></main><Footer settings={settings} /></div>;
}
