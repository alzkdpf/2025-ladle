import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styled from "styled-components";

const CarouselWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  min-width: 280px;
  @media (min-width: 768px) {
    min-height: 180px;
    min-width: 340px;
  }
  @media (min-width: 1024px) {
    min-height: 240px;
    min-width: 400px;
  }
`;

const Card = styled(motion.div)`
  position: absolute;
  width: 8rem;
  height: 8rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  overflow: hidden;
  border: 2px solid white;
  background-size: cover;
  background-position: center;
  @media (min-width: 768px) {
    width: 14rem;
    height: 14rem;
    border-radius: 1.5rem;
    border-width: 4px;
  }
  @media (min-width: 1024px) {
    width: 16rem;
    height: 16rem;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 2rem;
  @media (min-width: 768px) {
    gap: 1rem;
  }
`;

const Button = styled.button`
  border-radius: 9999px;
  height: 2.5rem;
  width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background-color: rgb(243 244 246);
  border: 1px solid rgb(229 231 235);
  cursor: pointer;
  transition: all 0.2s;
  color: rgb(55 65 81);
  &:hover {
    background-color: rgb(229 231 235);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgb(96 165 250 / 0.5);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

type CardCarouselProps = {
  items?: Array<string | { id?: number | string; image?: string; imageUrl?: string }>;
};

type CardData = {
  id: number | string;
  image: string;
};

const CARD_SPACING = "clamp(100px, 15vw, 180px)";

export default function CardCarousel({
  items
}: CardCarouselProps) {
  const cards = useMemo<CardData[]>(() => {
    if (items && items.length > 0) {
      return items
        .map((entry, index) => {
          if (typeof entry === "string") {
            return { id: index, image: entry };
          }
          const image = entry.image ?? entry.imageUrl;
          if (!image) {
            return undefined;
          }
          return {
            id: entry.id ?? index,
            image,
          };
        })
        .filter((card): card is CardData => Boolean(card?.image));
    }

    return [];

  }, [items]);

  const [currentIndex, setCurrentIndex] = useState(() =>
    cards.length ? Math.min(Math.floor(cards.length / 2), cards.length - 1) : 0,
  );

  useEffect(() => {
    if (cards.length === 0) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prevIndex) => {
      if (prevIndex < cards.length) {
        return prevIndex;
      }
      return cards.length - 1;
    });
  }, [cards.length]);

  if (cards.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    if (cards.length <= 1) {
      return;
    }
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    if (cards.length <= 1) {
      return;
    }
    setCurrentIndex((prevIndex) =>
      prevIndex === cards.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const getCardStyles = (index: number) => {
    if (cards.length === 1) {
      return {
        isCurrent: true,
        isVisible: true,
        rotation: 0,
        zIndex: 2,
        xPosition: 0,
        scale: 1,
        opacity: 1,
      };
    }

    const total = cards.length;
    let relative = index - currentIndex;
    if (relative > total / 2) {
      relative -= total;
    } else if (relative < -total / 2) {
      relative += total;
    }

    const isCurrent = relative === 0;
    const isVisible = Math.abs(relative) <= 1 || total === 2;
    return {
      isCurrent,
      isVisible,
      rotation: isVisible ? relative * 5 : 0,
      zIndex: isCurrent ? 3 : isVisible ? 2 : 1,
      xPosition: isVisible ? `calc(${relative} * ${CARD_SPACING})` : 0,
      scale: isCurrent ? 1 : isVisible ? 0.92 : 0.85,
      opacity: isVisible ? 1 : 0,
    };
  };

  return (
    <CarouselWrapper>
      <CarouselContainer
        role="region"
        aria-label="Image carousel"
        aria-roledescription="carousel"
      >
        {cards.map((card, index) => {
          const { rotation, zIndex, xPosition, scale, opacity, isVisible } =
            getCardStyles(index);
          return (
            <Card
              key={card.id}
              initial={false}
              animate={{
                x: xPosition,
                rotate: rotation,
                zIndex: zIndex,
                scale: scale,
                opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              style={{
                backgroundImage: `url(${card.image})`,
                pointerEvents: isVisible ? "auto" : "none",
              }}
              role="group"
              aria-label={`Slide ${index + 1} of ${cards.length}`}
              aria-hidden={!isVisible}
            />
          );
        })}
      </CarouselContainer>
      <Controls>
        <Button
          onClick={goToPrevious}
          aria-label="Previous slide"
          disabled={cards.length <= 1}
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button
          onClick={goToNext}
          aria-label="Next slide"
          disabled={cards.length <= 1}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </Controls>
    </CarouselWrapper>
  );
}
