'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/Card';

export default function DashboardOverviewPage() {
  const { profile } = useAuth();

  const today = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-serif">
          Xin chào, {profile?.fullName || 'bạn'}! 👋
        </h2>
        <p className="text-gray-500 mt-1">{today}</p>
        <p className="text-gray-600 mt-2 font-medium">Hôm nay bạn cảm thấy thế nào? Hãy tiếp tục theo dõi sức khỏe nhé.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* BMI Card */}
        <Card className="bg-gradient-to-br from-teal-50 to-white border-teal-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-teal-100 rounded-lg">
              <ActivityIcon className="w-5 h-5 text-teal-600" />
            </div>
            <div className="flex items-center text-teal-600 text-sm font-medium">
              <ArrowDownIcon className="w-4 h-4 mr-1" />
              <span>0.5</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Chỉ số BMI</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">22.5</h3>
            <p className="text-xs text-gray-500 mt-1">Bình thường</p>
          </div>
        </Card>

        {/* Sleep Score Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MoonIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              <ArrowUpIcon className="w-4 h-4 mr-1" />
              <span>3%</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Điểm giấc ngủ</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">78<span className="text-sm font-normal text-gray-500">/100</span></h3>
            <p className="text-xs text-gray-500 mt-1">Khá tốt</p>
          </div>
        </Card>

        {/* Streak Card */}
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-green-100 rounded-lg">
              <FlameIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <StarIcon className="w-4 h-4 mr-1" />
              <span>Tốt</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Ngày theo dõi</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">15 <span className="text-sm font-normal text-gray-500">ngày</span></h3>
            <p className="text-xs text-gray-500 mt-1">Chuỗi liên tục</p>
          </div>
        </Card>

        {/* Calories Card */}
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-amber-100 rounded-lg">
              <UtensilsIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex items-center text-gray-400 text-sm font-medium">
              <span>Còn 150 kcal</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Calories hôm nay</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">1,850</h3>
            <div className="w-full bg-amber-200 rounded-full h-1.5 mt-2">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Hoạt động 7 ngày qua</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                <span className="text-gray-600">Calories</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Giấc ngủ</span>
              </div>
            </div>
          </div>
          <Card className="p-6">
            <div className="h-64 flex items-end justify-between gap-2">
              {[
                { day: 'T2', cal: 60, sleep: 70 },
                { day: 'T3', cal: 80, sleep: 65 },
                { day: 'T4', cal: 40, sleep: 80 },
                { day: 'T5', cal: 90, sleep: 75 },
                { day: 'T6', cal: 70, sleep: 60 },
                { day: 'T7', cal: 85, sleep: 90 },
                { day: 'CN', cal: 50, sleep: 85 },
              ].map((data, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 gap-2 group relative">
                  <div className="w-full relative h-48 bg-gray-50 rounded-t-lg overflow-hidden flex items-end">
                    {/* Calories Bar */}
                    <div 
                      className="absolute bottom-0 w-full bg-teal-500/80 rounded-t-md transition-all duration-500 group-hover:bg-teal-500" 
                      style={{ height: `${data.cal}%` }}
                    ></div>
                    {/* Sleep Dot/Line representation */}
                    <div 
                      className="absolute w-3 h-3 bg-blue-500 rounded-full left-1/2 -translate-x-1/2 shadow-sm border-2 border-white z-10"
                      style={{ bottom: `${data.sleep}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-500">{data.day}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <Link href="/dashboard/sleep-tracker" className="block group">
              <Card className="p-4 border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-colors flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                  <MoonIcon className="w-5 h-5" />
                </div>
                <span className="font-medium text-blue-900 text-sm">Ghi nhật ký giấc ngủ</span>
              </Card>
            </Link>
            <Link href="/dashboard/meal-plan" className="block group">
              <Card className="p-4 border-teal-100 bg-teal-50/50 hover:bg-teal-50 transition-colors flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg text-teal-600 group-hover:scale-110 transition-transform">
                  <UtensilsIcon className="w-5 h-5" />
                </div>
                <span className="font-medium text-teal-900 text-sm">Xem thực đơn hôm nay</span>
              </Card>
            </Link>
            <Link href="/quiz" className="block group">
              <Card className="p-4 border-purple-100 bg-purple-50/50 hover:bg-purple-50 transition-colors flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:scale-110 transition-transform">
                  <ClipboardIcon className="w-5 h-5" />
                </div>
                <span className="font-medium text-purple-900 text-sm">Làm bài đánh giá mới</span>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {[
                { text: 'Đã hoàn thành bữa sáng', time: '2 giờ trước', color: 'bg-teal-500' },
                { text: 'Ghi nhận giấc ngủ: 7.5 giờ', time: '8 giờ trước', color: 'bg-blue-500' },
                { text: 'Cập nhật cân nặng: 65kg', time: '1 ngày trước', color: 'bg-indigo-500' },
                { text: 'Hoàn thành 80% thực đơn ngày', time: '1 ngày trước', color: 'bg-green-500' },
                { text: 'Đạt mục tiêu calories', time: '2 ngày trước', color: 'bg-amber-500' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${item.color}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.text}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
              <button className="text-sm text-teal-600 font-medium hover:text-teal-700">Xem tất cả</button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Icons
function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  );
}
function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  );
}
function FlameIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
  );
}
function UtensilsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
  );
}
function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
  );
}
function ArrowDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
  );
}
function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  );
}
function ClipboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
  );
}
