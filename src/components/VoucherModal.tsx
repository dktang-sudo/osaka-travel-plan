import React, { useState, useEffect } from 'react';
import { X, QrCode, Copy, Check, Sparkles, User, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { ZoomableImage } from './ZoomableImage';

export interface FamilyMemberQR {
  id: string;
  name: string;      // 예: "대인 1 (식별번호 -0012)"
  role: string;      // 예: "🧑 대인 1 (16세 이상)"
  image: string;     // 예: "/images/vouchers/kaiyukan_adult1_qr.jpg"
  description?: string;
}

export interface VoucherData {
  id: string;
  title: string;
  subtitle: string;
  bookingNo?: string;
  travelerName?: string;
  date?: string;
  time?: string;
  location?: string;
  image: string; // 기본 이미지 (예: '/images/vouchers/innn_pickup_qr.jpg')
  badge: string;
  usageGuide: string;
  note?: string;
  familyMembers?: FamilyMemberQR[]; // 3인 가족 / 다중 티켓 QR 좌우 전환 지원!
}

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: VoucherData | null;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({ isOpen, onClose, voucher }) => {
  const [copied, setCopied] = useState(false);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0);

  useEffect(() => {
    setSelectedMemberIndex(0);
  }, [voucher]);

  const hasFamilyMembers = voucher?.familyMembers && voucher.familyMembers.length > 0;
  const totalCount = hasFamilyMembers ? voucher.familyMembers!.length : 1;

  const handlePrev = () => {
    if (hasFamilyMembers) {
      setSelectedMemberIndex((prev) => (prev > 0 ? prev - 1 : totalCount - 1));
    }
  };

  const handleNext = () => {
    if (hasFamilyMembers) {
      setSelectedMemberIndex((prev) => (prev < totalCount - 1 ? prev + 1 : 0));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, hasFamilyMembers, totalCount]);

  if (!isOpen || !voucher) return null;

  const handleCopyBookingNo = () => {
    if (voucher.bookingNo) {
      navigator.clipboard.writeText(voucher.bookingNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentImage = hasFamilyMembers
    ? voucher.familyMembers![selectedMemberIndex].image
    : voucher.image;
  const currentMember = hasFamilyMembers
    ? voucher.familyMembers![selectedMemberIndex]
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn font-[var(--font-cute)]">
      <div 
        className="paper-card w-full max-w-2xl bg-white border-2 border-slate-900 shadow-[8px_8px_0px_#1e293b] flex flex-col max-h-[96vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 bg-amber-100 border-b-2 border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-rose-500 text-white p-1.5 rounded-xl border border-slate-900 shadow-[1px_1px_0px_#1e293b]">
              <QrCode size={18} />
            </span>
            <div>
              <span className="bg-amber-300 text-slate-900 text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full border border-slate-900 mr-1.5">
                {voucher.badge}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {voucher.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-rose-100 text-slate-700 hover:text-rose-600 transition border-2 border-transparent hover:border-slate-900 active:scale-95"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-5 space-y-3 overflow-y-auto max-h-[calc(96vh-120px)]">
          {/* Top Tip Alert */}
          <div className="bg-emerald-50 border-2 border-emerald-800/40 rounded-xl p-2.5 sm:p-3 text-xs text-emerald-950 font-bold flex items-start gap-2 shadow-[2px_2px_0px_#1e293b]">
            <Sparkles size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p>{voucher.usageGuide}</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">※ 오프라인(비행기 모드)에서도 QR코드와 바우처가 100% 정상 작동합니다.</p>
            </div>
          </div>

          {/* Member / Ticket Tabs & Swipe Controls */}
          {hasFamilyMembers && (
            <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-2xl border-2 border-slate-900">
              <div className="flex items-center justify-between text-xs font-black text-slate-700">
                <span className="flex items-center gap-1">
                  <Users size={14} className="text-indigo-600" />
                  <span>티켓 / 가족 선택 ({selectedMemberIndex + 1} / {totalCount}):</span>
                </span>
                <span className="text-[11px] text-slate-500 font-bold">좌우 버튼 또는 탭으로 전환</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {voucher.familyMembers!.map((member, idx) => {
                  const isSelected = selectedMemberIndex === idx;
                  return (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMemberIndex(idx)}
                      className={`p-2 rounded-xl text-xs font-black transition border-2 border-slate-900 flex flex-col items-center justify-center gap-0.5 active:scale-95 ${
                        isSelected
                          ? 'bg-amber-400 text-slate-900 shadow-[2px_2px_0px_#1e293b] scale-[1.02]'
                          : 'bg-white hover:bg-slate-100 text-slate-700 shadow-sm'
                      }`}
                    >
                      <span className="text-xs">{member.role.split(' ')[0]}</span>
                      <span className="text-[10px] font-extrabold truncate max-w-full">{member.role.split(' ')[1] || member.role}</span>
                      <span className="text-[9px] font-mono opacity-80 truncate max-w-full">{member.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QR Image Box with ZoomableImage & Left/Right Nav Arrows */}
          <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-2.5 sm:p-3 shadow-[3px_3px_0px_#1e293b] relative flex flex-col items-center justify-center">
            {/* Current Member Badge */}
            {currentMember && (
              <div className="mb-2 bg-indigo-100 text-indigo-950 font-black text-xs px-3 py-1 rounded-full border border-slate-900 shadow-sm flex items-center gap-1.5">
                <User size={13} />
                <span>{currentMember.role} : <strong>{currentMember.name}</strong></span>
              </div>
            )}

            {/* Left / Right Carousel Controls */}
            {hasFamilyMembers && totalCount > 1 && (
              <div className="w-full flex items-center justify-between mb-1.5 px-1">
                <button
                  onClick={handlePrev}
                  className="px-3 py-1 rounded-xl bg-white hover:bg-amber-300 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] flex items-center gap-1 text-xs font-black transition active:scale-90"
                  aria-label="이전 티켓"
                  title="이전 티켓 보기 (◀)"
                >
                  <ChevronLeft size={16} />
                  <span>이전 티켓</span>
                </button>
                <div className="flex items-center gap-1.5">
                  {voucher.familyMembers!.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedMemberIndex(idx)}
                      className={`h-2.5 rounded-full transition-all border border-slate-900 ${
                        selectedMemberIndex === idx ? 'w-5 bg-amber-400' : 'w-2 bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  className="px-3 py-1 rounded-xl bg-white hover:bg-amber-300 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] flex items-center gap-1 text-xs font-black transition active:scale-90"
                  aria-label="다음 티켓"
                  title="다음 티켓 보기 (▶)"
                >
                  <span>다음 티켓</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Zoomable QR Image */}
            <ZoomableImage
              src={currentImage}
              alt={currentMember?.name || voucher.title}
            />
          </div>

          {/* Voucher Summary Table */}
          <div className="bg-amber-50/70 border-2 border-slate-900 rounded-2xl p-3.5 space-y-2 text-xs">
            {voucher.bookingNo && (
              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-300">
                <div>
                  <span className="text-slate-500 font-bold block text-[10px]">구매/예약 번호</span>
                  <span className="font-mono font-black text-indigo-700 text-xs sm:text-sm">{voucher.bookingNo}</span>
                </div>
                <button
                  onClick={handleCopyBookingNo}
                  className="px-2.5 py-1 bg-amber-300 hover:bg-amber-400 text-slate-900 text-xs font-bold rounded-lg border border-slate-900 shadow-[1px_1px_0px_#1e293b] flex items-center gap-1 active:scale-95"
                >
                  {copied ? <Check size={13} className="text-emerald-700" /> : <Copy size={13} />}
                  <span>{copied ? '복사됨!' : '번호 복사'}</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {voucher.travelerName && (
                <div className="bg-white p-2 rounded-xl border border-slate-300">
                  <span className="text-slate-500 font-bold block text-[10px]">인원 / 대상</span>
                  <span className="font-bold text-slate-900">{voucher.travelerName}</span>
                </div>
              )}
              {voucher.date && (
                <div className="bg-white p-2 rounded-xl border border-slate-300">
                  <span className="text-slate-500 font-bold block text-[10px]">이용 일시</span>
                  <span className="font-bold text-slate-900">{voucher.date} {voucher.time || ''}</span>
                </div>
              )}
            </div>

            {voucher.location && (
              <div className="bg-white p-2 rounded-xl border border-slate-300">
                <span className="text-slate-500 font-bold block text-[10px]">위치 / 장소</span>
                <span className="font-bold text-slate-900">{voucher.location}</span>
              </div>
            )}

            {voucher.note && (
              <div className="text-[11px] text-rose-900 font-bold bg-rose-50 p-2 rounded-xl border border-rose-200">
                ⚠️ {voucher.note}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t-2 border-slate-900 flex items-center justify-between gap-2">
          {hasFamilyMembers && totalCount > 1 ? (
            <>
              <button
                onClick={handlePrev}
                className="px-4 py-2.5 bg-white hover:bg-amber-100 text-slate-900 font-black rounded-xl text-xs transition border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] flex items-center gap-1 active:scale-95"
              >
                <ChevronLeft size={16} /> 이전 티켓
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black rounded-xl text-xs transition border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] flex items-center gap-1 active:scale-95"
              >
                다음 티켓 <ChevronRight size={16} />
              </button>
            </>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs transition border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] active:scale-95"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
