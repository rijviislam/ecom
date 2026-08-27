"use client";
import { getProducts } from "@/lib/data";
import {
  CheckoutItem,
  CustomerInfo,
  DeliveryInfo,
  DeliveryOption,
  PaymentInfo,
  PaymentOption,
} from "@/types/checkout";
import {
  CreditCard,
  Edit3,
  MapPin,
  Package,
  Sparkles,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

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

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when your order arrives at your doorstep.",
    badge: "Most Popular",
    isOnline: false,
  },
  {
    id: "bkash",
    name: "bKash",
    description: "Pay securely using bKash mobile wallet.",
    badge: "Instant",
    isOnline: true,
  },
  {
    id: "nagad",
    name: "Nagad",
    description: "Pay securely using Nagad digital payment.",
    badge: "Instant",
    isOnline: true,
  },
  {
    id: "sslcommerz",
    name: "SSLCommerz",
    description: "Cards (Visa, MasterCard, Amex) & Online Banking.",
    badge: "Cards / Online",
    isOnline: true,
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    description: "Pay via direct bank transfer / EFTN / NPSB.",
    badge: "Direct Transfer",
    isOnline: true,
  },
];

function readCartIds(localStorageKey: string): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(localStorageKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch (err) {
    console.warn("[ReviewOrder] failed to parse cart from localStorage", err);
    return [];
  }
}

function resolveCartItems(localStorageKey: string): CheckoutItem[] {
  const cartIds = readCartIds(localStorageKey);
  if (cartIds.length === 0) return [];

  const allProducts = getProducts();

  const quantityMap = new Map<string, number>();
  cartIds.forEach((id) => {
    quantityMap.set(id, (quantityMap.get(id) || 0) + 1);
  });

  return Array.from(quantityMap.entries())
    .map(([id, quantity]) => {
      const product = allProducts.find(
        (p: any) => String(p.id) === id || String(p.uuid) === id,
      );
      if (!product) {
        console.warn(`[ReviewOrder] no product found for cart id "${id}"`);
        return null;
      }
      return {
        id: product.id,
        name: product.name,
        category: product.category || product.brand || "General",
        quantity,
        price: Number(product.price) || 0,
        image: product.image || product.image?.[0],
        variant: undefined,
      } as CheckoutItem;
    })
    .filter((item): item is CheckoutItem => item !== null);
}

interface ReviewOrderProps {
  customerInfo?: CustomerInfo;
  deliveryInfo?: DeliveryInfo;
  paymentInfo?: PaymentInfo;
  appliedCoupon?: {
    code: string;
    discountAmount: number;
    description: string;
  } | null;
  onBack: () => void;
  onEditStep: (step: number) => void;
  onOrderComplete?: (orderData: Record<string, unknown>) => void;
  localStorageKey?: string;
}

export default function ReviewOrder({
  customerInfo = { firstName: "", lastName: "", email: "", phone: "" },
  deliveryInfo = {
    address: "",
    city: "Dhaka",
    area: "",
    postalCode: "",
    deliveryNote: "",
    deliveryMethod: "standard",
  },
  paymentInfo = { method: "cod" },
  appliedCoupon = null,
  onBack,
  onEditStep,
  onOrderComplete,
  localStorageKey = "cart",
}: ReviewOrderProps) {
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState<boolean>(false);

  useEffect(() => {
    const resolved = resolveCartItems(localStorageKey);
    console.log("[ReviewOrder] resolved cart items", resolved);
    setItems(resolved);
    setIsLoaded(true);
  }, [localStorageKey]);

  const selectedDelivery =
    DELIVERY_OPTIONS.find((d) => d.id === deliveryInfo.deliveryMethod) ||
    DELIVERY_OPTIONS[0];

  const selectedPaymentMethodObj = PAYMENT_OPTIONS.find(
    (p) => p.id === paymentInfo.method,
  );

  const shippingCost = items.length > 0 ? selectedDelivery.cost : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const itemsSubtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const grandTotal = Math.max(0, itemsSubtotal + shippingCost - discountAmount);

  const handlePlaceOrder = () => {
    setIsProcessingOrder(true);

    setTimeout(() => {
      const generatedOrderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

      const confirmation = {
        orderNumber: generatedOrderNumber,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        total: grandTotal,
        shippingDuration: selectedDelivery.duration,
        paymentName: selectedPaymentMethodObj?.name || "Cash on Delivery",
      };

      setIsProcessingOrder(false);

      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem(localStorageKey);
        }
      } catch {}

      onOrderComplete?.({
        ...confirmation,
        customer: customerInfo,
        delivery: deliveryInfo,
        items,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 800);
  };

  return (
    <section
      aria-labelledby="step4-title"
      className="bg-[#EDE4DC] rounded-2xl border border-[#3E2C26]/15 p-6 sm:p-8 shadow-xs transition-all"
    >
      <div className="flex items-center justify-between pb-5 border-b border-[#3E2C26]/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#3E2C26] text-white flex items-center justify-center text-xs font-bold">
            04
          </div>
          <div>
            <h2
              id="step4-title"
              className="text-lg sm:text-xl font-display font-semibold text-[#261815]"
            >
              Review Order
            </h2>
            <p className="text-xs text-[#3E2C26]/60">
              Verify your information before placing the order.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {/* Customer Info */}
        <div className="rounded-xl bg-[#F8F2F1] border border-[#3E2C26]/10 p-4.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3E2C26]">
              <User className="w-3.5 h-3.5" />
              <span>Customer Information</span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#3E2C26] hover:underline cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="text-xs text-[#261815] grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <div>
              <span className="text-[#3E2C26]/50">Name:</span>{" "}
              <strong className="font-medium text-[#261815]">
                {customerInfo.firstName} {customerInfo.lastName}
              </strong>
            </div>
            <div>
              <span className="text-[#3E2C26]/50">Phone:</span>{" "}
              <strong className="font-medium text-[#261815]">
                {customerInfo.phone}
              </strong>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[#3E2C26]/50">Email:</span>{" "}
              <strong className="font-medium text-[#261815]">
                {customerInfo.email}
              </strong>
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="rounded-xl bg-[#F8F2F1] border border-[#3E2C26]/10 p-4.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3E2C26]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Delivery</span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#3E2C26] hover:underline cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="text-xs text-[#261815] flex flex-col gap-1.5 mt-2">
            <p className="font-medium">
              {deliveryInfo.address}, {deliveryInfo.area}, {deliveryInfo.city} —{" "}
              {deliveryInfo.postalCode}
            </p>
            <div className="flex items-center gap-2 text-[#3E2C26]/70">
              <Truck className="w-3.5 h-3.5 text-[#3E2C26]" />
              <span>
                {selectedDelivery.title} ({selectedDelivery.cost}) —{" "}
                {selectedDelivery.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-xl bg-[#F8F2F1] border border-[#3E2C26]/10 p-4.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3E2C26]">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payment</span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#3E2C26] hover:underline cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="text-xs text-[#261815] flex items-center justify-between mt-2">
            <span className="font-medium">
              {selectedPaymentMethodObj?.name || "Cash on Delivery"}
            </span>
            <span className="text-xs text-[#3E2C26]/60">
              {selectedPaymentMethodObj?.description}
            </span>
          </div>
        </div>

        {/* Order Items Review */}
        <div className="rounded-xl bg-[#F8F2F1] border border-[#3E2C26]/10 p-4.5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3E2C26]">
              <Package className="w-3.5 h-3.5" />
              <span>
                Order ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
            </div>
          </div>

          {!isLoaded && (
            <p className="text-xs text-[#3E2C26]/60 py-3">
              Loading order items…
            </p>
          )}

          {isLoaded && items.length === 0 && (
            <p className="text-xs text-[#3E2C26]/60 py-3">
              No items found in your cart.
            </p>
          )}

          <div className="divide-y divide-[#3E2C26]/10">
            {items.map((item) => (
              <div
                key={item.id}
                className="py-2.5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#3E2C26]/10 bg-[#F8F2F1] shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src;
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#261815]">{item.name}</h4>
                    <span className="text-[11px] text-[#3E2C26]/60">
                      Qty: {item.quantity} •{" "}
                      {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="font-semibold text-[#261815]">
                  {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#3E2C26]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/70 hover:text-[#261815] transition-colors cursor-pointer px-3 py-2 order-2 sm:order-1"
        >
          <span>← Back</span>
        </button>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isProcessingOrder || items.length === 0}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#3E2C26] px-9 py-4 text-sm font-semibold uppercase tracking-wider text-white hover:bg-[#261815] active:scale-98 transition-all cursor-pointer shadow-md disabled:opacity-75 order-1 sm:order-2"
        >
          {isProcessingOrder ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing Order...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Place Order • {grandTotal.toLocaleString()}</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
