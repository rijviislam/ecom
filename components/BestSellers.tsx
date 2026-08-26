"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProductActions } from "./ProductSection";

export interface BestSellerProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  image: string;
  colors?: { name: string; hex: string }[];
}

const BEST_SELLERS_DATA: BestSellerProduct[] = [
  {
    id: "bs-1",
    name: "Everyday Hoodie",
    category: "Hoodie",
    price: 95.0,
    originalPrice: 120.0,
    discount: "-21%",
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 142,
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    colors: [
      { name: "Dusty Rose", hex: "#D8A4A8" },
      { name: "Lavender", hex: "#D6C6E1" },
      { name: "Oatmeal", hex: "#E9DFD2" },
    ],
  },
  {
    id: "bs-2",
    name: "Lightweight Jacket",
    category: "Jacket",
    price: 189.0,
    originalPrice: 219.0,
    discount: "-14%",
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 98,
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
    colors: [
      { name: "Stone", hex: "#D9D2C7" },
      { name: "Charcoal", hex: "#5C6064" },
    ],
  },
  {
    id: "bs-3",
    name: "Zipper Jacket",
    category: "Jacket",
    price: 99.0,
    originalPrice: 129.0,
    discount: "-23%",
    isBestSeller: false,
    rating: 4.7,
    reviewsCount: 76,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
    colors: [{ name: "Washed Black", hex: "#4A4D50" }],
  },
  {
    id: "bs-4",
    name: "Relaxed Fit Cardigan",
    category: "Cardigan",
    price: 119.0,
    originalPrice: 149.0,
    discount: "-20%",
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 115,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    colors: [
      { name: "Vanilla", hex: "#EBE3D3" },
      { name: "Sage", hex: "#A8C4B3" },
    ],
  },
];

const FILTER_CATEGORIES = [
  "All",
  "Jacket",
  "Sweater",
  "Hoodie",
  "Pants",
  "T-Shirt",
  "Cardigan",
];

export default function BestSellers({
  title = "Best Sellers",
  subtitle = "Loved by our customers, these are the products everyone is talking about.",
  products = BEST_SELLERS_DATA,
  onAddToCart,
}: {
  title?: string;
  subtitle?: string;
  products?: BestSellerProduct[];
  onAddToCart?: (productId: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, number>>(
    {},
  );
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (id: string) => {
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 900);
    if (onAddToCart) onAddToCart(id);
  };

  return (
    <section
      aria-labelledby="best-sellers-heading"
      className="w-full text-[#261815] select-none  bg-[#ece0de]/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="mb-6">
          <h2 className="font-display text-3xl font-bold text-[#3E2C26] md:text-4xl">
            {title}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar">
            {FILTER_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium tracking-wide transition-all cursor-pointer outline-none shrink-0 ${
                    isActive
                      ? "bg-[#5D4039] text-white shadow-xs"
                      : "bg-[#5D4039]/5 text-[#261815]/80 hover:bg-[#261815]/10"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <Link
              href={`#`}
              className="group relative inline-flex pb-0.5 font-sans text-[11px] font-bold text-[#3E2C26] uppercase tracking-[0.16em]  transition-colors duration-300 hover:text-zinc-950 md:text-xs"
            >
              <span>View More</span>

              <span className="absolute bottom-0 left-0 h-px w-full bg-zinc-800 transition-all duration-300 group-hover:h-[1.5px] group-hover:bg-zinc-950" />
            </Link>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#261815]/20 text-[#261815]/70 hover:border-[#261815] hover:text-[#261815] transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#261815]/20 text-[#261815]/70 hover:border-[#261815] hover:text-[#261815] transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const isWish = !!wishlist[product.id];
            const isAdded = !!addedItems[product.id];
            const selectedColorIdx = selectedColors[product.id] || 0;

            return (
              <Link
                key={product.id}
                href={`#`}
                className="group mb-8 w-full break-inside-avoid"
              >
                <div className="relative w-full aspect-5/6 overflow-hidden rounded-2xl bg-zinc-100/60">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                  />
                </div>

                <div className="flex items-start justify-between gap-3 px-0.5 pt-3.5">
                  <div className="min-w-0 pr-2">
                    <h3 className="font-sans text-lg font-medium tracking-tight text-[#3E2C26]">
                      {product.name}
                    </h3>

                    <p className="mt-0.5 font-sans text-md tracking-normal text-[#3E2C26]">
                      {product.price}
                    </p>
                  </div>

                  <ProductActions
                    productId={product.id}
                    onAddToCart={onAddToCart}
                    // onToggleWishlist={product.id}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
