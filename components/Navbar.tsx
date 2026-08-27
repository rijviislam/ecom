"use client";

import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";

const SHOP_LINKS = [
  { href: "/products", label: "Shop All" },
  { href: "/orders", label: "My Orders" },
  { href: "/products?category=skincare", label: "Skincare" },
  { href: "/products?category=makeup", label: "Makeup" },
  { href: "/products?category=fragrance", label: "Fragrance" },
  { href: "/products?category=body", label: "Body & Bath" },
];

const BRAND_LINKS = [
  { href: "/about", label: "About" },
  { href: "/rituals", label: "Our Rituals" },
  { href: "/contact", label: "Contact" },
  { href: "/shipping-returns", label: "Returns & Shipping" },
];

type ActivePanel = "menu" | "cart" | "wishlist" | null;

export default function Navbar({
  brandName = "ECOM",
  cartCount = 0,
  wishlistCount = 0,
}: {
  brandName?: string;
  cartCount?: number;
  wishlistCount?: number;
}) {
  const pathname = usePathname();

  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  const navContainerRef = useRef<HTMLDivElement>(null);

  const menuOpen = activePanel === "menu";
  const cartOpen = activePanel === "cart";
  const wishlistOpen = activePanel === "wishlist";

  function togglePanel(panel: Exclude<ActivePanel, null>) {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, activePanel]);

  return (
    <>
      <header
        ref={navContainerRef}
        className={`sticky top-0 z-50 w-full pt-3 pb-3 px-4 sm:px-6 relative transition-all `}
      >
        {/* TOP SEGMENTED BOXED BAR */}
        <div className="max-w-10xl mx-auto flex h-12 md:h-14 items-stretch border border-[#3E2C26]/50 bg-[#ece0de]/90 shadow-xs relative z-90">
          {/* 1. LEFT: MENU / CLOSE BUTTON */}
          <button
            type="button"
            onClick={() => togglePanel("menu")}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className={`flex items-center gap-2.5 px-5 sm:px-7 border-r border-[#3E2C26]/40 text-xs sm:text-sm font-medium tracking-wide uppercase transition-colors duration-200 cursor-pointer outline-none select-none ${
              menuOpen
                ? "bg-[#3E2C26] text-white"
                : "bg-transparent text-[#3E2C26] hover:bg-[#3E2C26]/5"
            }`}
          >
            {menuOpen ? (
              <>
                <X className="h-4 w-4 stroke-2" />
                <span className="font-sans">Close</span>
              </>
            ) : (
              <>
                <Menu className="h-4 w-4 stroke-[1.75]" />
                <span className="font-sans">Menu</span>
              </>
            )}
          </button>

          {/* 2. CENTER: EDITORIAL BRAND LOGO */}
          <div className="flex-1 flex items-center justify-center px-4">
            <Link
              href="/"
              onClick={() => setActivePanel(null)}
              className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-[#3E2C26] transition-opacity hover:opacity-85 select-none font-display"
            >
              {brandName}
            </Link>
          </div>

          {/* 3. RIGHT: SEARCH BUTTON */}

          {/* 4. RIGHT: WISHLIST BUTTON */}
          <button
            type="button"
            onClick={() => togglePanel("wishlist")}
            aria-label="Wishlist"
            className={`relative flex items-center justify-center px-4 sm:px-5 border-l border-[#3E2C26]/40 transition-colors cursor-pointer outline-none select-none ${
              wishlistOpen
                ? "bg-[#3E2C26] text-white"
                : "text-[#3E2C26] hover:bg-[#3E2C26]/5"
            }`}
          >
            <Heart className="h-4 w-4 stroke-[1.75]" />
            {wishlistCount > 0 && (
              <span className="absolute top-2 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#3E2C26] text-[9px] font-semibold text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* 5. RIGHT: CART BUTTON */}
          <button
            type="button"
            onClick={() => togglePanel("cart")}
            aria-label="Cart"
            className={`relative flex items-center justify-center px-4 sm:px-5 border-l border-[#3E2C26]/40 transition-colors cursor-pointer outline-none select-none ${
              cartOpen
                ? "bg-[#3E2C26] text-white"
                : "text-[#3E2C26] hover:bg-[#3E2C26]/5"
            }`}
          >
            <ShoppingBag className="h-4 w-4 stroke-[1.75]" />
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#3E2C26] text-[9px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* ATTACHED TOP MEGA-MENU DROPDOWN DRAWER */}
        {menuOpen && (
          <div className="absolute left-4 right-4 sm:left-6 sm:right-auto top-15 md:top-17 z-50 animate-fadeIn">
            <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-[#3E2C26]/40 border-x border-b border-[#3E2C26]/40 bg-[#ece0de]/90 shadow-xl">
              <div className="w-full sm:w-64 p-6 sm:p-8 flex flex-col">
                <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#3E2C26] font-sans mb-5">
                  SHOP
                </h3>
                <ul className="flex flex-col gap-3.5">
                  {SHOP_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setActivePanel(null)}
                        className={`text-sm text-[#3E2C26]/80 hover:text-[#3E2C26] hover:translate-x-0.5 transition-all font-sans ${
                          pathname === link.href
                            ? "font-semibold text-[#3E2C26]"
                            : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full sm:w-64 p-6 sm:p-8 flex flex-col">
                <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#3E2C26] font-sans mb-5">
                  BRAND
                </h3>
                <ul className="flex flex-col gap-3.5">
                  {BRAND_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setActivePanel(null)}
                        className="text-sm text-[#3E2C26]/80 hover:text-[#3E2C26] hover:translate-x-0.5 transition-all font-sans"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* CLICK-OUTSIDE BACKDROP OVERLAY (menu only) */}
      {menuOpen && (
        <div
          className="fixed  inset-0 z-40 bg-[#ece0de]/10 backdrop-blur-md transition-opacity"
          onClick={() => setActivePanel(null)}
        />
      )}

      {/* CART & WISHLIST DRAWERS — part of the same activePanel state, so mutually exclusive with menu/search too */}
      <CartDrawer isOpen={cartOpen} onClose={() => setActivePanel(null)} />
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setActivePanel(null)}
      />
    </>
  );
}
