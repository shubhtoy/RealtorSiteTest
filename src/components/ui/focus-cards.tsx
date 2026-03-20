"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/media/OptimizedImage";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: { title: string; src: string };
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <article
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "group relative h-72 w-full overflow-hidden rounded-2xl border border-border/70 bg-card-gradient shadow-soft transition-all duration-300 ease-out md:h-[30rem]",
        hovered !== null && hovered !== index && "scale-[0.985] opacity-85"
      )}
    >
      <OptimizedImage
        src={card.src}
        alt={card.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(min-width: 768px) 33vw, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-overlay-dark/72 via-overlay-dark/26 to-transparent" />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 p-5 md:p-6",
          hovered === index ? "translate-y-0" : "translate-y-0"
        )}
      >
        <div className="max-w-[90%] rounded-xl border border-overlay-text/20 bg-overlay-dark/35 px-4 py-3 backdrop-blur-sm">
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-overlay-text/80">Residence Type</p>
          <h3 className="mt-1 text-xl font-semibold leading-tight text-overlay-text md:text-2xl">{card.title}</h3>
        </div>
      </div>
    </article>
  )
);

Card.displayName = "Card";

type Card = {
  title: string;
  src: string;
};

export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:px-4">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
