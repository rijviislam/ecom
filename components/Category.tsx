"use client";

import { getCategories, getProducts, type Product } from "@/lib/data";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface FeaturedCategoryEntry {
  key: string;
  name: string;
  count: number;
  leftProduct: Product | null;
  rightProduct: Product | null;
}

const ALL_KEY = "all";

function buildFeaturedCategories(): FeaturedCategoryEntry[] {
  const categories = getCategories();
  const products = getProducts();

  const perCategory: FeaturedCategoryEntry[] = categories.map((cat) => {
    const inCategory = products.filter((p) => p.category === cat.name);
    return {
      key: cat.slug,
      name: cat.name,
      count: inCategory.length,
      leftProduct: inCategory[0] ?? null,
      rightProduct: inCategory[1] ?? inCategory[0] ?? null,
    };
  });

  const allEntry: FeaturedCategoryEntry = {
    key: ALL_KEY,
    name: "All categories",
    count: products.length,
    leftProduct: products[0] ?? null,
    rightProduct: products[1] ?? products[0] ?? null,
  };

  return [allEntry, ...perCategory];
}

export default function FeaturedCategories() {
  // Computed once on mount; getCategories()/getProducts() are called here,
  // inside the component, rather than at module scope.
  const featuredCategories = useMemo(() => buildFeaturedCategories(), []);

  const defaultKey = featuredCategories[0]?.key ?? ALL_KEY;

  const [activeKey, setActiveKey] = useState(defaultKey);
  const [displayKey, setDisplayKey] = useState(defaultKey);

  // Premium transition effect for category image crossfades
  useEffect(() => {
    if (activeKey !== displayKey) {
      const timer = setTimeout(() => {
        setDisplayKey(activeKey);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [activeKey, displayKey]);

  const activeCategory = featuredCategories.find((c) => c.key === displayKey);

  if (!activeCategory) {
    return null;
  }

  return (
    <div className="w-full font-display">
      <section className="relative w-full max-w-7xl mx-auto px-6 flex flex-col justify-center min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-12 md:gap-10 lg:gap-16">
          <div className="flex flex-col items-center md:items-end justify-center w-full order-2 md:order-1">
            <div
              className={`w-full max-w-65 lg:max-w-[320px] transition-all duration-300 ease-out ${
                activeKey === displayKey
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
            >
              {activeCategory.leftProduct ? (
                <>
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

                  <div className="flex justify-between items-start mt-6 px-1 w-full">
                    <div>
                      <h3 className="text-lg font-medium text-[#3E2C26] tracking-wide font-display">
                        {activeCategory.leftProduct.name}
                      </h3>
                      <p className="text-md text-[#3E2C26] font-sans mt-1">
                        ৳ {activeCategory.leftProduct.price.toLocaleString()}
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
                </>
              ) : (
                <div className="w-full aspect-4/5 rounded-full bg-zinc-100 flex items-center justify-center text-xs text-zinc-400">
                  No products yet
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center min-w-65 md:min-w-75 lg:min-w-90 order-1 md:order-2">
            <nav className="flex flex-col items-center gap-6 md:gap-8 lg:gap-10">
              {featuredCategories.map((category) => {
                const isActive = activeKey === category.key;
                return (
                  <button
                    key={category.key}
                    onMouseEnter={() => setActiveKey(category.key)}
                    onClick={() => setActiveKey(category.key)}
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

          <div className="flex flex-col items-center md:items-start justify-center w-full order-3">
            <div
              className={`w-full max-w-70 lg:max-w-85 transition-all duration-300 ease-out ${
                activeKey === displayKey
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
            >
              {activeCategory.rightProduct ? (
                <>
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

                  <div className="flex justify-between items-start mt-6 px-1 w-full">
                    <div>
                      <h3 className="text-lg font-medium text-[#3E2C26] tracking-wide font-sans">
                        {activeCategory.rightProduct.name}
                      </h3>
                      <p className="text-md text-zinc-500 font-sans mt-1">
                        ৳ {activeCategory.rightProduct.price.toLocaleString()}
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
                </>
              ) : (
                <div className="w-full aspect-3/4 bg-zinc-100 flex items-center justify-center text-xs text-zinc-400">
                  No products yet
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
