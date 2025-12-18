import type React from "react";
import { useEffect, useRef, useState } from "react";

interface SwiperProps {
  showIndicators?: boolean;
  indicatorActiveColor?: string;
  indicatorInactiveColor?: string;
  loop?: boolean;
}

export default function Swiper({
  showIndicators = true,
  indicatorActiveColor = "bg-blue-500",
  indicatorInactiveColor = "bg-gray-300",
  loop = false,
}: SwiperProps = {}) {
  const [activeIndex, setActiveIndex] = useState(1); // 0: Slide 1, 1: Slide 2, 2: Slide 3
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 슬라이드 설정 상수
  const SLIDE_WIDTH = 234;
  const SLIDE_HEIGHT = 169;
  const SLIDE_GAP = 24;
  const SLIDE_OFFSET = SLIDE_WIDTH + SLIDE_GAP; // 308px

  const slides = [
    { id: 1, bg: "from-indigo-500 to-purple-600" },
    { id: 2, bg: "from-pink-400 to-red-500" },
    { id: 3, bg: "from-blue-400 to-cyan-400" },
  ];

  const handleStart = (clientX: number) => {
    setStartX(clientX);
    setCurrentX(clientX);
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const diff = startX - currentX;
    const threshold = 50; // 최소 swipe 거리

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // 오른쪽으로 swipe (다음 슬라이드)
        if (loop) {
          // 루프 모드: 마지막 슬라이드에서 첫 번째로
          setActiveIndex((activeIndex + 1) % slides.length);
        } else if (activeIndex < slides.length - 1) {
          setActiveIndex(activeIndex + 1);
        }
      } else if (diff < 0) {
        // 왼쪽으로 swipe (이전 슬라이드)
        if (loop) {
          // 루프 모드: 첫 번째 슬라이드에서 마지막으로
          setActiveIndex((activeIndex - 1 + slides.length) % slides.length);
        } else if (activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
        }
      }
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  // 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // 마우스 이벤트 (데스크톱)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  // 슬라이드 위치 계산 함수
  const getSlideTransform = (index: number) => {
    const dragOffset = isDragging ? (startX - currentX) / 10 : 0; // 드래그 감도 조절

    if (index === activeIndex) {
      // 활성 슬라이드를 중심으로 이동
      return `translateX(calc(-50% + ${dragOffset}px))`;
    }

    // 루프 모드일 때 이전/다음 슬라이드 계산
    let prevIndex = activeIndex - 1;
    let nextIndex = activeIndex + 1;

    if (loop) {
      prevIndex = (activeIndex - 1 + slides.length) % slides.length;
      nextIndex = (activeIndex + 1) % slides.length;
    }

    if (index === prevIndex) {
      // 이전 슬라이드 (왼쪽)
      return `translateX(calc(-50% - ${SLIDE_OFFSET}px + ${dragOffset}px))`;
    } else if (index === nextIndex) {
      // 다음 슬라이드 (오른쪽)
      return `translateX(calc(-50% + ${SLIDE_OFFSET}px + ${dragOffset}px))`;
    } else {
      // 나머지 슬라이드들
      if (loop) {
        // 루프 모드에서는 가장 가까운 거리 계산
        let distance = Math.abs(index - activeIndex);
        const reverseDistance = slides.length - distance;

        // 더 가까운 경로 선택
        if (reverseDistance < distance) {
          distance = reverseDistance;
          const direction =
            (activeIndex + reverseDistance) % slides.length === index ? 1 : -1;
          return `translateX(calc(-50% + ${
            direction * distance * SLIDE_OFFSET
          }px + ${dragOffset}px))`;
        } else {
          const direction = index < activeIndex ? -1 : 1;
          return `translateX(calc(-50% + ${
            direction * distance * SLIDE_OFFSET
          }px + ${dragOffset}px))`;
        }
      } else {
        // 일반 모드
        const distance = Math.abs(index - activeIndex);
        const direction = index < activeIndex ? -1 : 1;
        return `translateX(calc(-50% + ${
          direction * distance * SLIDE_OFFSET
        }px + ${dragOffset}px))`;
      }
    }
  };

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX);
      };
      const handleGlobalMouseUp = () => {
        handleEnd();
      };

      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging, startX, currentX, activeIndex, slides.length, loop]);

  return (
    <div className="w-full max-w-[800px] mx-auto py-8">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: `${SLIDE_HEIGHT}px` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="flex w-full h-full relative justify-center items-center">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            const transform = getSlideTransform(index);

            return (
              <div
                key={slide.id}
                className={`absolute flex items-center justify-center transition-all duration-300 ease-in-out left-1/2 ${
                  isActive
                    ? "opacity-100 z-[2]"
                    : "opacity-80 hover:opacity-90 z-[1]"
                }`}
                style={{
                  width: `${SLIDE_WIDTH}px`,
                  height: `${SLIDE_HEIGHT}px`,
                  transform: transform,
                  transition: isDragging
                    ? "none"
                    : "transform 0.3s ease, opacity 0.3s ease",
                }}
              >
                <div
                  className={`w-full h-full flex items-center justify-center text-3xl font-bold rounded-xl text-white shadow-lg bg-gradient-to-br ${slide.bg}`}
                >
                  Slide {slide.id}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showIndicators && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? indicatorActiveColor
                  : indicatorInactiveColor
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
