"use client";

import { useEffect, useRef, useState } from "react";

const SLIDER_PRODUCTS = [
  {
    id: "1",
    name: "Signature Wooden Chair",
    price: 4500,
    image: "https://i.ibb.co.com/ZzNSh1zc/p1.jpg",
  },
  {
    id: "2",
    name: "Ceramic Vase Set",
    price: 1800,
    image: "https://i.ibb.co.com/rKjfMZP0/p3.jpg",
  },
  {
    id: "3",
    name: "Linen Throw Pillow",
    price: 950,
    image: "https://i.ibb.co.com/KxwP0Y2g/p5.jpg",
  },
  {
    id: "4",
    name: "Rattan Table Lamp",
    price: 2600,
    image: "https://i.ibb.co.com/JRPzG7CN/per.png",
  },
];

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
}: {
  product: (typeof SLIDER_PRODUCTS)[0];
  index: number;
}) {
  const styleIndex = index % SLIDER_PRODUCTS.length;
  const config = CARD_STYLES[styleIndex];

  return (
    <div
      className={`group relative shrink-0 snap-start overflow-hidden shadow-2xl rounded-sm transition-all duration-500 hover:scale-105 hover:z-50 select-none  ${config.size} ${config.tilt} ${config.offset} ${config.overlap} ${config.zIndex} ${config.scale}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.image}
        alt={product.name}
        draggable={false}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 select-none pointer-events-none"
      />
    </div>
  );
}

export default function FeaturedProductsSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animId = useRef<number | null>(null);
  const [isDown, setIsDown] = useState(false);

  // High-precision physics state (avoids React re-render lag)
  const drag = useRef({
    isDragging: false,
    startX: 0,
    scrollStart: 0,
    target: 0,
    current: 0,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
    lastActionTime: 0,
  });

  const extendedProducts = Array.from({ length: 5 }, (_, copyIndex) =>
    SLIDER_PRODUCTS.map((product) => ({
      ...product,
      uniqueId: `${copyIndex}-${product.id}`,
    })),
  ).flat();

  const startLoop = () => {
    if (animId.current) return;

    const loop = () => {
      const el = trackRef.current;
      if (!el) {
        animId.current = null;
        return;
      }

      const d = drag.current;
      const now = performance.now();
      const children = el.children;
      const numProducts = SLIDER_PRODUCTS.length;

      let cycleWidth = 0;
      if (children.length >= numProducts * 2) {
        const firstItem = children[0] as HTMLElement;
        const middleItem = children[numProducts] as HTMLElement;
        if (firstItem && middleItem) {
          cycleWidth = middleItem.offsetLeft - firstItem.offsetLeft || 0;
        }
      }

      if (d.isDragging) {
        // Direct, ultra-responsive 1:1 cursor follow with micro-interpolation
        d.current += (d.target - d.current) * 0.75;
        el.scrollLeft = d.current;
        d.lastActionTime = now;
      } else {
        const timeSinceDrag = now - d.lastActionTime;

        if (timeSinceDrag < 1800) {
          // Natural momentum glide with exponential friction decay
          d.velocity *= 0.94;
          d.target += d.velocity;
          d.current += (d.target - d.current) * 0.25;
          el.scrollLeft = d.current;
        } else {
          // Continuous smooth auto-slide
          const autoSpeed = 0.5;
          d.target += autoSpeed;
          d.current += autoSpeed;
          el.scrollLeft = d.current;
        }
      }

      // Seamless infinite loop wrapping (synchronizes drag coordinates to prevent jumps)
      if (cycleWidth > 0) {
        const minBound = cycleWidth * 1.5;
        const maxBound = cycleWidth * 2.5;

        if (d.current < minBound || d.current > maxBound) {
          const offsetFromMiddle =
            ((d.current % cycleWidth) + cycleWidth) % cycleWidth;
          const newPos = cycleWidth * 2 + offsetFromMiddle;
          const shift = newPos - d.current;

          d.current = newPos;
          d.target += shift;
          d.scrollStart += shift;
          el.scrollLeft = newPos;
        }
      }

      animId.current = requestAnimationFrame(loop);
    };

    animId.current = requestAnimationFrame(loop);
  };

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    if (!el) return;

    // Capture pointer events to prevent mouse drop outside viewport
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    setIsDown(true);
    const d = drag.current;
    d.isDragging = true;
    d.startX = e.clientX;
    d.scrollStart = el.scrollLeft;
    d.target = el.scrollLeft;
    d.current = el.scrollLeft;
    d.velocity = 0;
    d.lastX = e.clientX;
    d.lastTime = performance.now();
    d.lastActionTime = performance.now();

    startLoop();
    e.preventDefault();
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    setIsDown(false);
    const d = drag.current;
    d.isDragging = false;
    d.lastActionTime = performance.now();

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d.isDragging) return;

    // 1:1 drag movement matching hand/mouse position
    const walk = e.clientX - d.startX;
    d.target = d.scrollStart - walk;

    const now = performance.now();
    const dt = Math.max(now - d.lastTime, 1);
    const dx = e.clientX - d.lastX;

    // Filtered velocity calculation normalized to 60fps frame rate
    const currentVelocity = (-dx / dt) * 16.67;
    d.velocity = d.velocity * 0.35 + currentVelocity * 0.65;

    d.lastX = e.clientX;
    d.lastTime = now;
    d.lastActionTime = now;
  }

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const initializeScroll = () => {
      const children = el.children;
      const numProducts = SLIDER_PRODUCTS.length;
      if (children.length >= numProducts * 2) {
        const firstItem = children[0] as HTMLElement;
        const middleItem = children[numProducts] as HTMLElement;
        if (firstItem && middleItem) {
          const cycleWidth = middleItem.offsetLeft - firstItem.offsetLeft;
          if (cycleWidth > 0) {
            const startPos = cycleWidth * 2;
            el.scrollLeft = startPos;
            drag.current.current = startPos;
            drag.current.target = startPos;
          }
        }
      }
      startLoop();
    };

    const initTimer = setTimeout(initializeScroll, 50);

    return () => {
      clearTimeout(initTimer);
      if (animId.current) {
        cancelAnimationFrame(animId.current);
      }
    };
  }, []);

  return (
    <section className="relative overflow-hidden py-20 select-none">
      {/* Hide native browser scrollbars */}
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

      <div className="mb-14 px-6 md:px-10 text-center">
        <h2 className="font-display text-3xl font-bold text-[#3E2C26] md:text-4xl">
          Featured Products
        </h2>
      </div>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerMove={onPointerMove}
        className={`no-scrollbar flex overflow-x-auto overflow-y-visible px-10 pb-20 pt-10 md:px-20 touch-none gap-6 md:gap-14 ${
          isDown ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {extendedProducts.map((product, idx) => (
          <SlideCard key={product.uniqueId} product={product} index={idx} />
        ))}
      </div>
    </section>
  );
}
