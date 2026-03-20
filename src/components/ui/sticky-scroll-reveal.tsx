"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const [activeIndexProgress, setActiveIndexProgress] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const stickyMediaRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardLength = content.length;
  const checkpointsRef = useRef<number[]>([]);
  const cardLengthRef = useRef(cardLength);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
    trackContentSize: true,
  });

  useEffect(() => {
    cardLengthRef.current = cardLength;
  }, [cardLength]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, cardLength);

    if (cardLength <= 1) {
      setActiveCard(0);
      checkpointsRef.current = [];
      return;
    }

    const getIndexFromProgress = (latest: number, points: number[], length: number) => {
      if (length <= 1) {
        return 0;
      }

      if (points.length === length) {
        let index = 0;
        for (let i = 0; i < points.length; i += 1) {
          if (latest >= points[i]) {
            index = i;
          } else {
            break;
          }
        }
        return Math.min(length - 1, Math.max(0, index));
      }

      return Math.min(length - 1, Math.max(0, Math.floor(latest * length)));
    };

    const recalculateCheckpoints = () => {
      const container = ref.current;
      if (!container) {
        return;
      }

      // Require each card to travel a bit further before activation.
      const triggerOffsetPx = 140;
      const scrollRange = Math.max(1, container.offsetHeight);
      const stickyMedia = stickyMediaRef.current;
      const defaultActivationY = 96 + 160;
      const activationY = stickyMedia
        ? stickyMedia.offsetTop + stickyMedia.offsetHeight / 2
        : defaultActivationY;

      const nextCheckpoints = itemRefs.current.map((item) => {
        if (!item) {
          return 0;
        }

        const itemCenterInContainer = item.offsetTop + item.offsetHeight / 2;
        const progressAtActivation = (itemCenterInContainer + triggerOffsetPx - activationY) / scrollRange;

        return Math.min(1, Math.max(0, progressAtActivation));
      });

      checkpointsRef.current = nextCheckpoints;

      const nextIndex = getIndexFromProgress(scrollYProgress.get(), nextCheckpoints, cardLengthRef.current);
      setActiveCard((prev) => (prev === nextIndex ? prev : nextIndex));
    };

    recalculateCheckpoints();

    const resizeObserver = new ResizeObserver(() => recalculateCheckpoints());
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
    if (stickyMediaRef.current) {
      resizeObserver.observe(stickyMediaRef.current);
    }
    itemRefs.current.forEach((item) => {
      if (item) {
        resizeObserver.observe(item);
      }
    });

    window.addEventListener("resize", recalculateCheckpoints);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", recalculateCheckpoints);
    };
  }, [cardLength]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const length = cardLengthRef.current;
    if (length <= 1) {
      setActiveIndexProgress(0);
      setActiveCard(0);
      return;
    }

    const points = checkpointsRef.current;
    let nextIndexProgress = 0;

    if (points.length === length) {
      if (latest <= points[0]) {
        nextIndexProgress = 0;
      } else if (latest >= points[length - 1]) {
        nextIndexProgress = length - 1;
      } else {
        for (let i = 0; i < points.length - 1; i += 1) {
          const start = points[i];
          const end = points[i + 1];
          if (latest >= start && latest <= end) {
            const segmentSize = Math.max(0.0001, end - start);
            const segmentProgress = (latest - start) / segmentSize;
            nextIndexProgress = i + segmentProgress;
            break;
          }
        }
      }
    } else {
      nextIndexProgress = latest * (length - 1);
    }

    nextIndexProgress = Math.min(length - 1, Math.max(0, nextIndexProgress));
    const nextIndex = Math.min(length - 1, Math.max(0, Math.round(nextIndexProgress)));

    setActiveIndexProgress(nextIndexProgress);
    setActiveCard((prev) => (prev === nextIndex ? prev : nextIndex));
  });

  const backgroundColors = [
    "hsl(var(--card))",
    "hsl(var(--secondary))",
    "hsl(var(--background))",
  ];
  const linearGradients = [
    "linear-gradient(to bottom right, hsl(var(--primary) / 0.45), hsl(var(--accent) / 0.35))",
    "linear-gradient(to bottom right, hsl(var(--accent) / 0.45), hsl(var(--primary) / 0.28))",
    "linear-gradient(to bottom right, hsl(var(--primary) / 0.38), hsl(var(--secondary-foreground) / 0.25))",
  ];

  const activeGradient = linearGradients[activeCard % linearGradients.length] ?? linearGradients[0];

  const syncTransition = { duration: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  const getBlendWeight = (index: number) => {
    const distance = Math.abs(activeIndexProgress - index);
    return Math.max(0, 1 - distance);
  };

  const renderStackedContent = () => {
    if (cardLength === 0) {
      return null;
    }

    return content.map((item, index) => (
      <motion.div
        key={item.title + index}
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: getBlendWeight(index) }}
        transition={syncTransition}
        style={{ pointerEvents: activeCard === index ? "auto" : "none" }}
      >
        {item.content ?? null}
      </motion.div>
    ));
  };

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="relative rounded-2xl border border-border p-6 shadow-soft md:p-8"
      ref={ref}
    >
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-10">
        <div className="relative px-2">
          <div
            style={{ background: activeGradient }}
            className={cn(
              "relative mb-6 h-56 w-full overflow-hidden rounded-xl border border-border/60 bg-card md:hidden",
              contentClassName,
            )}
          >
            {renderStackedContent()}
          </div>
          {content.map((item, index) => (
            <div
              key={item.title + index}
              className="my-10 md:my-16"
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
            >
              <motion.h2
                initial={false}
                animate={{
                  opacity: 0.22 + getBlendWeight(index) * 0.78,
                }}
                transition={syncTransition}
                className="text-2xl font-semibold text-foreground"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={false}
                animate={{
                  opacity: 0.22 + getBlendWeight(index) * 0.78,
                }}
                transition={syncTransition}
                className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-8 md:h-12" />
        </div>
        <div
          ref={stickyMediaRef}
          style={{ background: activeGradient }}
          className={cn(
            "relative sticky top-24 hidden h-80 w-full overflow-hidden rounded-xl border border-border/60 bg-card md:block",
            contentClassName,
          )}
        >
          {renderStackedContent()}
        </div>
      </div>
    </motion.div>
  );
};
