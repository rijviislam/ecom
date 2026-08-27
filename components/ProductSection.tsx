"use client";

import { getProducts, type Product } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export function ProductActions({
  productId,
  onAddToCart,
  onToggleWishlist,
}: {
  productId: string;
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string, state: boolean) => void;
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextState = !isWishlisted;
    setIsWishlisted(nextState);

    const savedWishlist = localStorage.getItem("wishlist");
    const wishlist: string[] = savedWishlist ? JSON.parse(savedWishlist) : [];

    let updatedWishlist: string[];

    if (nextState) {
      updatedWishlist = wishlist.includes(productId)
        ? wishlist
        : [...wishlist, productId];
    } else {
      updatedWishlist = wishlist.filter((id) => id !== productId);
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    onToggleWishlist?.(productId, nextState);
  };
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      const wishlist: string[] = JSON.parse(savedWishlist);

      setIsWishlisted(wishlist.includes(productId));
    }
  }, [productId]);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdded(true);
    console.log("CART ADD:", productId);
    setTimeout(() => setIsAdded(false), 900);
    onAddToCart?.(productId);
  };

  return (
    <div className="flex shrink-0 items-center gap-2 select-none ">
      <button
        type="button"
        onClick={handleAddToCartClick}
        aria-label="Add to cart"
        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full  transition-all duration-300 ${
          isAdded
            ? "scale-105 bg-[#3E2C26] text-white"
            : "bg-[#5D4039] text-white hover:scale-105  hover:bg-[#5D4039] active:scale-95"
        }`}
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={handleWishlistClick}
        aria-label="Save to wishlist"
        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full  transition-all duration-300 ${
          isWishlisted
            ? "scale-105 bg-[#3E2C26] text-white"
            : "bg-[#5D4039] text-white hover:scale-105  hover:bg-[#5D4039] active:scale-95"
        }`}
      >
        <svg
          className="h-3.5 w-3.5"
          fill={isWishlisted ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
    </div>
  );
}

export function MasonryProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
}: {
  product: Product;
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string, state: boolean) => void;
}) {
  const aspect = product.aspectClass || "aspect-[3/4]";

  return (
    <Link
      href={`/products/${product.id}`}
      className="group w-full break-inside-avoid block"
    >
      {/* IMAGE */}
      <div
        className={`relative w-full ${aspect} overflow-hidden rounded-2xl bg-zinc-100/60`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="select-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        />
      </div>

      {/* PRODUCT INFO */}
      <div className="flex items-start justify-between gap-3 px-0.5 pt-3">
        <div className="min-w-0 pr-2">
          <h3 className="font-sans text-lg font-medium tracking-tight text-[#3E2C26] ">
            {product.name}
          </h3>

          <p className="mt-0.5 font-sans text-md tracking-normal text-[#3E2C26]">
            ৳ {product.price.toLocaleString()}
          </p>
        </div>

        <ProductActions
          productId={product.id}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
        />
      </div>
    </Link>
  );
}

function getHeightRatio(aspectClass?: string): number {
  if (!aspectClass || aspectClass === "aspect-square") return 1;

  const match = aspectClass.match(/aspect-\[(\d+)\/(\d+)\]/);
  if (!match) return 1;

  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!width || !height) return 1;

  return height / width;
}

const CARD_META_HEIGHT = 0.16;

function distributeIntoColumns(
  products: Product[],
  columnCount: number,
): Product[][] {
  const columns: Product[][] = Array.from({ length: columnCount }, () => []);
  const columnHeights = new Array(columnCount).fill(0);

  for (const product of products) {
    const estimatedHeight =
      getHeightRatio(product.aspectClass) + CARD_META_HEIGHT;

    let shortestIndex = 0;
    for (let i = 1; i < columnCount; i++) {
      if (columnHeights[i] < columnHeights[shortestIndex]) {
        shortestIndex = i;
      }
    }

    columns[shortestIndex].push(product);
    columnHeights[shortestIndex] += estimatedHeight;
  }

  return columns;
}

function useResponsiveColumnCount() {
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const computeColumnCount = () => {
      const width = window.innerWidth;
      if (width < 640) return 1;
      if (width < 1024) return 2;
      return 3;
    };

    const updateColumnCount = () => setColumnCount(computeColumnCount());

    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  return columnCount;
}

function MasonryGrid({
  products,
  onAddToCart,
  onToggleWishlist,
  maxProducts,
}: {
  products: Product[];
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string, state: boolean) => void;
  maxProducts?: number;
}) {
  const columnCount = useResponsiveColumnCount();

  const visibleProducts = useMemo(
    () =>
      maxProducts !== undefined ? products.slice(0, maxProducts) : products,
    [products, maxProducts],
  );

  const columns = useMemo(
    () => distributeIntoColumns(visibleProducts, columnCount),
    [visibleProducts, columnCount],
  );

  // gap-y controls vertical spacing between cards inside a column —
  // this is now the ONLY source of vertical spacing (card no longer
  // carries its own mb-8), so top/bottom whitespace stays consistent
  // instead of stacking up.
  const gapClass =
    columnCount === 1
      ? "gap-x-3 gap-y-5"
      : columnCount === 2
        ? "gap-x-4 gap-y-6"
        : "gap-x-6 gap-y-8";

  return (
    <div className={`flex w-full items-start ${gapClass}`}>
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className={`flex flex-1 flex-col ${gapClass}`}>
          {column.map((product) => (
            <MasonryProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export interface ProductSectionProps {
  title?: string;
  seeAllLink?: string;
  seeAllText?: string;
  products?: Product[];
  maxProducts?: number;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string, state: boolean) => void;
}

export default function ProductSection({
  title = "Products",
  seeAllLink = "#",
  seeAllText = "SEE ALL PRODUCTS",
  products,
  maxProducts = 8,
  onAddToCart,
  onToggleWishlist,
}: ProductSectionProps) {
  const allProducts = useMemo(() => getProducts(), []);
  const resolvedProducts = products ?? allProducts;

  return (
    <section className={`w-full text-zinc-900  bg-[#EDE4DC]/50 `}>
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="mb-10 flex items-baseline justify-between md:mb-14">
          <h2 className="font-display text-3xl font-bold text-[#3E2C26] md:text-4xl">
            {title}
          </h2>

          <Link
            href={seeAllLink}
            className="group relative inline-flex pb-0.5 font-sans text-[11px] font-bold text-[#3E2C26] uppercase tracking-[0.16em]  transition-colors duration-300 hover:text-zinc-950 md:text-xs"
          >
            <span>{seeAllText}</span>

            <span className="absolute bottom-0 left-0 h-px w-full bg-zinc-800 transition-all duration-300 group-hover:h-[1.5px] group-hover:bg-zinc-950" />
          </Link>
        </div>

        <MasonryGrid
          products={resolvedProducts}
          maxProducts={maxProducts}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
        />
      </div>
    </section>
  );
}
