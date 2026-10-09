'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { BrandMark } from './BrandMark';

const navLinks = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Phương pháp', href: '/phuong-phap' },
  { name: 'Chương trình', href: '/services' },
  { name: 'Kiến thức', href: '/blog' },
  { name: 'Về PrymaLab', href: '/about' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'border-b border-[#dfe6e2]/90 bg-[#f7f9f5]/88 py-3 shadow-[0_10px_35px_-25px_rgba(21,51,57,0.4)] backdrop-blur-xl' : 'border-b border-transparent bg-transparent py-5'}`}>
        <div className="mx-auto flex max-w-[88rem] items-center justify-between px-5 sm:px-8 lg:px-10">
          <BrandMark />

          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-2 text-sm font-semibold transition-colors ${isActive ? 'text-[#0b7f72]' : 'text-[#526a6f] hover:text-[#0b7f72]'}`}
                >
                  {link.name}
                  <span className={`absolute inset-x-0 -bottom-1 mx-auto h-0.5 rounded-full bg-[#0b8a78] transition-all ${isActive ? 'w-5' : 'w-0'}`} />
                </Link>
              );
            })}
          </div>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <Link href="/contact" className="inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#0b8a78] px-5 text-sm font-bold text-[#0b7f72] transition hover:bg-white/70">
              Trao đổi trước
            </Link>
            <Link href="/quiz" className="inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#153339] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0b7f72]">
              Đánh giá miễn phí
            </Link>
          </div>

          <button
            type="button"
            aria-label="Mở menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#cedbd6] bg-white/75 text-[#153339] backdrop-blur lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[60] transition lg:hidden ${isMobileMenuOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'}`}>
        <button
          type="button"
          aria-label="Đóng menu"
          className={`absolute inset-0 bg-[#102f35]/45 backdrop-blur-sm transition-opacity ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <aside
          id="mobile-navigation"
          className={`absolute right-0 top-0 flex h-full w-[min(88vw,25rem)] flex-col bg-[#f7f9f5] p-6 shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between">
            <BrandMark />
            <button type="button" aria-label="Đóng menu" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4dfda] text-[#153339]" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-12 flex flex-col">
            {navLinks.map((link, index) => (
              <Link key={link.name} href={link.href} className="flex items-center justify-between border-b border-[#dde5e0] py-5 text-lg font-semibold text-[#27474c]" onClick={() => setIsMobileMenuOpen(false)}>
                {link.name}<span className="text-xs font-bold text-[#9aabaa]">0{index + 1}</span>
              </Link>
            ))}
          </div>

          <div className="mt-auto space-y-4 pt-8">
            <Link href="/quiz" className="flex min-h-13 items-center justify-center rounded-full bg-[#153339] px-6 text-sm font-bold text-white" onClick={() => setIsMobileMenuOpen(false)}>
              Khám phá nhịp sống của bạn
            </Link>
            <Link href="/contact" className="flex min-h-12 items-center justify-center rounded-full border border-[#b8d3cc] bg-white px-6 text-sm font-bold text-[#0b7f72]" onClick={() => setIsMobileMenuOpen(false)}>
              Trao đổi với PrymaLab
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
