"use client";

import { useShop } from "@/context/ShopContext";
import { Product } from "@/types/product";

export function useProductActions(product: Product) {
  const {
    isInCart,
    isInWishlist,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
  } = useShop();

  const isCart = isInCart(product?.id);
  const isWishlisted = isInWishlist(product?.id);

  function handleCartToggle(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();

    if (isCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  }

  function handleWishlistToggle(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }

  return { isWishlisted, isCart, handleWishlistToggle, handleCartToggle };
}
