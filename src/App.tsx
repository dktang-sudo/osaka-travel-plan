import React, { useState } from 'react';
import { ITINERARY_DATA, DayItinerary, ScheduleItem } from './data/itineraryData';
import { Header } from './components/Header';
import { OverviewGrid } from './components/OverviewGrid';
import { DayDetailView } from './components/DayDetailView';
import { RouteMapModal } from './components/RouteMapModal';
import { TipsAndChecklist } from './components/TipsAndChecklist';
import { Heart, Compass, MapPin } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'day1' | 'day2' | 'day3' | 'day4' | 'day5' | 'day6' | 'checklist'
  >('overview');

  // Modal map state
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedMapItem, setSelectedMapItem] = useState<ScheduleItem | null>(null);
  const [selectedMapDay, setSelectedMapDay] = useState<DayItinerary | null>(null);

  const handleOpenItemMap = (item: ScheduleItem, dayTitle: string) => {
    setSelectedMapItem(item);
    setSelectedMapDay(null);
    setModalTitle(`${dayTitle} - ${item.title}`);
    setIsMapModalOpen(true);
  };

  const handleOpenDayMap = (day: DayItinerary) => {
    setSelectedMapItem(null);
    setSelectedMapDay(day);
    setModalTitle(`${day.dateStr} (${day.dayOfWeek}) ${day.title} 전체 동선`);
    setIsMapModalOpen(true);
  };

  const handleCloseMapModal = () => {
    setIsMapModalOpen(false);
    setSelectedMapItem(null);
    setSelectedMapDay(null);
  };

  const currentDayIndex = activeTab.startsWith('day')
    ? parseInt(activeTab.replace('day', ''), 10) - 1
    : 0;

  const currentDay = ITINERARY_DATA[currentDayIndex] || ITINERARY_DATA[0];

  const handlePrevDay = () => {
    if (currentDayIndex > 0) {
      setActiveTab(`day${currentDayIndex}` as any);
    }
  };

  const handleNextDay = () => {
    if (currentDayIndex < ITINERARY_DATA.length - 1) {
      setActiveTab(`day${currentDayIndex + 2}` as any);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Header Component */}
        <Header activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content Area */}
        <main className="transition-all duration-300">
          {activeTab === 'overview' && (
            <OverviewGrid
              onSelectDay={(dayId) => setActiveTab(dayId as any)}
              onOpenMapModal={handleOpenDayMap}
            />
          )}

          {activeTab.startsWith('day') && (
            <DayDetailView
              day={currentDay}
              onPrevDay={handlePrevDay}
              onNextDay={handleNextDay}
              onOpenItemMap={handleOpenItemMap}
              onOpenDayMap={handleOpenDayMap}
            />
          )}

          {activeTab === 'checklist' && <TipsAndChecklist />}
        </main>

        {/* Global Footer */}
        <footer className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-slate-400 space-y-2">
          <p className="flex items-center justify-center gap-1 font-medium text-slate-300">
            <span>Osaka 5 Nights 6 Days Itinerary (10/4 ~ 10/9)</span>
            <Heart size={14} className="text-rose-500 fill-rose-500" />
          </p>
          <p className="text-slate-500">
            시간대별 동선 $\cdot$ 구글 지도 $\cdot$ 꿀팁 & 주의사항 완벽 내비게이션
          </p>
        </footer>
      </div>

      {/* Global Interactive Route & Google Maps Modal */}
      <RouteMapModal
        isOpen={isMapModalOpen}
        onClose={handleCloseMapModal}
        title={modalTitle}
        item={selectedMapItem}
        day={selectedMapDay}
      />
    </div>
  );
};
