"use client";

import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair",
});

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  aspectClass?: string;
}

const MASONRY_PRODUCTS: Product[] = [
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
    e.stopPropagation();

    const nextState = !isWishlisted;

    setIsWishlisted(nextState);
    onToggleWishlist?.(productId, nextState);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 900);

    onAddToCart?.(productId);
  };

  return (
    <div className="flex shrink-0 items-center gap-2 select-none">
      <button
        type="button"
        onClick={handleAddToCartClick}
        aria-label="Add to cart"
        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 ${
          isAdded
            ? "scale-105 border-zinc-900 bg-zinc-900 text-white"
            : "border-zinc-300/80 bg-white text-zinc-700 hover:scale-105 hover:border-zinc-900 hover:text-zinc-950 active:scale-95"
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
        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 ${
          isWishlisted
            ? "scale-105 border-zinc-900 bg-zinc-900 text-white"
            : "border-zinc-300/80 bg-white text-zinc-700 hover:scale-105 hover:border-zinc-900 hover:text-zinc-950 active:scale-95"
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
    <article className="group mb-8 w-full break-inside-avoid">
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
      <div className="flex items-start justify-between gap-3 px-0.5 pt-3.5">
        <div className="min-w-0 pr-2">
          <h3 className="font-sans text-sm font-medium tracking-tight text-zinc-900">
            {product.name}
          </h3>

          <p className="mt-0.5 font-sans text-xs tracking-normal text-zinc-500">
            {product.price}
          </p>
        </div>

        <ProductActions
          productId={product.id}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
        />
      </div>
    </article>
  );
}

/* ============================================================
   PINTEREST-STYLE MASONRY ENGINE
   Real Pinterest doesn't fill columns top-to-bottom (which is
   what CSS `columns-*` does). It drops each new card into
   whichever column is currently shortest, so columns stay
   balanced and cards read left-to-right in roughly the order
   they were added. We replicate that with a small greedy
   bin-packing pass based on each card's aspect ratio.
   ============================================================ */

// Parses "aspect-[3/4]" / "aspect-square" / "aspect-[4/3]" into a
// height-per-unit-width multiplier, so we can estimate relative
// card height without ever touching the DOM.
function getHeightRatio(aspectClass?: string): number {
  if (!aspectClass || aspectClass === "aspect-square") return 1;

  const match = aspectClass.match(/aspect-\[(\d+)\/(\d+)\]/);
  if (!match) return 1;

  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!width || !height) return 1;

  return height / width;
}

// Constant to approximate the title/price/actions row height so
// short-image cards don't get unfairly stacked on top of each other.
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

    // Find the shortest column so far — this is the core of the
    // Pinterest algorithm.
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

// Tracks the current column count based on viewport width, matching
// the sm (640px) and lg (1024px) Tailwind breakpoints.
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
}: {
  products: Product[];
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string, state: boolean) => void;
}) {
  const columnCount = useResponsiveColumnCount();

  const columns = useMemo(
    () => distributeIntoColumns(products, columnCount),
    [products, columnCount],
  );

  const gapClass =
    columnCount === 1 ? "gap-7" : columnCount === 2 ? "gap-6" : "gap-8";

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
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string, state: boolean) => void;
}

export default function ProductSection({
  title = "Products",
  seeAllLink = "#",
  seeAllText = "SEE ALL PRODUCTS",
  products = MASONRY_PRODUCTS,
  onAddToCart,
  onToggleWishlist,
}: ProductSectionProps) {
  return (
    <section
      className={`w-full py-16 text-zinc-900 md:py-24 ${playfair.variable}`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        {/* HEADER */}
        <div className="mb-10 flex items-baseline justify-between md:mb-14">
          <h2
            className="text-3xl font-normal tracking-tight text-zinc-900 sm:text-4xl md:text-5xl lg:text-6xl"
            style={{
              fontFamily: "var(--font-playfair), serif",
            }}
          >
            {title}
          </h2>

          <a
            href={seeAllLink}
            className="group relative inline-flex pb-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-800 transition-colors duration-300 hover:text-zinc-950 md:text-xs"
          >
            <span>{seeAllText}</span>

            <span className="absolute bottom-0 left-0 h-px w-full bg-zinc-800 transition-all duration-300 group-hover:h-[1.5px] group-hover:bg-zinc-950" />
          </a>
        </div>

        {/* TRUE PINTEREST-STYLE MASONRY — one responsive grid,
            column count adapts at sm/lg breakpoints, cards are
            distributed shortest-column-first like Pinterest. */}
        <MasonryGrid
          products={products}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
        />
      </div>
    </section>
  );
}
