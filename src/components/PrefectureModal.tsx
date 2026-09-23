import React, { useState, useEffect } from 'react';
import { PrefectureMeta, PrefectureVisitData, VisitStatus } from '../types';
import { COLOR_PRESETS } from '../data/prefectures';
import { useLanguage } from '../i18n/LanguageContext';
import { X, Check, Star, Trash2, Calendar, MapPin, Sparkles, Paintbrush } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NativeService } from '../services/nativeService';

interface PrefectureModalProps {
  prefecture: PrefectureMeta | null;
  currentData?: PrefectureVisitData;
  onClose: () => void;
  onSave: (prefId: number, data: Partial<PrefectureVisitData>) => void;
  onClear: (prefId: number) => void;
}

export const PrefectureModal: React.FC<PrefectureModalProps> = ({
  prefecture,
  currentData,
  onClose,
  onSave,
  onClear
}) => {
  const { language, t } = useLanguage();

  const [status, setStatus] = useState<VisitStatus>('visited');
  const [selectedColor, setSelectedColor] = useState<string>('#F43F5E');
  const [visitDate, setVisitDate] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    if (prefecture) {
      if (currentData) {
        setStatus(currentData.status || 'visited');
        setSelectedColor(currentData.color || '#F43F5E');
        setVisitDate(currentData.visitDate || '');
        setRating(currentData.rating || 5);
        setNotes(currentData.notes || '');
      } else {
        setStatus('visited');
        setSelectedColor('#F43F5E');
        setVisitDate(new Date().toISOString().slice(0, 7)); // e.g. "2026-09"
        setRating(5);
        setNotes('');
      }
    }
  }, [prefecture, currentData]);

  if (!prefecture) return null;

  const handleSave = () => {
    NativeService.triggerSuccessHaptic();
    onSave(prefecture.id, {
      status,
      color: selectedColor,
      visitDate,
      rating,
      notes
    });

    if (status === 'visited') {
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: [selectedColor, '#fb7185', '#38bdf8', '#f59e0b']
        });
      } catch {
        // ignore
      }
    }

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 450);
  };

  const handleClear = () => {
    NativeService.triggerLightHaptic();
    onClear(prefecture.id);
    onClose();
  };

  const statusOptions: { key: VisitStatus; emoji: string; label: string }[] = [
    { key: 'visited', emoji: '🚩', label: t.statuses.visited },
    { key: 'want_to_go', emoji: '✨', label: t.statuses.want_to_go },
    { key: 'lived', emoji: '🏠', label: t.statuses.lived },
    { key: 'passed', emoji: '🚄', label: t.statuses.passed }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-slide-up"
        style={{
          background: 'var(--bg-card-solid)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTop: '1px solid var(--border-subtle)',
          padding: '20px 20px 32px',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pull Drawer Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ width: 42, height: 5, borderRadius: 99, background: 'var(--border-subtle)' }} />
        </div>

        {/* Header: Prefecture Name & Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {language === 'ja' ? prefecture.nameJa : prefecture.nameEn}
              </h2>
              <span
                className="badge"
                style={{
                  background: 'rgba(244, 63, 94, 0.12)',
                  color: '#e11d48',
                  border: '1px solid rgba(244, 63, 94, 0.25)'
                }}
              >
                {t.regions[prefecture.region]}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 2 }}>
              {language === 'ja' ? `${prefecture.kana} • ${prefecture.nameEn}` : `${prefecture.nameJa} • ${prefecture.kana}`}
            </p>
          </div>

          <button
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            style={{ width: 34, height: 34, borderRadius: '50%', color: 'var(--text-primary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Highlight details box */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            borderRadius: 14,
            padding: '10px 14px',
            marginBottom: 20,
            fontSize: '0.82rem',
            lineHeight: 1.4,
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#d97706', fontWeight: 700, marginBottom: 4 }}>
            <Sparkles size={14} />
            <span>{t.prefectureModal.famousFor}</span>
          </div>
          <div style={{ color: 'var(--text-primary)' }}>
            {language === 'ja' ? prefecture.highlightJa : prefecture.highlightEn}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', marginTop: 6, fontSize: '0.76rem' }}>
            <MapPin size={12} />
            <span>
              {t.prefectureModal.capital}: {language === 'ja' ? prefecture.capitalJa : prefecture.capitalEn}
            </span>
          </div>
        </div>

        {/* 1. Visit Status Selector */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
            {t.prefectureModal.visitedTitle}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {statusOptions.map((opt) => {
              const isCurrent = status === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    NativeService.triggerLightHaptic();
                    setStatus(opt.key);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    borderRadius: 12,
                    fontSize: '0.82rem',
                    fontWeight: isCurrent ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: isCurrent ? 'rgba(244, 63, 94, 0.15)' : 'var(--bg-elevated)',
                    color: isCurrent ? '#f43f5e' : 'var(--text-primary)',
                    border: isCurrent ? '1.5px solid #f43f5e' : '1px solid var(--border-subtle)',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{opt.emoji}</span>
                  <span style={{ flex: 1 }}>{opt.label.split(' ')[0]}</span>
                  {isCurrent && <Check size={16} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Color Palette Selection */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Paintbrush size={15} color="#f43f5e" />
              <span>{t.prefectureModal.selectColor}</span>
            </label>

            {/* Custom Color Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                style={{
                  width: 28,
                  height: 28,
                  padding: 0,
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  background: 'transparent'
                }}
                title={t.prefectureModal.customColor}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace', fontWeight: 700 }}>
                {selectedColor.toUpperCase()}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {COLOR_PRESETS.map((preset) => {
              const isSelected = selectedColor.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => {
                    NativeService.triggerLightHaptic();
                    setSelectedColor(preset.hex);
                  }}
                  title={language === 'ja' ? preset.nameJa : preset.nameEn}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: preset.hex,
                    border: isSelected ? '3px solid #ffffff' : '2px solid rgba(0,0,0,0.15)',
                    boxShadow: isSelected ? `0 0 10px ${preset.hex}` : 'none',
                    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isSelected && <Check size={18} color="#ffffff" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Visit Date & Rating */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <Calendar size={14} color="#0ea5e9" />
              <span>{t.prefectureModal.visitDate}</span>
            </label>
            <input
              type="month"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 10,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <Star size={14} color="#f59e0b" />
              <span>{t.prefectureModal.rating}</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 38 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    NativeService.triggerLightHaptic();
                    setRating(star);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 2,
                    cursor: 'pointer',
                    color: star <= rating ? '#f59e0b' : 'rgba(0,0,0,0.2)',
                    transition: 'transform 0.1s'
                  }}
                >
                  <Star size={20} fill={star <= rating ? '#f59e0b' : 'none'} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Travel Notes / Memories */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
            {t.prefectureModal.notes}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t.prefectureModal.notesPlaceholder}
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 12,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontFamily: 'inherit',
              resize: 'none'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          {currentData && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              title={t.prefectureModal.clear}
            >
              <Trash2 size={16} />
            </button>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            style={{ flex: 1, padding: '12px 18px', fontSize: '0.95rem' }}
          >
            {showToast ? t.prefectureModal.savedSuccess : t.prefectureModal.save}
          </button>
        </div>
      </div>
    </div>
  );
};
