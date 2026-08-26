"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const CATEGORY_DATA = {
  sales: {
    name: "Sales",
    count: 12,
    leftProduct: {
      name: "Signature Mirror",
      price: "$ 48",
      image:
        "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop",
    },
    rightProduct: {
      name: "Chic Vanity Set",
      price: "$ 120",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600&auto=format&fit=crop",
    },
  },
  skincare: {
    name: "Skincare",
    count: 25,
    leftProduct: {
      name: "Hydrating Serum",
      price: "$ 42",
      image:
        "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop",
    },
    rightProduct: {
      name: "Luminescence Essence",
      price: "$ 85",
      image:
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=600&auto=format&fit=crop",
    },
  },
  makeup: {
    name: "Makeup",
    count: 83,
    leftProduct: {
      name: "Bisou Balm",
      price: "$ 35",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
    },
    rightProduct: {
      name: "C'est La Cream",
      price: "$ 65",
      image:
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop",
    },
  },
  perfume: {
    name: "Parfume",
    count: 3,
    leftProduct: {
      name: "L'Eau de Parfum",
      price: "$ 110",
      image:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop",
    },
    rightProduct: {
      name: "Floral Scent Story",
      price: "$ 145",
      image:
        "https://images.unsplash.com/photo-1528740569068-3ac1ab553a17?q=80&w=600&auto=format&fit=crop",
    },
  },
  all: {
    name: "All categories",
    count: 11,
    leftProduct: {
      name: "Essential Beauty Trio",
      price: "$ 90",
      image:
        "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop",
    },
    rightProduct: {
      name: "Seasonal Campaign",
      price: "$ 175",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
    },
  },
};

export default function FeaturedCategories() {
  const [activeKey, setActiveKey] =
    useState<keyof typeof CATEGORY_DATA>("makeup");
  const [displayKey, setDisplayKey] =
    useState<keyof typeof CATEGORY_DATA>("makeup");
  const [fadeState, setFadeState] = useState<"fade-in" | "fade-out">("fade-in");

  // Premium transition effect for category image crossfades
  useEffect(() => {
    if (activeKey !== displayKey) {
      // setFadeState("fade-out");
      const timer = setTimeout(() => {
        setDisplayKey(activeKey);
        setFadeState("fade-in");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [activeKey, displayKey]);

  const activeCategory = CATEGORY_DATA[displayKey];

  return (
    <div className={`w-full min-h-screen  text-zinc-900 font-display `}>
      <section className="relative w-full max-w-7xl mx-auto px-6   flex flex-col justify-center min-h-screen">
        {/* Three Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-12 md:gap-10 lg:gap-16">
          {/* LEFT — PRODUCT CATEGORY VISUAL (Oval Shape) */}
          <div className="flex flex-col items-center md:items-end justify-center w-full order-2 md:order-1">
            <div
              className={`w-full max-w-65 lg:max-w-[320px] transition-all duration-300 ease-out ${
                fadeState === "fade-in"
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
            >
              {/* Elegant organic oval/rounded shape image */}
              <div className="group relative w-full aspect-4/5 rounded-full overflow-hidden shadow-sm bg-zinc-50 ">
                <Image
                  src={activeCategory.leftProduct.image}
                  alt={activeCategory.leftProduct.name}
                  fill
                  sizes="(max-w-768px) 260px, 320px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                  priority
                />
              </div>

              {/* Supporting Info */}
              <div className="flex justify-between items-start mt-6 px-1 w-full">
                <div>
                  <h3 className="text-sm font-medium text-zinc-900 tracking-wide font-sans">
                    {activeCategory.leftProduct.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans mt-1">
                    {activeCategory.leftProduct.price}
                  </p>
                </div>
                <button
                  aria-label="Add to cart"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 hover:border-zinc-950 hover:text-zinc-950 transition-colors duration-300 cursor-pointer outline-none"
                >
                  <span className="text-lg font-light leading-none select-none">
                    +
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* CENTER — TYPOGRAPHIC CATEGORY NAVIGATION */}
          <div className="flex flex-col items-center justify-center min-w-65 md:min-w-75 lg:min-w-90 order-1 md:order-2">
            <nav className="flex flex-col items-center gap-6 md:gap-8 lg:gap-10">
              {Object.entries(CATEGORY_DATA).map(([key, category]) => {
                const isActive = activeKey === key;
                return (
                  <button
                    key={key}
                    onMouseEnter={() =>
                      setActiveKey(key as keyof typeof CATEGORY_DATA)
                    }
                    onClick={() =>
                      setActiveKey(key as keyof typeof CATEGORY_DATA)
                    }
                    className={`group relative flex items-start gap-1 py-1 text-xl md:text-2xl lg:text-4xl font-light tracking-wide transition-all duration-300 cursor-pointer select-none outline-none ${
                      isActive
                        ? "text-[#79564E] scale-102 font-medium"
                        : "text-[#D9C1BD] hover:text-[#D9C1BD]/50"
                    }`}
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    <span className="relative pr-6">
                      <h2 className="  tracking-tight  font-display">
                        {category.name}
                      </h2>
                      <sup className="absolute -top-1.5 right-0 font-sans text-[10px] md:text-xs text-zinc-400 font-light tracking-normal">
                        {category.count}
                      </sup>
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* RIGHT — LIFESTYLE IMAGE (Rectangle Shape) */}
          <div className="flex flex-col items-center md:items-start justify-center w-full order-3">
            <div
              className={`w-full max-w-70 lg:max-w-85 transition-all duration-300 ease-out ${
                fadeState === "fade-in"
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
            >
              {/* Clean rectangular lifestyle image */}
              <div className="group relative w-full aspect-3/4 overflow-hidden bg-zinc-50  shadow-sm">
                <Image
                  src={activeCategory.rightProduct.image}
                  alt={activeCategory.rightProduct.name}
                  fill
                  sizes="(max-w-768px) 280px, 340px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                  priority
                />
              </div>

              {/* Supporting Info */}
              <div className="flex justify-between items-start mt-6 px-1 w-full">
                <div>
                  <h3 className="text-sm font-medium text-zinc-900 tracking-wide font-sans">
                    {activeCategory.rightProduct.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans mt-1">
                    {activeCategory.rightProduct.price}
                  </p>
                </div>
                <button
                  aria-label="Add to cart"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200  hover:border-zinc-950 hover:text-zinc-950 transition-colors duration-300 cursor-pointer text-zinc-600 outline-none"
                >
                  <span className="text-lg font-light leading-none select-none">
                    +
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
