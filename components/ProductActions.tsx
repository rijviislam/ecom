"use client";

import { useProductActions } from "@/hooks/useProductActions";
import { Product } from "@/types/product";

export function ProductActions({
  product,
  onAddToCart,
  onToggleWishlist,
}: {
  product: Product;
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string, state: boolean) => void;
}) {
  const { isWishlisted, isCart, handleWishlistToggle, handleCartToggle } =
    useProductActions(product);

  return (
    <div className="flex shrink-0 items-center gap-2 select-none">
      <button
        type="button"
        onClick={(e) => {
          handleCartToggle(e);
          onAddToCart?.(product.id);
        }}
        aria-label="Add to cart"
        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-300 ${
          isCart
            ? "scale-105 bg-[#3E2C26] text-white"
            : "bg-[#5D4039] text-white hover:scale-105 hover:bg-[#5D4039] active:scale-95"
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
        onClick={(e) => {
          handleWishlistToggle(e);
          onToggleWishlist?.(product.id, !isWishlisted);
        }}
        aria-label="Save to wishlist"
        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-300 ${
          isWishlisted
            ? "scale-105 bg-[#3E2C26] text-white"
            : "bg-[#5D4039] text-white hover:scale-105 hover:bg-[#5D4039] active:scale-95"
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
