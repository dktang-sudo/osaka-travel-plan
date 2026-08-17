import React, { useState } from 'react';
import { ScheduleItem, VocabItem, getItemVocabs, VocabularyCategory } from '../data/itineraryData';
import {
  X,
  Languages,
  Volume2,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  MessageCircle,
  Tag,
} from 'lucide-react';

interface JapaneseVocabModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ScheduleItem | null;
  dayTitle: string;
}

export const JapaneseVocabModal: React.FC<JapaneseVocabModalProps> = ({
  isOpen,
  onClose,
  item,
  dayTitle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const vocabCategories: VocabularyCategory[] = getItemVocabs(item);

  // 모든 단어 플랫 리스트 생성
  const allVocabItems: { categoryName: string; item: VocabItem }[] = [];
  vocabCategories.forEach((cat) => {
    cat.items.forEach((v) => {
      allVocabItems.push({ categoryName: cat.categoryName, item: v });
    });
  });

  const filteredItems = selectedCategory === 'all'
    ? allVocabItems
    : allVocabItems.filter((i) => i.categoryName === selectedCategory);

  const handleCopy = (vocab: VocabItem) => {
    navigator.clipboard.writeText(`${vocab.japanese} (${vocab.pronunciation} - ${vocab.korean})`);
    setCopiedId(vocab.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Web Speech API 일본어 음성 발음 재생 (오프라인 브라우저 기본 내장 지원)
  const handleSpeak = (vocab: VocabItem) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // 이전 재생 중단
      const utterance = new SpeechSynthesisUtterance(vocab.japanese);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9; // 듣기 편한 속도

      utterance.onstart = () => setPlayingId(vocab.id);
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/75 backdrop-blur-sm animate-pop-in font-[var(--font-cute)]">
      <div className="paper-panel w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden bg-amber-50 border-2 border-slate-900 shadow-[6px_6px_0px_#1e293b]">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 bg-white border-b-2 border-slate-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-rose-100 border-2 border-slate-900 flex items-center justify-center flex-shrink-0">
              <Languages size={18} className="text-rose-600" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-amber-300 border border-slate-900 text-slate-900">
                  현지 일본어 & 메뉴/입장권 용어
                </span>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 border border-slate-900 text-emerald-900">
                  {allVocabItems.length}개 표현
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 truncate mt-0.5">
                {item.title} 필수 일본어집
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

        {/* Category Tabs */}
        <div className="bg-amber-100/70 px-3.5 sm:px-5 py-2.5 border-b-2 border-slate-900 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-extrabold text-slate-700 mr-1 flex-shrink-0 flex items-center gap-1">
            <Tag size={12} /> 분류:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition flex-shrink-0 border border-slate-900 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-[1px_1px_0px_#1e293b]'
                : 'bg-white text-slate-700 hover:bg-amber-200'
            }`}
          >
            전체 보기 ({allVocabItems.length})
          </button>
          {vocabCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat.categoryName)}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition flex-shrink-0 border border-slate-900 ${
                selectedCategory === cat.categoryName
                  ? 'bg-amber-400 text-slate-900 shadow-[1px_1px_0px_#1e293b]'
                  : 'bg-white text-slate-700 hover:bg-amber-200'
              }`}
            >
              {cat.categoryName} ({cat.items.length})
            </button>
          ))}
        </div>

        {/* Modal Body: Vocab Card Grid */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4">
          {/* Quick Guide Banner */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <MessageCircle size={18} className="text-amber-500 flex-shrink-0" />
              <span>
                👉 <strong>일본어를 전혀 몰라도 OK!</strong> 직원이나 기사님에게 아래 카드의 <strong>큰 글씨 일본어</strong>를 그대로 보여주거나 <strong>[🔊 발음 듣기]</strong>를 누르세요.
              </span>
            </div>
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {filteredItems.map(({ categoryName, item: vocab }) => {
              const isCopied = copiedId === vocab.id;
              const isPlaying = playingId === vocab.id;

              return (
                <div
                  key={vocab.id}
                  className="paper-card p-4 sm:p-5 bg-white border-2 border-slate-900 shadow-[3px_3px_0px_#1e293b] flex flex-col justify-between gap-3 relative group"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Category badge & Image Thumb */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 border border-slate-800 text-amber-950">
                        {categoryName}
                      </span>
                      {vocab.image && (
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-slate-900 flex items-center justify-center p-1 shadow-[1px_1px_0px_#1e293b] flex-shrink-0">
                          <img
                            src={vocab.image}
                            alt={vocab.korean}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>

                    {/* Korean Meaning */}
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold block">한국어 뜻</span>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                        {vocab.korean}
                      </h4>
                    </div>

                    {/* Giant Japanese Text Box (현지인에게 바로 보여주기용) */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 sm:p-3.5 rounded-xl border-2 border-slate-900 relative">
                      <span className="text-[10px] text-rose-700 font-extrabold block mb-0.5">
                        🇯🇵 일본어 표기 (직원에게 보여주세요)
                      </span>
                      <p className="text-base sm:text-lg font-black text-slate-900 tracking-wide font-sans">
                        {vocab.japanese}
                      </p>
                      <p className="text-xs font-extrabold text-amber-700 mt-1">
                        🗣️ 발음: <span className="text-slate-800 underline decoration-amber-300 font-bold">{vocab.pronunciation}</span>
                      </p>
                    </div>

                    {/* Situation Tip */}
                    {vocab.situationTip && (
                      <p className="text-[11px] text-slate-600 font-medium bg-slate-50 p-2 rounded-lg border border-dashed border-slate-300">
                        💡 {vocab.situationTip}
                      </p>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                    <button
                      onClick={() => handleSpeak(vocab)}
                      className={`flex-1 py-2 px-3 rounded-xl border border-slate-900 text-xs font-extrabold transition flex items-center justify-center gap-1.5 active:scale-95 ${
                        isPlaying
                          ? 'bg-amber-400 text-slate-900 shadow-[1px_1px_0px_#1e293b] animate-pulse'
                          : 'bg-amber-200 hover:bg-amber-300 text-slate-900'
                      }`}
                    >
                      <Volume2 size={14} className={isPlaying ? 'text-rose-600' : 'text-slate-900'} />
                      <span>{isPlaying ? '재생 중...' : '발음 듣기'}</span>
                    </button>

                    <button
                      onClick={() => handleCopy(vocab)}
                      className="py-2 px-3 rounded-xl border border-slate-900 text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center justify-center gap-1 active:scale-95"
                    >
                      {isCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      <span>{isCopied ? '복사됨!' : '복사'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-white border-t-2 border-slate-900 flex items-center justify-between text-xs text-slate-600 font-bold">
          <span>모든 단어와 사진은 기기에 오프라인 캐시 저장되어 인터넷 없이도 바로 열립니다.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white font-extrabold rounded-xl hover:bg-slate-800 transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
