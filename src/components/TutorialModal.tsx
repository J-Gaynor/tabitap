import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { NativeService } from '../services/nativeService';
import { X, ChevronRight, ChevronLeft, Check, Sparkles, MapPin, Users, Compass } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Reset to first slide when reopened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const slides = [
    {
      icon: <Sparkles size={32} color="#f43f5e" />,
      accentColor: '#f43f5e',
      bgGradient: 'linear-gradient(135deg, rgba(244,63,94,0.12), rgba(249,115,22,0.08))',
      badge: t.tutorial.slide1Badge,
      title: t.tutorial.slide1Title,
      description: t.tutorial.slide1Desc,
      highlights: [t.tutorial.slide1Highlight1, t.tutorial.slide1Highlight2]
    },
    {
      icon: <MapPin size={32} color="#0ea5e9" />,
      accentColor: '#0ea5e9',
      bgGradient: 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(16,185,129,0.08))',
      badge: t.tutorial.slide2Badge,
      title: t.tutorial.slide2Title,
      description: t.tutorial.slide2Desc,
      highlights: [t.tutorial.slide2Highlight1, t.tutorial.slide2Highlight2]
    },
    {
      icon: <Users size={32} color="#8b5cf6" />,
      accentColor: '#8b5cf6',
      bgGradient: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.08))',
      badge: t.tutorial.slide3Badge,
      title: t.tutorial.slide3Title,
      description: t.tutorial.slide3Desc,
      highlights: [t.tutorial.slide3Highlight1, t.tutorial.slide3Highlight2]
    },
    {
      icon: <Compass size={32} color="#10b981" />,
      accentColor: '#10b981',
      bgGradient: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(234,179,8,0.08))',
      badge: t.tutorial.slide4Badge,
      title: t.tutorial.slide4Title,
      description: t.tutorial.slide4Desc,
      highlights: [t.tutorial.slide4Highlight1, t.tutorial.slide4Highlight2]
    }
  ];

  const currentSlide = slides[currentStep];
  const isLastStep = currentStep === slides.length - 1;

  const handleNext = () => {
    NativeService.triggerLightHaptic();
    if (isLastStep) {
      handleClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    NativeService.triggerLightHaptic();
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    NativeService.triggerLightHaptic();
    try {
      localStorage.setItem('issho_tutorial_seen', 'true');
    } catch {
      // Ignore localStorage errors in private mode
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: 16
      }}
      onClick={handleClose}
    >
      <div
        className="glass-panel animate-scale-up"
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--bg-card-solid)',
          borderRadius: 28,
          border: '1.5px solid var(--border-subtle)',
          padding: '24px 20px 20px',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Step Badge & Skip Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 20,
              background: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {currentStep + 1} / {slides.length}
          </span>

          <button
            className="btn btn-ghost"
            onClick={handleClose}
            style={{
              padding: '4px 10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--text-muted)'
            }}
          >
            {t.tutorial.skip} <X size={14} style={{ marginLeft: 4 }} />
          </button>
        </div>

        {/* Illustrated Slide Hero Card */}
        <div
          style={{
            borderRadius: 20,
            padding: '24px 18px',
            background: currentSlide.bgGradient,
            border: `1.5px solid ${currentSlide.accentColor}33`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: 20,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--bg-card-solid)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              marginBottom: 12
            }}
          >
            {currentSlide.icon}
          </div>

          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: currentSlide.accentColor,
              marginBottom: 6,
              letterSpacing: '0.02em'
            }}
          >
            {currentSlide.badge}
          </span>

          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: 10,
              lineHeight: 1.3
            }}
          >
            {currentSlide.title}
          </h3>

          <p
            style={{
              fontSize: '0.86rem',
              lineHeight: 1.55,
              color: 'var(--text-secondary)',
              margin: 0
            }}
          >
            {currentSlide.description}
          </p>
        </div>

        {/* Feature Highlights Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {currentSlide.highlights.map((hl, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                background: 'var(--bg-elevated)',
                padding: '10px 14px',
                borderRadius: 14,
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: currentSlide.accentColor,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Check size={12} strokeWidth={3} />
              </div>
              <span style={{ lineHeight: 1.35 }}>{hl}</span>
            </div>
          ))}
        </div>

        {/* Dots Step Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 20
          }}
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                NativeService.triggerLightHaptic();
                setCurrentStep(idx);
              }}
              style={{
                width: currentStep === idx ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: currentStep === idx ? currentSlide.accentColor : 'var(--border-subtle)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.25s ease'
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          {currentStep > 0 && (
            <button
              className="btn btn-secondary"
              onClick={handlePrev}
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: 16,
                fontWeight: 700,
                fontSize: '0.9rem'
              }}
            >
              <ChevronLeft size={16} />
              <span>{t.tutorial.prev}</span>
            </button>
          )}

          <button
            className="btn btn-primary"
            onClick={handleNext}
            style={{
              flex: 2,
              padding: '12px 18px',
              borderRadius: 16,
              fontWeight: 800,
              fontSize: '0.92rem',
              background: isLastStep ? 'linear-gradient(135deg, #10b981, #059669)' : undefined,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <span>{isLastStep ? t.tutorial.getStarted : t.tutorial.next}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
