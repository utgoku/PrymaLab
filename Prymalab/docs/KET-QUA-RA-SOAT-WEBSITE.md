# Kết quả rà soát PrymaLab — cập nhật 09/10/2026

## Website chính

- Rút gọn trang chủ: thông điệp chính, cách bắt đầu, gói dịch vụ, bài mới và câu hỏi thường gặp. Bỏ các khối dài, lời kêu gọi lặp lại và số liệu minh họa dễ bị hiểu thành kết quả thực tế.
- Sửa liên kết font để tiêu đề và nội dung dùng đúng bộ chữ; cân lại kích thước chữ, độ tương phản, khoảng cách và hiển thị điện thoại.
- Làm rõ dịch vụ trực tuyến, quy trình tiếp nhận và phạm vi sản phẩm. Giá và thông tin gói lấy từ dữ liệu quản trị hiện có.
- Giữ thông tin đã xác nhận: 0948 348 444; hung@prymalab.com; Đà Nẵng, Việt Nam; Thứ Hai–Thứ Bảy, 08:00–18:00.
- Mục Kiến thức có tìm kiếm, lọc chủ đề và bài liên quan. Sáu bài đang công khai được quản lý bằng dữ liệu, các bản cũ ngừng công khai được giữ nháp.

## Viết và đăng bài

Vào https://www.prymalab.com/admin → **Bài viết**. Có tạo bài, lưu nháp, xem trước, đăng, sửa và chuyển về nháp. Bài đã đăng cập nhật trang chủ, thư viện bài viết, sitemap và RSS; không cần triển khai lại website.

Chi tiết thao tác trong [HUONG-DAN-DANG-BAI.md](HUONG-DAN-DANG-BAI.md).

Hỗ trợ văn bản, tiêu đề phần, danh sách, nguồn tham khảo và ba ảnh thư viện. Chưa có tải ảnh riêng, hẹn giờ, tự động lưu theo thời gian, lịch sử phiên bản hoặc nhiều tài khoản biên tập.

## Ba blog vệ tinh

Đã tạo và đăng công khai **Blogger, WordPress.com và Tumblr**, mỗi blog có hai bài riêng, phần giới thiệu/liên hệ và liên kết về PrymaLab. Chủ website đã hoàn tất các bước đăng nhập, xác nhận tài khoản và điều khoản. Email công khai được xác nhận là **hung@prymalab.com**.

- [Bữa ăn có nhịp — Blogger](https://buaancohnhip-prymalab.blogspot.com/)
- [Sổ tay giấc ngủ — WordPress.com](https://sotaygiacnguprymalab.wordpress.com/)
- [Nhịp sống nhỏ — Tumblr](https://nhipsongnho-prymalab.tumblr.com/)

Đã chỉnh cỡ chữ, khoảng cách, rút gọn mô tả và bỏ tiêu đề lặp. WordPress hiển thị trích đoạn ở trang chủ, bỏ nội dung mẫu và chân trang giả. Tumblr có giao diện riêng cho máy tính/điện thoại và phần liên hệ. Đã chọn giờ Việt Nam cho cả ba blog.

Hướng dẫn quản lý, đăng bài và bản sao giao diện trong [BAN-GIAO-3-BLOG.md](BAN-GIAO-3-BLOG.md). Không cần tạo lại tài khoản hoặc nhập lại XML lên blog hiện tại.

## Kiểm chứng

- Kiểm thử trọn luồng bài viết: lưu nháp không công khai, đăng xuất hiện đúng nơi, chuyển về nháp gỡ khỏi trang công khai/sitemap/RSS. Bản ghi kiểm thử đã được dọn.
- Kiểm tra đăng nhập bắt buộc, nguồn yêu cầu, đường dẫn trùng, dữ liệu không hợp lệ, liên kết nguồn không an toàn và xung đột khi hai cửa sổ sửa cùng bài.
- Kiểm tra các trang chính, canonical, số tiêu đề H1 và dữ liệu có cấu trúc; xem giao diện máy tính và điện thoại.
- Bản đóng gói phát hành đã biên dịch, kiểm tra kiểu dữ liệu và tạo trang thành công.
- Kiểm tra quy tắc mã toàn kho đã đạt với mức yêu cầu không có cảnh báo. Đã xử lý các lỗi cũ về kiểu dữ liệu, khởi tạo giao diện và biểu đồ.
- Thêm kiểm thử hồi quy cho đường dẫn tiếng Việt, thứ tự nội dung, yêu cầu trước khi đăng, nguồn tham khảo và bản ghi ngủ qua đêm. Đã sửa lỗi giờ thức dậy bị đặt cùng ngày khi ngủ qua nửa đêm.
- Thêm workflow GitHub Actions: cài đúng phiên bản thư viện, kiểm tra mã, chạy kiểm thử và build. CI dùng cấu hình giả cho build, không dùng mật khẩu hay dữ liệu Supabase thật.
- Đã kiểm tra trang quản trị trên tên miền thật bằng phiên đăng nhập của chủ website và lưu thành công một bản nháp mẫu. Bản nháp này được giữ để chủ website dùng thử, chưa đăng công khai.

## Phần chủ website cần duy trì

Đăng nội dung có ích, kiểm tra nguồn kiến thức sức khỏe, giữ thông tin dịch vụ đúng thực tế và cập nhật giờ liên hệ khi thay đổi. Chỉ thêm hồ sơ chuyên môn, ảnh đội ngũ, câu chuyện khách hàng hay đánh giá khi có thông tin thật và quyền sử dụng. Sitemap hỗ trợ phát hiện bài; không bảo đảm thời điểm lập chỉ mục hoặc thứ hạng tìm kiếm.
