'use client';

export default function BlogError({ reset }: { reset: () => void }) {
  return <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-5 text-center"><h1 className="text-2xl font-semibold">Chưa tải được bài viết</h1><p className="mt-4 text-[#5f7478]">Kết nối đang gián đoạn. Bạn có thể thử lại sau một lát.</p><button type="button" onClick={reset} className="mt-6 min-h-12 rounded-full bg-[#153339] px-6 font-semibold text-white">Thử lại</button></main>;
}
