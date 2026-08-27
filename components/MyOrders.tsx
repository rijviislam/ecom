"use client";

import { MyOrdersProps, OrderData, OrderStatus } from "@/types/order";
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Printer,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

export const USER_MOCK_ORDERS: OrderData[] = [
  {
    uuid: "order-1001",
    orderNumber: "ORD-20260812-1001",
    customerUuid: "cust-demo",
    status: "delivered",
    paymentStatus: "paid",
    fulfillmentStatus: "fulfilled",
    items: [
      {
        productUuid: "prod-001",
        variantUuid: "var-001-black",
        name: "Aria Wireless Headphones",
        variantLabel: "Midnight Black",
        image: "https://picsum.photos/seed/aria-1/900/900",
        unitPrice: 7490,
        quantity: 1,
      },
    ],
    subtotal: 7490,
    discountTotal: 0,
    taxTotal: 0,
    shippingTotal: 0,
    grandTotal: 7490,
    shippingAddress: {
      recipientName: "Ayesha Rahman",
      phone: "+8801912000001",
      line1: "House 14, Road 7, Banani",
      city: "Dhaka",
      postalCode: "1213",
      country: "BD",
    },
    createdAt: "2026-08-12T04:00:00.000Z",
    statusHistory: [
      {
        status: "pending",
        label: "Order placed",
        timestamp: "2026-08-12T04:00:00.000Z",
        note: "We've received your order.",
      },
      {
        status: "confirmed",
        label: "Confirmed",
        timestamp: "2026-08-12T05:10:00.000Z",
        note: "Payment confirmed.",
      },
      {
        status: "processing",
        label: "Processing",
        timestamp: "2026-08-12T09:00:00.000Z",
        note: "Packing your order.",
      },
      {
        status: "shipped",
        label: "Shipped",
        timestamp: "2026-08-13T10:00:00.000Z",
        note: "Handed to courier.",
      },
      {
        status: "out_for_delivery",
        label: "Out for delivery",
        timestamp: "2026-08-14T08:00:00.000Z",
        note: "On the way to you.",
      },
      {
        status: "delivered",
        label: "Delivered",
        timestamp: "2026-08-14T14:32:00.000Z",
        note: "Delivered and signed for.",
      },
    ],
  },
  {
    uuid: "order-1002",
    orderNumber: "ORD-20260820-1002",
    customerUuid: "cust-demo",
    status: "pending",
    paymentStatus: "unpaid",
    fulfillmentStatus: "unfulfilled",
    items: [
      {
        productUuid: "prod-006",
        variantUuid: "var-006-42",
        name: "Strider Canvas Sneakers",
        variantLabel: "EU 42",
        image: "https://picsum.photos/seed/strider-1/900/900",
        unitPrice: 2630,
        quantity: 1,
      },
      {
        productUuid: "prod-013",
        variantUuid: null,
        name: "Bloomwater Face Serum",
        variantLabel: null,
        image: "https://picsum.photos/seed/serum-1/900/900",
        unitPrice: 990,
        quantity: 2,
      },
    ],
    subtotal: 4610,
    discountTotal: 0,
    taxTotal: 0,
    shippingTotal: 60,
    grandTotal: 4670,
    shippingAddress: {
      recipientName: "Ayesha Rahman",
      phone: "+8801912000001",
      line1: "House 14, Road 7, Banani",
      city: "Dhaka",
      postalCode: "1213",
      country: "BD",
    },
    createdAt: "2026-08-20T09:15:00.000Z",
    statusHistory: [
      {
        status: "pending",
        label: "Order placed",
        timestamp: "2026-08-20T09:15:00.000Z",
        note: "We've received your order and are waiting on payment confirmation.",
      },
    ],
  },
  {
    uuid: "order-1003",
    orderNumber: "ORD-20260805-1003",
    customerUuid: "cust-demo",
    status: "cancelled",
    paymentStatus: "refunded",
    fulfillmentStatus: "unfulfilled",
    items: [
      {
        productUuid: "prod-012",
        variantUuid: null,
        name: "Driftwood Shelf Unit",
        variantLabel: null,
        image: "https://picsum.photos/seed/shelf-1/900/900",
        unitPrice: 4590,
        quantity: 1,
      },
    ],
    subtotal: 4590,
    discountTotal: 0,
    taxTotal: 0,
    shippingTotal: 0,
    grandTotal: 4590,
    shippingAddress: {
      recipientName: "Ayesha Rahman",
      phone: "+8801912000001",
      line1: "House 14, Road 7, Banani",
      city: "Dhaka",
      postalCode: "1213",
      country: "BD",
    },
    createdAt: "2026-08-05T11:00:00.000Z",
    statusHistory: [
      {
        status: "pending",
        label: "Order placed",
        timestamp: "2026-08-05T11:00:00.000Z",
        note: "We've received your order.",
      },
      {
        status: "confirmed",
        label: "Confirmed",
        timestamp: "2026-08-05T12:00:00.000Z",
        note: "Payment confirmed.",
      },
      {
        status: "cancelled",
        label: "Cancelled",
        timestamp: "2026-08-06T08:00:00.000Z",
        note: "Cancelled at customer's request. Refund issued to original payment method.",
      },
    ],
  },
  {
    uuid: "order-1004",
    orderNumber: "ORD-20260728-1004",
    customerUuid: "cust-demo",
    status: "returned",
    paymentStatus: "refunded",
    fulfillmentStatus: "returned",
    items: [
      {
        productUuid: "prod-007",
        variantUuid: "var-007-l",
        name: "Field Utility Jacket",
        variantLabel: "L",
        image: "https://picsum.photos/seed/field-1/900/900",
        unitPrice: 4990,
        quantity: 1,
      },
    ],
    subtotal: 4990,
    discountTotal: 0,
    taxTotal: 0,
    shippingTotal: 0,
    grandTotal: 4990,
    shippingAddress: {
      recipientName: "Ayesha Rahman",
      phone: "+8801912000001",
      line1: "House 14, Road 7, Banani",
      city: "Dhaka",
      postalCode: "1213",
      country: "BD",
    },
    createdAt: "2026-07-28T07:00:00.000Z",
    statusHistory: [
      {
        status: "pending",
        label: "Order placed",
        timestamp: "2026-07-28T07:00:00.000Z",
        note: "We've received your order.",
      },
      {
        status: "confirmed",
        label: "Confirmed",
        timestamp: "2026-07-28T08:00:00.000Z",
        note: "Payment confirmed.",
      },
      {
        status: "shipped",
        label: "Shipped",
        timestamp: "2026-07-29T10:00:00.000Z",
        note: "Handed to courier.",
      },
      {
        status: "delivered",
        label: "Delivered",
        timestamp: "2026-07-30T15:00:00.000Z",
        note: "Delivered.",
      },
      {
        status: "returned",
        label: "Returned",
        timestamp: "2026-08-02T09:00:00.000Z",
        note: "Size didn't fit — return received and refunded.",
      },
    ],
  },
];

const STATUS_TABS = [
  { id: "all", label: "All Orders" },
  { id: "pending", label: "Pending" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
  { id: "returned", label: "Returned" },
];

export default function MyOrders({
  currencySymbol = "৳",
  initialOrders = USER_MOCK_ORDERS,
}: MyOrdersProps) {
  const [selectedOrderUuid, setSelectedOrderUuid] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedNumber, setCopiedNumber] = useState<boolean>(false);
  const [isTrackDrawerOpen, setIsTrackDrawerOpen] = useState<boolean>(false);

  const tabCounts = useMemo(
    () => ({
      all: initialOrders.length,
      pending: initialOrders.filter((o) => o.status === "pending").length,
      delivered: initialOrders.filter((o) => o.status === "delivered").length,
      cancelled: initialOrders.filter((o) => o.status === "cancelled").length,
      returned: initialOrders.filter((o) => o.status === "returned").length,
    }),
    [initialOrders],
  );

  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      const matchesTab = activeTab === "all" || order.status === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.items.some((i) => i.name.toLowerCase().includes(q)) ||
        order.shippingAddress.recipientName.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, initialOrders]);

  const activeOrder = useMemo(() => {
    if (!selectedOrderUuid) return null;
    return initialOrders.find((o) => o.uuid === selectedOrderUuid) || null;
  }, [selectedOrderUuid, initialOrders]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopyOrderNumber = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#EDE4DC] text-[#261815] font-sans antialiased selection:bg-[#3E2C26] selection:text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeOrder ? (
          <div className="animate-fadeIn">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <nav className="flex items-center gap-2 text-xs text-[#3E2C26]/60">
                <button
                  type="button"
                  onClick={() => setSelectedOrderUuid(null)}
                  className="hover:text-[#261815] transition-colors cursor-pointer"
                >
                  My Orders
                </button>
                <ChevronRight className="w-3 h-3 text-[#3E2C26]/40" />
                <span className="font-semibold text-[#261815]">
                  {activeOrder.orderNumber}
                </span>
              </nav>

              <button
                type="button"
                onClick={() => setSelectedOrderUuid(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/70 hover:text-[#261815] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to all orders</span>
              </button>
            </div>

            {/* Overview Card */}
            <div className="rounded-3xl bg-[#EDE4DC] border border-[#3E2C26]/15 p-6 sm:p-8 shadow-xs mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#3E2C26]/10">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium tracking-tight text-[#261815]">
                      Order {activeOrder.orderNumber}
                    </h1>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopyOrderNumber(activeOrder.orderNumber)
                      }
                      className="p-1.5 rounded-lg bg-[#3E2C26]/5 hover:bg-[#3E2C26]/10 text-[#3E2C26] transition-colors cursor-pointer"
                      title="Copy Order Number"
                    >
                      {copiedNumber ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <OrderStatusBadge status={activeOrder.status} />
                  </div>

                  <p className="text-xs sm:text-sm text-[#3E2C26]/70 mt-1.5">
                    Placed on{" "}
                    <span className="font-medium text-[#261815]">
                      {formatDateTime(activeOrder.createdAt)}
                    </span>{" "}
                    • {activeOrder.items.reduce((s, i) => s + i.quantity, 0)}{" "}
                    items
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#3E2C26]/20 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#3E2C26] hover:bg-[#FAF7F5] transition-colors cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Download Invoice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsTrackDrawerOpen(true)}
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#3E2C26] hover:bg-[#261815] px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    <Truck className="w-4 h-4 text-amber-300" />
                    <span>Track Order</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Status History Timeline */}
              <div className="mt-6 pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/70 mb-4">
                  Order Status Timeline
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {activeOrder.statusHistory.map((step, idx) => (
                    <div
                      key={idx}
                      className="relative flex flex-col p-3 rounded-xl bg-white/60 border border-[#3E2C26]/10 text-xs"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 rounded-full bg-[#3E2C26] text-white flex items-center justify-center text-[10px] font-bold">
                          <Check className="w-3 h-3 stroke-3" />
                        </span>
                        <strong className="font-semibold text-[#261815] truncate">
                          {step.label}
                        </strong>
                      </div>
                      <p className="text-[11px] text-[#3E2C26]/70 line-clamp-2 mt-0.5">
                        {step.note}
                      </p>
                      <span className="text-[10px] text-[#3E2C26]/50 mt-1 font-mono">
                        {formatDateTime(step.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4 Details Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Products & Shipping */}
              <div className="lg:col-span-7 flex flex-col gap-8">
                {/* 1. Products Section */}
                <section className="rounded-3xl bg-white/85 border border-[#3E2C26]/15 p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between pb-5 border-b border-[#3E2C26]/10">
                    <div className="flex items-center gap-2.5">
                      <Package className="w-5 h-5 text-[#3E2C26]" />
                      <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#261815]">
                        Products (
                        {activeOrder.items.reduce((s, i) => s + i.quantity, 0)})
                      </h2>
                    </div>
                  </div>

                  <div className="divide-y divide-[#3E2C26]/10 mt-2">
                    {activeOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#EDE4DC]/40 border border-[#3E2C26]/10">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold text-sm sm:text-base text-[#261815]">
                              {item.name}
                            </h3>
                            {item.variantLabel && (
                              <p className="text-xs text-[#3E2C26]/70 mt-0.5">
                                Variant:{" "}
                                <strong className="font-medium text-[#261815]">
                                  {item.variantLabel}
                                </strong>
                              </p>
                            )}
                            <span className="text-xs text-[#3E2C26]/60 mt-1 inline-block">
                              Qty:{" "}
                              <strong className="text-[#261815]">
                                {item.quantity}
                              </strong>{" "}
                              × {currencySymbol}{" "}
                              {item.unitPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-[#3E2C26]/10">
                          <span className="text-[10px] text-[#3E2C26]/50 uppercase tracking-wider block font-semibold">
                            Subtotal
                          </span>
                          <span className="font-serif text-base sm:text-lg font-bold text-[#261815]">
                            {currencySymbol}{" "}
                            {(item.unitPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-3xl bg-white/85 border border-[#3E2C26]/15 p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between pb-5 border-b border-[#3E2C26]/10">
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-5 h-5 text-[#3E2C26]" />
                      <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#261815]">
                        Shipping Address
                      </h2>
                    </div>
                  </div>

                  <div className="mt-5 p-5 rounded-2xl bg-[#FAF7F5] border border-[#3E2C26]/10 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-[10px] uppercase font-semibold tracking-wider text-[#3E2C26]/60 mb-2">
                      <User className="w-3.5 h-3.5" />
                      <span>Customer & Destination</span>
                    </div>

                    <strong className="text-[#261815] text-base font-semibold block">
                      {activeOrder.shippingAddress.recipientName}
                    </strong>
                    <p className="text-[#3E2C26]/80 mt-1 leading-relaxed">
                      {activeOrder.shippingAddress.line1}
                      <br />
                      {activeOrder.shippingAddress.city} —{" "}
                      {activeOrder.shippingAddress.postalCode},{" "}
                      {activeOrder.shippingAddress.country}
                    </p>

                    <div className="flex items-center gap-1.5 text-[#3E2C26]/80 mt-3 pt-3 border-t border-[#3E2C26]/10">
                      <Phone className="w-3.5 h-3.5 text-[#3E2C26]/50" />
                      <span>{activeOrder.shippingAddress.phone}</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Payment & Order Summary */}
              <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-28">
                {/* 3. Payment Section */}
                <section className="rounded-3xl bg-white/85 border border-[#3E2C26]/15 p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between pb-5 border-b border-[#3E2C26]/10">
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-5 h-5 text-[#3E2C26]" />
                      <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#261815]">
                        Payment & Fulfillment
                      </h2>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3.5 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[#3E2C26]/70">Payment Status:</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          activeOrder.paymentStatus === "paid"
                            ? "bg-emerald-500/10 text-emerald-800 border border-emerald-500/20"
                            : activeOrder.paymentStatus === "refunded"
                              ? "bg-[#3E2C26]/10 text-[#3E2C26] border border-[#3E2C26]/20"
                              : "bg-amber-500/10 text-amber-900 border border-amber-500/20"
                        }`}
                      >
                        {activeOrder.paymentStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#3E2C26]/70">Fulfillment:</span>
                      <span className="text-[#261815] font-semibold uppercase text-xs">
                        {activeOrder.fulfillmentStatus}
                      </span>
                    </div>

                    <div className="mt-2 pt-3 border-t border-[#3E2C26]/10 flex items-center gap-2 text-[11px] text-[#3E2C26]/60">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Encrypted, verified checkout transaction</span>
                    </div>
                  </div>
                </section>

                {/* 4. Order Summary Section */}
                <section className="rounded-3xl bg-white/85 border border-[#3E2C26]/15 p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between pb-5 border-b border-[#3E2C26]/10">
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className="w-5 h-5 text-[#3E2C26]" />
                      <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#261815]">
                        Order Summary
                      </h2>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 text-xs sm:text-sm">
                    <div className="flex justify-between text-[#3E2C26]/80">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#261815]">
                        {currencySymbol} {activeOrder.subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#3E2C26]/80">
                      <span>Shipping Fee</span>
                      <span className="font-medium text-[#261815]">
                        {activeOrder.shippingTotal > 0
                          ? `${currencySymbol} ${activeOrder.shippingTotal}`
                          : "Free"}
                      </span>
                    </div>

                    {activeOrder.discountTotal > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Discount</span>
                        <span>
                          −{currencySymbol}{" "}
                          {activeOrder.discountTotal.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="pt-4 mt-2 border-t border-[#3E2C26]/15 flex justify-between items-baseline">
                      <div>
                        <span className="text-sm sm:text-base font-semibold text-[#261815]">
                          Grand Total
                        </span>
                        <p className="text-[10px] text-[#3E2C26]/50">
                          Inclusive of all taxes
                        </p>
                      </div>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-[#261815]">
                        {currencySymbol}{" "}
                        {activeOrder.grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-[#3E2C26]/10 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsTrackDrawerOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#3E2C26] hover:bg-[#261815] py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      <Truck className="w-4 h-4 text-amber-300" />
                      <span>Track Order</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedOrderUuid(null)}
                      className="w-full text-center text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/70 hover:text-[#261815] py-2 transition-colors cursor-pointer"
                    >
                      ← Back to All Orders
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#3E2C26]/15 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium tracking-tight text-[#261815]">
                    My Orders
                  </h1>
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#3E2C26]/10 text-[#3E2C26] text-xs font-semibold">
                    {initialOrders.length} Total
                  </span>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-[#3E2C26]/70 mt-2 max-w-xl">
                  Track and manage all your recent orders.
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full md:w-80">
                <div className="relative flex items-center rounded-xl bg-white/70 border border-[#3E2C26]/20 px-3.5 py-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#3E2C26]/20 focus-within:border-[#3E2C26] transition-all">
                  <Search className="w-4 h-4 text-[#3E2C26]/50 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by order # or product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-[#261815] placeholder:text-[#3E2C26]/40 outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-[#3E2C26]/50 hover:text-[#261815] ml-1.5 p-0.5 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {STATUS_TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const count = tabCounts[tab.id as keyof typeof tabCounts];

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-[#3E2C26] text-white shadow-xs scale-102 font-bold"
                          : "bg-white/70 text-[#3E2C26]/75 hover:bg-white hover:text-[#261815] border border-[#3E2C26]/10"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#3E2C26]/10 text-[#3E2C26]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {searchQuery && (
                <span className="hidden md:inline text-xs text-[#3E2C26]/60">
                  Found {filteredOrders.length}{" "}
                  {filteredOrders.length === 1 ? "result" : "results"}
                </span>
              )}
            </div>

            {/* Order Cards List */}
            {filteredOrders.length > 0 ? (
              <div className="flex flex-col gap-5">
                {filteredOrders.map((order) => {
                  const productCount = order.items.reduce(
                    (s, i) => s + i.quantity,
                    0,
                  );

                  return (
                    <div
                      key={order.uuid}
                      className="group relative rounded-2xl bg-[#F8F2F1]  border border-[#3E2C26]/15 hover:border-[#3E2C26]/30 p-5 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 "
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#3E2C26]/10">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#261815]">
                            {order.orderNumber}
                          </span>

                          <span className="text-xs text-[#3E2C26]/40">•</span>

                          <div className="flex items-center gap-1.5 text-xs text-[#3E2C26]/70">
                            <Calendar className="w-3.5 h-3.5 text-[#3E2C26]/50" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>

                          <span className="text-xs text-[#3E2C26]/40 hidden sm:inline">
                            •
                          </span>

                          <span className="text-xs text-[#3E2C26]/70 font-medium hidden sm:inline">
                            {productCount}{" "}
                            {productCount === 1 ? "Product" : "Products"}
                          </span>
                        </div>

                        <OrderStatusBadge status={order.status} />
                      </div>

                      <div className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="flex items-center -space-x-3 overflow-hidden shrink-0">
                            {order.items.slice(0, 3).map((item, i) => (
                              <div
                                key={i}
                                className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden border-2 border-white bg-[#EDE4DC]/30 shadow-2xs"
                              >
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              </div>
                            ))}

                            {order.items.length > 3 && (
                              <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl flex items-center justify-center border-2 border-white bg-[#3E2C26] text-white text-xs font-bold shadow-2xs">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm sm:text-base font-semibold text-[#261815] truncate">
                              {order.items.map((i) => i.name).join(", ")}
                            </h3>
                            <p className="text-xs text-[#3E2C26]/60 mt-0.5">
                              Payment:{" "}
                              <span className="capitalize font-medium text-[#261815]">
                                {order.paymentStatus}
                              </span>{" "}
                              • Fulfillment:{" "}
                              <span className="capitalize">
                                {order.fulfillmentStatus}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-[#3E2C26]/10">
                          <div className="text-left md:text-right">
                            <span className="text-[11px] text-[#3E2C26]/60 block uppercase tracking-wider font-semibold">
                              Total Amount
                            </span>
                            <span className="font-serif text-lg sm:text-xl font-bold text-[#261815]">
                              {currencySymbol}{" "}
                              {order.grandTotal.toLocaleString()}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedOrderUuid(order.uuid)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#3E2C26] hover:bg-[#261815] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs active:scale-98"
                          >
                            <span>View Order</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#3E2C26]/10 flex items-center justify-between text-xs text-[#3E2C26]/60">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#3E2C26]/50" />
                          <span>
                            Deliver to {order.shippingAddress.recipientName} (
                            {order.shippingAddress.city})
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedOrderUuid(order.uuid)}
                          className="text-xs font-semibold text-[#3E2C26] hover:underline cursor-pointer"
                        >
                          Order Details & Tracking →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl bg-white/70 border border-[#3E2C26]/15 p-10 sm:p-16 text-center shadow-xs">
                <div className="mx-auto w-16 h-16 rounded-full bg-[#3E2C26]/10 text-[#3E2C26] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-7 h-7" />
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#261815]">
                  {activeTab === "delivered"
                    ? "No delivered orders yet."
                    : activeTab === "pending"
                      ? "No pending orders."
                      : activeTab === "cancelled"
                        ? "No cancelled orders."
                        : activeTab === "returned"
                          ? "No returned orders."
                          : "No orders found."}
                </h3>

                <p className="text-xs sm:text-sm text-[#3E2C26]/70 mt-1.5 max-w-sm mx-auto">
                  {searchQuery
                    ? `No orders matching "${searchQuery}". Try clearing your search query.`
                    : "Your placed orders will appear here for tracking and history."}
                </p>

                {searchQuery && (
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="rounded-xl bg-[#3E2C26] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#261815] transition-colors cursor-pointer"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Tracking Modal */}
      {isTrackDrawerOpen && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setIsTrackDrawerOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg rounded-3xl bg-[#EDE4DC] border border-[#3E2C26]/20 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-5 border-b border-[#3E2C26]/15">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-[#3E2C26]" />
                <div>
                  <h3 className="text-lg font-serif font-semibold text-[#261815]">
                    Shipment Tracking
                  </h3>
                  <p className="text-xs text-[#3E2C26]/60">
                    Order {activeOrder.orderNumber}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTrackDrawerOpen(false)}
                className="p-2 text-[#3E2C26]/60 hover:text-[#261815] hover:bg-white/60 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {activeOrder.statusHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start bg-white/70 p-3.5 rounded-xl border border-[#3E2C26]/10"
                >
                  <div className="w-5 h-5 rounded-full bg-[#3E2C26] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-3" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-xs text-[#261815]">
                        {item.label}
                      </h4>
                      <span className="text-[10px] text-[#3E2C26]/50 font-mono">
                        {formatDateTime(item.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-[#3E2C26]/70 mt-1">
                      {item.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#3E2C26]/15 flex justify-end">
              <button
                type="button"
                onClick={() => setIsTrackDrawerOpen(false)}
                className="rounded-xl bg-[#3E2C26] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#261815] transition-colors cursor-pointer"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  switch (status) {
    case "delivered":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>Delivered</span>
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-900 border border-amber-500/20 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          <span>Pending</span>
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-500/10 text-rose-800 border border-rose-500/20 shadow-2xs">
          <XCircle className="w-3.5 h-3.5 text-rose-700" />
          <span>Cancelled</span>
        </span>
      );
    case "returned":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#3E2C26]/10 text-[#3E2C26] border border-[#3E2C26]/20 shadow-2xs">
          <RotateCcw className="w-3.5 h-3.5 text-[#3E2C26]" />
          <span>Returned</span>
        </span>
      );
    default:
      return null;
  }
}
