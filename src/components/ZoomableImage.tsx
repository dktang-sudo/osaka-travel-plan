import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, X, Move } from 'lucide-react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  enableLightbox?: boolean;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  enableLightbox = true,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Lightbox Zoom State
  const [lightboxScale, setLightboxScale] = useState(1);
  const [lightboxPosition, setLightboxPosition] = useState({ x: 0, y: 0 });
  const [isLightboxDragging, setIsLightboxDragging] = useState(false);

  // References for Touch & Drag
  const containerRef = useRef<HTMLDivElement>(null);
  const lightboxContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1);
  const lastTapRef = useRef<number>(0);

  // Reset zoom when image source changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setLightboxScale(1);
    setLightboxPosition({ x: 0, y: 0 });
  }, [src]);

  // Zoom helpers
  const handleZoomIn = (isLb = false) => {
    if (isLb) {
      setLightboxScale((prev) => Math.min(prev + 0.5, 4.5));
    } else {
      setScale((prev) => Math.min(prev + 0.5, 4.5));
    }
  };

  const handleZoomOut = (isLb = false) => {
    if (isLb) {
      setLightboxScale((prev) => {
        const next = Math.max(prev - 0.5, 1);
        if (next === 1) setLightboxPosition({ x: 0, y: 0 });
        return next;
      });
    } else {
      setScale((prev) => {
        const next = Math.max(prev - 0.5, 1);
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

  const handleResetZoom = (isLb = false) => {
    if (isLb) {
      setLightboxScale(1);
      setLightboxPosition({ x: 0, y: 0 });
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  // Double tap to zoom
  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent, isLb = false) => {
    e.preventDefault();
    if (isLb) {
      if (lightboxScale > 1) {
        setLightboxScale(1);
        setLightboxPosition({ x: 0, y: 0 });
      } else {
        setLightboxScale(2.5);
      }
    } else {
      if (scale > 1) {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      } else {
        setScale(2.2);
      }
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent, isLb = false) => {
    const currentScale = isLb ? lightboxScale : scale;
    if (currentScale <= 1) return;
    e.preventDefault();
    if (isLb) {
      setIsLightboxDragging(true);
      dragStartRef.current = { x: e.clientX - lightboxPosition.x, y: e.clientY - lightboxPosition.y };
    } else {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent, isLb = false) => {
    if (isLb) {
      if (!isLightboxDragging || lightboxScale <= 1) return;
      setLightboxPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    } else {
      if (!isDragging || scale <= 1) return;
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = (isLb = false) => {
    if (isLb) setIsLightboxDragging(false);
    else setIsDragging(false);
  };

  // Touch Gesture handlers (Pinch to zoom + 1 finger Pan)
  const getTouchDistance = (t1: React.Touch, t2: React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent, isLb = false) => {
    const now = Date.now();
    // Double tap check (< 300ms)
    if (e.touches.length === 1) {
      if (now - lastTapRef.current < 300) {
        handleDoubleTap(e, isLb);
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;
    }

    if (e.touches.length === 1) {
      const currentScale = isLb ? lightboxScale : scale;
      const currentPos = isLb ? lightboxPosition : position;
      if (currentScale > 1) {
        if (isLb) setIsLightboxDragging(true);
        else setIsDragging(true);
        dragStartRef.current = {
          x: e.touches[0].clientX - currentPos.x,
          y: e.touches[0].clientY - currentPos.y,
        };
      }
    } else if (e.touches.length === 2) {
      // 2 fingers pinch
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      initialDistanceRef.current = dist;
      initialScaleRef.current = isLb ? lightboxScale : scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent, isLb = false) => {
    if (e.touches.length === 1) {
      const isD = isLb ? isLightboxDragging : isDragging;
      const curScale = isLb ? lightboxScale : scale;
      if (!isD || curScale <= 1) return;
      e.preventDefault();
      const newPos = {
        x: e.touches[0].clientX - dragStartRef.current.x,
        y: e.touches[0].clientY - dragStartRef.current.y,
      };
      if (isLb) setLightboxPosition(newPos);
      else setPosition(newPos);
    } else if (e.touches.length === 2 && initialDistanceRef.current !== null) {
      e.preventDefault();
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      const factor = dist / initialDistanceRef.current;
      const newScale = Math.min(Math.max(initialScaleRef.current * factor, 1), 4.5);
      if (isLb) {
        setLightboxScale(newScale);
        if (newScale === 1) setLightboxPosition({ x: 0, y: 0 });
      } else {
        setScale(newScale);
        if (newScale === 1) setPosition({ x: 0, y: 0 });
      }
    }
  };

  const handleTouchEnd = (isLb = false) => {
    if (isLb) setIsLightboxDragging(false);
    else setIsDragging(false);
    initialDistanceRef.current = null;
  };

  return (
    <div className={`relative flex flex-col items-center w-full ${containerClassName}`}>
      {/* Zoomable Container */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden bg-slate-950/5 rounded-xl border border-slate-300 flex items-center justify-center select-none touch-none"
        style={{ minHeight: '300px', maxHeight: '460px' }}
        onMouseDown={(e) => handleMouseDown(e, false)}
        onMouseMove={(e) => handleMouseMove(e, false)}
        onMouseUp={() => handleMouseUp(false)}
        onMouseLeave={() => handleMouseUp(false)}
        onTouchStart={(e) => handleTouchStart(e, false)}
        onTouchMove={(e) => handleTouchMove(e, false)}
        onTouchEnd={() => handleTouchEnd(false)}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
          }}
          className={`max-h-[400px] w-auto object-contain rounded-lg shadow-sm transition-transform duration-100 ${className}`}
        />

        {/* Floating Zoom & Lightbox Controls Bar */}
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-slate-900/85 backdrop-blur-md px-2 py-1 rounded-xl border border-white/20 shadow-lg text-white">
          <button
            type="button"
            onClick={() => handleZoomIn(false)}
            className="p-1 rounded-lg hover:bg-white/20 active:scale-90 transition text-amber-300 hover:text-amber-200"
            title="확대 (+)"
            aria-label="확대"
          >
            <ZoomIn size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleZoomOut(false)}
            className="p-1 rounded-lg hover:bg-white/20 active:scale-90 transition text-amber-300 hover:text-amber-200"
            title="축소 (-)"
            aria-label="축소"
          >
            <ZoomOut size={16} />
          </button>
          {scale > 1 && (
            <button
              type="button"
              onClick={() => handleResetZoom(false)}
              className="p-1 rounded-lg hover:bg-white/20 active:scale-90 transition text-rose-300 hover:text-rose-200 flex items-center gap-1 text-[10px] font-bold"
              title="원래 크기로 리셋"
              aria-label="리셋"
            >
              <RotateCcw size={14} />
              <span>{Math.round(scale * 100)}%</span>
            </button>
          )}
          {enableLightbox && (
            <button
              type="button"
              onClick={() => {
                setLightboxScale(1.8);
                setLightboxPosition({ x: 0, y: 0 });
                setIsLightboxOpen(true);
              }}
              className="p-1 rounded-lg hover:bg-white/20 active:scale-90 transition text-emerald-300 hover:text-emerald-200 ml-0.5 border-l border-white/20 pl-1.5"
              title="전체화면 큰 화면으로 확대보기"
              aria-label="전체화면 확대"
            >
              <Maximize2 size={16} />
            </button>
          )}
        </div>

        {/* Panning indicator overlay */}
        {scale > 1 && (
          <div className="absolute bottom-2 left-2 z-10 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow pointer-events-none">
            <Move size={11} className="text-amber-400" />
            <span>손가락으로 밀어서 이동</span>
          </div>
        )}
      </div>

      {/* Guide text */}
      <div className="w-full flex items-center justify-between text-[11px] text-slate-500 font-bold mt-1.5 px-1">
        <span>💡 두 손가락 핀치 줌 / 더블 탭으로 크게 확대 가능</span>
        {enableLightbox && (
          <button
            type="button"
            onClick={() => {
              setLightboxScale(1.8);
              setIsLightboxOpen(true);
            }}
            className="text-indigo-600 hover:text-indigo-800 font-extrabold flex items-center gap-0.5 hover:underline"
          >
            <Maximize2 size={12} />
            <span>전체화면 크게보기</span>
          </button>
        )}
      </div>

      {/* Full-Screen Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 select-none touch-none animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Top Bar */}
          <div 
            className="w-full max-w-4xl flex items-center justify-between px-3 py-2 text-white bg-slate-900/90 rounded-2xl border border-white/20 shadow-xl mb-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-900 text-[11px] font-black px-2 py-0.5 rounded-md">
                전체화면 확대 뷰어
              </span>
              <span className="text-xs font-bold text-slate-200 truncate max-w-[200px] sm:max-w-md">
                {alt}
              </span>
            </div>

            {/* Lightbox Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleZoomIn(true)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 active:scale-90 transition text-amber-300"
                title="더 크게 확대 (+)"
              >
                <ZoomIn size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleZoomOut(true)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 active:scale-90 transition text-amber-300"
                title="축소 (-)"
              >
                <ZoomOut size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleResetZoom(true)}
                className="px-2 py-1 rounded-xl bg-white/10 hover:bg-white/25 active:scale-90 transition text-xs font-bold text-rose-300 flex items-center gap-1"
                title="원래 크기"
              >
                <RotateCcw size={14} />
                <span>{Math.round(lightboxScale * 100)}%</span>
              </button>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white active:scale-90 transition ml-2 border border-white/30"
                title="닫기"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Lightbox Main Image Area */}
          <div
            ref={lightboxContainerRef}
            className="relative w-full max-w-5xl h-[calc(100vh-100px)] flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => handleMouseDown(e, true)}
            onMouseMove={(e) => handleMouseMove(e, true)}
            onMouseUp={() => handleMouseUp(true)}
            onMouseLeave={() => handleMouseUp(true)}
            onTouchStart={(e) => handleTouchStart(e, true)}
            onTouchMove={(e) => handleTouchMove(e, true)}
            onTouchEnd={() => handleTouchEnd(true)}
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              style={{
                transform: `scale(${lightboxScale}) translate(${lightboxPosition.x / lightboxScale}px, ${lightboxPosition.y / lightboxScale}px)`,
                transition: isLightboxDragging ? 'none' : 'transform 0.15s ease-out',
                cursor: lightboxScale > 1 ? (isLightboxDragging ? 'grabbing' : 'grab') : 'zoom-in',
                maxWidth: '96%',
                maxHeight: '92vh',
              }}
              className="object-contain rounded-lg shadow-2xl"
            />

            {/* Bottom Floating Hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-lg flex items-center gap-2 pointer-events-none">
              <Move size={14} className="text-amber-400" />
              <span>손가락으로 밀어서 이동 | 두 손가락 핀치로 자유롭게 확대</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
