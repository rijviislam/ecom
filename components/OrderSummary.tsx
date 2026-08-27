"use client";
import { getProducts } from "@/lib/data";
import { CheckoutItem, DeliveryInfo, DeliveryOption } from "@/types/checkout";
import { AlertCircle, Check, ShieldCheck, Tag, Truck } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function readCartIds(): string[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem("cart");
  if (!raw) {
    console.warn("[OrderSummary] localStorage 'cart' is empty");
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      console.log("[OrderSummary] raw cart ids", parsed);
      return parsed.map(String);
    }
    console.warn("[OrderSummary] 'cart' is not an array", parsed);
    return [];
  } catch (err) {
    console.warn("[OrderSummary] failed to parse 'cart'", err);
    return [];
  }
}

export default function OrderSummary() {
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    description: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string>("");

  useEffect(() => {
    const cartIds = readCartIds();
    const allProducts = getProducts();
    console.log("[OrderSummary] published products", allProducts);

    if (cartIds.length > 0) {
      // Count occurrences of each id -> quantity
      const quantityMap = new Map<string, number>();
      cartIds.forEach((id) => {
        quantityMap.set(id, (quantityMap.get(id) || 0) + 1);
      });

      const resolved: CheckoutItem[] = Array.from(quantityMap.entries())
        .map(([id, quantity]) => {
          const product = allProducts.find(
            (p: any) =>
              String(p.id) === String(id) || String(p.uuid) === String(id),
          );

          if (!product) {
            console.warn(`[OrderSummary] no product found for cart id "${id}"`);
            return null;
          }

          return {
            id: product.id,
            name: product.name,
            category: product.category || product.brand || "General",
            quantity,
            price: Number(product.price) || 0,
            image:
              product.image || product.image?.[0] || product.thumbnail || "",
            variant: undefined,
          } as CheckoutItem;
        })
        .filter((item): item is CheckoutItem => item !== null);

      console.log("[OrderSummary] resolved checkout items", resolved);
      setItems(resolved);
    }

    setIsLoaded(true);
  }, []);

  // Coupon Logic
  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = couponCode.trim().toUpperCase();

    if (!clean) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (clean === "COVET10" || clean === "SAVE500") {
      setAppliedCoupon({
        code: clean,
        discountAmount: 500,
        description: `Promo code ${clean} applied (−৳ 500)`,
      });
      setCouponError("");
    } else if (clean === "WELCOME10") {
      const discount = Math.round(itemsSubtotal * 0.1);
      setAppliedCoupon({
        code: clean,
        discountAmount: discount,
        description: `10% discount applied (−৳ ${discount.toLocaleString()})`,
      });
      setCouponError("");
    } else {
      setCouponError("Invalid promo code");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const itemsSubtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const DELIVERY_OPTIONS: DeliveryOption[] = [
    {
      id: "standard",
      title: "Standard Delivery",
      cost: 60,
      duration: "3–5 business days",
      description: "Reliable ground shipping across Bangladesh",
    },
    {
      id: "express",
      title: "Express Delivery",
      cost: 120,
      duration: "1–2 business days",
      description: "Priority dispatch with real-time tracking",
    },
  ];

  const [deliveryInfo] = useState<DeliveryInfo>({
    address: "",
    city: "Dhaka",
    area: "",
    postalCode: "",
    deliveryNote: "",
    deliveryMethod: "standard",
  });

  const selectedDelivery =
    DELIVERY_OPTIONS.find((d) => d.id === deliveryInfo.deliveryMethod) ||
    DELIVERY_OPTIONS[0];
  const shippingCost = items.length > 0 ? selectedDelivery.cost : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, itemsSubtotal + shippingCost - discountAmount);

  return (
    <div className="lg:col-span-5 flex flex-col gap-6 order-1 lg:order-2 lg:sticky lg:top-28">
      <div className="bg-[#EDE4DC] rounded-2xl border border-[#3E2C26]/15 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#3E2C26]/10">
          <h3 className="text-base sm:text-lg font-display font-semibold text-[#261815]">
            Order Summary
          </h3>
          <span className="text-xs text-[#3E2C26]/60">
            {items.reduce((acc, i) => acc + i.quantity, 0)} items
          </span>
        </div>

        <div className="py-4 divide-y divide-[#3E2C26]/10">
          {!isLoaded && (
            <p className="text-xs text-[#3E2C26]/60 py-4">Loading cart…</p>
          )}

          {isLoaded && items.length === 0 && (
            <p className="text-xs text-[#3E2C26]/60 py-4">
              Your cart is empty. Add items and they&apos;ll appear here.
            </p>
          )}

          {items.map((item) => (
            <div key={item.id} className="py-3 flex gap-3.5 items-center">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#EDE4DC]/40 border border-[#3E2C26]/10">
                <Image
                  src={item.image}
                  alt={item.name || "Product"}
                  fill
                  sizes="64px"
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src;
                  }}
                />

                <span className="absolute top-1 right-1 bg-[#3E2C26] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {item.quantity}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-[#261815] truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[#3E2C26]/60 mt-0.5">
                    {item.variant || item.category}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-[11px] text-[#3E2C26]/60">
                    Qty: {item.quantity}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[#261815]">
                    {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Code */}
        <div className="pt-4 pb-4 border-t border-[#3E2C26]/10">
          <p className="text-xs font-semibold text-[#3E2C26] mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#3E2C26]" />
            <span>Have a promo code?</span>
          </p>

          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter code (e.g. COVET10)"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                setCouponError("");
              }}
              className="flex-1 rounded-xl bg-[#F8F2F1] border border-[#3E2C26]/20 px-3.5 py-2.5 text-xs text-[#261815] placeholder:text-[#3E2C26]/30 uppercase tracking-wider outline-none focus:ring-2 focus:ring-[#3E2C26]/20 focus:border-[#3E2C26]"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#3E2C26] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#261815] transition-colors cursor-pointer"
            >
              Apply
            </button>
          </form>

          {couponError && (
            <p className="text-xs text-rose-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {couponError}
            </p>
          )}

          {appliedCoupon && (
            <div className="mt-2.5 flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs text-emerald-800">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span className="font-semibold">{appliedCoupon.code}</span>
                <span className="text-[11px] text-emerald-700/80">
                  {appliedCoupon.discountAmount.toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-[11px] font-semibold text-emerald-900/60 hover:text-rose-700 underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Subtotals */}
        <div className="pt-4 border-t border-[#3E2C26]/10 flex flex-col gap-2.5 text-xs sm:text-sm">
          <div className="flex justify-between text-[#3E2C26]/80">
            <span>Subtotal</span>
            <span className="font-medium text-[#261815]">
              {itemsSubtotal.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-[#3E2C26]/80">
            <span>Shipping</span>
            <span className="font-medium text-[#261815]">{shippingCost}</span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Discount</span>
              <span>{discountAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="pt-3 border-t border-[#3E2C26]/15 flex justify-between items-baseline">
            <span className="text-sm sm:text-base font-semibold text-[#261815]">
              Total
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#261815] font-serif">
              {grandTotal.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-[#3E2C26]/10 flex flex-col gap-2 text-[11px] text-[#3E2C26]/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Guaranteed safe & secure checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-[#3E2C26] shrink-0" />
            <span>Doorstep delivery with real-time updates</span>
          </div>
        </div>
      </div>
    </div>
  );
}
