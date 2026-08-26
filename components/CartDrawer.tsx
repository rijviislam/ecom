"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import Drawer from "./Drawer";
// import { useCartStore } from '@/store/useCartStore';

export default function CartDrawer({ isOpen, onClose }) {
  // const items = useCartStore((s) => s.items);
  // const updateQuantity = useCartStore((s) => s.updateQuantity);
  // const removeItem = useCartStore((s) => s.removeItem);

  // Temporary placeholder data until store is wired back in
  const items = [
    {
      id: "1",
      name: "Sample Product",
      price: 1200,
      quantity: 1,
      image: "/images/placeholder.png",
    },
  ];
  const updateQuantity = (id, qty) => {};
  const removeItem = (id) => {};

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Cart (${items.length})`}
      footer={
        items.length > 0 && (
          <div className="space-y-3 ">
            <div className="flex items-center justify-between text-sm font-medium text-ink">
              <span>Subtotal</span>
              <span>৳{subtotal.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full rounded-full bg-forest-700 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-forest-800"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full rounded-full border border-ink/15 py-3 text-center text-sm font-medium text-ink transition-colors hover:bg-ink/5"
            >
              View Cart
            </Link>
          </div>
        )
      }
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
          <ShoppingBag className="h-10 w-10 text-ink/20" />
          <p className="text-sm text-ink/50">Your cart is empty</p>
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
                    aria-label="Remove item"
                    className="text-ink/40 transition-colors hover:text-clay-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">
                    ৳{item.price.toLocaleString()}
                  </span>

                  <div className="flex items-center gap-2 rounded-full border border-ink/15 px-2 py-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
