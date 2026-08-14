import React from 'react';
import { ScheduleItem, DayItinerary } from '../data/itineraryData';
import { X, MapPin, Navigation, ExternalLink, Lightbulb, AlertTriangle, Copy, Check } from 'lucide-react';

interface RouteMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  item?: ScheduleItem | null;
  day?: DayItinerary | null;
}

export const RouteMapModal: React.FC<RouteMapModalProps> = ({
  isOpen,
  onClose,
  title,
  item,
  day,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  let embedUrl = '';
  let externalUrl = '';
  let locationTitle = title;
  let locationAddress = '';

  if (item) {
    locationTitle = item.title;
    locationAddress = item.location;
    const query = encodeURIComponent(`${item.title} ${item.location} Osaka`);
    embedUrl = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    externalUrl = item.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${query}`;
  } else if (day) {
    locationTitle = `${day.dateStr} (${day.dayOfWeek}) ${day.title} - 전체 동선`;
    embedUrl = day.googleEmbedMapUrl;
    const routeQuery = encodeURIComponent(day.dayRouteQuery);
    externalUrl = `https://www.google.com/maps/dir/?api=1&query=${routeQuery}`;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${locationTitle} - ${locationAddress}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-pop-in font-[var(--font-cute)]">
      <div className="paper-panel w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden bg-amber-50 border-2 border-slate-900 shadow-[6px_6px_0px_#1e293b]">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 bg-white border-b-2 border-slate-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <MapPin size={20} className="text-rose-500 flex-shrink-0" />
            <div className="overflow-hidden">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                {locationTitle}
              </h3>
              {locationAddress && (
                <p className="text-[11px] sm:text-xs font-bold text-slate-600 truncate">
                  {locationAddress}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-amber-100 hover:bg-amber-200 border-2 border-slate-900 text-slate-900 transition shadow-[1px_1px_0px_#1e293b] flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 sm:space-y-5">
          {/* Map Frame Container */}
          <div className="relative w-full h-[250px] sm:h-[380px] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-slate-900 shadow-[3px_3px_0px_#1e293b] bg-slate-100">
            <iframe
              title={locationTitle}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={embedUrl}
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b]">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-2 border-2 border-slate-900 active:scale-95"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? '복사 완료!' : '장소 명칭 복사'}</span>
            </button>

            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-amber-300 hover:bg-amber-400 text-slate-900 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] active:scale-95"
            >
              <Navigation size={15} />
              <span>구글 지도 앱에서 길찾기 열기</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Item Specific Tips */}
          {item && (
            <div className="space-y-3">
              {item.recommendations && item.recommendations.length > 0 && (
                <div className="bg-indigo-50 border-2 border-slate-900 rounded-2xl p-4 text-xs shadow-[3px_3px_0px_#1e293b]">
                  <h4 className="font-extrabold text-indigo-900 flex items-center gap-1.5 mb-2 text-sm">
                    <Lightbulb size={16} className="text-amber-500" /> 💡 꿀팁 & 추천사항
                  </h4>
                  <ul className="space-y-1 pl-4 list-disc text-slate-800 font-medium">
                    {item.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.precautions && item.precautions.length > 0 && (
                <div className="bg-rose-50 border-2 border-slate-900 rounded-2xl p-4 text-xs shadow-[3px_3px_0px_#1e293b]">
                  <h4 className="font-extrabold text-rose-900 flex items-center gap-1.5 mb-2 text-sm">
                    <AlertTriangle size={16} className="text-rose-600" /> ⚠️ 주의사항
                  </h4>
                  <ul className="space-y-1 pl-4 list-disc text-slate-800 font-medium">
                    {item.precautions.map((pre, i) => (
                      <li key={i}>{pre}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
