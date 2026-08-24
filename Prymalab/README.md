# PrymaLab - Health & Sleep Wellness 🌿💤

![PrymaLab Banner](https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop)

<div align="center">

**Nền tảng Chăm sóc Sức khỏe và Giấc ngủ Toàn diện**  
*A Comprehensive Health & Sleep Wellness Platform*

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## 🌟 Giới thiệu (About)

PrymaLab là nền tảng chuyên biệt cung cấp các giải pháp cải thiện chất lượng giấc ngủ và chăm sóc sức khỏe dinh dưỡng. Với thiết kế hiện đại, giao diện thân thiện và các tính năng được cá nhân hóa, PrymaLab mang đến trải nghiệm tốt nhất cho người dùng trên hành trình tìm lại sự cân bằng.

PrymaLab is a specialized platform offering solutions to improve sleep quality and nutritional health. With a modern design, user-friendly interface, and personalized features, PrymaLab provides the best experience for users on their journey to restore balance.

## ✨ Tính năng chính (Key Features)

- 🔍 **Đánh giá Sức khỏe (Health Quiz):** Bài kiểm tra đánh giá chi tiết tình trạng giấc ngủ và thói quen sinh hoạt.
- 🛍️ **Dịch vụ Đa dạng (Services):** Cung cấp các gói tư vấn, liệu trình cải thiện giấc ngủ và dinh dưỡng.
- 📊 **Dashboard Cá nhân (User Dashboard):** Theo dõi chỉ số sức khỏe, lịch hẹn và tiến độ cá nhân.
- 💳 **Đăng ký lộ trình (Conversion Checkout):** Ghi nhận nhu cầu vào CRM; cổng thanh toán chỉ được kích hoạt khi có cấu hình merchant thật.
- 📱 **Responsive Design:** Trải nghiệm tối ưu trên mọi thiết bị (Mobile, Tablet, Desktop).
- 🎨 **Modern UI/UX:** Giao diện glassmorphism, hiệu ứng chuyển động mượt mà, màu sắc nhẹ nhàng (Teal/Blue).

## 🚀 Công nghệ sử dụng (Tech Stack)

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Animation:** CSS Keyframes / Tailwind Utilities

## 📦 Yêu cầu hệ thống (Prerequisites)

- Node.js 18.17.0 trở lên (Node 18+ recommended)
- npm, yarn, hoặc pnpm

## 🛠️ Cài đặt & Chạy dự án (Getting Started)

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd Prymalab
   ```

2. **Cài đặt thư viện (Install dependencies):**
   ```bash
   npm install
   # hoặc
   yarn install
   # hoặc
   pnpm install
   ```

3. **Cấu hình biến môi trường (Environment Variables):**
   Copy file `.env.example` thành `.env.local` và điền các thông tin cần thiết:
   ```bash
   cp .env.example .env.local
   ```

4. **Chạy server phát triển (Run development server):**
   ```bash
   npm run dev
   # hoặc
   yarn dev
   # hoặc
   pnpm dev
   ```

   Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để xem kết quả.

## 📁 Cấu trúc dự án (Project Structure)

```
Prymalab/
├── public/             # Tài nguyên tĩnh (images, icons, fonts)
├── src/
│   ├── app/            # Next.js App Router (pages, layouts, api)
│   ├── components/     # Các UI component dùng chung
│   │   ├── layout/     # Header, Footer, Sidebar
│   │   └── ui/         # Buttons, Cards, Inputs, v.v.
│   ├── lib/            # Utilities, cấu hình chung
│   └── types/          # Định nghĩa kiểu dữ liệu TypeScript
├── .env.example        # Mẫu biến môi trường
├── next.config.mjs     # Cấu hình Next.js
├── tailwind.config.ts  # Cấu hình Tailwind CSS
└── package.json        # Thông tin dự án & scripts
```

## 📜 Các lệnh có sẵn (Available Scripts)

- `npm run dev`: Chạy dự án ở chế độ phát triển
- `npm run build`: Build dự án cho môi trường production
- `npm start`: Chạy dự án sau khi đã build
- `npm run lint`: Kiểm tra lỗi code bằng ESLint
- `npm run seo:indexnow`: Gửi toàn bộ URL trong sitemap production tới IndexNow

## ☁️ Triển khai (Deployment)

Dự án được tối ưu hóa để triển khai trên [Vercel](https://vercel.com/):

1. Đẩy code lên GitHub/GitLab/Bitbucket.
2. Đăng nhập vào Vercel, chọn **Add New Project**.
3. Chọn repository chứa dự án PrymaLab.
4. Cấu hình biến môi trường (Environment Variables) trong mục Settings.
5. Click **Deploy**. Dự án sẽ tự động build và triển khai!

## ⚙️ Biến môi trường (Environment Variables)

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_APP_URL` | URL production | `https://prymalab.com` |
| `GOOGLE_SITE_VERIFICATION` | Token xác minh Google Search Console | Lấy từ Search Console |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Bắt buộc |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key | Bắt buộc |
| `SUPABASE_SERVICE_ROLE_KEY` | Quyền server cho CRM | Bắt buộc để bật admin |
| `PRYMALAB_ADMIN_PASSWORD` | Mật khẩu quản trị | Secret trên Vercel |
| `PRYMALAB_ADMIN_SESSION_SECRET` | Khóa ký phiên HttpOnly | Secret trên Vercel |

## 🛡️ Cổng kiểm soát thương hiệu và phát hành

Tên `PrymaLab` đang ở trạng thái **GO có điều kiện tại Việt Nam** vì có một đơn vị tại `prymalab.net` dùng cùng tên trong lĩnh vực peptide/nghiên cứu và có nội dung chạm tới giấc ngủ, tâm trạng, chuyển hóa. Organic SEO cho dịch vụ giáo dục lối sống tại Việt Nam được phép tiếp tục; không mở bán thực phẩm bổ sung/peptide, không mua backlink, không in bao bì và không dùng ký hiệu `®` cho đến khi hoàn tất tra cứu chuyên sâu tại Việt Nam, Hoa Kỳ và WIPO cùng ý kiến bằng văn bản của luật sư nhãn hiệu.

Xem hồ sơ kiểm soát tại:

- `docs/BRAND-RISK-REGISTER.md`
- `docs/TRADEMARK-COUNSEL-BRIEF.md`
- `docs/IP-ASSET-REGISTER.md`
- `docs/EXIT-READINESS.md`
- `docs/DEPENDENCY-LICENSE-AUDIT.md`
- `docs/SEARCH-CONSOLE-RUNBOOK.md`

## 📄 Giấy phép (License)

Mã nguồn và tài sản gốc của dự án là **proprietary / all rights reserved**. Các thư viện bên thứ ba tiếp tục tuân theo giấy phép riêng của chúng. Xem `LICENSE`.

## 🤝 Đóng góp (Contributing)

Không nhận đóng góp mã nguồn bên ngoài khi chưa có thỏa thuận chuyển giao IP bằng văn bản. Xem `CONTRIBUTING.md`.
