"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (cardLength <= 1) {
      setActiveCard(0);
      return;
    }

    // Quantize progress into stable index buckets to avoid jittery card switching.
    const nextIndex = Math.min(cardLength - 1, Math.max(0, Math.round(latest * (cardLength - 1))));
    setActiveCard(nextIndex);
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

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0],
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

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
            style={{ background: backgroundGradient }}
            className={cn(
              "mb-6 h-56 w-full overflow-hidden rounded-xl border border-border/60 bg-card md:hidden",
              contentClassName,
            )}
          >
            {content[activeCard]?.content ?? null}
          </div>
          {content.map((item, index) => (
            <div key={item.title + index} className="my-10 md:my-16">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-2xl font-semibold text-foreground"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-8 md:h-12" />
        </div>
        <div
          style={{ background: backgroundGradient }}
          className={cn(
            "sticky top-24 hidden h-80 w-full overflow-hidden rounded-xl border border-border/60 bg-card md:block",
            contentClassName,
          )}
        >
          {content[activeCard]?.content ?? null}
        </div>
      </div>
    </motion.div>
  );
};
