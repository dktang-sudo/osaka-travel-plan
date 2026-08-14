import React, { useState } from 'react';
import { DayItinerary, ScheduleItem } from '../data/itineraryData';
import {
  Clock, MapPin, Navigation, Lightbulb, AlertTriangle, ChevronLeft, ChevronRight,
  Plane, Train, Hotel, Utensils, Ship, Fish, Bug, Bed, Ticket, Sparkles, Home,
  LogOut, Briefcase, Castle, Gamepad2, Swords, Sun, ShoppingBag, Landmark,
  Store, PackageCheck, Footprints, PlaneTakeoff, ExternalLink, CheckCircle2, Star
} from 'lucide-react';

interface DayDetailViewProps {
  day: DayItinerary;
  onPrevDay: () => void;
  onNextDay: () => void;
  onOpenItemMap: (item: ScheduleItem, dayTitle: string) => void;
  onOpenDayMap: (day: DayItinerary) => void;
}

export const DayDetailView: React.FC<DayDetailViewProps> = ({
  day,
  onPrevDay,
  onNextDay,
  onOpenItemMap,
  onOpenDayMap,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const renderIcon = (iconName: string) => {
    const props = { size: 18, className: "flex-shrink-0 text-slate-900" };
    switch (iconName) {
      case 'Plane': return <Plane {...props} />;
      case 'Train': return <Train {...props} />;
      case 'Hotel': return <Hotel {...props} />;
      case 'Utensils': return <Utensils {...props} />;
      case 'Ship': return <Ship {...props} />;
      case 'Fish': return <Fish {...props} />;
      case 'Bug': return <Bug {...props} />;
      case 'Bed': return <Bed {...props} />;
      case 'Ticket': return <Ticket {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Home': return <Home {...props} />;
      case 'LogOut': return <LogOut {...props} />;
      case 'Subway': return <Train {...props} />;
      case 'Briefcase': return <Briefcase {...props} />;
      case 'Castle': return <Castle {...props} />;
      case 'Gamepad2': return <Gamepad2 {...props} />;
      case 'Swords': return <Swords {...props} />;
      case 'Sun': return <Sun {...props} />;
      case 'ShoppingBag': return <ShoppingBag {...props} />;
      case 'Tower': return <Landmark {...props} />;
      case 'Store': return <Store {...props} />;
      case 'PackageCheck': return <PackageCheck {...props} />;
      case 'Footprints': return <Footprints {...props} />;
      case 'PlaneTakeoff': return <PlaneTakeoff {...props} />;
      default: return <MapPin {...props} />;
    }
  };

  const getCategoryBadge = (category: ScheduleItem['category']) => {
    switch (category) {
      case 'transport':
        return <span className="bg-blue-100 text-blue-900 border-2 border-slate-900 text-xs px-2.5 py-0.5 rounded-full font-bold">이동/교통</span>;
      case 'sightseeing':
        return <span className="bg-purple-100 text-purple-900 border-2 border-slate-900 text-xs px-2.5 py-0.5 rounded-full font-bold">관광/명소</span>;
      case 'food':
        return <span className="bg-emerald-100 text-emerald-900 border-2 border-slate-900 text-xs px-2.5 py-0.5 rounded-full font-bold">식사/맛집</span>;
      case 'shopping':
        return <span className="bg-pink-100 text-pink-900 border-2 border-slate-900 text-xs px-2.5 py-0.5 rounded-full font-bold">쇼핑/굿즈</span>;
      case 'theme_park':
        return <span className="bg-amber-100 text-amber-900 border-2 border-slate-900 text-xs px-2.5 py-0.5 rounded-full font-bold">테마파크</span>;
      case 'hotel':
        return <span className="bg-slate-200 text-slate-900 border-2 border-slate-900 text-xs px-2.5 py-0.5 rounded-full font-bold">숙소/체크인</span>;
    }
  };

  const filteredSchedule = selectedCategory === 'all'
    ? day.schedule
    : day.schedule.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6 font-[var(--font-cute)]">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-4 paper-card p-4">
        <button
          onClick={onPrevDay}
          className="flex items-center gap-1 text-sm font-extrabold text-slate-900 bg-white hover:bg-amber-100 px-3.5 py-2 rounded-2xl transition border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b]"
        >
          <ChevronLeft size={18} /> 이전 일자
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
            DAY {day.dayNumber} $\cdot$ {day.dateStr} ({day.dayOfWeek})
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            {day.title}
          </h2>
        </div>

        <button
          onClick={onNextDay}
          className="flex items-center gap-1 text-sm font-extrabold text-slate-900 bg-white hover:bg-amber-100 px-3.5 py-2 rounded-2xl transition border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b]"
        >
          다음 일자 <ChevronRight size={18} />
        </button>
      </div>

      {/* Main Poster Day Banner */}
      <div className="paper-panel p-6 sm:p-8 washi-tape bg-amber-50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-slate-900 text-white font-extrabold text-xs px-3.5 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b]">
                DAY {day.dayNumber}
              </span>
              <span className="bg-white text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b]">
                {day.dateStr} ({day.dayOfWeek})
              </span>
              <span className="bg-amber-300 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b]">
                {day.badge.text}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              {day.title}
            </h1>
            <p className="text-base font-extrabold text-slate-800 bg-white px-3 py-1.5 rounded-xl border-2 border-slate-900 inline-block shadow-[2px_2px_0px_#1e293b]">
              {day.tagline}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onOpenDayMap(day)}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold rounded-2xl text-sm transition flex items-center justify-center gap-2 border-2 border-slate-900 shadow-[3px_3px_0px_#1e293b]"
            >
              <Navigation size={18} className="text-slate-900" />
              <span>전체 동선 구글 지도 보기</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mr-2 flex-shrink-0">카테고리 필터:</span>
        {[
          { id: 'all', label: '전체 보기' },
          { id: 'sightseeing', label: '관광/명소' },
          { id: 'food', label: '식사/맛집' },
          { id: 'shopping', label: '쇼핑/굿즈' },
          { id: 'transport', label: '교통/이동' },
          { id: 'theme_park', label: '테마파크' },
          { id: 'hotel', label: '숙소' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex-shrink-0 border-2 border-slate-900 ${
              selectedCategory === cat.id
                ? 'bg-amber-300 text-slate-900 shadow-[2px_2px_0px_#1e293b]'
                : 'bg-white text-slate-700 hover:bg-amber-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Timeline Schedule Items */}
      <div className="timeline-container-cute space-y-6 relative pl-4 sm:pl-6">
        {filteredSchedule.map((item) => (
          <div
            key={item.id}
            className="paper-card p-5 sm:p-6 relative group border-2 border-slate-900 hover:shadow-[6px_6px_0px_#1e293b] transition-all"
          >
            {/* Timeline Dot Icon */}
            <div className="absolute -left-[1.85rem] sm:-left-[2.35rem] top-6 w-8 h-8 rounded-full bg-amber-300 border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#1e293b] z-10">
              {renderIcon(item.icon)}
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-extrabold text-slate-900 bg-amber-200 px-3 py-0.5 rounded-lg border-2 border-slate-900 shadow-[1px_1px_0px_#1e293b] flex items-center gap-1">
                    <Clock size={13} /> {item.time}
                  </span>
                  {getCategoryBadge(item.category)}
                  {item.location && (
                    <span className="text-xs text-slate-700 font-bold flex items-center gap-1">
                      <MapPin size={13} className="text-rose-500" /> {item.location}
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {item.description}
                </p>

                {/* Recommendations (💡 꿀팁/추천 Sticky Note) */}
                {item.recommendations && item.recommendations.length > 0 && (
                  <div className="bg-indigo-50 border-2 border-slate-900 rounded-2xl p-3.5 text-xs shadow-[2px_2px_0px_#1e293b] space-y-1.5">
                    <div className="font-extrabold text-indigo-900 flex items-center gap-1.5">
                      <Lightbulb size={15} className="text-amber-500" />
                      <span>💡 꿀팁 & 추천사항:</span>
                    </div>
                    <ul className="space-y-1 pl-4 list-disc text-slate-800 font-medium">
                      {item.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Precautions (⚠️ 주의사항 Sticky Note) */}
                {item.precautions && item.precautions.length > 0 && (
                  <div className="bg-rose-50 border-2 border-slate-900 rounded-2xl p-3.5 text-xs shadow-[2px_2px_0px_#1e293b] space-y-1.5">
                    <div className="font-extrabold text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle size={15} className="text-rose-600" />
                      <span>⚠️ 주의사항:</span>
                    </div>
                    <ul className="space-y-1 pl-4 list-disc text-slate-800 font-medium">
                      {item.precautions.map((pre, idx) => (
                        <li key={idx}>{pre}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Map Action Buttons */}
              <div className="flex md:flex-col items-center gap-2 pt-2 md:pt-0">
                <button
                  onClick={() => onOpenItemMap(item, day.title)}
                  className="w-full md:w-auto px-4 py-2.5 bg-amber-300 hover:bg-amber-400 text-slate-900 border-2 border-slate-900 rounded-xl text-xs font-extrabold transition shadow-[2px_2px_0px_#1e293b] flex items-center justify-center gap-1.5"
                >
                  <MapPin size={14} className="text-slate-900" />
                  <span>지도 동선 보기</span>
                </button>

                {item.googleMapsUrl && (
                  <a
                    href={item.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto px-3 py-2.5 bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-[2px_2px_0px_#1e293b]"
                  >
                    <ExternalLink size={13} />
                    <span>구글맵 앱</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* General Day Tips */}
      <div className="paper-card p-6 bg-emerald-50 border-2 border-slate-900 shadow-[4px_4px_0px_#1e293b]">
        <h3 className="text-base font-extrabold text-emerald-950 flex items-center gap-2 mb-3">
          <Star size={18} className="text-emerald-700" /> {day.dateStr} ({day.dayOfWeek}) 요약 가이드 & 꿀팁
        </h3>
        <ul className="space-y-2 text-sm text-slate-800 font-medium">
          {day.generalTips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
