import React, { useState, useEffect, useRef } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const isPulling = useRef(false);

  const handleTouchStart = (e: TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling.current || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0 && containerRef.current?.scrollTop === 0) {
      e.preventDefault();
      const pullDistance = Math.min(distance * 0.5, 100);
      setPullDistance(pullDistance);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling.current) return;

    isPulling.current = false;

    if (pullDistance > 50 && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, isRefreshing]);

  return (
    <div ref={containerRef} className="h-full overflow-auto">
      {/* 下拉刷新指示器 */}
      <div 
        className="flex items-center justify-center py-4 transition-all duration-300"
        style={{ 
          transform: `translateY(${pullDistance}px)`,
          opacity: pullDistance > 0 ? 1 : 0
        }}
      >
        <div className="flex items-center space-x-2 text-gray-500">
          {isRefreshing ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">正在刷新...</span>
            </>
          ) : (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full"></div>
              <span className="text-sm">下拉刷新</span>
            </>
          )}
        </div>
      </div>

      {/* 内容 */}
      <div style={{ transform: `translateY(${Math.max(0, pullDistance)}px)` }}>
        {children}
      </div>
    </div>
  );
} 