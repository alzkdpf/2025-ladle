import React, { useState } from "react";
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
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

type CardCarouselProps = {
  image1Url?: string;
  image2Url?: string;
  image3Url?: string;
};

type CardData = {
  id: number;
  image: string;
};

export default function CardCarousel({
  image1Url = "https://picsum.photos/id/1015/600/600",
  image2Url = "https://picsum.photos/id/1018/600/600",
  image3Url = "https://picsum.photos/id/1019/600/600",
}: CardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(1);

  const cards: CardData[] = [
    { id: 1, image: image1Url },
    { id: 2, image: image2Url },
    { id: 3, image: image3Url },
  ];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === cards.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const getCardStyles = (index: number) => {
    const position =
      (index - currentIndex + cards.length) % cards.length;
    const normalizedPosition =
      position > 1 ? position - cards.length : position;
    return {
      rotation: normalizedPosition * 5,
      zIndex: normalizedPosition === 0 ? 10 : 0,
      xPosition: `calc(${normalizedPosition} * (clamp(100px, 15vw, 180px)))`,
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
          const { rotation, zIndex, xPosition } =
            getCardStyles(index);
          return (
            <Card
              key={card.id}
              initial={false}
              animate={{
                x: xPosition,
                rotate: rotation,
                zIndex: zIndex,
                scale: index === currentIndex ? 1 : 0.9,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              style={{
                backgroundImage: `url(${card.image})`,
              }}
              role="group"
              aria-label={`Slide ${index + 1} of ${cards.length}`}
              aria-hidden={index !== currentIndex}
            />
          );
        })}
      </CarouselContainer>
      <Controls>
        <Button
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button onClick={goToNext} aria-label="Next slide">
          <ChevronRight aria-hidden="true" />
        </Button>
      </Controls>
    </CarouselWrapper>
  );
}
