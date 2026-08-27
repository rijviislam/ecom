"use client";

import { getProducts } from "@/lib/data";
import { Product } from "@/types/product";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Drawer from "./Drawer";

type CartItem = Product & { quantity: number };
type StoredCartEntry = { id: string; quantity: number };

function readCart(): StoredCartEntry[] {
  const savedCart = localStorage.getItem("cart");
  if (!savedCart) return [];
  try {
    return JSON.parse(savedCart);
  } catch {
    return [];
  }
}

function writeCart(entries: StoredCartEntry[]) {
  localStorage.setItem("cart", JSON.stringify(entries));
  window.dispatchEvent(new Event("cart-updated"));
}

export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [cartItem, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    function loadWishlist() {
      const savedCarts = localStorage.getItem("cart");
      if (!savedCarts) {
        setCartItems([]);
        return;
      }

      const cartIds: string[] = JSON.parse(savedCarts);
      const allProducts = getProducts();

      const matchedProducts = allProducts
        .filter((product) => cartIds.includes(product.id))
        .map((product) => ({ ...product, quantity: 1 }));

      setCartItems(matchedProducts);
    }

    if (isOpen) {
      loadWishlist();
    }

    window.addEventListener("wishlist-updated", loadWishlist);
    return () => window.removeEventListener("wishlist-updated", loadWishlist);
  }, [isOpen]);

  console.log("first", cartItem);

  function updateQuantity(id: string, quantity: number) {
    const nextQuantity = Math.max(1, quantity);

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item,
      ),
    );

    const cartEntries = readCart();
    const updated = cartEntries.map((entry) =>
      entry.id === id ? { ...entry, quantity: nextQuantity } : entry,
    );
    writeCart(updated);
  }

  function removeItem(id: string) {
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    const savedCarts = localStorage.getItem("cart");
    if (savedCarts) {
      const ids: string[] = JSON.parse(savedCarts);
      localStorage.setItem(
        "cart",
        JSON.stringify(ids.filter((wid) => wid !== id)),
      );
    }
  }

  const subtotal = cartItem.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Cart (${cartItem.length})`}
      footer={
        cartItem.length > 0 && (
          <div className="space-y-3 ">
            <div className="flex items-center justify-between text-sm font-medium text-ink">
              <span>Subtotal</span>
              <span>৳{subtotal.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full rounded-full bg-forest-700 py-3 text-center text-sm font-semibold text-[#FFF] bg-[#3E2C26] transition-colors hover:bg-forest-800"
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
      {cartItem.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
          <ShoppingBag className="h-10 w-10 text-ink/20" />
          <p className="text-sm text-ink/50">Your cart is empty</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {cartItem.map((item) => (
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
                    <span className="w-4 text-center text-xs font-medium text-ink">
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
