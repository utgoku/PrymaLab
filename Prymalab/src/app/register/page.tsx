'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Navigation } from '@/components/ui/Navigation';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    document.title = 'Đăng ký | PrymaLab';
  }, []);

  const calculatePasswordStrength = (pass: string) => {
    if (pass.length === 0) return 0;
    if (pass.length < 6) return 1;
    if (pass.length >= 6 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 3;
    if (pass.length >= 6) return 2;
    return 1;
  };
  
  const strength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (!acceptedTerms) {
      setError('Bạn phải đồng ý với Điều khoản dịch vụ');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(email, password, fullName);
      
      // Submit order to Admin DB if applicable
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const plan = urlParams.get('plan') || 'starter';
        
        await fetch('/api/admin/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            packageId: plan,
            packageName: plan.toUpperCase(),
            customerName: fullName,
            customerPhone: email // Using email as contact info for now since phone is not in register form
          })
        });
      } catch (err) {
        console.error('Failed to save order to admin db', err);
      }

      if (result.requiresEmailConfirmation) {
        setSuccessMessage('Tài khoản đã được tạo. Vui lòng mở email và bấm liên kết xác nhận trước khi đăng nhập.');
        setIsLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng ký');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 mt-20 mb-10">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 -ml-16 -mt-16 w-32 h-32 rounded-full bg-[#0D9488]/10 blur-2xl"></div>
          <div className="absolute bottom-0 right-0 -mr-16 -mb-16 w-32 h-32 rounded-full bg-[#2563EB]/10 blur-2xl"></div>

          <div className="relative z-10 text-center mb-8">
            <h1 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0D9488] to-[#2563EB]">
              Tạo tài khoản
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Bắt đầu hành trình sức khỏe của bạn</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium leading-6 text-emerald-800">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            <Input
              label="Họ và tên"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              required
              fullWidth
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
              fullWidth
            />
            
            <div className="relative">
              <Input
                label="Mật khẩu"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                required
                fullWidth
              />
              <button
                type="button"
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
              
              {password.length > 0 && (
                <div className="mt-2 flex gap-1 h-1.5 w-full">
                  <div className={`flex-1 rounded-full ${strength >= 1 ? 'bg-red-400' : 'bg-gray-200'}`}></div>
                  <div className={`flex-1 rounded-full ${strength >= 2 ? 'bg-amber-400' : 'bg-gray-200'}`}></div>
                  <div className={`flex-1 rounded-full ${strength >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                </div>
              )}
            </div>

            <Input
              label="Xác nhận mật khẩu"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              required
              fullWidth
            />

            <div className="flex items-start mt-4">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#0D9488] focus:ring-[#0D9488]"
                />
              </div>
              <div className="ml-2 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  Tôi đồng ý với <Link href="/terms" className="text-[#0D9488] hover:underline">Điều khoản dịch vụ</Link>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              disabled={isLoading}
              className="mt-6 relative overflow-hidden group"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Đang xử lý...
                </span>
              ) : 'Đăng ký'}
            </Button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-semibold text-[#0D9488] hover:text-[#0F766E] transition-colors">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
