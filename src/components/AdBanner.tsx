import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Sparkles } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

interface AdBannerProps {
  isPro: boolean;
  onOpenProModal: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ isPro, onOpenProModal }) => {
  const { t } = useLanguage();
  const [adIndex, setAdIndex] = useState<number>(0);

  const ads = [
    {
      emoji: '🚄',
      title: t.ads.sampleAd1Title,
      desc: t.ads.sampleAd1Desc,
      tag: 'JR PASS'
    },
    {
      emoji: '♨️',
      title: t.ads.sampleAd2Title,
      desc: t.ads.sampleAd2Desc,
      tag: 'HOTEL'
    },
    {
      emoji: '📶',
      title: t.ads.sampleAd3Title,
      desc: t.ads.sampleAd3Desc,
      tag: 'eSIM 5G'
    }
  ];

  // Rotate ads every 12 seconds
  useEffect(() => {
    if (isPro || Capacitor.isNativePlatform()) return;
    const interval = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % ads.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [isPro, ads.length]);

  // On native platforms (iOS/Android), real native Google AdMob banner overlay is shown instead
  if (isPro || Capacitor.isNativePlatform()) {
    return null;
  }

  const currentAd = ads[adIndex];

  return (
    <aside
      className="glass-panel"
      aria-label={t.ads.sponsored}
      style={{
        margin: '6px 12px 10px',
        padding: '8px 12px',
        borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(30, 41, 67, 0.75), rgba(15, 23, 42, 0.85))',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', flex: 1 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            flexShrink: 0
          }}
        >
          {currentAd.emoji}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                background: 'rgba(255,255,255,0.12)',
                color: '#94a3b8',
                padding: '1px 5px',
                borderRadius: 4
              }}
            >
              {t.ads.sponsored}
            </span>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#f8fafc',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}
            >
              {currentAd.title}
            </span>
          </div>
          <p
            style={{
              fontSize: '0.7rem',
              color: '#94a3b8',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              marginTop: 1
            }}
          >
            {currentAd.desc}
          </p>
        </div>
      </div>

      {/* Remove Ads Pro Trigger Button */}
      <button
        onClick={onOpenProModal}
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          color: '#fbbf24',
          borderRadius: 8,
          padding: '4px 8px',
          fontSize: '0.68rem',
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          flexShrink: 0
        }}
      >
        <Sparkles size={11} />
        <span>{t.ads.removeAds}</span>
      </button>
    </aside>
  );
};
