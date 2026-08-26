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

function SlideCard({ product, index }) {
  const styleIndex = index % SLIDER_PRODUCTS.length;
  const config = CARD_STYLES[styleIndex];

  return (
    <div
      className={`group relative shrink-0 snap-start overflow-hidden  shadow-2xl rounded-sm transition-all duration-500 hover:scale-105 hover:z-50 select-none ${config.size} ${config.tilt} ${config.offset} ${config.overlap} ${config.zIndex} ${config.scale}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.image}
        alt={product.name}
        draggable={false}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 select-none"
      />
    </div>
  );
}

export default function FeaturedProductsSlider() {
  const trackRef = useRef(null);
  const animId = useRef(null);
  const [isDown, setIsDown] = useState(false);

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
      if (d.isDragging) {
        const lerpFactor = 0.15;
        d.current += (d.target - d.current) * lerpFactor;
        el.scrollLeft = d.current;
        d.lastActionTime = performance.now();
      } else {
        const now = performance.now();
        const timeSinceDrag = now - d.lastActionTime;

        if (timeSinceDrag < 1500) {
          const friction = 0.95;
          d.velocity *= friction;
          d.target += d.velocity;

          const lerpFactor = 0.15;
          d.current += (d.target - d.current) * lerpFactor;
          el.scrollLeft = d.current;
        } else {
          const autoSpeed = 0.6;
          d.target += autoSpeed;
          d.current += autoSpeed;
          el.scrollLeft = d.current;
        }
      }

      animId.current = requestAnimationFrame(loop);
    };

    animId.current = requestAnimationFrame(loop);
  };

  function onPointerDown(e) {
    const el = trackRef.current;
    if (!el) return;

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

    startLoop();
    e.preventDefault();
  }

  function onPointerUp() {
    setIsDown(false);
    const d = drag.current;
    d.isDragging = false;
  }

  function onPointerMove(e) {
    const d = drag.current;
    if (!d.isDragging) return;

    const walk = (e.clientX - d.startX) * 1.5;
    d.target = d.scrollStart - walk;

    const now = performance.now();
    const dt = now - d.lastTime;
    if (dt > 0) {
      const dx = e.clientX - d.lastX;
      d.velocity = -dx * 1.5;
    }
    d.lastX = e.clientX;
    d.lastTime = now;
  }

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const initializeScroll = () => {
      const children = el.children;
      if (children.length >= 8) {
        const firstItem = children[0];
        const middleItem = children[SLIDER_PRODUCTS.length];
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

    const handleScroll = () => {
      const children = el.children;
      const numProducts = SLIDER_PRODUCTS.length;
      if (children.length < numProducts * 2) return;

      const firstItem = children[0];
      const middleItem = children[numProducts];
      if (!firstItem || !middleItem) return;

      const cycleWidth = middleItem.offsetLeft - firstItem.offsetLeft || 1;
      const scrollLeft = el.scrollLeft;

      if (!drag.current.isDragging && !animId.current) {
        drag.current.current = scrollLeft;
        drag.current.target = scrollLeft;
      }

      checkAndPerformJump();
    };

    const checkAndPerformJump = () => {
      const children = el.children;
      const numProducts = SLIDER_PRODUCTS.length;
      if (children.length < numProducts * 2) return;

      const firstItem = children[0];
      const middleItem = children[numProducts];
      if (!firstItem || !middleItem) return;

      const cycleWidth = middleItem.offsetLeft - firstItem.offsetLeft || 1;
      const scrollLeft = el.scrollLeft;

      const minBound = cycleWidth * 1.5;
      const maxBound = cycleWidth * 2.5;

      if (scrollLeft < minBound || scrollLeft > maxBound) {
        const offsetFromMiddle =
          ((scrollLeft % cycleWidth) + cycleWidth) % cycleWidth;
        const newPos = cycleWidth * 2 + offsetFromMiddle;

        el.scrollLeft = newPos;
        drag.current.current = newPos;
        drag.current.target = newPos;
        drag.current.velocity = 0;
      }
    };

    el.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(initTimer);
      if (animId.current) {
        cancelAnimationFrame(animId.current);
      }
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="relative overflow-hidden  py-20 select-none">
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
        <h2 className="font-display text-3xl font-bold text-[#261815] md:text-4xl">
          Featured Products
        </h2>
      </div>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerMove={onPointerMove}
        className={`no-scrollbar flex overflow-x-auto overflow-y-visible px-10 pb-20 pt-10 md:px-20 touch-pan-y gap-6 md:gap-14 ${
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
