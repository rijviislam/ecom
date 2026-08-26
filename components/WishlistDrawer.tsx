"use client";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Drawer from "./Drawer";
// import { useWishlistStore } from '@/store/useWishlistStore';
// import { useCartStore } from '@/store/useCartStore';

export default function WishlistDrawer({ isOpen, onClose }) {
  // const items = useWishlistStore((s) => s.items);
  // const removeItem = useWishlistStore((s) => s.removeItem);
  // const addToCart = useCartStore((s) => s.addItem);

  // Temporary placeholder data until store is wired back in
  const items = [
    {
      id: "1",
      name: "Sample Product",
      price: 1200,
      image: "/images/placeholder.png",
    },
  ];
  const removeItem = (id) => {};
  const addToCart = (item) => {};

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Wishlist (${items.length})`}
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
          <Heart className="h-10 w-10 text-ink/20" />
          <p className="text-sm text-ink/50">Your wishlist is empty</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
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
                    className="text-ink/40 transition-colors hover:text-clay-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">
                    ৳{item.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="flex items-center gap-1.5 rounded-full bg-forest-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-forest-800"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
