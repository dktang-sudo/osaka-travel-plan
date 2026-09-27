import React, { useEffect } from 'react';
import { X, QrCode, Copy, Check, Download, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

export interface VoucherData {
  id: string;
  title: string;
  subtitle: string;
  bookingNo?: string;
  travelerName?: string;
  date?: string;
  time?: string;
  location?: string;
  image: string; // public 경로 (예: '/images/vouchers/innn_pickup_qr.jpg')
  badge: string;
  usageGuide: string;
  note?: string;
}

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: VoucherData | null;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({ isOpen, onClose, voucher }) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !voucher) return null;

  const handleCopyBookingNo = () => {
    if (voucher.bookingNo) {
      navigator.clipboard.writeText(voucher.bookingNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn font-[var(--font-cute)]">
      <div 
        className="paper-card w-full max-w-lg bg-white border-2 border-slate-900 shadow-[8px_8px_0px_#1e293b] flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-amber-100 border-b-2 border-slate-900 flex items-center justify-between">
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
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[calc(92vh-130px)]">
          {/* Top Tip Alert */}
          <div className="bg-emerald-50 border-2 border-emerald-800/40 rounded-xl p-2.5 sm:p-3 text-xs text-emerald-950 font-bold flex items-start gap-2 shadow-[2px_2px_0px_#1e293b]">
            <Sparkles size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p>{voucher.usageGuide}</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">※ 오프라인(비행기 모드)에서도 QR코드와 바우처가 정상 표시됩니다.</p>
            </div>
          </div>

          {/* QR Image Box */}
          <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-2 sm:p-3 shadow-[3px_3px_0px_#1e293b] flex flex-col items-center justify-center">
            <div className="w-full flex justify-center bg-white rounded-xl p-2 border border-slate-200 overflow-hidden">
              <img
                src={voucher.image}
                alt={voucher.title}
                className="max-h-[380px] w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
            <p className="text-[11px] text-slate-500 font-bold mt-2 text-center">
              💡 현장 직원 또는 게이트 기기에 화면을 그대로 보여주세요.
            </p>
          </div>

          {/* Voucher Summary Table */}
          <div className="bg-amber-50/70 border-2 border-slate-900 rounded-2xl p-3.5 space-y-2 text-xs">
            {voucher.bookingNo && (
              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-300">
                <div>
                  <span className="text-slate-500 font-bold block text-[10px]">예약 번호 (Booking ID)</span>
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
                  <span className="text-slate-500 font-bold block text-[10px]">예약자명</span>
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
        <div className="p-3 sm:p-4 bg-slate-50 border-t-2 border-slate-900 flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-amber-300 hover:bg-amber-400 text-slate-900 font-black rounded-xl text-xs sm:text-sm transition border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b] active:scale-95"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
