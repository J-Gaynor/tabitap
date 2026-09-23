import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface SwipeContainerProps {
  currentIndex: number;
  totalCount: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onOpenCreatePage?: () => void;
  children: React.ReactNode;
}

export const SwipeContainer: React.FC<SwipeContainerProps> = ({
  currentIndex,
  totalCount,
  onSwipeLeft,
  onSwipeRight,
  onOpenCreatePage,
  children
}) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isEdgeSwipe = useRef<boolean>(false);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);

  const minSwipeDistance = 60;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
    // Only engage swipe container if initiated from screen edges (<= 45px) so map panning remains smooth
    isEdgeSwipe.current = touchStartX.current <= 45 || touchStartX.current >= screenWidth - 45;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isEdgeSwipe.current || touchStartX.current === null || touchStartY.current === null) return;
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Only apply horizontal swipe if horizontal movement is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      setSwipeOffset(diffX * 0.4);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    if (isEdgeSwipe.current) {
      const touchEndX = e.changedTouches[0].clientX;
      const distance = touchEndX - touchStartX.current;

      if (distance > minSwipeDistance) {
        // Swiped right (previous map)
        onSwipeRight();
      } else if (distance < -minSwipeDistance) {
        // Swiped left (next map only if not on last map)
        onSwipeLeft();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    isEdgeSwipe.current = false;
    setSwipeOffset(0);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transform: `translateX(${swipeOffset}px)`,
          transition: swipeOffset === 0 ? 'transform 0.2s ease-out' : 'none'
        }}
      >
        {children}
      </div>

      {/* Floating Left Arrow (Previous Map) */}
      {currentIndex > 0 && (
        <button
          className="btn btn-ghost btn-icon"
          onClick={onSwipeRight}
          style={{
            position: 'absolute',
            left: 8,
            top: '48%',
            transform: 'translateY(-50%)',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            color: '#cbd5e1',
            width: 32,
            height: 32,
            borderRadius: '50%',
            zIndex: 15
          }}
          title="Previous Map"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Floating Right Navigation or Plus Button (Create New Map) */}
      {currentIndex < totalCount - 1 ? (
        <button
          className="btn btn-ghost btn-icon"
          onClick={onSwipeLeft}
          style={{
            position: 'absolute',
            right: 8,
            top: '48%',
            transform: 'translateY(-50%)',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            color: '#cbd5e1',
            width: 32,
            height: 32,
            borderRadius: '50%',
            zIndex: 15
          }}
          title="Next Map"
        >
          <ChevronRight size={18} />
        </button>
      ) : onOpenCreatePage ? (
        <button
          className="btn btn-ghost btn-icon"
          onClick={onOpenCreatePage}
          style={{
            position: 'absolute',
            right: 8,
            top: '48%',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(135deg, #f43f5e, #fb7185)',
            boxShadow: '0 2px 10px rgba(244, 63, 94, 0.4)',
            color: '#ffffff',
            width: 34,
            height: 34,
            borderRadius: '50%',
            zIndex: 15
          }}
          title="New Map"
        >
          <Plus size={19} />
        </button>
      ) : null}
    </div>
  );
};
