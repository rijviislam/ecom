"use client";

import { getProducts, type Product } from "@/lib/data";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const CARD_STYLES = [
  {
    size: "w-[180px] h-[180px] md:w-[300px] md:h-[300px]",
    tilt: "-rotate-[13deg]",
    offset: "mt-10 md:mt-20",
    overlap: "-mr-6 md:-mr-16",
    zIndex: "z-10",
    scale: "scale-95",
  },
  {
    size: "w-[195px] h-[195px] md:w-[325px] md:h-[325px]",
    tilt: "rotate-[14deg]",
    offset: "mt-4 md:mt-8",
    overlap: "-mr-8 md:-mr-20",
    zIndex: "z-20",
    scale: "scale-100",
  },
  {
    size: "w-[220px] h-[220px] md:w-[360px] md:h-[360px]",
    tilt: "-rotate-[12deg]",
    offset: "mt-10",
    overlap: "-mr-8 md:-mr-20",
    zIndex: "z-30",
    scale: "scale-105 md:scale-110",
  },
  {
    size: "w-[195px] h-[195px] md:w-[325px] md:h-[325px]",
    tilt: "rotate-[12deg]",
    offset: "mt-8 md:mt-24",
    overlap: "-mr-6 md:-mr-16",
    zIndex: "z-20",
    scale: "scale-100",
  },
];

function SlideCard({
  product,
  index,
  totalProducts,
  isMovedRef,
}: {
  product: Product;
  index: number;
  totalProducts: number;
  isMovedRef: React.MutableRefObject<boolean>;
}) {
  const styleIndex = index % totalProducts;
  const config = CARD_STYLES[styleIndex % CARD_STYLES.length];

  const handleClick = (e: React.MouseEvent) => {
    if (isMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Link
      href={`/products`}
      onClick={handleClick}
      draggable={false}
      className={`group relative shrink-0 snap-start overflow-hidden shadow-2xl rounded-sm transition-all duration-500 hover:scale-105 hover:z-50 select-none ${config.size} ${config.tilt} ${config.offset} ${config.overlap} ${config.zIndex} ${config.scale}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.image}
        alt={product.name}
        draggable={false}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 select-none pointer-events-none"
      />
    </Link>
  );
}

export default function HeroSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animId = useRef<number | null>(null);
  const [isDown, setIsDown] = useState(false);
  const isMovedRef = useRef(false);

  const sliderProducts = useMemo(() => getProducts().slice(0, 4), []);

  const extendedProducts = useMemo(
    () =>
      Array.from({ length: 6 }, (_, copyIndex) =>
        sliderProducts.map((product) => ({
          ...product,
          uniqueId: `${copyIndex}-${product.id}`,
        })),
      ).flat(),
    [sliderProducts],
  );

  const drag = useRef({
    isDragging: false,
    startX: 0,
    scrollStart: 0,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
  });

  const checkInfiniteWrap = () => {
    const el = trackRef.current;
    if (!el) return;

    const singleSetWidth = el.scrollWidth / 6;
    if (singleSetWidth <= 0) return;

    if (el.scrollLeft >= singleSetWidth * 4) {
      el.scrollLeft -= singleSetWidth * 2;
    } else if (el.scrollLeft <= singleSetWidth) {
      el.scrollLeft += singleSetWidth * 2;
    }
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const timer = setTimeout(() => {
      const singleSetWidth = el.scrollWidth / 6;
      if (singleSetWidth > 0 && el.scrollLeft === 0) {
        el.scrollLeft = singleSetWidth * 2;
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const startMomentum = () => {
    if (animId.current) cancelAnimationFrame(animId.current);

    const step = () => {
      const el = trackRef.current;
      const d = drag.current;

      if (!el) return;

      if (Math.abs(d.velocity) > 0.1) {
        el.scrollLeft += d.velocity;
        d.velocity *= 0.92;
        checkInfiniteWrap();
        animId.current = requestAnimationFrame(step);
      } else {
        d.velocity = 0;
        animId.current = null;
      }
    };

    animId.current = requestAnimationFrame(step);
  };

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    if (!el) return;

    // Stop any ongoing momentum
    if (animId.current) {
      cancelAnimationFrame(animId.current);
      animId.current = null;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    setIsDown(true);
    isMovedRef.current = false;

    const d = drag.current;
    d.isDragging = true;
    d.startX = e.clientX;
    d.scrollStart = el.scrollLeft;
    d.velocity = 0;
    d.lastX = e.clientX;
    d.lastTime = performance.now();
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    const el = trackRef.current;
    if (!d.isDragging || !el) return;

    const walk = e.clientX - d.startX;

    if (Math.abs(walk) > 5) {
      isMovedRef.current = true;
    }

    // Direct 1:1 follow
    el.scrollLeft = d.scrollStart - walk;
    checkInfiniteWrap();

    const now = performance.now();
    const dt = Math.max(now - d.lastTime, 1);
    const dx = e.clientX - d.lastX;

    const instantVelocity = (-dx / dt) * 16.67;
    d.velocity = d.velocity * 0.6 + instantVelocity * 0.4;

    d.lastX = e.clientX;
    d.lastTime = now;
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    d.isDragging = false;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    setIsDown(false);

    startMomentum();

    setTimeout(() => {
      isMovedRef.current = false;
    }, 100);
  }

  return (
    <section className="relative overflow-hidden py-5 select-none">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `,
        }}
      />

      <div className="px-6 md:px-10 text-center flex items-center justify-center flex-col gap-5 mt-10">
        <h1 className="font-display text-3xl font-bold text-[#3E2C26] md:text-5xl w-11/12 md:w-1/2 leading-12 md:leading-16">
          Thoughtfully Curated Essentials for Mind & Body.
        </h1>
        <Link
          href={`/products`}
          className="group relative inline-flex pb-0.5 font-sans text-sm font-bold text-[#3E2C26] uppercase tracking-[0.16em] transition-colors duration-300 hover:text-zinc-950"
        >
          <span>See All Product</span>
          <span className="absolute bottom-0 left-0 h-px w-full bg-zinc-800 transition-all duration-300 group-hover:h-[1.5px] group-hover:bg-zinc-950" />
        </Link>
      </div>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`no-scrollbar flex overflow-x-auto overflow-y-visible px-10 pb-20 pt-10 md:px-20 touch-pan-y gap-6 md:gap-14 ${
          isDown ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          touchAction: "pan-y",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {extendedProducts.map((product, idx) => (
          <SlideCard
            key={product.uniqueId}
            product={product}
            index={idx}
            totalProducts={sliderProducts.length}
            isMovedRef={isMovedRef}
          />
        ))}
      </div>
    </section>
  );
}
