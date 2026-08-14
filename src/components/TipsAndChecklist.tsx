import React, { useState, useEffect } from 'react';
import { ITINERARY_DATA, DayChecklist } from '../data/itineraryData';
import { CheckSquare, AlertTriangle, Lightbulb, Ticket, Percent, CreditCard, Sparkles, MessageCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const TipsAndChecklist: React.FC = () => {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('osaka_travel_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('osaka_travel_checklist', JSON.stringify(checkedMap));
    } catch (e) {
      console.error(e);
    }
  }, [checkedMap]);

  const toggleCheck = (id: string) => {
    setCheckedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const allChecklistItems: { dayNum: number; item: DayChecklist }[] = [];
  ITINERARY_DATA.forEach(day => {
    day.checklist.forEach(item => {
      allChecklistItems.push({ dayNum: day.dayNumber, item });
    });
  });

  const totalCount = allChecklistItems.length;
  const completedCount = allChecklistItems.filter(i => checkedMap[i.item.id]).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8 font-[var(--font-cute)]">
      {/* Top Banner */}
      <div className="paper-panel p-6 sm:p-8 washi-tape bg-amber-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 mb-2">
              💡 오사카 여행 핵심 꿀팁 & 준비물 스티커 북
            </h2>
            <p className="text-sm text-slate-700 font-medium">
              여행 출발 전부터 마감 날 귀국까지 꼭 챙겨야 할 필수 품목과 핵심 주의사항 정리!
            </p>
          </div>

          {/* Progress Box */}
          <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_#1e293b] min-w-[240px]">
            <div className="flex justify-between items-center text-xs font-extrabold mb-1.5 text-slate-900">
              <span>체크리스트 준비율</span>
              <span className="font-mono text-sm text-amber-600">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border-2 border-slate-900">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-600 mt-1.5 text-right font-extrabold">
              총 {totalCount}개 중 {completedCount}개 완료!
            </div>
          </div>
        </div>
      </div>

      {/* Warning Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="paper-card p-6 bg-amber-100/90 border-2 border-slate-900 shadow-[4px_4px_0px_#1e293b]">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base mb-2">
            <ShieldAlert size={20} className="text-rose-600" />
            <span>★ 캡틴라인 주유패스 불가!</span>
          </div>
          <p className="text-xs text-slate-800 font-medium leading-relaxed mb-3">
            Day 2 (10/5 월) 유니버설시티포트 $\leftrightarrow$ 덴포잔 캡틴라인 페리는 <strong>오사카 주유패스 무료 대상이 아닙니다!</strong> 현장에서 왕복 티켓(성인 약 1,700엔)을 별도 구매해야 합니다.
          </p>
          <span className="bg-white text-slate-900 text-[11px] px-2.5 py-1 rounded-md font-extrabold border-2 border-slate-900 shadow-[1px_1px_0px_#1e293b]">
            Day 2 캡틴라인 별도 구매
          </span>
        </div>

        <div className="paper-card p-6 bg-yellow-100/90 border-2 border-slate-900 shadow-[4px_4px_0px_#1e293b]">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base mb-2">
            <Ticket size={20} className="text-amber-600" />
            <span>★ USJ 닌텐도 e정리권 발급</span>
          </div>
          <p className="text-xs text-slate-800 font-medium leading-relaxed mb-3">
            Day 3 (10/6 화) USJ 게이트를 통과한 <strong>직후 USJ 공식 앱에서 '슈퍼 닌텐도 월드 e정리권'</strong>을 즉시 발급받아야 닌텐도 월드 입장이 확정됩니다.
          </p>
          <span className="bg-white text-slate-900 text-[11px] px-2.5 py-1 rounded-md font-extrabold border-2 border-slate-900 shadow-[1px_1px_0px_#1e293b]">
            Day 3 USJ e정리권 필수
          </span>
        </div>

        <div className="paper-card p-6 bg-pink-100/90 border-2 border-slate-900 shadow-[4px_4px_0px_#1e293b]">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base mb-2">
            <Percent size={20} className="text-pink-600" />
            <span>★ 돈키호테 면세 5%+10% 쿠폰</span>
          </div>
          <p className="text-xs text-slate-800 font-medium leading-relaxed mb-3">
            Day 5 (10/8 목) MEGA 돈키호테 결제 시 화면 캡처본은 거절됩니다. 반드시 <strong>스마트폰 웹 브라우저 화면</strong>으로 바코드를 제시하고 여권을 제시하세요.
          </p>
          <span className="bg-white text-slate-900 text-[11px] px-2.5 py-1 rounded-md font-extrabold border-2 border-slate-900 shadow-[1px_1px_0px_#1e293b]">
            여권 + 웹 쿠폰 제시
          </span>
        </div>
      </div>

      {/* Daily Interactive Checklists */}
      <div className="paper-panel p-6 sm:p-8 space-y-6 bg-white">
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 border-b-2 border-slate-900 pb-4">
          <CheckSquare size={20} className="text-emerald-600" /> 일자별 필수 체크리스트 (클릭하여 체크!)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ITINERARY_DATA.map((day) => (
            <div key={day.dayNumber} className="paper-card p-5 bg-amber-50/50">
              <div className="flex items-center justify-between mb-3 border-b-2 border-slate-900 pb-2">
                <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900"></span>
                  DAY {day.dayNumber} ({day.dateStr} {day.dayOfWeek})
                </span>
                <span className="text-xs font-bold text-slate-600">
                  {day.title}
                </span>
              </div>

              <div className="space-y-2">
                {day.checklist.map((c) => {
                  const isChecked = !!checkedMap[c.id];
                  return (
                    <label
                      key={c.id}
                      onClick={() => toggleCheck(c.id)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition select-none border-2 border-slate-900 ${
                        isChecked
                          ? 'bg-emerald-100 text-emerald-950 font-bold shadow-[1px_1px_0px_#1e293b]'
                          : 'bg-white hover:bg-amber-100 text-slate-900 font-medium shadow-[2px_2px_0px_#1e293b]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 rounded border-2 border-slate-900 text-amber-500 focus:ring-0 cursor-pointer accent-amber-500"
                      />
                      <span className={`text-xs ${isChecked ? 'line-through opacity-80' : ''} ${c.isImportant ? 'font-extrabold text-slate-900' : ''}`}>
                        {c.isImportant && '⭐ '}
                        {c.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Japanese Phrases */}
      <div className="paper-panel p-6 sm:p-8 space-y-4 bg-amber-50">
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <MessageCircle size={20} className="text-indigo-600" /> 오사카 여행 필수 일본어 표현
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="paper-card p-4 bg-white">
            <div className="font-extrabold text-amber-700 mb-1">식당 소스 규칙</div>
            <div className="text-slate-900 font-extrabold text-sm">ソースの二度づけはお断り (소스 노 니도즈케 와 오코토와리)</div>
            <div className="text-slate-600 font-bold mt-1">"쿠시카츠 소스는 두 번 찍기 금지입니다"</div>
          </div>
          <div className="paper-card p-4 bg-white">
            <div className="font-extrabold text-pink-700 mb-1">면세 안내</div>
            <div className="text-slate-900 font-extrabold text-sm">免税できますか？ (멘제이 데키마스카?)</div>
            <div className="text-slate-600 font-bold mt-1">"면세 적용 가능한가요?"</div>
          </div>
          <div className="paper-card p-4 bg-white">
            <div className="font-extrabold text-teal-700 mb-1">짐 보관 요청</div>
            <div className="text-slate-900 font-extrabold text-sm">荷物を預かっていただけますか？ (니모츠오 아즈캇테 이타다케마스카?)</div>
            <div className="text-slate-600 font-bold mt-1">"짐을 맡길 수 있을까요?"</div>
          </div>
        </div>
      </div>
    </div>
  );
};
