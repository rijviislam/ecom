"use client";

import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SHOP_LINKS = [
  { href: "/products", label: "Shop All" },
  { href: "/products?category=new", label: "New Arrivals" },
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

export default function Navbar({
  brandName = "ECOM",
  cartCount = 0,
}: {
  brandName?: string;
  cartCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const navContainerRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }

    if (menuOpen || searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, searchOpen]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setMenuOpen(false);
    }
  }

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
            onClick={() => {
              setMenuOpen((prev) => !prev);
              if (searchOpen) setSearchOpen(false);
            }}
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
                <X className="h-4 w-4 stroke-[2]" />
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
              onClick={() => setMenuOpen(false)}
              className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight text-[#3E2C26] transition-opacity hover:opacity-85 select-none"
            >
              {brandName}
            </Link>
          </div>

          {/* 3. RIGHT: SEARCH BUTTON */}
          <button
            type="button"
            onClick={() => {
              setSearchOpen((prev) => !prev);
              if (menuOpen) setMenuOpen(false);
            }}
            aria-label="Search"
            className={`flex items-center justify-center px-4 sm:px-5 border-l border-[#3E2C26]/40 text-[#3E2C26] transition-colors cursor-pointer outline-none select-none ${
              searchOpen ? "bg-[#3E2C26] text-white" : "hover:bg-[#3E2C26]/5"
            }`}
          >
            {searchOpen ? (
              <X className="h-4 w-4 stroke-[1.75]" />
            ) : (
              <Search className="h-4 w-4 stroke-[1.75]" />
            )}
          </button>

          {/* 4. RIGHT: CART BUTTON */}
          <button
            type="button"
            aria-label="Cart"
            className="relative flex items-center justify-center px-4 sm:px-5 border-l border-[#3E2C26]/40 text-[#3E2C26] hover:bg-[#3E2C26]/5 transition-colors cursor-pointer outline-none select-none"
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
          <div className="absolute left-6 top-16 w-1/2 z-10 animate-fadeIn">
            <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-[#3E2C26]/40 border-x border-b border-[#3E2C26]/40 bg-[#EDE4DC] shadow-xl">
              {/* COLUMN 1: SHOP — fixed column width; drawer's total width = number of columns × this width */}
              <div className="w-full sm:w-64 p-6 sm:p-8 flex flex-col">
                <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#3E2C26] font-sans mb-5">
                  SHOP
                </h3>
                <ul className="flex flex-col gap-3.5">
                  {SHOP_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
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

              {/* COLUMN 2: BRAND — same fixed width; add a 3rd column with this same width class to widen the drawer further */}
              <div className="w-full sm:w-64 p-6 sm:p-8 flex flex-col">
                <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#3E2C26] font-sans mb-5">
                  BRAND
                </h3>
                <ul className="flex flex-col gap-3.5">
                  {BRAND_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
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

        {/* EXPANDABLE INLINE SEARCH BAR */}
        {searchOpen && (
          <div className="max-w-7xl mx-auto border-x border-b border-[#3E2C26]/40 bg-[#EDE4DC] p-3 shadow-lg relative z-10 animate-fadeIn">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center"
            >
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3E2C26]/50" />
              <input
                autoFocus
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products, collections, stories..."
                className="w-full bg-transparent pl-10 pr-24 py-1.5 text-sm text-[#3E2C26] placeholder:text-[#3E2C26]/40 outline-none font-sans"
              />
              <button
                type="submit"
                className="absolute right-2 text-xs font-semibold uppercase tracking-wider text-[#3E2C26] hover:text-[#3E2C26]/70 px-2 py-1 cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* CLICK-OUTSIDE BACKDROP OVERLAY */}
      {menuOpen && (
        <div
          className="fixed  inset-0 z-30 bg-black/15 backdrop-blur-[12px] transition-opacity"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
