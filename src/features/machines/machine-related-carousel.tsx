"use client";

import { useCallback, useRef } from "react";

import type { MachineListItemDto } from "@/features/machines/machines.dto";
import type { MachinesMessages } from "@/features/machines/machines.messages";
import { MachineListCard } from "@/features/machines/machine-list-card";
import type { HomeLocale } from "@/features/home/home.messages";

type MachineRelatedCarouselProps = {
  readonly locale: HomeLocale;
  readonly sectionSlug: string;
  readonly messages: MachinesMessages;
  readonly items: MachineListItemDto[];
};

/** Fraction of viewport width to scroll per arrow tap (carousel track). */
const CAROUSEL_SCROLL_STEP_RATIO = 0.85;

export function MachineRelatedCarousel({ locale, sectionSlug, messages, items }: MachineRelatedCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByStep = useCallback((direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }
    el.scrollBy({ left: direction * el.clientWidth * CAROUSEL_SCROLL_STEP_RATIO, behavior: "smooth" });
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0)_100%)] sm:w-12" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-[linear-gradient(270deg,#000_0%,rgba(0,0,0,0)_100%)] sm:w-12" />
      <div className="absolute left-0 top-1/2 z-[2] -translate-y-1/2 sm:left-1">
        <button
          aria-label={messages.relatedCarouselPrev}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#27272a] bg-[#09090b]/95 text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition hover:border-[#ff6900] hover:text-[#ff6900]"
          type="button"
          onClick={() => {
            scrollByStep(-1);
          }}
        >
          <span aria-hidden className="text-lg leading-none">
            ‹
          </span>
        </button>
      </div>
      <div className="absolute right-0 top-1/2 z-[2] -translate-y-1/2 sm:right-1">
        <button
          aria-label={messages.relatedCarouselNext}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#27272a] bg-[#09090b]/95 text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition hover:border-[#ff6900] hover:text-[#ff6900]"
          type="button"
          onClick={() => {
            scrollByStep(1);
          }}
        >
          <span aria-hidden className="text-lg leading-none">
            ›
          </span>
        </button>
      </div>
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 pl-11 pr-11 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:pl-12 sm:pr-12 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((machine) => (
          <div
            key={machine.id}
            className="w-[min(280px,82vw)] shrink-0 snap-start sm:w-[min(300px,70vw)] lg:w-[min(320px,28vw)]"
          >
            <MachineListCard locale={locale} machine={machine} messages={messages} sectionSlug={sectionSlug} />
          </div>
        ))}
      </div>
    </div>
  );
}
