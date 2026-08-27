"use client";

import { Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import Drawer from "./Drawer";
// import { useWishlistStore } from '@/store/useWishlistStore';
// import { useCartStore } from '@/store/useCartStore';

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export default function WishlistDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // const items = useWishlistStore((s) => s.items);
  // const updateQuantity = useWishlistStore((s) => s.updateQuantity);
  // const removeItem = useWishlistStore((s) => s.removeItem);
  // const addToCart = useCartStore((s) => s.addItem);

  // Temporary placeholder data until store is wired back in
  const [items, setItems] = useState<WishlistItem[]>([
    {
      id: "1",
      name: "Sample Product",
      price: 1200,
      quantity: 1,
      image: "/images/placeholder.png",
    },
  ]);

  function updateQuantity(id: string, quantity: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function addToCart(item: WishlistItem) {}

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
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-2 rounded-full border border-ink/15 px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="text-ink/60 hover:text-ink"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-4 text-center text-xs font-medium text-ink">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="text-ink/60 hover:text-ink"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(item)}
                  className="flex items-end justify-end gap-1.5 self-start rounded-full bg-forest-700 px-3 py-1.5 text-xs font-semibold text-[#3E2C26] transition-colors hover:bg-forest-800"
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
