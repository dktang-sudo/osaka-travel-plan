import React from 'react';
import { ITINERARY_DATA, DayItinerary } from '../data/itineraryData';
import { ChevronRight, MapPin, AlertTriangle, Lightbulb, ArrowRight, Star, Heart } from 'lucide-react';

interface OverviewGridProps {
  onSelectDay: (dayId: string) => void;
  onOpenMapModal: (day: DayItinerary) => void;
}

export const OverviewGrid: React.FC<OverviewGridProps> = ({ onSelectDay, onOpenMapModal }) => {
  // Theme badge background mappings matching original image colors
  const getBadgeStyle = (dayNum: number) => {
    switch (dayNum) {
      case 1: return { bg: 'bg-indigo-500', headerBg: 'bg-indigo-50 text-indigo-950', border: 'border-indigo-900' };
      case 2: return { bg: 'bg-emerald-600', headerBg: 'bg-emerald-50 text-emerald-950', border: 'border-emerald-900' };
      case 3: return { bg: 'bg-blue-600', headerBg: 'bg-blue-50 text-blue-950', border: 'border-blue-900' };
      case 4: return { bg: 'bg-purple-600', headerBg: 'bg-purple-50 text-purple-950', border: 'border-purple-900' };
      case 5: return { bg: 'bg-orange-500', headerBg: 'bg-orange-50 text-orange-950', border: 'border-orange-900' };
      case 6: return { bg: 'bg-teal-600', headerBg: 'bg-teal-50 text-teal-950', border: 'border-teal-900' };
      default: return { bg: 'bg-amber-500', headerBg: 'bg-amber-50 text-amber-950', border: 'border-amber-900' };
    }
  };

  return (
    <div className="space-y-8 font-[var(--font-cute)]">
      {/* Intro Banner Card */}
      <div className="paper-card p-5 sm:p-6 bg-amber-50/80 border-2 border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            🗓️ 6일간의 손그림 여행 카드 한눈에 보기
          </h2>
          <p className="text-sm text-slate-700 mt-1">
            원하는 일자 카드를 선택하거나 [지도 동선] 버튼을 눌러 구글 지도 길찾기를 확인하세요.
          </p>
        </div>
        <button
          onClick={() => onSelectDay('day1')}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold rounded-2xl text-sm transition border-2 border-slate-900 shadow-[3px_3px_0px_#1e293b] flex items-center gap-2 flex-shrink-0"
        >
          1일차부터 출발! <ArrowRight size={16} />
        </button>
      </div>

      {/* Grid Cards (Recreating exact visual style of the user's poster images) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ITINERARY_DATA.map((day) => {
          const style = getBadgeStyle(day.dayNumber);
          const isWarning = day.badge.type === 'warning';

          return (
            <div
              key={day.dayNumber}
              className="paper-card overflow-hidden flex flex-col justify-between group hover:shadow-[7px_7px_0px_#1e293b]"
            >
              <div>
                {/* Poster Top Card Header */}
                <div className={`p-5 ${style.headerBg} border-b-2 border-slate-900 relative`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`${style.bg} text-white font-extrabold text-xs px-3.5 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b]`}>
                      DAY {day.dayNumber}
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {day.dateStr} ({day.dayOfWeek})
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight line-clamp-2 leading-snug">
                    {day.title}
                  </h3>
                </div>

                {/* Poster Card Body */}
                <div className="p-5 space-y-4 bg-white">
                  {/* Highlight Badge */}
                  <div className={`text-xs px-3 py-2 rounded-xl flex items-center gap-2 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] ${
                    isWarning
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-amber-100 text-amber-950'
                  }`}>
                    {isWarning ? <AlertTriangle size={15} className="text-emerald-700 flex-shrink-0" /> : <Star size={15} className="text-amber-600 flex-shrink-0" />}
                    <span>{day.badge.text}</span>
                  </div>

                  {/* Schedule Timeline List */}
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      ⏰ 주요 일정 & 코스
                    </div>
                    <ul className="space-y-2">
                      {day.schedule.slice(0, 5).map((item) => (
                        <li key={item.id} className="text-xs text-slate-800 flex items-start gap-2">
                          <span className="font-mono font-bold text-indigo-700 min-w-[70px] flex-shrink-0">
                            {item.time}
                          </span>
                          <span className="line-clamp-1 flex-1 text-slate-900 font-medium">
                            {item.title}
                          </span>
                        </li>
                      ))}
                      {day.schedule.length > 5 && (
                        <li className="text-xs text-slate-500 italic pl-16">
                          + 외 {day.schedule.length - 5}개 일정...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Poster Bottom Slogan Box (e.g. "오늘 은 신나게 놀자! ⭐") */}
                  <div className="bg-amber-100/80 border-2 border-slate-900 rounded-xl p-2.5 text-center text-xs font-bold text-slate-900">
                    {day.tagline}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50 border-t-2 border-slate-900 flex items-center gap-2">
                <button
                  onClick={() => onSelectDay(`day${day.dayNumber}`)}
                  className="flex-1 py-2.5 px-3 bg-amber-300 hover:bg-amber-400 text-slate-900 font-extrabold rounded-xl text-xs transition border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] flex items-center justify-center gap-1"
                >
                  상세 시간표 보기 <ChevronRight size={15} />
                </button>
                <button
                  onClick={() => onOpenMapModal(day)}
                  className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-900 font-extrabold rounded-xl text-xs transition border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] flex items-center gap-1"
                  title="구글 지도 동선 보기"
                >
                  <MapPin size={15} className="text-rose-500" />
                  <span>지도 동선</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
