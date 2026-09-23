import React, { useState } from 'react';
import { JapanMapData } from '../types';
import { PREFECTURES, REGIONS } from '../data/prefectures';
import { useLanguage } from '../i18n/LanguageContext';
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { NativeService } from '../services/nativeService';

interface StatsBarProps {
  mapData: JapanMapData;
}

export const StatsBar: React.FC<StatsBarProps> = ({ mapData }) => {
  const { language, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Calculate visited count & percentage
  const visitedPrefectures = Object.entries(mapData.prefectures).filter(
    ([, v]) => v && v.status && v.status !== 'none'
  );
  const visitedCount = visitedPrefectures.length;
  const totalCount = PREFECTURES.length; // 47
  const percentage = Math.round((visitedCount / totalCount) * 100);

  // Determine Level Title
  let levelTitle = t.stats.levelStarter;
  if (visitedCount >= 47) {
    levelTitle = t.stats.levelMaster;
  } else if (visitedCount >= 30) {
    levelTitle = t.stats.levelAdvanced;
  } else if (visitedCount >= 15) {
    levelTitle = t.stats.levelIntermediate;
  } else if (visitedCount >= 5) {
    levelTitle = t.stats.levelBeginner;
  }

  // Calculate regional completion
  const regionStats = REGIONS.map((region) => {
    const prefsInRegion = PREFECTURES.filter((p) => p.region === region.id);
    const visitedInRegion = prefsInRegion.filter((p) => {
      const v = mapData.prefectures[p.id];
      return v && v.status && v.status !== 'none';
    }).length;
    return {
      ...region,
      total: prefsInRegion.length,
      visited: visitedInRegion,
      pct: Math.round((visitedInRegion / prefsInRegion.length) * 100)
    };
  });

  return (
    <div
      className="glass-panel"
      style={{
        margin: '10px 14px 6px',
        padding: '12px 14px',
        borderRadius: 16,
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Top Header Row: Counter, Level & Expand Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
          cursor: 'pointer'
        }}
        onClick={() => {
          NativeService.triggerLightHaptic();
          setIsExpanded(!isExpanded);
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f43f5e, #f59e0b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(244, 63, 94, 0.4)'
            }}
          >
            <Trophy size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {levelTitle}
            </div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <span>{visitedCount}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}> / {totalCount}</span>
              <span style={{ marginLeft: 6, fontSize: '0.82rem', color: '#f43f5e' }}>
                ({percentage}%)
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-icon"
          style={{ width: 28, height: 28, borderRadius: '50%', color: 'var(--text-primary)' }}
          aria-label="Toggle details"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: 7,
          background: 'var(--bg-elevated)',
          borderRadius: 99,
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #f43f5e, #fb7185, #f59e0b)',
            borderRadius: 99,
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 10px rgba(244, 63, 94, 0.4)'
          }}
        />
      </div>

      {/* Expanded Region Breakdown Pills */}
      {isExpanded && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 6
          }}
        >
          {regionStats.map((r) => (
            <div
              key={r.id}
              style={{
                background: 'var(--bg-elevated)',
                padding: '6px 8px',
                borderRadius: 8,
                fontSize: '0.72rem',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)', fontWeight: 600 }}>
                <span>{language === 'ja' ? r.nameJa : r.nameEn}</span>
                <span style={{ color: r.visited > 0 ? '#f43f5e' : 'var(--text-muted)' }}>
                  {r.visited}/{r.total}
                </span>
              </div>
              <div style={{ width: '100%', height: 3, background: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${r.pct}%`,
                    height: '100%',
                    background: r.color,
                    borderRadius: 2
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
