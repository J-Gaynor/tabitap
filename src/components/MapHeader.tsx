import React from 'react';
import { JapanMapData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { Share2, Settings, Sliders, Crown, Users } from 'lucide-react';
import { NativeService } from '../services/nativeService';

interface MapHeaderProps {
  activeMap: JapanMapData;
  mapsCount: number;
  activeMapIndex: number;
  isOwner: boolean;
  isPro: boolean;
  onOpenShare: () => void;
  onOpenMapSettings: () => void;
  onOpenGlobalSettings: () => void;
  onOpenProModal: () => void;
}

export const MapHeader: React.FC<MapHeaderProps> = ({
  activeMap,
  mapsCount,
  activeMapIndex,
  isOwner,
  isPro,
  onOpenShare,
  onOpenMapSettings,
  onOpenGlobalSettings,
  onOpenProModal
}) => {
  const { t } = useLanguage();

  return (
    <header
      className="glass-panel"
      style={{
        paddingTop: 'max(14px, calc(env(safe-area-inset-top, 0px) + 8px))',
        paddingLeft: '14px',
        paddingRight: '14px',
        paddingBottom: '10px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-card)',
        zIndex: 20
      }}
    >
      {/* Top Utility Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        {/* Brand Title (No Emoji) & Pro Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.08rem',
              letterSpacing: '-0.3px',
              color: 'var(--text-primary)'
            }}
          >
            {t.appName}
          </span>

          {isPro ? (
            <span
              className="badge badge-pro"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                NativeService.triggerLightHaptic();
                onOpenProModal();
              }}
            >
              <Crown size={11} />
              PRO
            </span>
          ) : (
            <button
              className="badge"
              onClick={() => {
                NativeService.triggerLightHaptic();
                onOpenProModal();
              }}
              style={{
                background: 'rgba(245, 158, 11, 0.12)',
                color: '#d97706',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                cursor: 'pointer'
              }}
            >
              <Crown size={11} />
              PRO
            </button>
          )}
        </div>

        {/* Action icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Global App Settings */}
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => {
              NativeService.triggerLightHaptic();
              onOpenGlobalSettings();
            }}
            title={t.settings}
            style={{ width: 34, height: 34, color: 'var(--text-primary)' }}
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Main Map Title & Share Actions Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', flex: 1, marginRight: 8 }}>
          <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{activeMap.emoji || '🗾'}</span>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h1
                style={{
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  margin: 0
                }}
              >
                {activeMap.title}
              </h1>
              {activeMap.isShared && (
                <span className="badge badge-shared" title="Collaborative Map" style={{ flexShrink: 0 }}>
                  <Users size={10} />
                  {activeMap.collaborators.length}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 1 }}>
              {isOwner ? t.makerRole : t.collaboratorRole}
            </div>
          </div>
        </div>

        {/* Map Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {/* Share Button */}
          <button
            className="btn btn-secondary"
            onClick={() => {
              NativeService.triggerLightHaptic();
              onOpenShare();
            }}
            style={{ padding: '6px 10px', fontSize: '0.78rem', gap: 5, borderRadius: 10, color: 'var(--text-primary)' }}
          >
            <Share2 size={14} color="#0284c7" />
            <span>{t.share}</span>
          </button>

          {/* Map Settings / Options */}
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => {
              NativeService.triggerLightHaptic();
              onOpenMapSettings();
            }}
            title={t.mapSettings}
            style={{ width: 34, height: 34, borderRadius: 10, color: 'var(--text-primary)' }}
          >
            <Sliders size={15} />
          </button>
        </div>
      </div>

      {/* Map Switcher Indicator Dots (Clean & Minimal - No redundant button) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          marginTop: 8,
          paddingTop: 6,
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        {Array.from({ length: mapsCount }).map((_, idx) => (
          <div
            key={idx}
            style={{
              width: activeMapIndex === idx ? 18 : 6,
              height: 5,
              borderRadius: 99,
              background:
                activeMapIndex === idx
                  ? 'linear-gradient(90deg, #f43f5e, #fb7185)'
                  : 'var(--border-subtle)',
              transition: 'all 0.25s ease'
            }}
          />
        ))}
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: 4 }}>
          {activeMapIndex + 1}/{mapsCount}
        </span>
      </div>
    </header>
  );
};
