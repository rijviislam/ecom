"use client";

import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";
// import { useCartStore } from '@/store/useCartStore';
// import { useWishlistStore } from '@/store/useWishlistStore';

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/orders", label: "My Orders" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  // const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  // const wishlistCount = useWishlistStore((s) => s.items.length);

  // useEffect(() => setMounted(true), []);

  function handleSearchSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    router.push(
      searchValue.trim()
        ? `/products?q=${encodeURIComponent(searchValue.trim())}`
        : "/products",
    );
    setMobileOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#5A4139]/50  backdrop-blur px-10 ">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="font-display text-2xl tracking-tight text-ink text-[#3E2C26] flex items-center gap-1 font-bold"
          >
            Ecom
            <svg
              viewBox="0 0 100 100"
              width="24"
              height="24"
              fill="currentColor"
            >
              <g>
                <path d="M50 4 Q59 30 50 50 Q41 30 50 4 Z" />
                <path
                  d="M50 4 Q59 30 50 50 Q41 30 50 4 Z"
                  transform="rotate(60 50 50)"
                />
                <path
                  d="M50 4 Q59 30 50 50 Q41 30 50 4 Z"
                  transform="rotate(120 50 50)"
                />
                <path
                  d="M50 4 Q59 30 50 50 Q41 30 50 4 Z"
                  transform="rotate(180 50 50)"
                />
                <path
                  d="M50 4 Q59 30 50 50 Q41 30 50 4 Z"
                  transform="rotate(240 50 50)"
                />
                <path
                  d="M50 4 Q59 30 50 50 Q41 30 50 4 Z"
                  transform="rotate(300 50 50)"
                />
              </g>
            </svg>
          </Link>
          <nav className="hidden items-center gap-7 md:flex font-sans text-[#3E2C26]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-medium transition-colors ${
                  pathname === link.href
                    ? "text-forest-700"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* <form
            onSubmit={handleSearchSubmit}
            className="relative hidden max-w-xs flex-1 md:block"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-ink/15 bg-white py-2 pl-9 pr-4 text-sm focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600"
            />
          </form> */}

          <div className="flex items-center gap-1">
            <button
              aria-label="Wishlist"
              onClick={() => setWishlistOpen(true)}
              className="relative rounded-full p-2.5 text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink text-[#3E2C26]"
            >
              <Heart className="h-5 w-5" />
              {/* {mounted && wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-clay-500 text-[10px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )} */}
            </button>
            <button
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
              className="relative rounded-full p-2.5 text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink text-[#5A4139]"
            >
              <ShoppingBag className="h-5 w-5" />
              {/* {mounted && cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-forest-700 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )} */}
            </button>
            <button
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-full p-2.5 text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink md:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-ink/10 bg-cream px-4 pb-4 pt-3 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-ink/15 bg-white py-2 pl-9 pr-4 text-sm focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600"
              />
            </form>
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    pathname === link.href
                      ? "bg-forest-50 text-forest-700"
                      : "text-ink/70"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
      />
    </>
  );
}
