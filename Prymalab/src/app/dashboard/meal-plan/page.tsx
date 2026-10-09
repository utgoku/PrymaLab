'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ChevronLeft, ChevronRight, Sunrise, Sun, Moon, Cookie, Check, CalendarOff } from 'lucide-react';
import { useHydrated } from '@/lib/use-hydrated';

// Mock Data Definitions
type MockMealItem = {
  id: string;
  name: string;
  calories: number;
  macros: { protein: number; carbs: number; fat: number };
  isHTSuggest?: boolean;
};

type MockMealSection = {
  title: string;
  type: string;
  icon: React.ReactNode;
  bgClass: string;
  items: MockMealItem[];
};

const DEMO_MEALS: MockMealSection[] = [
  {
    title: 'Bữa Sáng',
    type: 'breakfast',
    icon: <Sunrise className="w-5 h-5 text-teal-600" />,
    bgClass: 'bg-teal-50',
    items: [
      { id: 'b1', name: 'Yến mạch với trái cây', calories: 350, macros: { protein: 10, carbs: 60, fat: 8 } },
      { id: 'b2', name: 'Trứng luộc x2', calories: 140, macros: { protein: 12, carbs: 1, fat: 10 } },
      { id: 'b3', name: 'Sinh tố chuối protein', calories: 280, macros: { protein: 25, carbs: 35, fat: 4 } },
    ],
  },
  {
    title: 'Bữa Trưa',
    type: 'lunch',
    icon: <Sun className="w-5 h-5 text-amber-600" />,
    bgClass: 'bg-amber-50',
    items: [
      { id: 'l1', name: 'Cơm gạo lứt', calories: 200, macros: { protein: 4, carbs: 40, fat: 2 } },
      { id: 'l2', name: 'Ức gà áp chảo', calories: 250, macros: { protein: 45, carbs: 0, fat: 5 } },
      { id: 'l3', name: 'Salad rau trộn', calories: 120, macros: { protein: 3, carbs: 10, fat: 8 } },
    ],
  },
  {
    title: 'Bữa Tối',
    type: 'dinner',
    icon: <Moon className="w-5 h-5 text-blue-600" />,
    bgClass: 'bg-blue-50',
    items: [
      { id: 'd1', name: 'Cá hồi nướng', calories: 380, macros: { protein: 35, carbs: 0, fat: 22 } },
      { id: 'd2', name: 'Rau luộc hỗn hợp', calories: 80, macros: { protein: 4, carbs: 12, fat: 0 } },
      { id: 'd3', name: 'Soup bí đỏ', calories: 150, macros: { protein: 2, carbs: 20, fat: 6 } },
    ],
  },
  {
    title: 'Bữa Phụ',
    type: 'snack',
    icon: <Cookie className="w-5 h-5 text-green-600" />,
    bgClass: 'bg-green-50',
    items: [
      { id: 's1', name: 'Granola bar Pryma', calories: 180, macros: { protein: 6, carbs: 22, fat: 8 }, isHTSuggest: true },
      { id: 's2', name: 'Sữa chua Hy Lạp', calories: 120, macros: { protein: 12, carbs: 6, fat: 4 } },
    ],
  },
];

const TARGETS = {
  calories: 2100,
  protein: 150,
  carbs: 250,
  fat: 70,
};

// Helpers
const getDayName = (date: Date) => {
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return days[date.getDay()];
};

const formatDateVietnamese = (date: Date) => {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = days[date.getDay()];
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dayName}, ngày ${dd} tháng ${mm} năm ${yyyy}`;
};

const DonutChart = ({ current, target }: { current: number; target: number }) => {
  const percentage = Math.min(100, Math.max(0, (current / target) * 100));
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="currentColor"
          strokeWidth="14"
          fill="transparent"
          className="text-gray-100"
        />
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="14"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold text-gray-900 tracking-tight">{current.toLocaleString()}</span>
        <span className="text-sm font-medium text-gray-500">/ {target.toLocaleString()} kcal</span>
      </div>
    </div>
  );
};

export default function MealPlanPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const isClient = useHydrated();

  const weekDates = useMemo(() => {
    const dates = [];
    const curr = new Date(currentDate);
    // Adjust to Monday of the week
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1); 
    curr.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(curr);
      date.setDate(curr.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentDate]);

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const toggleItem = (id: string) => {
    const next = new Set(checkedItems);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCheckedItems(next);
  };

  // Calculate totals
  const currentTotals = useMemo(() => {
    let calories = 0, protein = 0, carbs = 0, fat = 0;
    DEMO_MEALS.forEach(section => {
      section.items.forEach(item => {
        if (checkedItems.has(item.id)) {
          calories += item.calories;
          protein += item.macros.protein;
          carbs += item.macros.carbs;
          fat += item.macros.fat;
        }
      });
    });
    return { calories, protein, carbs, fat };
  }, [checkedItems]);

  const percentageComplete = Math.round((currentTotals.calories / TARGETS.calories) * 100);
  const today = new Date();
  const isFutureWeek = selectedDate > new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay() || 7));

  if (!isClient) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto pb-24 lg:pb-8">
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Thực Đơn Của Bạn</h1>
          <p className="text-gray-500 font-medium">{formatDateVietnamese(selectedDate)}</p>
        </div>

        {/* Weekly Navigation */}
        <Card className="p-4 bg-white/60 backdrop-blur-md border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={handlePrevWeek} className="text-gray-500 hover:text-teal-600">
              <ChevronLeft className="w-5 h-5 mr-1" /> Tuần trước
            </Button>
            <span className="font-semibold text-gray-700">
              Tháng {selectedDate.getMonth() + 1}, {selectedDate.getFullYear()}
            </span>
            <Button variant="ghost" size="sm" onClick={handleNextWeek} className="text-gray-500 hover:text-teal-600">
              Tuần sau <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>

          <div className="flex justify-between items-center gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {weekDates.map((date, idx) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center justify-center min-w-[3rem] sm:min-w-[4rem] py-3 rounded-2xl transition-all ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-105'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <span className={`text-xs mb-1 ${isSelected ? 'text-teal-50' : 'text-gray-400'}`}>
                    {getDayName(date)}
                  </span>
                  <span className="text-lg font-bold">{date.getDate()}</span>
                  {isToday && (
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isSelected ? 'bg-white' : 'bg-teal-500'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Meal Plan List */}
        {!isFutureWeek ? (
          <div className="flex flex-col gap-4">
            {DEMO_MEALS.map((section, idx) => (
              <Card key={idx} className="overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className={`${section.bgClass} px-5 py-4 border-b border-gray-100/50 flex items-center gap-3`}>
                  <div className="p-2 bg-white/80 rounded-xl shadow-sm backdrop-blur-sm">
                    {section.icon}
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">{section.title}</h3>
                </div>
                <div className="p-2 sm:p-4 flex flex-col gap-2">
                  {section.items.map((item) => {
                    const isChecked = checkedItems.has(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border border-transparent ${
                          isChecked ? 'bg-gray-50/50 opacity-60' : 'hover:bg-gray-50 hover:border-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                              isChecked
                                ? 'bg-teal-500 border-teal-500 text-white'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${isChecked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {item.name}
                              </span>
                              {item.isHTSuggest && (
                                <Badge variant="primary" className="bg-teal-50 text-teal-700 border-teal-200 text-[10px] px-1.5 py-0 leading-tight">
                                  Pryma Gợi ý
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-gray-400 mt-0.5 block">
                              {item.macros.protein}g P • {item.macros.carbs}g C • {item.macros.fat}g F
                            </span>
                          </div>
                        </div>
                        <div className="text-right whitespace-nowrap pl-2">
                          <Badge variant="secondary" className={`${isChecked ? 'bg-gray-100 text-gray-500' : 'bg-white shadow-sm border border-gray-100 text-gray-700'}`}>
                            {item.calories} kcal
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center py-16 px-6 text-center border-dashed border-2 border-gray-200 bg-gray-50/50">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CalendarOff className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Chưa có thực đơn</h3>
            <p className="text-gray-500 max-w-sm">Thực đơn cho tuần này sẽ được chuyên gia PrymaLab cập nhật vào đầu tuần nhé.</p>
          </Card>
        )}
      </div>

      {/* Summary Sidebar / Bottom Panel */}
      <div className="w-full lg:w-80 shrink-0 fixed bottom-0 left-0 right-0 z-20 lg:static lg:z-auto bg-white lg:bg-transparent border-t lg:border-none border-gray-200 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] lg:shadow-none p-4 lg:p-0">
        <Card className="lg:sticky lg:top-6 lg:border lg:border-gray-100 lg:shadow-sm overflow-hidden hidden lg:block">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 text-center text-white">
            <h3 className="font-semibold text-lg mb-1">Mục Tiêu Dinh Dưỡng</h3>
            <p className="text-teal-50 text-sm opacity-90">Theo dõi lượng calo hôm nay</p>
          </div>
          
          <div className="p-6 bg-white">
            <DonutChart current={currentTotals.calories} target={TARGETS.calories} />
            <p className="text-center font-medium text-gray-700 mt-4 mb-6">
              Đã hoàn thành <span className="text-teal-600 font-bold">{percentageComplete}%</span> thực đơn
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-600">Protein</span>
                  <span className="text-gray-500">{currentTotals.protein}g / {TARGETS.protein}g</span>
                </div>
                <ProgressBar value={(currentTotals.protein / TARGETS.protein) * 100} variant="primary" size="sm" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-600">Carbs</span>
                  <span className="text-gray-500">{currentTotals.carbs}g / {TARGETS.carbs}g</span>
                </div>
                <ProgressBar value={(currentTotals.carbs / TARGETS.carbs) * 100} variant="gradient" size="sm" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-600">Fat</span>
                  <span className="text-gray-500">{currentTotals.fat}g / {TARGETS.fat}g</span>
                </div>
                <ProgressBar value={(currentTotals.fat / TARGETS.fat) * 100} variant="secondary" size="sm" />
              </div>
            </div>
          </div>
        </Card>

        {/* Mobile Summary Mini Bar */}
        <div className="lg:hidden flex items-center justify-between max-w-7xl mx-auto w-full">
           <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Calo hôm nay</span>
              <span className="text-lg font-bold text-gray-900">{currentTotals.calories} <span className="text-sm font-normal text-gray-500">/ {TARGETS.calories} kcal</span></span>
           </div>
           <div className="w-1/2 flex items-center justify-end gap-3">
              <div className="w-full">
                <ProgressBar value={percentageComplete} variant="primary" size="sm" />
              </div>
              <span className="text-sm font-bold text-teal-600">{percentageComplete}%</span>
           </div>
        </div>
      </div>
    </div>
  );
}
