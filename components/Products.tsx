"use client";
import { useProductActions } from "@/hooks/useProductActions";
import { getProducts } from "@/lib/data";
import { Product } from "@/types/product";
import {
  ChevronDown,
  Heart,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const CATEGORIES = ["All", "Electronics", "Fashion", "Living", "Beauty"];
const BRANDS = ["Apple", "Nike", "Sony"];
const MAX_PRICE = 50000;

const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
  { id: "name_asc", label: "Name: A to Z" },
] as const;

type SortId = (typeof SORT_OPTIONS)[number]["id"];

function DesktopProductCard({ product }: { product: Product }) {
  const { isWishlisted, isCart, handleWishlistToggle, handleCartToggle } =
    useProductActions(product);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col w-full rounded-2xl p-2.5 sm:p-3 transition-all duration-300 select-none break-inside-avoid mb-5 xl:mb-6"
    >
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

        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label="Save to wishlist"
          className={`absolute top-2 right-2 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-300 ${
            isWishlisted
              ? "scale-105 bg-[#3E2C26] text-white"
              : "bg-[#5D4039] text-white hover:scale-105 hover:bg-[#5D4039] active:scale-95"
          }`}
        >
          <Heart
            className="h-3.5 w-3.5"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        <button
          type="button"
          onClick={handleCartToggle}
          aria-label="Add to cart"
          className={`absolute bottom-2 right-2 z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${
            isCart
              ? "bg-[#261815] text-white"
              : "bg-white/95 text-[#261815] hover:bg-[#261815] hover:text-white"
          }`}
        >
          <Plus className="h-3.5 w-3.5 stroke-2" />
        </button>
      </div>

      <div className="flex flex-col pt-2.5 px-0.5">
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#261815]/55">
          {product.brand}
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
  );
}

function MobileProductCard({ product }: { product: Product }) {
  const { isWishlisted, isCart, handleWishlistToggle, handleCartToggle } =
    useProductActions(product);

  return (
    <div className="group flex flex-col w-full rounded-2xl p-2.5 transition-all duration-300 select-none break-inside-avoid mb-3.5 sm:mb-5">
      <Link href={`/products/${product.id}`} className="block">
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
            onClick={handleWishlistToggle}
            aria-label="Save to wishlist"
            className={`absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-xs transition-all ${
              isWishlisted
                ? "bg-[#3E2C26] text-white"
                : "bg-white/95 text-[#261815]"
            }`}
          >
            <Heart
              className="h-3 w-3"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>

          <button
            type="button"
            onClick={handleCartToggle}
            aria-label="Add to cart"
            className={`absolute bottom-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-all ${
              isCart ? "bg-[#261815] text-white" : "bg-white/95 text-[#261815]"
            }`}
          >
            <Plus className="h-3.5 w-3.5 stroke-2" />
          </button>
        </div>
      </Link>

      <div className="flex flex-col pt-2 px-0.5">
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#261815]/55">
          {product.brand}
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
    </div>
  );
}

export default function ProductsPage() {
  const allProducts = getProducts();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(() =>
    categoryFromUrl && CATEGORIES.includes(categoryFromUrl)
      ? categoryFromUrl
      : "All",
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE);
  const [sortBy, setSortBy] = useState<SortId>("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (categoryFromUrl && CATEGORIES.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    } else if (!categoryFromUrl) {
      setSelectedCategory("All");
    }
  }, [categoryFromUrl]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedBrands([]);
    setMaxPrice(MAX_PRICE);
    setSortBy("featured");
  };

  const pro = useMemo(() => {
    let result = allProducts;

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          (p as any).category?.toLowerCase?.().includes(q),
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((p) => (p as any).category === selectedCategory);
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    result = result.filter((p) => p.price <= maxPrice);

    const sorted = [...result];
    switch (sortBy) {
      case "price_asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return sorted;
  }, [
    allProducts,
    searchQuery,
    selectedCategory,
    selectedBrands,
    maxPrice,
    sortBy,
  ]);

  const activeSortLabel =
    SORT_OPTIONS.find((s) => s.id === sortBy)?.label || "Featured";

  return (
    <div className="w-full min-h-screen bg-[#EDE4DC] text-[#261815] flex flex-col justify-between ">
      <div>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-24 ">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-10 pb-8 md:pt-16 md:pb-12 border-b border-[#3E2C26]/10 mb-8">
            <div className="flex flex-col items-start max-w-2xl">
              <h2 className="font-display text-3xl text-[#3E2C26] md:text-5xl font-bold">
                All Products
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-[#3E2C26]/70 font-sans">
                Explore our collection of carefully selected products.
              </p>
            </div>

            <div className="w-full md:max-w-xs lg:max-w-sm">
              <div className="relative flex items-center border-b border-[#3E2C26]/30 pb-2">
                <Search className="h-4 w-4 text-[#3E2C26]/60 shrink-0 mr-3" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#261815] placeholder:text-[#261815]/40 outline-none font-sans"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <aside
              className={`${
                isMobileFiltersOpen ? "flex" : "hidden"
              } lg:flex lg:col-span-3 mt-3 flex-col gap-8 font-sans select-none lg:sticky lg:top-24`}
            >
              <div className="flex items-center justify-between border-b border-[#3E2C26]/15 pb-4.5">
                <h3 className="text-xs sm:text-sm font-semibold tracking-tight text-[#261815]">
                  Filters
                </h3>
                <span
                  onClick={clearFilters}
                  className="text-[11px] font-medium text-[#3E2C26]/60 hover:text-[#3E2C26] cursor-pointer"
                >
                  Clear Filters
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/70">
                  Category
                </h4>
                <div className="flex flex-col gap-2.5 text-xs text-[#261815]">
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2.5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="h-4 w-4 border-[#3E2C26]/30 text-[#3E2C26] focus:ring-[#3E2C26] accent-[#3E2C26]"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-[#3E2C26]/10">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/70">
                  Brand
                </h4>
                <div className="flex flex-col gap-2.5 text-xs text-[#261815]">
                  {BRANDS.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2.5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="h-4 w-4 rounded border-[#3E2C26]/30 text-[#3E2C26] focus:ring-[#3E2C26] accent-[#3E2C26]"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-[#3E2C26]/10">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/70">
                    Price
                  </h4>
                  <span className="text-xs font-semibold text-[#261815]">
                    ৳ 0 — ৳ {maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={MAX_PRICE}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#3E2C26] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#261815]/50">
                  <span>৳ 0</span>
                  <span>৳ 50,000</span>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-9 flex flex-col font-sans">
              <div className="w-full flex items-center justify-between pb-4 border-b border-[#3E2C26]/10 mb-6 select-none">
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
                  className="flex lg:hidden items-center gap-2 px-3 py-1.5 rounded-lg border border-[#3E2C26]/30 bg-white/70 text-xs font-semibold uppercase tracking-wider text-[#3E2C26]"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Filters</span>
                </button>

                <span className="text-xs sm:text-sm font-semibold tracking-tight text-[#261815]">
                  {pro.length} Products
                </span>

                <div className="relative flex items-center gap-2 text-xs sm:text-sm">
                  <span className="text-[#261815]/60 font-medium hidden sm:inline">
                    Sort:
                  </span>
                  <div
                    onClick={() => setIsSortOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 border border-[#3E2C26]/20 bg-white/70 px-3 py-1.5 rounded-lg text-[#261815] font-medium cursor-pointer"
                  >
                    <span>{activeSortLabel}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-[#261815]/60" />
                  </div>

                  {isSortOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-[#3E2C26]/15 bg-white shadow-md z-20 overflow-hidden">
                      {SORT_OPTIONS.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => {
                            setSortBy(opt.id);
                            setIsSortOpen(false);
                          }}
                          className={`px-3.5 py-2.5 text-xs cursor-pointer hover:bg-[#EDE4DC] ${
                            sortBy === opt.id
                              ? "font-semibold text-[#261815] bg-[#EDE4DC]/70"
                              : "text-[#261815]/80"
                          }`}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {pro.length === 0 && (
                <p className="text-sm text-[#3E2C26]/60 py-10 text-center">
                  No products match your filters.
                </p>
              )}

              {pro.length > 0 && (
                <>
                  <div className="hidden lg:block columns-3 gap-5 xl:gap-6">
                    {pro.map((product) => (
                      <DesktopProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  <div className="grid lg:hidden columns-2 gap-3.5 sm:gap-5">
                    {pro.map((product) => (
                      <MobileProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
