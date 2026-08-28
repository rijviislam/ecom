"use client";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";

import { useShop } from "@/context/ShopContext";
import Drawer from "./Drawer";

export default function WishlistDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { wishlist, wishlistCount, removeFromWishlist, addToCart } = useShop();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Wishlist (${wishlistCount})`}
    >
      {wishlist.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
          <Heart className="h-10 w-10 text-ink/20" />

          <p className="text-sm text-ink/50">Your wishlist is empty</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {wishlist.map((item) => (
            <li key={item.id} className="flex gap-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink/5">
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
                    onClick={() => removeFromWishlist(item.id)}
                    aria-label="Remove from wishlist"
                    className="cursor-pointer text-ink/40 hover:text-clay-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <span className="text-sm font-semibold text-ink">
                  ৳{(item.price ?? 0).toLocaleString()}
                </span>

                <button
                  onClick={() => addToCart(item)}
                  className="flex items-center justify-center gap-1.5 self-start rounded-full py-1.5 text-xs font-semibold text-[#3E2C26] cursor-pointer"
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
