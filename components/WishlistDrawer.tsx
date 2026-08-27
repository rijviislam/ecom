"use client";

import { getProducts } from "@/lib/data";
import { Product } from "@/types/product";
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Drawer from "./Drawer";

type WishlistItem = Product & { quantity: number };

export default function WishlistDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    function loadWishlist() {
      const savedWishlist = localStorage.getItem("wishlist");
      if (!savedWishlist) {
        setWishlistItems([]);
        return;
      }

      const wishlistIds: string[] = JSON.parse(savedWishlist);
      const allProducts = getProducts();

      const matchedProducts = allProducts
        .filter((product) => wishlistIds.includes(product.id))
        .map((product) => ({ ...product, quantity: 1 }));

      setWishlistItems(matchedProducts);
    }

    if (isOpen) {
      loadWishlist();
    }

    window.addEventListener("wishlist-updated", loadWishlist);
    return () => window.removeEventListener("wishlist-updated", loadWishlist);
  }, [isOpen]);

  function updateQuantity(id: string, quantity: number) {
    setWishlistItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  }

  function removeItem(id: string) {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));

    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      const ids: string[] = JSON.parse(savedWishlist);
      localStorage.setItem(
        "wishlist",
        JSON.stringify(ids.filter((wid) => wid !== id)),
      );
    }
  }

  function addToCart(productId: string) {
    try {
      const savedCart = localStorage.getItem("cart");
      const cart: string[] = savedCart ? JSON.parse(savedCart) : [];
      const updatedCart = cart.includes(productId)
        ? cart
        : [...cart, productId];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("CART ERROR:", error);
    }
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Wishlist (${wishlistItems.length})`}
    >
      {wishlistItems.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
          <Heart className="h-10 w-10 text-ink/20" />
          <p className="text-sm text-ink/50">Your wishlist is empty</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {wishlistItems.map((item) => (
            <li key={item.id} className="flex gap-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove from wishlist"
                    className="text-ink/40 transition-colors hover:text-clay-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">
                    ৳ {(item.price * item.quantity).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-2 rounded-full border border-ink/15 px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="text-ink/60 hover:text-ink cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-4 text-center text-xs font-medium text-ink ">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="text-ink/60 hover:text-ink cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(item.id)}
                  className="flex items-center justify-center gap-1.5 self-start rounded-full bg-forest-700  py-1.5 text-xs font-semibold text-[#3E2C26] transition-colors hover:bg-forest-800 cursor-pointer"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Add to Cart
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
