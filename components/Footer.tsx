import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" bg-[#5D4039] ">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 px-10">
        <div>
          <div className="font-display text-2xl text-ink">ECOM</div>
          <p className="mt-3 max-w-xs text-sm text-ink/60 font-sans">
            Thoughtfully sourced electronics, fashion, home and beauty — built
            as a frontend take-home exercise, running entirely on local mock
            data.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink/40 font-display">
            Shop
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-ink/70 font-sans">
            <li>
              <Link href="/products" className="hover:text-ink ">
                All products
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=electronics"
                className="hover:text-ink"
              >
                Electronics
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=fashion"
                className="hover:text-ink"
              >
                Fashion
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=home-living"
                className="hover:text-ink"
              >
                Home & Living
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink/40 font-display">
            Account
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-ink/70 font-sans">
            <li>
              <Link href="/orders" className="hover:text-ink">
                My orders
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-ink">
                Wishlist
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-ink">
                Cart
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink/40 font-display">
            Note
          </h4>
          <p className="mt-4 text-sm text-ink/60 font-sans">
            No backend is involved — every flow reads and writes to local JSON
            and your browser&apos;s storage only.
          </p>
        </div>
      </div>
      <div className="border-t border-gray-500/50 py-5 text-center text-xs text-ink/40 font-display">
        © 2026 Covet. Built for the Neo Nexor frontend assessment.
      </div>
    </footer>
  );
}
