"use client";

import { getCategories, getProducts, type Product } from "@/lib/data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ProductActions } from "./ProductActions";

const ALL_CATEGORY = "All";

export default function BestSellers({
  title = "Best Sellers",
  subtitle = "Loved by our customers, these are the products everyone is talking about.",
  products,
  onAddToCart,
}: {
  title?: string;
  subtitle?: string;
  products?: Product[];
  onAddToCart?: (productId: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const sliderRef = useRef<HTMLDivElement>(null);

  // getProducts()/getCategories() are computed here, inside the component,
  // so they only ever run on render (never stale, and safe if they later
  // become async or depend on props/state).
  const allProducts = useMemo(() => getProducts(), []);
  const categories = useMemo(() => getCategories(), []);

  // Default to items tagged/flagged as best sellers when no explicit
  // `products` prop is passed in; fall back to all products if none exist.
  const sourceProducts = useMemo(() => {
    if (products) return products;
    const bestSellers = allProducts.filter((p) => p.isBestSeller);
    return bestSellers.length > 0 ? bestSellers : allProducts;
  }, [products, allProducts]);

  const filteredProducts =
    activeCategory === ALL_CATEGORY
      ? sourceProducts
      : sourceProducts.filter((p) => p.category === activeCategory);

  const hasSlider = filteredProducts.length > 4;

  const scrollLeft = () => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth * 0.75;
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth * 0.75;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section
      aria-labelledby="best-sellers-heading"
      className="w-full text-[#261815] select-none bg-[#ece0de]/50 py-12 md:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* SECTION HEADER */}
        <div className="mb-6">
          <h2 className="font-display text-3xl font-bold text-[#3E2C26] md:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#3E2C26]/60 mt-1 font-sans">
              {subtitle}
            </p>
          )}
        </div>

        {/* CONTROLS: CATEGORIES & SLIDER ARROWS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar">
            <div className="flex items-center gap-2 sm:gap-3 flex-nowrap">
              {/* "All" pill isn't part of getCategories(), so it's added explicitly */}
              <button
                type="button"
                onClick={() => setActiveCategory(ALL_CATEGORY)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all cursor-pointer outline-none shrink-0 ${
                  activeCategory === ALL_CATEGORY
                    ? "bg-[#5D4039] text-white shadow-xs"
                    : "bg-[#5D4039]/5 text-[#261815]/80 hover:bg-[#261815]/10"
                }`}
              >
                {ALL_CATEGORY}
              </button>

              {categories.map((cat) => {
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.uuid}
                    type="button"
                    onClick={() => setActiveCategory(cat.name)}
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all cursor-pointer outline-none shrink-0 ${
                      isActive
                        ? "bg-[#5D4039] text-white shadow-xs"
                        : "bg-[#5D4039]/5 text-[#261815]/80 hover:bg-[#261815]/10"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: View More & Conditional Slider Navigation Arrows */}
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="group relative inline-flex pb-0.5 font-sans text-[11px] font-bold text-[#3E2C26] uppercase tracking-[0.16em] transition-colors duration-300 hover:text-zinc-950 md:text-xs"
            >
              <span>View More</span>
              <span className="absolute bottom-0 left-0 h-px w-full bg-zinc-800 transition-all duration-300 group-hover:h-[1.5px] group-hover:bg-zinc-950" />
            </Link>

            {/* Slider buttons appear ONLY when products > 4 */}
            {hasSlider && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={scrollLeft}
                  aria-label="Previous products"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#261815]/20 text-[#261815]/70 hover:border-[#261815] hover:text-[#261815] hover:bg-white/40 active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollRight}
                  aria-label="Next products"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#261815]/20 text-[#261815]/70 hover:border-[#261815] hover:text-[#261815] hover:bg-white/40 active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PRODUCTS LIST / SLIDER CONTAINER */}
        <div
          ref={sliderRef}
          className={`w-full ${
            hasSlider
              ? "flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory pb-4"
              : "grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          }`}
        >
          {filteredProducts.length === 0 && (
            <p className="col-span-full font-semibold text-center text-lg text-[#261815]/60 py-8">
              No products found in this category.
            </p>
          )}

          {filteredProducts.map((product) => {
            return (
              <div
                key={product.id}
                className={`group mb-2 select-none ${
                  hasSlider
                    ? "w-[calc(50%-8px)] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 snap-start"
                    : "w-full"
                }`}
              >
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative w-full aspect-5/6 overflow-hidden rounded-2xl bg-zinc-100/60">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                    />

                    {product.discount && (
                      <span className="absolute top-2.5 left-2.5 bg-[#261815] text-[#EDE4DC] text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                        {product.discount}
                      </span>
                    )}
                  </div>
                </Link>

                <div className="flex items-start justify-between gap-3 px-0.5 pt-3.5">
                  <div className="min-w-0 pr-2">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-sans text-sm sm:text-base font-medium tracking-tight text-[#3E2C26] hover:underline line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="font-sans text-xs sm:text-sm font-semibold tracking-normal text-[#3E2C26]">
                        ৳ {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="font-sans text-[11px] text-[#3E2C26]/40 line-through">
                          ৳ {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <ProductActions
                    productId={product.id}
                    onAddToCart={onAddToCart}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
