import React from 'react';
import { ITINERARY_DATA, DayItinerary, TRIP_INFO } from '../data/itineraryData';
import { ChevronRight, MapPin, AlertTriangle, ArrowRight, Star, Plane, Hotel, CheckCircle, Heart, Sparkles, Building2 } from 'lucide-react';

interface OverviewGridProps {
  onSelectDay: (dayId: string) => void;
  onOpenMapModal: (day: DayItinerary) => void;
}

export const OverviewGrid: React.FC<OverviewGridProps> = ({ onSelectDay, onOpenMapModal }) => {
  // Theme badge background mappings matching original image colors
  const getBadgeStyle = (dayNum: number) => {
    switch (dayNum) {
      case 1: return { bg: 'bg-rose-500', headerBg: 'bg-rose-50 text-rose-950', border: 'border-rose-900' };
      case 2: return { bg: 'bg-amber-500', headerBg: 'bg-amber-50 text-amber-950', border: 'border-amber-900' };
      case 3: return { bg: 'bg-blue-600', headerBg: 'bg-blue-50 text-blue-950', border: 'border-blue-900' };
      case 4: return { bg: 'bg-emerald-600', headerBg: 'bg-emerald-50 text-emerald-950', border: 'border-emerald-900' };
      case 5: return { bg: 'bg-indigo-600', headerBg: 'bg-indigo-50 text-indigo-950', border: 'border-indigo-900' };
      case 6: return { bg: 'bg-pink-600', headerBg: 'bg-pink-50 text-pink-950', border: 'border-pink-900' };
      default: return { bg: 'bg-amber-500', headerBg: 'bg-amber-50 text-amber-950', border: 'border-amber-900' };
    }
  };

  return (
    <div className="space-y-8 font-[var(--font-cute)]">
      {/* Top Main Overview Card */}
      <div className="paper-card p-5 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-slate-900 shadow-[4px_4px_0px_#1e293b]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-rose-500 text-white font-extrabold text-xs px-3 py-1 rounded-full border border-slate-900 shadow-[1px_1px_0px_#1e293b] flex items-center gap-1">
                <Heart size={12} className="fill-white" /> {TRIP_INFO.members}
              </span>
              <span className="text-xs font-extrabold text-slate-700 bg-white px-2.5 py-1 rounded-full border border-slate-900">
                {TRIP_INFO.dates}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {TRIP_INFO.title} - {TRIP_INFO.subtitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              더 싱귤러리 호텔(3박) ➔ 사쿠라가와 호텔 난바(2박)와 함께하는 완벽한 오사카 일정표입니다.
            </p>
          </div>
          <button
            onClick={() => onSelectDay('day1')}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black rounded-2xl text-xs sm:text-sm transition border-2 border-slate-900 shadow-[3px_3px_0px_#1e293b] flex items-center gap-2 flex-shrink-0 active:scale-95"
          >
            1일차부터 시작하기 <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 6 Days Grid Cards (Exact Layout from Image) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ITINERARY_DATA.map((day) => {
          const style = getBadgeStyle(day.dayNumber);
          const isWarning = day.badge.type === 'warning';

          return (
            <div
              key={day.dayNumber}
              className="paper-card overflow-hidden flex flex-col justify-between group hover:shadow-[7px_7px_0px_#1e293b] border-2 border-slate-900 bg-white"
            >
              <div>
                {/* Poster Top Card Header */}
                <div className={`p-5 ${style.headerBg} border-b-2 border-slate-900 relative`}>
                  <div className="flex items-center justify-between mb-2.5">
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
                    <span className="truncate">{day.badge.text}</span>
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

                  {/* Hotel info badge */}
                  <div className="bg-slate-100 border border-slate-900 rounded-xl p-2 text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Hotel size={13} className="text-indigo-600 flex-shrink-0" />
                    <span className="truncate">숙소: <strong>{day.hotelInfo}</strong></span>
                  </div>

                  {/* Poster Bottom Slogan Box */}
                  <div className="bg-amber-100/80 border-2 border-slate-900 rounded-xl p-2.5 text-center text-xs font-bold text-slate-900">
                    {day.tagline}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50 border-t-2 border-slate-900 flex items-center gap-2">
                <button
                  onClick={() => onSelectDay(`day${day.dayNumber}`)}
                  className="flex-1 py-2.5 px-3 bg-amber-300 hover:bg-amber-400 text-slate-900 font-extrabold rounded-xl text-xs transition border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] flex items-center justify-center gap-1 active:scale-95"
                >
                  상세 시간표 보기 <ChevronRight size={15} />
                </button>
                <button
                  onClick={() => onOpenMapModal(day)}
                  className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-900 font-extrabold rounded-xl text-xs transition border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] flex items-center gap-1 active:scale-95"
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

      {/* Bottom Summary Panels (Recreating the original image footer summary) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
        {/* Flight & Hotel Card */}
        <div className="paper-card p-4 sm:p-5 bg-white border-2 border-slate-900 shadow-[3px_3px_0px_#1e293b] space-y-3">
          <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm border-b pb-2 border-slate-200">
            <Plane size={18} className="text-indigo-600" />
            <span>✈️ 항공편 & 🏨 숙소</span>
          </div>
          <div className="space-y-2 text-xs text-slate-800">
            <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-200">
              <strong className="text-indigo-950 block mb-1">✈️ 아시아나 항공</strong>
              <p>• 가는 편: 10/4 (일) OZ114 16:40 ➔ 18:30 간사이</p>
              <p>• 오는 편: 10/9 (금) OZ111 10:30 ➔ 12:30 인천</p>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <strong className="text-amber-950 block mb-1">🏨 숙소 2곳</strong>
              <p>• 10/4~10/7 (3박): <strong>더 싱귤러리 호텔</strong> (USJ 앞)</p>
              <p>• 10/7~10/9 (2박): <strong>사쿠라가와 호텔 난바</strong></p>
            </div>
          </div>
        </div>

        {/* Reservations Card */}
        <div className="paper-card p-4 sm:p-5 bg-white border-2 border-slate-900 shadow-[3px_3px_0px_#1e293b] space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm border-b pb-2 border-slate-200">
            <CheckCircle size={18} className="text-emerald-600" />
            <span>✔️ 예약 완료 항목</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-800">
            {TRIP_INFO.reservations.map((res, i) => (
              <li key={i} className="flex items-center gap-1.5 font-medium">
                <span className="text-emerald-600 font-bold">☑</span>
                <span>{res}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Checklist Card */}
        <div className="paper-card p-4 sm:p-5 bg-gradient-to-br from-rose-50 to-amber-50 border-2 border-slate-900 shadow-[3px_3px_0px_#1e293b] space-y-3">
          <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm border-b pb-2 border-slate-200">
            <Sparkles size={18} className="text-rose-600" />
            <span>📋 여행 체크리스트</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-800">
            <li className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className="text-rose-500 font-bold">☑</span> 여권 / 항공권 (E-티켓)
            </li>
            <li className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className="text-rose-500 font-bold">☑</span> 숙소 바우처 2곳
            </li>
            <li className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className="text-rose-500 font-bold">☑</span> 각종 입장권 (QR코드 캡처)
            </li>
            <li className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className="text-rose-500 font-bold">☑</span> eSIM / 교통카드 (ICOCA)
            </li>
            <li className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className="text-rose-500 font-bold">☑</span> 환전 (엔화) / 트래블카드
            </li>
            <li className="flex items-center gap-1.5 font-extrabold text-rose-600 pt-1">
              <Heart size={14} className="fill-rose-500" /> 짐 챙기기 / 즐길 마음! ❤️
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
