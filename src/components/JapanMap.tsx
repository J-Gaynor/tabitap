import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PREFECTURES } from '../data/prefectures';
import { PrefectureMeta, JapanMapData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { NativeService } from '../services/nativeService';

interface JapanMapProps {
  mapData: JapanMapData;
  onSelectPrefecture: (pref: PrefectureMeta) => void;
  selectedPrefId?: number | null;
}

// Prefecture size tiers to determine minimum zoom threshold and base font size
const PREF_ZOOM_TIERS: Record<number, { minScale: number; baseFontSize: number }> = {
  // Tier 1: Large prefectures (Hokkaido, Tohoku, Nagano, Niigata, Gifu)
  1: { minScale: 1.1, baseFontSize: 6.5 }, // Hokkaido
  2: { minScale: 1.3, baseFontSize: 5.0 }, // Aomori
  3: { minScale: 1.3, baseFontSize: 5.0 }, // Iwate
  4: { minScale: 1.3, baseFontSize: 4.6 }, // Miyagi
  5: { minScale: 1.3, baseFontSize: 4.6 }, // Akita
  7: { minScale: 1.3, baseFontSize: 4.8 }, // Fukushima
  15: { minScale: 1.3, baseFontSize: 4.8 }, // Niigata
  20: { minScale: 1.3, baseFontSize: 4.8 }, // Nagano
  21: { minScale: 1.3, baseFontSize: 4.6 }, // Gifu

  // Tier 2: Medium prefectures
  6: { minScale: 1.5, baseFontSize: 5.0 }, // Yamagata
  8: { minScale: 1.5, baseFontSize: 5.0 }, // Ibaraki
  9: { minScale: 1.5, baseFontSize: 5.0 }, // Tochigi
  10: { minScale: 1.5, baseFontSize: 5.0 }, // Gunma
  12: { minScale: 1.5, baseFontSize: 5.0 }, // Chiba
  16: { minScale: 1.6, baseFontSize: 4.6 }, // Toyama
  17: { minScale: 1.6, baseFontSize: 4.6 }, // Ishikawa
  18: { minScale: 1.6, baseFontSize: 4.6 }, // Fukui
  22: { minScale: 1.5, baseFontSize: 5.0 }, // Shizuoka
  23: { minScale: 1.5, baseFontSize: 4.8 }, // Aichi
  25: { minScale: 1.6, baseFontSize: 4.6 }, // Shiga
  26: { minScale: 1.6, baseFontSize: 4.8 }, // Kyoto
  28: { minScale: 1.4, baseFontSize: 5.4 }, // Hyogo
  30: { minScale: 1.5, baseFontSize: 5.0 }, // Wakayama
  33: { minScale: 1.5, baseFontSize: 5.0 }, // Okayama
  34: { minScale: 1.5, baseFontSize: 5.0 }, // Hiroshima
  35: { minScale: 1.4, baseFontSize: 5.0 }, // Yamaguchi
  36: { minScale: 1.6, baseFontSize: 4.6 }, // Tokushima
  39: { minScale: 1.4, baseFontSize: 5.2 }, // Kochi
  40: { minScale: 1.5, baseFontSize: 5.0 }, // Fukuoka
  42: { minScale: 1.6, baseFontSize: 4.6 }, // Nagasaki
  44: { minScale: 1.5, baseFontSize: 4.8 }, // Oita
  45: { minScale: 1.4, baseFontSize: 5.2 }, // Miyazaki
  46: { minScale: 1.4, baseFontSize: 5.2 }, // Kagoshima
  47: { minScale: 1.3, baseFontSize: 5.4 }, // Okinawa inset

  // Tier 3: Compact & Metropolitan prefectures
  11: { minScale: 1.8, baseFontSize: 4.2 }, // Saitama
  13: { minScale: 1.8, baseFontSize: 4.2 }, // Tokyo
  14: { minScale: 1.8, baseFontSize: 4.2 }, // Kanagawa
  19: { minScale: 1.8, baseFontSize: 4.2 }, // Yamanashi
  24: { minScale: 1.8, baseFontSize: 4.4 }, // Mie
  27: { minScale: 1.8, baseFontSize: 4.0 }, // Osaka
  29: { minScale: 1.8, baseFontSize: 4.2 }, // Nara
  31: { minScale: 1.8, baseFontSize: 4.2 }, // Tottori
  32: { minScale: 1.8, baseFontSize: 4.4 }, // Shimane
  37: { minScale: 1.8, baseFontSize: 4.0 }, // Kagawa
  38: { minScale: 1.7, baseFontSize: 4.2 }, // Ehime
  41: { minScale: 1.8, baseFontSize: 4.2 }, // Saga
  43: { minScale: 1.8, baseFontSize: 4.4 }  // Kumamoto
};

export const JapanMap: React.FC<JapanMapProps> = ({
  mapData,
  onSelectPrefecture,
  selectedPrefId
}) => {
  const { language, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Pan & Zoom state
  const [scale, setScale] = useState<number>(1);
  const [translate, setTranslate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoveredPref, setHoveredPref] = useState<PrefectureMeta | null>(null);

  // Synchronous refs for instantaneous drag tracking (bypasses React state closure lag)
  const isDraggingRef = useRef<boolean>(false);
  const hasDraggedRef = useRef<boolean>(false);
  const dragStartClientPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartTranslate = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastDragEndTimeRef = useRef<number>(0);

  // Touch pinch zoom state
  const initialTouchDistance = useRef<number | null>(null);
  const initialScale = useRef<number>(1);

  // Reset zoom
  const handleResetZoom = useCallback(() => {
    NativeService.triggerLightHaptic();
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = () => {
    NativeService.triggerLightHaptic();
    setScale((prev) => Math.min(prev * 1.35, 5.0));
  };

  const handleZoomOut = () => {
    NativeService.triggerLightHaptic();
    setScale((prev) => Math.max(prev / 1.35, 0.7));
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setScale((prev) => Math.min(Math.max(prev * zoomFactor, 0.7), 5.0));
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    setIsDragging(true);
    dragStartClientPos.current = { x: e.clientX, y: e.clientY };
    dragStartTranslate.current = { x: e.clientX - translate.x, y: e.clientY - translate.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dist = Math.hypot(
      e.clientX - dragStartClientPos.current.x,
      e.clientY - dragStartClientPos.current.y
    );
    if (dist > 4) {
      hasDraggedRef.current = true;
    }
    setTranslate({
      x: e.clientX - dragStartTranslate.current.x,
      y: e.clientY - dragStartTranslate.current.y
    });
  };

  const handleMouseUp = () => {
    if (hasDraggedRef.current) {
      lastDragEndTimeRef.current = Date.now();
    }
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  // Touch handlers for mobile pan & pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      setIsDragging(true);
      dragStartClientPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      dragStartTranslate.current = {
        x: e.touches[0].clientX - translate.x,
        y: e.touches[0].clientY - translate.y
      };
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false;
      hasDraggedRef.current = true;
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialTouchDistance.current = dist;
      initialScale.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - dragStartClientPos.current.x,
        e.touches[0].clientY - dragStartClientPos.current.y
      );
      if (dist > 4) {
        hasDraggedRef.current = true;
      }
      setTranslate({
        x: e.touches[0].clientX - dragStartTranslate.current.x,
        y: e.touches[0].clientY - dragStartTranslate.current.y
      });
    } else if (e.touches.length === 2 && initialTouchDistance.current !== null) {
      hasDraggedRef.current = true;
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = (dist / initialTouchDistance.current) * initialScale.current;
      setScale(Math.min(Math.max(newScale, 0.7), 5.0));
    }
  };

  const handleTouchEnd = () => {
    if (hasDraggedRef.current) {
      lastDragEndTimeRef.current = Date.now();
    }
    isDraggingRef.current = false;
    setIsDragging(false);
    initialTouchDistance.current = null;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const preventTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    el.addEventListener('touchmove', preventTouch, { passive: false });
    return () => el.removeEventListener('touchmove', preventTouch);
  }, []);

  return (
    <div
      ref={containerRef}
      className="map-viewport"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        background: 'var(--map-ocean-bg)',
        touchAction: 'none'
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Floating Zoom Controls */}
      <div
        style={{
          position: 'absolute',
          right: 14,
          bottom: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 10
        }}
      >
        <button
          className="btn btn-secondary btn-icon glass-panel"
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          title={t.mapActions.zoomIn}
          style={{ width: 38, height: 38, borderRadius: '50%' }}
        >
          <ZoomIn size={18} />
        </button>
        <button
          className="btn btn-secondary btn-icon glass-panel"
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          title={t.mapActions.zoomOut}
          style={{ width: 38, height: 38, borderRadius: '50%' }}
        >
          <ZoomOut size={18} />
        </button>
        <button
          className="btn btn-secondary btn-icon glass-panel"
          onClick={(e) => {
            e.stopPropagation();
            handleResetZoom();
          }}
          title={t.mapActions.resetZoom}
          style={{ width: 38, height: 38, borderRadius: '50%' }}
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Hovered / Selected Prefecture Info Tooltip */}
      {hoveredPref && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            zIndex: 10,
            padding: '8px 14px',
            borderRadius: 18,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: 'var(--shadow-md)',
            border: '1.5px solid var(--accent-pink)',
            background: 'var(--bg-card-solid)'
          }}
        >
          <span style={{ fontSize: '1.15rem' }}>🗾</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              {language === 'ja' ? prefNameClean(hoveredPref.nameJa) : hoveredPref.nameEn}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {language === 'ja' ? hoveredPref.kana : hoveredPref.nameJa} • {t.regions[hoveredPref.region]}
            </div>
          </div>
        </div>
      )}

      {/* Main SVG Map - Accurate Authentic Boundaries with Safety Margins */}
      <svg
        ref={svgRef}
        viewBox="10 -15 650 660"
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: '50% 50%',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <defs>
          <filter id="active-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f43f5e" floodOpacity="0.7" />
          </filter>
        </defs>

        {/* Okinawa Inset Box Line */}
        <g id="okinawa-inset">
          <rect
            x="35"
            y="520"
            width="145"
            height="100"
            rx="10"
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="1.2"
            strokeDasharray="4,4"
          />
          <text
            x="107"
            y="535"
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="9"
            fontFamily="sans-serif"
            fontWeight="bold"
            letterSpacing="1"
          >
            {language === 'ja' ? '沖縄' : 'OKINAWA'}
          </text>
        </g>

        {/* LAYER 1: 47 Prefectures Geographic Paths */}
        <g id="prefectures-paths-layer">
          {PREFECTURES.map((pref) => {
            const visitData = mapData.prefectures[pref.id];
            const isVisited = visitData && visitData.status && visitData.status !== 'none';
            const isSelected = selectedPrefId === pref.id;

            // Determine Fill Color
            let fillColor = 'var(--pref-default)';
            if (isVisited && visitData.color) {
              fillColor = visitData.color;
            } else if (visitData?.status === 'want_to_go') {
              fillColor = 'rgba(234, 179, 8, 0.45)';
            } else if (visitData?.status === 'lived') {
              fillColor = '#8b5cf6';
            } else if (visitData?.status === 'passed') {
              fillColor = '#94a3b8';
            }

            return (
              <path
                key={pref.id}
                id={`pref-path-${pref.id}`}
                d={pref.path}
                fill={fillColor}
                stroke={isSelected ? '#ffffff' : 'var(--pref-default-stroke)'}
                strokeWidth={isSelected ? '2.5' : '0.85'}
                strokeLinejoin="round"
                filter={isSelected ? 'url(#active-glow)' : 'none'}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasDraggedRef.current || (Date.now() - lastDragEndTimeRef.current < 450)) {
                    return;
                  }
                  NativeService.triggerLightHaptic();
                  onSelectPrefecture(pref);
                }}
                onMouseEnter={() => setHoveredPref(pref)}
                onMouseLeave={() => setHoveredPref(null)}
                style={{
                  cursor: 'pointer',
                  transition: 'fill 0.2s ease, stroke 0.15s ease'
                }}
                className="prefecture-path"
              />
            );
          })}
        </g>

        {/* LAYER 2: Scaled Centered Prefecture Labels - ALWAYS IN FRONT OF ALL PREFECTURES */}
        <g id="prefectures-labels-layer" style={{ pointerEvents: 'none' }}>
          {PREFECTURES.map((pref) => {
            const tier = PREF_ZOOM_TIERS[pref.id] || { minScale: 1.6, baseFontSize: 4.2 };
            const isLabelVisible = scale >= tier.minScale;
            if (!isLabelVisible) return null;

            // Accurate label text: ONLY strip trailing suffix in Japanese (fixes 京都 bug!)
            const labelText = language === 'ja' ? prefNameClean(pref.nameJa) : pref.nameEn;

            // Dynamic scaling: keep English names bold and full-sized (no aggressive shrinking)
            const langLengthScale = language === 'en' ? Math.max(0.88, Math.min(1.0, 7.8 / Math.max(6, labelText.length))) : 1.0;
            const zoomScaleDampen = scale <= 1.8 ? 1.0 : Math.max(0.72, 1.0 - (scale - 1.8) * 0.08);
            const dynamicFontSize = tier.baseFontSize * langLengthScale * zoomScaleDampen;

            return (
              <text
                key={`label-${pref.id}`}
                x={pref.labelX}
                y={pref.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--text-primary)"
                fontSize={dynamicFontSize}
                fontWeight="800"
                fontFamily="'Zen Maru Gothic', 'Noto Sans JP', sans-serif"
                style={{
                  pointerEvents: 'none',
                  textShadow: 'var(--pref-label-shadow)',
                  transition: 'fill 0.2s ease, opacity 0.2s ease'
                }}
              >
                {labelText}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

// Helper: Only strip trailing suffix (都, 府, 県) at the END of the string
function prefNameClean(nameJa: string): string {
  return nameJa.replace(/[都府県]$/, '');
}
