"use client";

import {
  isInCart,
  isInWishlist,
  toggleCart,
  toggleWishlist,
} from "@/lib/productAction";
import { useEffect, useState } from "react";

export function useProductActions(productId: string) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCart, setIsCart] = useState(false);

  useEffect(() => {
    setIsWishlisted(isInWishlist(productId));
    setIsCart(isInCart(productId));

    function syncWishlist() {
      setIsWishlisted(isInWishlist(productId));
    }
    function syncCart() {
      setIsCart(isInCart(productId));
    }

    window.addEventListener("wishlist-updated", syncWishlist);
    window.addEventListener("cart-updated", syncCart);
    return () => {
      window.removeEventListener("wishlist-updated", syncWishlist);
      window.removeEventListener("cart-updated", syncCart);
    };
  }, [productId]);

  function handleWishlistToggle(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    setIsWishlisted(toggleWishlist(productId));
  }

  function handleCartToggle(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    setIsCart(toggleCart(productId));
  }

  return { isWishlisted, isCart, handleWishlistToggle, handleCartToggle };
}
