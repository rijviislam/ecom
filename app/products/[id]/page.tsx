"use client";

import { getProducts } from "@/lib/data";
import {
  Check,
  ChevronRight,
  Headphones,
  Heart,
  Maximize2,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  // getProducts() is cheap/in-memory here; useMemo avoids recomputing
  // the normalized list on every render (e.g. when quantity changes).
  const allProducts = useMemo(() => getProducts(), []);

  const product = allProducts.find((p) => p.id === id || p.slug === id);

  // Gallery state
  const galleryImages =
    product?.gallery && product.gallery.length > 0
      ? product.gallery
      : product?.image
        ? [product.image]
        : [];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Variant & Interaction State
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors ? product.colors[0]?.name : undefined,
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes ? product.sizes[0] : undefined,
  );
  const [quantity, setQuantity] = useState(1);
  const [isWish, setIsWish] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "shipping"
  >("description");
  const [isAdded, setIsAdded] = useState(false);

  // 1. PRODUCT NOT FOUND STATE
  if (!product) {
    return (
      <div className="w-full min-h-screen bg-[#EDE4DC] text-[#261815] flex flex-col justify-center items-center px-6 py-28 text-center select-none font-sans">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3E2C26]/50 mb-3">
          404
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#261815] mb-4">
          Product Not Found
        </h1>
        <p className="text-sm sm:text-base text-[#261815]/70 max-w-md mb-8 leading-relaxed">
          The product you&apos;re looking for doesn&apos;t exist or may have
          been removed.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#261815] text-[#EDE4DC] text-xs font-semibold uppercase tracking-wider hover:bg-[#261815]/90 transition-all shadow-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const currentImage = galleryImages[activeImageIdx] || product.image;

  // Related products: prefer same category, fall back to any other product
  const relatedProducts = (() => {
    const sameCategory = allProducts.filter(
      (p) => p.id !== product.id && p.category === product.category,
    );
    const rest = allProducts.filter(
      (p) => p.id !== product.id && p.category !== product.category,
    );
    return [...sameCategory, ...rest].slice(0, 4);
  })();

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div className="w-full min-h-screen bg-[#EDE4DC] text-[#261815]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12">
        {/* 1. BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#261815]/60 mb-8 sm:mb-10 font-sans motion-safe:animate-fadeInUp"
        >
          <Link href="/" className="hover:text-[#261815] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-[#261815]/40" />
          <Link
            href="/products"
            className="hover:text-[#261815] transition-colors"
          >
            Products
          </Link>
          {product.brand && (
            <>
              <ChevronRight className="h-3 w-3 text-[#261815]/40" />
              <span className="hover:text-[#261815] transition-colors">
                {product.brand}
              </span>
            </>
          )}
          <ChevronRight className="h-3 w-3 text-[#261815]/40" />
          <span className="text-[#261815] font-medium truncate max-w-45 sm:max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* 2. MAIN 2-COLUMN PRODUCT DETAILS LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pb-16 lg:pb-24 border-b border-[#3E2C26]/10">
          {/* LEFT COLUMN: LARGE IMAGE GALLERY (Col span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-4 motion-safe:animate-fadeInUp">
            {/* Main Image Frame */}
            <div className="group relative w-full aspect-4/3 sm:aspect-square max-h-115 rounded-2xl overflow-hidden bg-white/70 border border-[#3E2C26]/10 shadow-sm">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                priority
              />

              {/* Discount Badge */}
              {product.isSale && (
                <span className="absolute top-4 left-4 bg-[#261815] text-[#EDE4DC] text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs font-sans">
                  {product.discount || "SALE"}
                </span>
              )}

              {/* Fullscreen Lightbox Trigger */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Open fullscreen image"
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#261815] shadow-xs opacity-0 group-hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>

            {/* Thumbnails Row */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                {galleryImages.map((imgUrl: string, idx: number) => {
                  const isActive = activeImageIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 rounded-xl overflow-hidden bg-white/60 transition-all cursor-pointer ${
                        isActive
                          ? "ring-2 ring-[#261815] ring-offset-2 border-transparent shadow-sm"
                          : "border border-[#3E2C26]/15 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        fill
                        sizes="90px"
                        className="object-cover select-none"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PRODUCT INFORMATION & PURCHASING (Col span 5) */}
          <div className="lg:col-span-5 flex flex-col font-sans select-none motion-safe:animate-fadeInUp delay-100">
            {/* Brand Label */}
            {product.brand && (
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3E2C26]/60 mb-2">
                {product.brand}
              </span>
            )}

            {/* Product Name */}
            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-normal tracking-tight font-display text-[#261815] leading-[1.15] mb-3.5">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pb-5 border-b border-[#3E2C26]/10 mb-6">
              <span className="text-2xl sm:text-3xl font-semibold text-[#261815]">
                ৳ {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-base text-[#261815]/40 line-through">
                  ৳ {product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.discount && (
                <span className="text-xs font-semibold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {product.discount}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm leading-relaxed text-[#261815]/75 mb-6">
              {product.description}
            </p>

            {/* Color Variants */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6 flex flex-col gap-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#261815]/70">
                  Color:{" "}
                  <span className="font-normal text-[#261815]">
                    {selectedColor}
                  </span>
                </span>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c) => {
                    const isSelected = selectedColor === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`h-7 w-7 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? "ring-2 ring-offset-2 ring-[#261815] border-white"
                            : "border-black/15 hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        aria-label={c.name}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Variants */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#261815]/70">
                    Size:{" "}
                    <span className="font-normal text-[#261815]">
                      {selectedSize}
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#261815] bg-[#261815] text-white shadow-xs"
                            : "border-[#261815]/20 bg-white/50 text-[#261815] hover:border-[#261815]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart Area */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
              {/* Quantity Stepper */}
              <div className="flex items-center justify-between border border-[#261815]/30 rounded-xl bg-white/70 p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="p-2.5 text-[#261815] hover:bg-[#261815]/10 rounded-lg transition-colors cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="px-5 text-sm font-semibold text-[#261815]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="p-2.5 text-[#261815] hover:bg-[#261815]/10 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Primary Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-semibold uppercase tracking-wider text-xs transition-all shadow-sm cursor-pointer ${
                  isAdded
                    ? "bg-[#261815] text-white scale-102"
                    : "bg-[#261815] text-white hover:bg-[#261815]/90 hover:shadow-md"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="h-4 w-4 stroke-[2.5]" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>
                      Add to Cart • ৳{" "}
                      {(product.price * quantity).toLocaleString()}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Wishlist CTA Button */}
            <button
              type="button"
              onClick={() => setIsWish((prev) => !prev)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer mb-8 ${
                isWish
                  ? "border-rose-600 bg-rose-50 text-rose-600"
                  : "border-[#261815]/20 bg-white/50 text-[#261815] hover:border-[#261815]"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${isWish ? "fill-rose-600 text-rose-600" : ""}`}
              />
              <span>{isWish ? "Added to Wishlist" : " Add to Wishlist"}</span>
            </button>

            {/* 3. PRODUCT BENEFITS ROW */}
            <div className="grid grid-cols-2 gap-3.5 py-5 border-t border-[#3E2C26]/10 text-xs text-[#261815]/75">
              <div className="flex items-start gap-2.5">
                <Truck className="h-4 w-4 text-[#261815] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#261815] block">
                    Free Shipping
                  </span>
                  <span className="text-[11px] text-[#261815]/60">
                    On orders over ৳5,000
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-[#261815] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#261815] block">
                    Secure Payment
                  </span>
                  <span className="text-[11px] text-[#261815]/60">
                    100% secure checkout
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <RefreshCw className="h-4 w-4 text-[#261815] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#261815] block">
                    Easy Returns
                  </span>
                  <span className="text-[11px] text-[#261815]/60">
                    7-day return policy
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Headphones className="h-4 w-4 text-[#261815] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#261815] block">
                    Customer Support
                  </span>
                  <span className="text-[11px] text-[#261815]/60">
                    We&apos;re here to help
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-14 border-b border-[#3E2C26]/10 font-sans">
          {/* Tab Headers */}
          <div className="flex items-center gap-8 border-b border-[#3E2C26]/15 pb-4 mb-8 overflow-x-auto no-scrollbar">
            {(["description", "specifications", "shipping"] as const).map(
              (tabKey) => {
                const isActive = activeTab === tabKey;
                const label =
                  tabKey === "description"
                    ? "Description"
                    : tabKey === "specifications"
                      ? "Specifications"
                      : "Shipping & Returns";

                return (
                  <button
                    key={tabKey}
                    type="button"
                    onClick={() => setActiveTab(tabKey)}
                    className={`text-sm font-semibold uppercase tracking-wider pb-1 transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? "text-[#261815] border-b-2 border-[#261815]"
                        : "text-[#261815]/40 hover:text-[#261815]/75"
                    }`}
                  >
                    {label}
                  </button>
                );
              },
            )}
          </div>

          {/* Tab 1: Description */}
          {activeTab === "description" && (
            <div className="max-w-3xl flex flex-col gap-4 text-sm leading-relaxed text-[#261815]/80 animate-fadeIn">
              <p>{product.longDescription || product.description}</p>
            </div>
          )}

          {/* Tab 2: Specifications */}
          {activeTab === "specifications" && (
            <div className="max-w-2xl animate-fadeIn">
              <div className="divide-y divide-[#3E2C26]/10 text-xs sm:text-sm">
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#261815]/60">Brand</span>
                  <span className="font-semibold text-[#261815]">
                    {product.specifications?.brand || product.brand}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#261815]/60">Category</span>
                  <span className="font-semibold text-[#261815]">
                    {product.specifications?.category || product.category}
                  </span>
                </div>
                {product.specifications?.sku && (
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#261815]/60">SKU</span>
                    <span className="font-mono text-xs font-medium text-[#261815]">
                      {product.specifications.sku}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Shipping & Returns */}
          {activeTab === "shipping" && (
            <div className="max-w-3xl flex flex-col gap-4 text-sm leading-relaxed text-[#261815]/80 animate-fadeIn">
              <p>
                <strong>Delivery Information:</strong> All orders are dispatched
                within 24 hours. Standard delivery takes 2–4 business days
                across major metropolitan cities. Express courier options
                available at checkout.
              </p>
              <p>
                <strong>Return Policy:</strong> We offer a hassle-free 7-day
                return policy. Items must be in original condition with tags and
                packaging intact.
              </p>
              <p>
                <strong>Packaging:</strong> Shipped in 100% recyclable,
                tamper-evident protective luxury packaging.
              </p>
            </div>
          )}
        </div>

        {/* 5. CUSTOMER REVIEWS SECTION */}
        <section className="py-14 border-b border-[#3E2C26]/10 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display text-[#261815] mb-2">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-[#261815]">
                  4.8 / 5
                </span>
                <span className="text-xs text-[#261815]/50">
                  (124 verified ratings)
                </span>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: "1",
                name: "Sarah Ahmed",
                rating: 5,
                date: "June 02, 2026",
                text: "Excellent quality and very comfortable. The product looks exactly like the photos.",
              },
              {
                id: "2",
                name: "Tanvir Hasan",
                rating: 5,
                date: "May 24, 2026",
                text: "Remarkable craftsmanship. Fast delivery and premium packaging exceeded expectations.",
              },
              {
                id: "3",
                name: "Farhan Kabir",
                rating: 4,
                date: "May 10, 2026",
                text: "Great daily essential. Would definitely recommend to anyone looking for refined style.",
              },
            ].map((rev) => (
              <div
                key={rev.id}
                className="flex flex-col bg-white/45 rounded-2xl p-5 border border-[#3E2C26]/5 shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#261815]">
                    {rev.name}
                  </span>
                  <span className="text-[11px] text-[#261815]/50">
                    {rev.date}
                  </span>
                </div>
                <div className="flex items-center text-amber-500 mb-3">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-[#261815]/75">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. YOU MAY ALSO LIKE (Related Products) */}
        {relatedProducts.length > 0 && (
          <section className="pt-14 pb-8 font-sans">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-display text-[#261815]">
                You May Also Like
              </h2>
              <Link
                href="/products"
                className="text-xs font-semibold uppercase tracking-wider text-[#261815]/70 hover:text-[#261815] underline"
              >
                View all products
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.id}`}
                  className="group flex flex-col rounded-2xl p-2.5 sm:p-3 transition-all duration-300   select-none"
                >
                  <div className="relative w-full aspect-4/5 overflow-hidden rounded-xl  block">
                    <Image
                      src={rel.image}
                      alt={rel.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {rel.isSale && (
                      <span className="absolute top-2 left-2 bg-[#261815] text-[#EDE4DC] text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full shadow-xs">
                        {rel.discount || "SALE"}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col pt-2.5 px-0.5">
                    {rel.brand && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#261815]/55">
                        {rel.brand}
                      </span>
                    )}
                    <h3 className="text-xs sm:text-sm font-medium tracking-tight text-[#261815] line-clamp-1 mt-0.5">
                      {rel.name}
                    </h3>
                    <span className="text-xs sm:text-sm font-semibold text-[#261815] mt-1">
                      ৳ {rel.price.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 7. STICKY MOBILE BOTTOM ADD-TO-CART BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#EDE4DC]/95 backdrop-blur-md border-t border-[#3E2C26]/15 p-3.5 sm:hidden flex items-center justify-between gap-3 shadow-lg font-sans">
        <div>
          <span className="text-[11px] text-[#261815]/60 block line-clamp-1">
            {product.name}
          </span>
          <span className="text-sm font-bold text-[#261815]">
            ৳ {product.price.toLocaleString()}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="px-5 py-2.5 rounded-xl bg-[#261815] text-[#EDE4DC] text-xs font-semibold uppercase tracking-wider active:scale-95 transition-all shadow-sm"
        >
          {isAdded ? "Added!" : "Add to Cart"}
        </button>
      </div>

      {/* 8. LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 cursor-pointer"
            aria-label="Close fullscreen view"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
