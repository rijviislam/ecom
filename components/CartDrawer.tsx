"use client";

import { useShop } from "@/context/ShopContext";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import Drawer from "./Drawer";

export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { cart, cartCount, subtotal, updateQuantity, removeFromCart } =
    useShop();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Cart (${cartCount})`}
      footer={
        cart.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium text-ink">
              <span>Subtotal</span>

              <span>৳{subtotal.toLocaleString()}</span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full rounded-full bg-[#3E2C26] py-3 text-center text-sm font-semibold text-white transition-colors"
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
      {cart.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
          <ShoppingBag className="h-10 w-10 text-ink/20" />

          <p className="text-sm text-ink/50">Your cart is empty</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {cart.map((item) => (
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
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                    className="cursor-pointer text-ink/40 hover:text-clay-600"
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
                      className="cursor-pointer text-ink/60"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>

                    <span className="w-4 text-center text-xs font-medium ">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="cursor-pointer text-ink/60"
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
