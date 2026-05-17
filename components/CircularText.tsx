"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion, useAnimation } from "motion/react";

import "./CircularText.css";

type HoverMode = "slowDown" | "speedUp" | "pause" | "goBonkers";

type CircularTextProps = {
  text: string;
  spinDuration?: number;
  onHover?: HoverMode;
  className?: string;
  centerContent?: ReactNode;
  radius?: number;
};

export default function CircularText({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
  centerContent,
  radius = 74,
}: CircularTextProps) {
  const letters = Array.from(text || "");
  const controls = useAnimation();
  const [currentDuration, setCurrentDuration] = useState(spinDuration);
  const [isPaused, setIsPaused] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    controls.start({
      rotate: 360,
      scale,
      transition: {
        rotate: {
          ease: "linear",
          duration: currentDuration,
          repeat: Infinity,
          type: "tween",
        },
        scale: {
          type: "spring",
          damping: 20,
          stiffness: 300,
        },
      },
    });
  }, [controls, currentDuration, scale, text]);

  useEffect(() => {
    if (isPaused) {
      controls.stop();
    } else {
      controls.start({
        rotate: 360,
        scale,
        transition: {
          rotate: {
            ease: "linear",
            duration: currentDuration,
            repeat: Infinity,
            type: "tween",
          },
          scale: {
            type: "spring",
            damping: 20,
            stiffness: 300,
          },
        },
      });
    }
  }, [controls, currentDuration, isPaused, scale]);

  const handleHoverStart = () => {
    if (!onHover) return;

    switch (onHover) {
      case "slowDown":
        setIsPaused(false);
        setScale(1);
        setCurrentDuration(spinDuration * 2);
        break;
      case "speedUp":
        setIsPaused(false);
        setScale(1);
        setCurrentDuration(spinDuration / 2.5);
        break;
      case "pause":
        setIsPaused(true);
        setScale(1);
        break;
      case "goBonkers":
        setIsPaused(false);
        setScale(0.9);
        setCurrentDuration(Math.max(2.4, spinDuration / 5));
        break;
      default:
        setIsPaused(false);
        setScale(1);
        setCurrentDuration(spinDuration);
    }
  };

  const handleHoverEnd = () => {
    setIsPaused(false);
    setScale(1);
    setCurrentDuration(spinDuration);
  };

  return (
    <motion.div
      className={`circular-text ${className}`}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        const transform = `rotate(${rotationDeg}deg) translateY(-${radius}px)`;

        return (
          <span key={`${letter}-${i}`} style={{ transform, WebkitTransform: transform }}>
            {letter}
          </span>
        );
      })}
      {centerContent ? <div className="circular-text-center">{centerContent}</div> : null}
    </motion.div>
  );
}
