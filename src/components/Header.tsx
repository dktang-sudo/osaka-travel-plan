import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Sparkles, Compass, CheckSquare, Clock, Heart } from 'lucide-react';

interface HeaderProps {
  activeTab: 'overview' | 'day1' | 'day2' | 'day3' | 'day4' | 'day5' | 'day6' | 'checklist';
  onTabChange: (tab: 'overview' | 'day1' | 'day2' | 'day3' | 'day4' | 'day5' | 'day6' | 'checklist') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const [dDayStr, setDDayStr] = useState<string>('');

  useEffect(() => {
    const targetDate = new Date('2026-10-04T00:00:00');
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      setDDayStr(`D-${diffDays}`);
    } else if (diffDays === 0) {
      setDDayStr(`D-Day 오늘 출발! 🎉`);
    } else if (diffDays >= -5) {
      setDDayStr(`여행 ${Math.abs(diffDays) + 1}일차 진행 중! ✈️`);
    } else {
      setDDayStr(`오사카 추억 여행 💕`);
    }
  }, []);

  const navItems = [
    { id: 'overview', label: '전체 일정 오버뷰', icon: Compass },
    { id: 'day1', label: 'DAY 1', sub: '10/4 (토)' },
    { id: 'day2', label: 'DAY 2', sub: '10/5 (월)' },
    { id: 'day3', label: 'DAY 3', sub: '10/6 (화)' },
    { id: 'day4', label: 'DAY 4', sub: '10/7 (수)' },
    { id: 'day5', label: 'DAY 5', sub: '10/8 (목)' },
    { id: 'day6', label: 'DAY 6', sub: '10/9 (금)' },
    { id: 'checklist', label: '꿀팁 & 체크리스트', icon: CheckSquare },
  ];

  return (
    <header className="w-full relative mb-6 sm:mb-8">
      {/* Hand-Drawn Paper Banner */}
      <div className="paper-panel p-4 sm:p-6 lg:p-8 washi-tape bg-amber-50/90 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 mb-2.5 font-[var(--font-cute)]">
              <span className="bg-rose-500 text-white font-bold text-[11px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-slate-900 shadow-[2px_2px_0px_#1e293b] flex items-center gap-1">
                <Sparkles size={12} /> Osaka 2026
              </span>
              <span className="bg-amber-300 text-slate-900 font-bold text-[11px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-slate-900 shadow-[2px_2px_0px_#1e293b] flex items-center gap-1">
                <Clock size={12} /> {dDayStr}
              </span>
              <span className="bg-emerald-200 text-slate-900 font-bold text-[11px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-slate-900 shadow-[2px_2px_0px_#1e293b] flex items-center gap-1">
                <Calendar size={12} /> 10/4 (토) ~ 10/9 (금)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-1.5 font-[var(--font-cute)] leading-tight">
              🇯🇵 오사카 5박 6일 <span className="bg-amber-300 px-2 py-0.5 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] inline-block mt-1 sm:mt-0">여행 안내서</span>
            </h1>
            <p className="text-slate-700 text-xs sm:text-sm lg:text-base font-medium max-w-2xl font-[var(--font-cute)]">
              시간표 $\cdot$ 구글 지도 길찾기 $\cdot$ 현지 꿀팁 & 주의사항 모음
            </p>
          </div>

          {/* Quick Info Badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 font-[var(--font-cute)] mt-2 lg:mt-0">
            <div className="bg-white border-2 border-slate-900 rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center shadow-[2px_2px_0px_#1e293b]">
              <div className="text-[10px] sm:text-xs text-slate-500 font-bold">여행 기간</div>
              <div className="text-xs sm:text-base font-extrabold text-indigo-600">5박 6일</div>
            </div>
            <div className="bg-white border-2 border-slate-900 rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center shadow-[2px_2px_0px_#1e293b]">
              <div className="text-[10px] sm:text-xs text-slate-500 font-bold">주요 거점</div>
              <div className="text-xs sm:text-base font-extrabold text-teal-600">유니버설/난바</div>
            </div>
            <div className="bg-white border-2 border-slate-900 rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center shadow-[2px_2px_0px_#1e293b]">
              <div className="text-[10px] sm:text-xs text-slate-500 font-bold">교통 패스</div>
              <div className="text-xs sm:text-base font-extrabold text-rose-600">라피트+캡틴라인</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Smooth Mobile Horizontal Swipe) */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-dashed border-slate-300 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none font-[var(--font-cute)] -mx-1 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as any)}
                className={`flex-shrink-0 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all duration-150 flex items-center gap-1 sm:gap-1.5 border-2 border-slate-900 active:scale-95 ${
                  isActive
                    ? 'bg-amber-400 text-slate-900 shadow-[2px_2px_0px_#1e293b] translate-y-[-1px]'
                    : 'bg-white text-slate-700 hover:bg-amber-100 shadow-[1px_1px_0px_#1e293b]'
                }`}
              >
                {Icon && <Icon size={14} className="sm:w-4 sm:h-4" />}
                <span>{item.label}</span>
                {item.sub && (
                  <span className={`text-[10px] sm:text-[11px] px-1 sm:px-1.5 py-0.5 rounded-md ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {item.sub}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
