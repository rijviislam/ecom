"use client";

import { ProductActions } from "@/components/ProductActions";
import { getProducts, type Product } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
          product={product}
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
    <section className={`w-full text-zinc-900  bg-[#EDE4DC]/50 pt-16 md:pt-0`}>
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
