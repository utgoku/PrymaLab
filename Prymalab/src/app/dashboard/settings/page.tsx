'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { TargetGoal, UserProfile } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const { user, profile, updateProfile, isLoading } = useAuth();
  if (isLoading || !user || !profile) return <p className="p-6 text-gray-500">Đang tải thông tin tài khoản…</p>;
  return <SettingsForm key={user.id} profile={profile} email={user.email} updateProfile={updateProfile} />;
}

function SettingsForm({ profile, email, updateProfile }: {
  profile: UserProfile;
  email: string;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}) {
  const [formData, setFormData] = useState(() => ({
    fullName: profile.fullName || '',
    email,
    age: profile.age ? profile.age.toString() : '',
    gender: profile.gender?.toLowerCase() || 'other',
    weight: profile.weightKg ? profile.weightKg.toString() : '',
    height: profile.heightCm ? profile.heightCm.toString() : '',
    targetGoal: profile.targetGoal || TargetGoal.WEIGHT_MAINTAIN,
  }));
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
  };

  const handleGoalSelect = (goal: TargetGoal) => {
    setFormData((prev) => ({ ...prev, targetGoal: goal }));
    setSaveSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const genderMap: Record<string, 'MALE' | 'FEMALE' | 'OTHER'> = {
        male: 'MALE', female: 'FEMALE', other: 'OTHER',
        MALE: 'MALE', FEMALE: 'FEMALE', OTHER: 'OTHER',
      };
      const updatedProfile: Partial<UserProfile> = {
        fullName: formData.fullName,
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        gender: genderMap[formData.gender] || 'OTHER',
        weightKg: formData.weight ? parseFloat(formData.weight) : undefined,
        heightCm: formData.height ? parseFloat(formData.height) : undefined,
        targetGoal: formData.targetGoal,
      };
      
      await updateProfile(updatedProfile);
      setSaveSuccess(true);
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Lỗi khi lưu cài đặt", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-serif">Cài đặt tài khoản</h2>
        <p className="text-gray-500 mt-1">Cập nhật thông tin cá nhân và mục tiêu sức khỏe của bạn.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cá nhân */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">Thông tin cá nhân</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow"
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">Email không thể thay đổi</p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Tuổi</label>
              <input
                type="number"
                id="age"
                name="age"
                min="10"
                max="120"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow"
                placeholder="Ví dụ: 25"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Giới tính</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow bg-white"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Cân nặng (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                min="20"
                max="300"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow"
                placeholder="Ví dụ: 65.5"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">Chiều cao (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                min="100"
                max="250"
                value={formData.height}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow"
                placeholder="Ví dụ: 170"
              />
            </div>
          </div>
        </Card>

        {/* Mục tiêu sức khỏe */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">Mục tiêu sức khỏe</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: TargetGoal.WEIGHT_MAINTAIN, label: 'Duy trì vóc dáng', desc: 'Giữ mức cân nặng hiện tại, ăn uống lành mạnh' },
              { id: TargetGoal.FAT_LOSS, label: 'Giảm cân', desc: 'Đốt cháy calories, giảm mỡ an toàn' },
              { id: TargetGoal.MUSCLE_GAIN, label: 'Tăng cân', desc: 'Tăng cơ, bổ sung năng lượng dinh dưỡng' },
              { id: TargetGoal.SLEEP_RECOVERY, label: 'Cải thiện giấc ngủ', desc: 'Ngủ sâu hơn, thức dậy sảng khoái' },
            ].map((goal) => (
              <div
                key={goal.id}
                onClick={() => handleGoalSelect(goal.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.targetGoal === goal.id
                    ? 'border-teal-500 bg-teal-50/50 shadow-sm'
                    : 'border-gray-200 hover:border-teal-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.targetGoal === goal.id ? 'border-teal-500' : 'border-gray-300'
                  }`}>
                    {formData.targetGoal === goal.id && <div className="w-2.5 h-2.5 bg-teal-500 rounded-full" />}
                  </div>
                  <div>
                    <h4 className={`font-medium ${formData.targetGoal === goal.id ? 'text-teal-900' : 'text-gray-900'}`}>
                      {goal.label}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{goal.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          {saveSuccess && (
            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <CheckIcon className="w-4 h-4" />
              Đã lưu thành công
            </span>
          )}
          <Button 
            type="submit" 
            disabled={isSaving}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <SpinnerIcon className="w-4 h-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Icons
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  );
}
function SpinnerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  );
}
