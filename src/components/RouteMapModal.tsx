import React, { useState, useEffect } from 'react';
import { ScheduleItem, DayItinerary, RouteOption, getItemRoutes } from '../data/itineraryData';
import {
  X,
  Navigation,
  ExternalLink,
  Lightbulb,
  AlertTriangle,
  Copy,
  Check,
  ArrowRight,
  Footprints,
  Train,
  Car,
  Layers,
  WifiOff,
  Wifi,
  Compass,
  Map,
  Languages,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

interface RouteMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  item?: ScheduleItem | null;
  day?: DayItinerary | null;
  selectedRoute?: RouteOption | null;
  routes?: RouteOption[];
  nextItem?: ScheduleItem | null;
}

export const RouteMapModal: React.FC<RouteMapModalProps> = ({
  isOpen,
  onClose,
  title,
  item,
  day,
  selectedRoute,
  routes = [],
  nextItem,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedJapanese, setCopiedJapanese] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [viewMode, setViewMode] = useState<'directions' | 'offline' | 'destination' | 'origin'>('directions');
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);

  // 온라인/오프라인 네트워크 상태 리스너
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setViewMode('offline'); // 오프라인 감지 시 자동 전환
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 사용 가능한 동선 리스트 계산
  const currentRoutes: RouteOption[] = React.useMemo(() => {
    if (routes && routes.length > 0) return routes;
    if (item) return getItemRoutes(item, nextItem);
    return [];
  }, [routes, item, nextItem]);

  // 선택된 루트 인덱스 동기화
  useEffect(() => {
    if (selectedRoute && currentRoutes.length > 0) {
      const idx = currentRoutes.findIndex((r) => r.id === selectedRoute.id);
      setActiveRouteIndex(idx !== -1 ? idx : 0);
    } else {
      setActiveRouteIndex(0);
    }
    // 오프라인 상태이면 기본 offline 뷰, 아니면 directions 뷰
    setViewMode(navigator.onLine ? 'directions' : 'offline');
  }, [selectedRoute, currentRoutes, isOpen]);

  if (!isOpen) return null;

  const currentRoute = currentRoutes[activeRouteIndex] || currentRoutes[0];

  let embedUrl = '';
  let externalUrl = '';
  let locationTitle = title;
  let originLabel = '';
  let destLabel = '';

  if (day) {
    // 전체 일차 동선 보기
    locationTitle = `${day.dateStr} (${day.dayOfWeek}) ${day.title} - 전체 동선`;
    embedUrl = day.googleEmbedMapUrl;
    const routeQuery = encodeURIComponent(day.dayRouteQuery);
    externalUrl = `https://www.google.com/maps/dir/?api=1&query=${routeQuery}`;
  } else if (currentRoute) {
    originLabel = currentRoute.originTitle;
    destLabel = currentRoute.destinationTitle;

    const originQueryStr = currentRoute.originQuery || `${currentRoute.originTitle} ${currentRoute.originLocation} Osaka`;
    const destQueryStr = currentRoute.destinationQuery || `${currentRoute.destinationTitle} ${currentRoute.destinationLocation} Osaka`;

    const encodedOrigin = encodeURIComponent(originQueryStr);
    const encodedDest = encodeURIComponent(destQueryStr);

    locationTitle = `${currentRoute.originTitle} ➔ ${currentRoute.destinationTitle}`;

    if (viewMode === 'destination') {
      embedUrl = `https://maps.google.com/maps?q=${encodedDest}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
      externalUrl = `https://www.google.com/maps/search/?api=1&query=${encodedDest}`;
    } else if (viewMode === 'origin') {
      embedUrl = `https://maps.google.com/maps?q=${encodedOrigin}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
      externalUrl = `https://www.google.com/maps/search/?api=1&query=${encodedOrigin}`;
    } else {
      // Directions Mode (A ➔ B 길찾기 동선)
      embedUrl = `https://maps.google.com/maps?saddr=${encodedOrigin}&daddr=${encodedDest}&output=embed`;
      const travelModeParam = currentRoute.transportMode ? `&travelmode=${currentRoute.transportMode}` : '';
      externalUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${encodedDest}${travelModeParam}`;
    }
  } else if (item) {
    locationTitle = item.title;
    const query = encodeURIComponent(`${item.title} ${item.location} Osaka`);
    embedUrl = `https://maps.google.com/maps?q=${query}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    externalUrl = item.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  const handleCopy = () => {
    const textToCopy = currentRoute
      ? `${currentRoute.originTitle} (${currentRoute.originLocation}) ➔ ${currentRoute.destinationTitle} (${currentRoute.destinationLocation})`
      : locationTitle;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyJapanese = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedJapanese(true);
    setTimeout(() => setCopiedJapanese(false), 2000);
  };

  const renderTransportIcon = (mode?: string) => {
    switch (mode) {
      case 'walking':
        return <Footprints size={15} className="text-emerald-600" />;
      case 'driving':
        return <Car size={15} className="text-blue-600" />;
      case 'transit':
      default:
        return <Train size={15} className="text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-pop-in font-[var(--font-cute)]">
      <div className="paper-panel w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden bg-amber-50 border-2 border-slate-900 shadow-[6px_6px_0px_#1e293b]">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 bg-white border-b-2 border-slate-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-rose-100 border-2 border-slate-900 flex items-center justify-center flex-shrink-0">
              <Navigation size={18} className="text-rose-600" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-amber-300 border border-slate-900 text-slate-900">
                  구글 지도 동선
                </span>
                {currentRoute?.badge && (
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-100 border border-slate-900 text-indigo-900">
                    {currentRoute.badge}
                  </span>
                )}
                {isOnline ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Wifi size={10} /> 온라인
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                    <WifiOff size={10} /> 오프라인 모드
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 truncate mt-0.5">
                {locationTitle}
              </h3>
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
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4">
          {/* Multi-route Tab Selector (동선이 2개 이상일 때) */}
          {currentRoutes.length > 1 && (
            <div className="bg-white p-2.5 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] space-y-2">
              <div className="flex items-center gap-1.5 px-1 text-xs font-extrabold text-slate-700">
                <Layers size={14} className="text-amber-500" />
                <span>이동 동선 선택 ({currentRoutes.length}개 경로 옵션):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentRoutes.map((route, idx) => (
                  <button
                    key={route.id}
                    onClick={() => {
                      setActiveRouteIndex(idx);
                      if (viewMode === 'offline') setViewMode('offline');
                      else setViewMode('directions');
                    }}
                    className={`p-2.5 rounded-xl border-2 border-slate-900 text-left transition text-xs flex items-center justify-between gap-2 ${
                      activeRouteIndex === idx
                        ? 'bg-amber-300 text-slate-900 font-extrabold shadow-[2px_2px_0px_#1e293b]'
                        : 'bg-slate-50 hover:bg-amber-100 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {renderTransportIcon(route.transportMode)}
                      <span className="truncate">{route.label}</span>
                    </div>
                    {route.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-900 flex-shrink-0">
                        {route.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Route Header Info Card */}
          {currentRoute && (
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_#1e293b] space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 flex-1 overflow-hidden">
                  <div className="flex items-center gap-1.5 bg-blue-100 px-2.5 py-1 rounded-lg border border-slate-900 truncate">
                    <span className="text-[10px] bg-blue-600 text-white px-1 rounded flex-shrink-0">출발</span>
                    <span className="truncate">{originLabel}</span>
                  </div>
                  <ArrowRight size={16} className="text-slate-500 flex-shrink-0" />
                  <div className="flex items-center gap-1.5 bg-emerald-100 px-2.5 py-1 rounded-lg border border-slate-900 truncate">
                    <span className="text-[10px] bg-emerald-600 text-white px-1 rounded flex-shrink-0">도착</span>
                    <span className="truncate">{destLabel}</span>
                  </div>
                </div>

                {/* View Mode Tabs (오프라인 동선 탭 포함 ⭐) */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  <button
                    onClick={() => setViewMode('directions')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border border-slate-900 transition flex items-center gap-1 flex-shrink-0 ${
                      viewMode === 'directions'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    🚗 구글 동선
                  </button>
                  <button
                    onClick={() => setViewMode('offline')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border border-slate-900 transition flex items-center gap-1 flex-shrink-0 ${
                      viewMode === 'offline'
                        ? 'bg-amber-400 text-slate-900 shadow-[1px_1px_0px_#1e293b]'
                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    }`}
                  >
                    <Map size={13} />
                    <span>📱 오프라인 동선 맵</span>
                  </button>
                  <button
                    onClick={() => setViewMode('destination')}
                    className={`px-2 py-1 rounded-lg text-xs font-extrabold border border-slate-900 transition flex-shrink-0 ${
                      viewMode === 'destination'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    🎯 도착지
                  </button>
                  <button
                    onClick={() => setViewMode('origin')}
                    className={`px-2 py-1 rounded-lg text-xs font-extrabold border border-slate-900 transition flex-shrink-0 ${
                      viewMode === 'origin'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    📍 출발지
                  </button>
                </div>
              </div>

              {currentRoute.description && (
                <p className="text-xs text-slate-700 font-medium bg-amber-50 p-2 rounded-xl border border-dashed border-slate-400">
                  💡 {currentRoute.description}
                </p>
              )}
            </div>
          )}

          {/* VIEW MODE 1: 오프라인 동선 맵 & 가이드 뷰 (인터넷 없이 100% 동작) */}
          {viewMode === 'offline' && currentRoute ? (
            <div className="space-y-4 animate-fade-in">
              {/* Visual Offline Route Diagram Card */}
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_#1e293b]">
                <div className="flex items-center justify-between gap-2 mb-4 border-b border-amber-300/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Map size={18} className="text-amber-700" />
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                      오프라인 동선 로드맵 (데이터 없이 확인 가능)
                    </h4>
                  </div>
                  <span className="text-[10px] font-extrabold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full border border-slate-900">
                    💾 기기 저장됨
                  </span>
                </div>

                {/* Step Flow Diagram */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 border border-slate-900 flex items-center justify-center font-extrabold text-blue-900 flex-shrink-0">
                      A
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold">출발 장소</span>
                      <p className="text-xs font-extrabold text-slate-900">{currentRoute.originTitle}</p>
                      <p className="text-[10px] text-slate-600 truncate max-w-[180px]">{currentRoute.originLocation}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center justify-center gap-1 py-1 sm:py-0 border-y sm:border-y-0 sm:border-x border-slate-200 px-3">
                    <span className="text-[11px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                      {currentRoute.badge || '이동'}
                    </span>
                    <ArrowRight size={16} className="text-slate-400 rotate-90 sm:rotate-0" />
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-slate-900 flex items-center justify-center font-extrabold text-emerald-900 flex-shrink-0">
                      B
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold">도착 목적지</span>
                      <p className="text-xs font-extrabold text-slate-900">{currentRoute.destinationTitle}</p>
                      <p className="text-[10px] text-slate-600 truncate max-w-[180px]">{currentRoute.destinationLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Offline Turn-by-Turn Steps */}
                {currentRoute.offlineSteps && currentRoute.offlineSteps.length > 0 && (
                  <div className="space-y-2 mb-3">
                    <h5 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Compass size={14} className="text-slate-700" />
                      <span>단계별 상세 도보/환승 경로 가이드:</span>
                    </h5>
                    <div className="space-y-1.5 bg-white p-3.5 rounded-xl border-2 border-slate-900">
                      {currentRoute.offlineSteps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-xs font-medium text-slate-800">
                          <CheckCircle2 size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Japanese Local Show Card for Taxi/Locals */}
                {currentRoute.destinationJapanese && (
                  <div className="bg-white p-3.5 rounded-xl border-2 border-slate-900 space-y-1.5 shadow-[2px_2px_0px_#1e293b]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold text-rose-800 flex items-center gap-1">
                        <Languages size={13} />
                        <span>🚕 현지인/택시 기사님에게 보여주기 (일본어 표기):</span>
                      </span>
                      <button
                        onClick={() => handleCopyJapanese(currentRoute.destinationJapanese!)}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-900"
                      >
                        {copiedJapanese ? '복사됨!' : '일본어 복사'}
                      </button>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      「{currentRoute.destinationJapanese}」
                    </p>
                  </div>
                )}
              </div>

              {/* Google Maps Offline App Tip Banner */}
              <div className="bg-indigo-50 border-2 border-slate-900 rounded-2xl p-4 shadow-[2px_2px_0px_#1e293b] flex items-start gap-3">
                <Smartphone size={22} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <h5 className="font-extrabold text-indigo-950">
                    💡 구글맵 앱 '오프라인 지도'와 함께 쓰면 200% 완벽!
                  </h5>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    한국 출발 전 스마트폰 <strong>구글 지도 앱 ➔ 프로필 ➔ '오프라인 지도' ➔ '오사카' 구역을 미리 다운로드</strong>해 두시면, 로밍/데이터가 전혀 안 터지는 오프라인 상태에서도 스마트폰 GPS로 실시간 내 위치와 길찾기가 작동합니다.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* VIEW MODE 2: 구글 지도 실시간 Iframe 맵 */
            <div className="relative w-full h-[260px] sm:h-[380px] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-slate-900 shadow-[3px_3px_0px_#1e293b] bg-slate-100">
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
          )}

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b]">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-2 border-2 border-slate-900 active:scale-95"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? '복사 완료!' : '동선 정보 복사'}</span>
            </button>

            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-amber-300 hover:bg-amber-400 text-slate-900 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] active:scale-95"
            >
              <Navigation size={15} />
              <span>구글 지도 앱에서 실시간 길찾기 열기</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Item Specific Tips & Precautions */}
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
