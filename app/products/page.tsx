import { Product } from "@/components/ProductSection";
import {
  ChevronDown,
  Heart,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const PRODUCTS_DATA: Product[] = [
  {
    id: "1",
    name: "Balm Amour",
    price: "$ 40",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop",
    aspectClass: "aspect-[3/4]",
  },
  {
    id: "2",
    name: "Reusable Eye Mask",
    price: "$ 29",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
    aspectClass: "aspect-square",
  },
  {
    id: "3",
    name: "C'est La Cream",
    price: "$ 78",
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1000&auto=format&fit=crop",
    aspectClass: "aspect-[2/3]",
  },
  {
    id: "4",
    name: "Invisible Bandage",
    price: "$ 33",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
    aspectClass: "aspect-[4/5]",
  },
  {
    id: "5",
    name: "Hydrating Botanic Serum",
    price: "$ 64",
    image:
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=800&auto=format&fit=crop",
    aspectClass: "aspect-[3/4]",
  },
  {
    id: "6",
    name: "Skin Amour Duo",
    price: "$ 72",
    image:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop",
    aspectClass: "aspect-[4/3]",
  },
];

export default function ProductsPage() {
  // Distribute products across columns for pure CSS-like waterfall masonry
  const col1 = PRODUCTS_DATA.filter((_, i) => i % 3 === 0);
  const col2 = PRODUCTS_DATA.filter((_, i) => i % 3 === 1);
  const col3 = PRODUCTS_DATA.filter((_, i) => i % 3 === 2);

  const mobileCol1 = PRODUCTS_DATA.filter((_, i) => i % 2 === 0);
  const mobileCol2 = PRODUCTS_DATA.filter((_, i) => i % 2 === 1);

  return (
    <div
      className={`w-full min-h-screen bg-[#EDE4DC] text-[#261815] flex flex-col justify-between `}
    >
      <div>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-24">
          {/* 1. HERO TITLE & SEARCH BAR */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-10 pb-8 md:pt-16 md:pb-12 border-b border-[#3E2C26]/10 mb-8">
            <div className="flex flex-col items-start max-w-2xl">
              <h2 className="font-display text-3xl  text-[#3E2C26] md:text-5xl font-bold">
                All Products
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-[#3E2C26]/70 font-sans">
                Explore our collection of carefully selected products.
              </p>
            </div>

            {/* Visual Search Bar */}
            <div className="w-full md:max-w-xs lg:max-w-sm">
              <div className="relative flex items-center border-b border-[#3E2C26]/30 pb-2">
                <Search className="h-4 w-4 text-[#3E2C26]/60 shrink-0 mr-3" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-transparent text-sm text-[#261815] placeholder:text-[#261815]/40 outline-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* 2. MAIN LAYOUT: SIDEBAR (LEFT) + MASONRY GRID (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* DESKTOP FILTER SIDEBAR (Col span 3) */}
            <aside className="hidden lg:flex lg:col-span-3 mt-3 flex-col gap-8 font-sans select-none sticky top-24 ">
              <div className="flex items-center justify-between  border-b border-[#3E2C26]/15 pb-4.5">
                <h3 className="text-xs sm:text-sm font-semibold tracking-tight text-[#261815]">
                  Filters
                </h3>
                <span className="text-[11px] font-medium text-[#3E2C26]/60 hover:text-[#3E2C26] cursor-pointer">
                  Clear Filters
                </span>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/70">
                  Category
                </h4>
                <div className="flex flex-col gap-2.5 text-xs text-[#261815]">
                  {["Electronics", "Fashion", "Accessories"].map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2.5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={cat === "Electronics"}
                        className="h-4 w-4 rounded border-[#3E2C26]/30 text-[#3E2C26] focus:ring-[#3E2C26] accent-[#3E2C26]"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="flex flex-col gap-3 pt-4 border-t border-[#3E2C26]/10">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/70">
                  Brand
                </h4>
                <div className="flex flex-col gap-2.5 text-xs text-[#261815]">
                  {["Apple", "Nike", "Sony"].map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2.5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={brand === "Apple"}
                        className="h-4 w-4 rounded border-[#3E2C26]/30 text-[#3E2C26] focus:ring-[#3E2C26] accent-[#3E2C26]"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="flex flex-col gap-3 pt-4 border-t border-[#3E2C26]/10">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/70">
                    Price
                  </h4>
                  <span className="text-xs font-semibold text-[#261815]">
                    ৳ 0 — ৳ 50,000
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  defaultValue={50000}
                  className="w-full accent-[#3E2C26] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#261815]/50">
                  <span>৳ 0</span>
                  <span>৳ 50,000</span>
                </div>
              </div>
            </aside>

            {/* PRODUCT CATALOG & CONTROLS (Col span 9) */}
            <div className="lg:col-span-9 flex flex-col font-sans">
              {/* Toolbar */}
              <div className="w-full flex items-center justify-between pb-4 border-b border-[#3E2C26]/10 mb-6 select-none">
                {/* Mobile Filter Button */}
                <button
                  type="button"
                  className="flex lg:hidden items-center gap-2 px-3 py-1.5 rounded-lg border border-[#3E2C26]/30 bg-white/70 text-xs font-semibold uppercase tracking-wider text-[#3E2C26]"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Filters</span>
                </button>

                {/* Dynamic Product Count */}
                <span className="text-xs sm:text-sm font-semibold tracking-tight text-[#261815]">
                  24 Products
                </span>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="text-[#261815]/60 font-medium hidden sm:inline">
                    Sort:
                  </span>
                  <div className="flex items-center gap-1.5 border border-[#3E2C26]/20 bg-white/70 px-3 py-1.5 rounded-lg text-[#261815] font-medium cursor-pointer">
                    <span>Featured</span>
                    <ChevronDown className="h-3.5 w-3.5 text-[#261815]/60" />
                  </div>
                </div>
              </div>

              {/* 3. PINTEREST-STYLE MASONRY GRID */}
              {/* DESKTOP (3 Columns) */}
              <div className="hidden lg:grid grid-cols-3 gap-5 xl:gap-6 items-start">
                {[col1, col2, col3].map((column, colIdx) => (
                  <div
                    key={colIdx}
                    className="flex flex-col gap-5 xl:gap-6 w-full min-w-0"
                  >
                    {column.map((product) => (
                      <Link
                        href={`/products/${product.id}`}
                        key={product.id}
                        className="group flex flex-col w-full  rounded-2xl p-2.5 sm:p-3 transition-all duration-300   select-none"
                      >
                        {/* Image Container with variable aspect ratio */}
                        <div
                          className={`relative w-full ${product.aspectClass || "aspect-3/4"} overflow-hidden rounded-xl bg-zinc-100/90 block`}
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                          />

                          {/* Wishlist Heart Button */}
                          <button
                            type="button"
                            aria-label="Save to wishlist"
                            className="absolute top-2 right-2 z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/95 text-[#261815] shadow-xs hover:scale-110 active:scale-95 transition-all cursor-pointer"
                          >
                            <Heart className="h-3.5 w-3.5 text-[#261815]/80" />
                          </button>

                          {/* Quick Add To Cart Button */}
                          <button
                            type="button"
                            aria-label="Add to cart"
                            className="absolute bottom-2 right-2 z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/95 text-[#261815] hover:bg-[#261815] hover:text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5 stroke-2" />
                          </button>
                        </div>

                        {/* Product Information */}
                        <div className="flex flex-col pt-2.5 px-0.5">
                          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#261815]/55">
                            {/* {product?.brand} */}
                          </span>
                          <h3 className="text-xs sm:text-sm font-medium tracking-tight text-[#261815] line-clamp-1 mt-0.5">
                            {product.name}
                          </h3>
                          <div className="flex items-baseline gap-1.5 mt-1.5">
                            <span className="text-xs sm:text-sm font-semibold text-[#261815]">
                              ৳ {product.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>

              {/* TABLET & MOBILE (2 Columns) */}
              <div className="grid lg:hidden grid-cols-2 gap-3.5 sm:gap-5 items-start">
                {[mobileCol1, mobileCol2].map((column, colIdx) => (
                  <div
                    key={colIdx}
                    className="flex flex-col gap-3.5 sm:gap-5 w-full min-w-0"
                  >
                    {column.map((product) => (
                      <div
                        key={product.id}
                        className="group flex flex-col w-full bg-white/50 hover:bg-white rounded-2xl p-2.5 transition-all duration-300 hover:shadow-xl border border-[#3E2C26]/5 select-none"
                      >
                        <div
                          className={`relative w-full ${product.aspectClass || "aspect-3/4"} overflow-hidden rounded-xl bg-zinc-100/90 block`}
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, 50vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                          />

                          <button
                            type="button"
                            aria-label="Save to wishlist"
                            className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[#261815] shadow-xs"
                          >
                            <Heart className="h-3 w-3 text-[#261815]/80" />
                          </button>
                        </div>

                        <div className="flex flex-col pt-2 px-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#261815]/55">
                            {/* {product.brand} */}
                          </span>
                          <h3 className="text-xs font-medium tracking-tight text-[#261815] line-clamp-1 mt-0.5">
                            {product.name}
                          </h3>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-xs font-semibold text-[#261815]">
                              ৳ {product.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
