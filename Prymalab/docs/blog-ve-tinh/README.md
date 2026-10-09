# Ba blog PrymaLab đã công khai

Trạng thái ngày 09/10/2026: **đã tạo và đăng công khai cả ba blog**, mỗi blog có hai bài riêng và phần giới thiệu/liên hệ. Chủ website đã hoàn tất đăng nhập, xác nhận tài khoản và điều khoản. Email công khai được xác nhận là **hung@prymalab.com**.

Xem [hướng dẫn bàn giao và đăng bài](../BAN-GIAO-3-BLOG.md). Các mục thiết lập bên dưới được giữ làm tài liệu tham khảo khi cần tạo lại; không cần tạo tài khoản hoặc nhập bài lần nữa.

| Nền tảng | Tên blog | Địa chỉ công khai | Vai trò |
|---|---|---|---|
| Blogger | Bữa ăn có nhịp — PrymaLab | https://buaancohnhip-prymalab.blogspot.com/ | Tổ chức bữa ăn, mẫu chuẩn bị cho ngày bận |
| WordPress.com | Sổ tay giấc ngủ — PrymaLab | https://sotaygiacnguprymalab.wordpress.com/ | Nhật ký, giải thích và hướng dẫn dài |
| Tumblr | Nhịp sống nhỏ — PrymaLab | https://nhipsongnho-prymalab.tumblr.com/ | Ghi chú ngắn, lời nhắc thực hành |

Mở `xem-truoc.html` để xem bộ ba. Mỗi thư mục có tên bài, mô tả, nội dung HTML có thể dán vào trình soạn thảo, trang giới thiệu và một bài thứ hai. Tất cả đều nhận diện công khai là blog của PrymaLab Việt Nam. Bài mở đầu khác nhau để người đọc nhận được giá trị riêng trên từng kênh.

## Thiết lập tài khoản — đã hoàn tất

1. Tạo tài khoản bằng email thuộc quyền quản lý của bạn tại từng nền tảng. Tự đặt mật khẩu, xác nhận email và chấp nhận điều khoản. Bật xác thực hai bước khi nền tảng hỗ trợ.
2. Chọn gói miễn phí và tên miền phụ miễn phí. Chưa cần mua tên miền hoặc nâng cấp trả phí.
3. Gửi lại địa chỉ blog đã tạo, hoặc đăng nhập trong trình duyệt của cuộc trò chuyện để tiếp tục cấu hình. Không gửi mật khẩu qua tin nhắn.

## Blogger

- Vào https://www.blogger.com/ và chọn tạo blog. Dùng tên và mô tả trong `blogger/cau-hinh.json`.
- Chọn chủ đề **Contempo**, nền sáng, màu nhấn xanh lá, thanh bên gọn. Trong phần tùy chỉnh nâng cao, dán `blogger/giao-dien.css` nếu muốn dùng kiểu chữ đã chuẩn bị.
- Tạo trang Giới thiệu từ `blogger/gioi-thieu.html`, đặt liên kết trên menu.
- Tạo bài mới, nhập tiêu đề từ cấu hình; chuyển sang chế độ HTML và dán `bai-mo-dau.html`. Xem trước trên điện thoại rồi đăng.
- Đặt mô tả tìm kiếm từ `description`, bật hiển thị với công cụ tìm kiếm. Dùng 2–3 nhãn liên quan, không thêm từ khóa không xuất hiện trong nội dung.

## WordPress.com

- Vào https://wordpress.com/start/, chọn địa chỉ `.wordpress.com` miễn phí và gói Free nếu được cung cấp trong luồng đăng ký.
- Chọn một chủ đề blog miễn phí, bố cục một cột, nền sáng, phông hệ thống dễ đọc; nội dung khoảng 680–760 px, chữ 17–18 px. Tùy chọn chính xác phụ thuộc chủ đề/gói. Không cần cài plugin hoặc mua quyền sửa CSS.
- Có thể nhập `wordpress/nhap-ban-nhap.xml` bằng công cụ Import WordPress nếu tài khoản hỗ trợ. Tệp chứa 2 bài và 1 trang Giới thiệu, tất cả ở trạng thái **draft**. Gán tác giả cho tài khoản của bạn khi nhập. Tệp đã kiểm tra XML, chưa thử nhập trên tài khoản thật.
- Nếu không có công cụ nhập: tạo bài/trang thủ công và dán các tệp HTML bằng khối Custom HTML hoặc trình chỉnh sửa mã. Xem trước rồi xuất bản.
- Menu chỉ cần Trang chủ, Giới thiệu, PrymaLab. Kiểm tra bài được mở công khai trước khi bật khả năng tìm kiếm.

## Tumblr

- Tạo blog tại https://www.tumblr.com/ với tên từ `tumblr/cau-hinh.json`.
- Dán mô tả; tạo bài Text từ `bai-mo-dau.html`. Với trình soạn HTML, dùng nội dung bên trong bài, không dán trang xem trước.
- Nếu tài khoản có **Enable custom theme**, bật rồi vào Edit theme → Edit HTML và dùng `tumblr/chu-de.html`. Chủ đề ưu tiên bài Text; giao diện custom áp dụng khi xem địa chỉ blog riêng, không áp dụng cho mọi màn hình trong app.
- Tạo trang Giới thiệu, bật hiển thị liên kết trang. Xem trước máy tính/điện thoại rồi lưu.

## Lịch biên tập mẫu

Đây là lịch gợi ý, chưa tạo lịch tự động hay tác vụ nhắc việc.

- Hai bài khởi đầu và phần Giới thiệu ở mỗi kênh đã đăng ngày 09/10/2026.
- Bài kế tiếp: chọn một câu hỏi mới của người đọc, triển khai theo chủ đề riêng của mỗi blog.
- Tuần 3: viết thêm một ví dụ thực hành từ câu hỏi người đọc; không dùng hồ sơ hay dữ liệu khách hàng nếu chưa được phép.
- Tuần 4: xem lượt đọc và lượt truy cập về website; giữ kênh có người đọc thật, cập nhật bài cũ khi có điều cần sửa.

Website chính là nơi đăng bài đầy đủ hằng ngày hoặc khi cần. Ba kênh bổ sung nội dung theo thế mạnh riêng; liên kết về bài liên quan khi hữu ích, không đặt liên kết chéo hàng loạt hoặc sao chép toàn bộ một bài lên cả ba nơi. Điều này bám sát định hướng nội dung hữu ích và tránh doorway/link spam của Google; không có bảo đảm về thứ hạng hay việc được lập chỉ mục.

## Nguồn và hướng dẫn nền tảng

- Blogger: https://support.google.com/blogger/answer/1623800?hl=en
- WordPress.com: https://wordpress.com/support/getting-started-with-wordpress-com/
- Tumblr custom themes: https://help.tumblr.com/knowledge-base/customizing-your-theme/
- Google Search spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- Tham khảo kiến thức ngủ: https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits
