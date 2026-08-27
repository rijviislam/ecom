"use client";

import {
  AlertCircle,
  ArrowRight,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Edit3,
  Info,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Tag,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

// Types
export interface CheckoutItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  image: string;
  variant?: string;
}

export type DeliveryMethodId = "standard" | "express";
export type PaymentMethodId =
  | "cod"
  | "bkash"
  | "nagad"
  | "sslcommerz"
  | "bank_transfer";

export interface DeliveryOption {
  id: DeliveryMethodId;
  title: string;
  cost: number;
  duration: string;
  description: string;
}

export interface PaymentOption {
  id: PaymentMethodId;
  name: string;
  description: string;
  badge?: string;
  isOnline: boolean;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface DeliveryInfo {
  address: string;
  city: string;
  area: string;
  postalCode: string;
  deliveryNote: string;
  deliveryMethod: DeliveryMethodId;
}

export interface PaymentInfo {
  method: PaymentMethodId;
  accountNumber?: string;
  transactionNote?: string;
}

export interface CheckoutProps {
  brandName?: string;
  currencySymbol?: string;
  initialItems?: CheckoutItem[];
  onOrderComplete?: (orderData: Record<string, unknown>) => void;
  onContinueShopping?: () => void;
}

// Default Mock Products matching user requirements
const DEFAULT_MOCK_ITEMS: CheckoutItem[] = [
  {
    id: "prod-1",
    name: "Aria Wireless Headphones",
    category: "Electronics / Audio",
    quantity: 1,
    price: 7490,
    variant: "Matte Charcoal",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "prod-2",
    name: "Drift Oversized Hoodie",
    category: "Apparel / Essentials",
    quantity: 2,
    price: 2490, // 2 x 2,490 = 4,980
    variant: "Sand / Size L",
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop",
  },
];

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

const STEPS = [
  { id: 1, number: "01", label: "Information" },
  { id: 2, number: "02", label: "Delivery" },
  { id: 3, number: "03", label: "Payment" },
  { id: 4, number: "04", label: "Review" },
  { id: 5, number: "05", label: "Complete" },
];

export default function Checkout({
  brandName = "Covet",
  currencySymbol = "৳",
  initialItems = DEFAULT_MOCK_ITEMS,
  onOrderComplete,
  onContinueShopping,
}: CheckoutProps) {
  // Navigation & Step State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessingOrder, setIsProcessingOrder] = useState<boolean>(false);
  const [orderConfirmedData, setOrderConfirmedData] = useState<{
    orderNumber: string;
    date: string;
    total: number;
    shippingDuration: string;
    paymentName: string;
  } | null>(null);

  // Form States (Pre-filled with realistic mock values)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "Rijvi",
    lastName: "Islam",
    email: "customer@example.com",
    phone: "01700000000",
  });

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    address: "House 42, Road 11, Block D",
    city: "Dhaka",
    area: "Banani",
    postalCode: "1213",
    deliveryNote: "Please call before arriving.",
    deliveryMethod: "standard",
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: "cod",
  });

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Coupon State
  const [couponCode, setCouponCode] = useState<string>("COVET10");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    description: string;
  } | null>({
    code: "COVET10",
    discountAmount: 500,
    description: "Promo code COVET10 applied (−৳ 500)",
  });
  const [couponError, setCouponError] = useState<string>("");
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] =
    useState<boolean>(false);

  // Price Calculations
  const itemsSubtotal = initialItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const selectedDelivery =
    DELIVERY_OPTIONS.find((d) => d.id === deliveryInfo.deliveryMethod) ||
    DELIVERY_OPTIONS[0];
  const shippingCost = selectedDelivery.cost;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, itemsSubtotal + shippingCost - discountAmount);

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!customerInfo.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!customerInfo.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!customerInfo.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!customerInfo.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }
    }

    if (step === 2) {
      if (!deliveryInfo.address.trim())
        newErrors.address = "Address is required";
      if (!deliveryInfo.city.trim()) newErrors.city = "City is required";
      if (!deliveryInfo.area.trim()) newErrors.area = "Area is required";
      if (!deliveryInfo.postalCode.trim())
        newErrors.postalCode = "Postal code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step Navigation Handlers
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const jumpToStep = (stepNumber: number) => {
    if (stepNumber <= currentStep || currentStep === 4) {
      setErrors({});
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Coupon Handlers
  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = couponCode.trim().toUpperCase();

    if (!clean) {
      setCouponError("Please enter a code");
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
      setCouponError("Invalid promo code. Try COVET10");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // Final Order Submission (Mock Flow)
  const handlePlaceOrder = () => {
    setIsProcessingOrder(true);

    setTimeout(() => {
      const generatedOrderNumber = `COV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-001`;
      const selectedPaymentObj = PAYMENT_OPTIONS.find(
        (p) => p.id === paymentInfo.method,
      );

      const confirmation = {
        orderNumber: generatedOrderNumber,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        total: grandTotal,
        shippingDuration: selectedDelivery.duration,
        paymentName: selectedPaymentObj?.name || "Cash on Delivery",
      };

      setOrderConfirmedData(confirmation);
      setIsProcessingOrder(false);
      setCurrentStep(5); // Complete state

      if (onOrderComplete) {
        onOrderComplete({
          ...confirmation,
          customer: customerInfo,
          delivery: deliveryInfo,
          items: initialItems,
        });
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 850);
  };

  // Copy Order ID
  const handleCopyOrderId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const selectedPaymentMethodObj = PAYMENT_OPTIONS.find(
    (p) => p.id === paymentInfo.method,
  );

  return (
    <div className="w-full min-h-screen  text-[#261815] font-sans antialiased  selection:text-white">
      {/* Top Header */}
      {/* <header className="border-b border-[#3E2C26]/15 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-xl sm:text-2xl font-serif tracking-tight text-[#261815] hover:opacity-80 transition-opacity"
          >
            <span className="font-semibold">{brandName}</span>
            <span className="text-[11px] uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-[#3E2C26]/10 text-[#3E2C26] font-sans font-medium">
              Checkout
            </span>
          </Link>

          <div className="flex items-center gap-4 text-xs text-[#3E2C26]/70">
            <div className="hidden sm:flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-[#3E2C26]/10 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="font-medium text-[#261815]">
                256-Bit Encrypted Checkout
              </span>
            </div>
            <span className="hidden md:inline text-xs text-[#3E2C26]/40">
              •
            </span>
            <span className="hidden md:inline text-xs font-medium text-[#3E2C26]/70">
              Assistance: +880 9612-000000
            </span>
          </div>
        </div>
      </header> */}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Step Indicator Header (Hidden on final complete state) */}
        {currentStep < 5 && (
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#3E2C26]/15">
              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-medium tracking-tight text-[#261815]">
                  Checkout
                </h1>
                <p className="text-xs sm:text-sm text-[#3E2C26]/70 mt-1 font-sans">
                  Complete your order in a few simple steps.
                </p>
              </div>

              {/* Progress Stepper Bar: 01 Information → 02 Delivery → 03 Review → 04 Complete */}
              <nav aria-label="Checkout Progress" className="w-full sm:w-auto">
                <ol className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs font-medium">
                  {STEPS.slice(0, 4).map((step, idx) => {
                    const isActive = currentStep === step.id;
                    const isDone = currentStep > step.id;
                    const isAccessible =
                      currentStep >= step.id || currentStep === 4;

                    return (
                      <li key={step.id} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => isAccessible && jumpToStep(step.id)}
                          disabled={!isAccessible}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                            isActive
                              ? "bg-[#3E2C26] text-white shadow-xs font-semibold scale-102"
                              : isDone
                                ? "bg-white/80 text-[#3E2C26] hover:bg-white border border-[#3E2C26]/20"
                                : "bg-[#3E2C26]/5 text-[#3E2C26]/40 cursor-not-allowed"
                          }`}
                        >
                          <span
                            className={`flex items-center justify-center w-4 h-4 rounded-full text-[10px] ${
                              isActive
                                ? "bg-white text-[#3E2C26]"
                                : isDone
                                  ? "bg-[#3E2C26] text-white"
                                  : "bg-[#3E2C26]/10 text-[#3E2C26]/50"
                            }`}
                          >
                            {isDone ? (
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            ) : (
                              step.number
                            )}
                          </span>
                          <span className="tracking-wide">{step.label}</span>
                        </button>

                        {idx < 3 && (
                          <ChevronRight className="w-3.5 h-3.5 text-[#3E2C26]/30 shrink-0 hidden sm:inline" />
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>
          </div>
        )}

        {/* =========================================================
            CHECKOUT MAIN WORKFLOW (Steps 1 to 4)
            Responsive: Desktop 60% Form / 40% Order Summary
           ========================================================= */}
        {currentStep < 5 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT COLUMN: 60% Form */}
            <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
              {/* Mobile Collapsible Order Summary */}
              <div className="block lg:hidden rounded-2xl bg-white/70 border border-[#3E2C26]/15 p-4 shadow-xs">
                <button
                  type="button"
                  onClick={() => setIsMobileSummaryOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between text-left text-xs font-medium text-[#261815] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#3E2C26]" />
                    <span>
                      {isMobileSummaryOpen
                        ? "Hide Order Summary"
                        : "Show Order Summary"}{" "}
                      ({initialItems.reduce((acc, i) => acc + i.quantity, 0)}{" "}
                      items)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#261815]">
                    <span>
                      {currencySymbol} {grandTotal.toLocaleString()}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isMobileSummaryOpen ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>

                {isMobileSummaryOpen && (
                  <div className="mt-4 pt-4 border-t border-[#3E2C26]/10 flex flex-col gap-3 text-xs">
                    {initialItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-[#3E2C26]/80">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-semibold text-[#261815]">
                          {currencySymbol}{" "}
                          {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-[#3E2C26]/10 flex justify-between text-[#3E2C26]/70">
                      <span>Delivery ({selectedDelivery.title})</span>
                      <span>
                        {currencySymbol} {shippingCost}
                      </span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>
                          −{currencySymbol} {appliedCoupon.discountAmount}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 1: INFORMATION */}
              {currentStep === 1 && (
                <section
                  aria-labelledby="step1-title"
                  className="bg-white/80 rounded-2xl border border-[#3E2C26]/15 p-6 sm:p-8 shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between pb-5 border-b border-[#3E2C26]/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#3E2C26] text-white flex items-center justify-center text-xs font-bold">
                        01
                      </div>
                      <div>
                        <h2
                          id="step1-title"
                          className="text-lg sm:text-xl font-serif font-semibold text-[#261815]"
                        >
                          Customer Information
                        </h2>
                        <p className="text-xs text-[#3E2C26]/60">
                          Enter your contact information for order confirmation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* First Name */}
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/80 mb-1.5"
                      >
                        First Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        placeholder="Rijvi"
                        value={customerInfo.firstName}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            firstName: e.target.value,
                          })
                        }
                        className={`w-full rounded-xl bg-white border px-4 py-3 text-sm text-[#261815] placeholder:text-[#3E2C26]/30 transition-all outline-none focus:ring-2 focus:ring-[#3E2C26]/20 ${
                          errors.firstName
                            ? "border-rose-500 focus:border-rose-600"
                            : "border-[#3E2C26]/20 focus:border-[#3E2C26]"
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/80 mb-1.5"
                      >
                        Last Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        placeholder="Islam"
                        value={customerInfo.lastName}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            lastName: e.target.value,
                          })
                        }
                        className={`w-full rounded-xl bg-white border px-4 py-3 text-sm text-[#261815] placeholder:text-[#3E2C26]/30 transition-all outline-none focus:ring-2 focus:ring-[#3E2C26]/20 ${
                          errors.lastName
                            ? "border-rose-500 focus:border-rose-600"
                            : "border-[#3E2C26]/20 focus:border-[#3E2C26]"
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/80 mb-1.5"
                      >
                        Email <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          placeholder="customer@example.com"
                          value={customerInfo.email}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              email: e.target.value,
                            })
                          }
                          className={`w-full rounded-xl bg-white border pl-10 pr-4 py-3 text-sm text-[#261815] placeholder:text-[#3E2C26]/30 transition-all outline-none focus:ring-2 focus:ring-[#3E2C26]/20 ${
                            errors.email
                              ? "border-rose-500 focus:border-rose-600"
                              : "border-[#3E2C26]/20 focus:border-[#3E2C26]"
                          }`}
                        />
                        <Mail className="w-4 h-4 text-[#3E2C26]/40 absolute left-3.5 top-3.5 pointer-events-none" />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="phone"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/80 mb-1.5"
                      >
                        Phone <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="phone"
                          type="tel"
                          placeholder="01700000000"
                          value={customerInfo.phone}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              phone: e.target.value,
                            })
                          }
                          className={`w-full rounded-xl bg-white border pl-10 pr-4 py-3 text-sm text-[#261815] placeholder:text-[#3E2C26]/30 transition-all outline-none focus:ring-2 focus:ring-[#3E2C26]/20 ${
                            errors.phone
                              ? "border-rose-500 focus:border-rose-600"
                              : "border-[#3E2C26]/20 focus:border-[#3E2C26]"
                          }`}
                        />
                        <Phone className="w-4 h-4 text-[#3E2C26]/40 absolute left-3.5 top-3.5 pointer-events-none" />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Navigation Button */}
                  <div className="mt-8 pt-6 border-t border-[#3E2C26]/10 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#3E2C26] px-7 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white hover:bg-[#261815] active:scale-98 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Continue to Delivery →</span>
                    </button>
                  </div>
                </section>
              )}

              {/* STEP 2: DELIVERY */}
              {currentStep === 2 && (
                <section
                  aria-labelledby="step2-title"
                  className="bg-white/80 rounded-2xl border border-[#3E2C26]/15 p-6 sm:p-8 shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between pb-5 border-b border-[#3E2C26]/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#3E2C26] text-white flex items-center justify-center text-xs font-bold">
                        02
                      </div>
                      <div>
                        <h2
                          id="step2-title"
                          className="text-lg sm:text-xl font-display font-semibold text-[#261815]"
                        >
                          Delivery Information
                        </h2>
                        <p className="text-xs text-[#3E2C26]/60">
                          Where should we send your order?
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-5">
                    {/* Address */}
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/80 mb-1.5"
                      >
                        Address <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="address"
                        type="text"
                        placeholder="House 42, Road 11, Block D"
                        value={deliveryInfo.address}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            address: e.target.value,
                          })
                        }
                        className={`w-full rounded-xl bg-white border px-4 py-3 text-sm text-[#261815] placeholder:text-[#3E2C26]/30 transition-all outline-none focus:ring-2 focus:ring-[#3E2C26]/20 ${
                          errors.address
                            ? "border-rose-500 focus:border-rose-600"
                            : "border-[#3E2C26]/20 focus:border-[#3E2C26]"
                        }`}
                      />
                      {errors.address && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.address}
                        </p>
                      )}
                    </div>

                    {/* City, Area, Postal Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* City */}
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/80 mb-1.5"
                        >
                          City <span className="text-rose-600">*</span>
                        </label>
                        <input
                          id="city"
                          type="text"
                          placeholder="Dhaka"
                          value={deliveryInfo.city}
                          onChange={(e) =>
                            setDeliveryInfo({
                              ...deliveryInfo,
                              city: e.target.value,
                            })
                          }
                          className={`w-full rounded-xl bg-white border px-4 py-3 text-sm text-[#261815] placeholder:text-[#3E2C26]/30 transition-all outline-none focus:ring-2 focus:ring-[#3E2C26]/20 ${
                            errors.city
                              ? "border-rose-500 focus:border-rose-600"
                              : "border-[#3E2C26]/20 focus:border-[#3E2C26]"
                          }`}
                        />
                        {errors.city && (
                          <p className="text-xs text-rose-600 mt-1">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      {/* Area */}
                      <div>
                        <label
                          htmlFor="area"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/80 mb-1.5"
                        >
                          Area <span className="text-rose-600">*</span>
                        </label>
                        <input
                          id="area"
                          type="text"
                          placeholder="Banani"
                          value={deliveryInfo.area}
                          onChange={(e) =>
                            setDeliveryInfo({
                              ...deliveryInfo,
                              area: e.target.value,
                            })
                          }
                          className={`w-full rounded-xl bg-white border px-4 py-3 text-sm text-[#261815] placeholder:text-[#3E2C26]/30 transition-all outline-none focus:ring-2 focus:ring-[#3E2C26]/20 ${
                            errors.area
                              ? "border-rose-500 focus:border-rose-600"
                              : "border-[#3E2C26]/20 focus:border-[#3E2C26]"
                          }`}
                        />
                        {errors.area && (
                          <p className="text-xs text-rose-600 mt-1">
                            {errors.area}
                          </p>
                        )}
                      </div>

                      {/* Postal Code */}
                      <div>
                        <label
                          htmlFor="postalCode"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/80 mb-1.5"
                        >
                          Postal Code <span className="text-rose-600">*</span>
                        </label>
                        <input
                          id="postalCode"
                          type="text"
                          placeholder="1213"
                          value={deliveryInfo.postalCode}
                          onChange={(e) =>
                            setDeliveryInfo({
                              ...deliveryInfo,
                              postalCode: e.target.value,
                            })
                          }
                          className={`w-full rounded-xl bg-white border px-4 py-3 text-sm text-[#261815] placeholder:text-[#3E2C26]/30 transition-all outline-none focus:ring-2 focus:ring-[#3E2C26]/20 ${
                            errors.postalCode
                              ? "border-rose-500 focus:border-rose-600"
                              : "border-[#3E2C26]/20 focus:border-[#3E2C26]"
                          }`}
                        />
                        {errors.postalCode && (
                          <p className="text-xs text-rose-600 mt-1">
                            {errors.postalCode}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Note (Optional) */}
                    <div>
                      <label
                        htmlFor="deliveryNote"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/80 mb-1.5"
                      >
                        Delivery Note{" "}
                        <span className="text-[#3E2C26]/40 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <textarea
                        id="deliveryNote"
                        rows={2}
                        placeholder="Please call before arriving or leave with front security..."
                        value={deliveryInfo.deliveryNote}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            deliveryNote: e.target.value,
                          })
                        }
                        className="w-full rounded-xl bg-white border border-[#3E2C26]/20 px-4 py-3 text-sm text-[#261815] placeholder:text-[#3E2C26]/30 transition-all outline-none focus:ring-2 focus:ring-[#3E2C26]/20 focus:border-[#3E2C26] resize-none"
                      />
                    </div>

                    {/* Delivery Options */}
                    <div className="mt-3">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/80 mb-3">
                        Delivery Options
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {DELIVERY_OPTIONS.map((option) => {
                          const isSelected =
                            deliveryInfo.deliveryMethod === option.id;
                          return (
                            <label
                              key={option.id}
                              className={`relative flex flex-col p-4 rounded-xl border transition-all cursor-pointer select-none ${
                                isSelected
                                  ? "border-[#3E2C26] bg-[#3E2C26]/5 shadow-xs ring-1 ring-[#3E2C26]"
                                  : "border-[#3E2C26]/15 bg-white hover:border-[#3E2C26]/40"
                              }`}
                            >
                              <input
                                type="radio"
                                name="deliveryMethod"
                                value={option.id}
                                checked={isSelected}
                                onChange={() =>
                                  setDeliveryInfo({
                                    ...deliveryInfo,
                                    deliveryMethod: option.id,
                                  })
                                }
                                className="sr-only"
                              />
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                      isSelected
                                        ? "border-[#3E2C26] bg-[#3E2C26]"
                                        : "border-[#3E2C26]/30 bg-white"
                                    }`}
                                  >
                                    {isSelected && (
                                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    )}
                                  </div>
                                  <span className="font-semibold text-sm text-[#261815]">
                                    {option.title}
                                  </span>
                                </div>
                                <span className="font-bold text-sm text-[#261815]">
                                  {currencySymbol} {option.cost}
                                </span>
                              </div>

                              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#3E2C26]/70">
                                <Clock className="w-3.5 h-3.5 text-[#3E2C26]/60 shrink-0" />
                                <span>
                                  {currencySymbol} {option.cost} —{" "}
                                  {option.duration}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#3E2C26]/50 mt-1">
                                {option.description}
                              </p>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Navigation CTAs */}
                  <div className="mt-8 pt-6 border-t border-[#3E2C26]/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/70 hover:text-[#261815] transition-colors cursor-pointer px-3 py-2"
                    >
                      <span>← Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#3E2C26] px-7 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white hover:bg-[#261815] active:scale-98 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Continue to Payment →</span>
                    </button>
                  </div>
                </section>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {currentStep === 3 && (
                <section
                  aria-labelledby="step3-title"
                  className="bg-white/80 rounded-2xl border border-[#3E2C26]/15 p-6 sm:p-8 shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between pb-5 border-b border-[#3E2C26]/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#3E2C26] text-white flex items-center justify-center text-xs font-bold">
                        03
                      </div>
                      <div>
                        <h2
                          id="step3-title"
                          className="text-lg sm:text-xl font-display font-semibold text-[#261815]"
                        >
                          Payment Method
                        </h2>
                        <p className="text-xs text-[#3E2C26]/60">
                          Select your preferred payment method.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3.5">
                    {PAYMENT_OPTIONS.map((method) => {
                      const isSelected = paymentInfo.method === method.id;
                      return (
                        <label
                          key={method.id}
                          className={`relative flex flex-col p-4 rounded-xl border transition-all cursor-pointer select-none ${
                            isSelected
                              ? "border-[#3E2C26] bg-[#3E2C26]/5 shadow-xs ring-1 ring-[#3E2C26]"
                              : "border-[#3E2C26]/15 bg-white hover:border-[#3E2C26]/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={isSelected}
                                onChange={() =>
                                  setPaymentInfo({
                                    ...paymentInfo,
                                    method: method.id,
                                  })
                                }
                                className="sr-only"
                              />
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? "border-[#3E2C26] bg-[#3E2C26]"
                                    : "border-[#3E2C26]/30 bg-white"
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {method.id === "cod" && (
                                  <Banknote className="w-4 h-4 text-[#3E2C26]" />
                                )}
                                {(method.id === "bkash" ||
                                  method.id === "nagad") && (
                                  <Smartphone className="w-4 h-4 text-[#3E2C26]" />
                                )}
                                {method.id === "sslcommerz" && (
                                  <CreditCard className="w-4 h-4 text-[#3E2C26]" />
                                )}
                                {method.id === "bank_transfer" && (
                                  <Building2 className="w-4 h-4 text-[#3E2C26]" />
                                )}
                                <span className="font-semibold text-sm text-[#261815]">
                                  {method.name}
                                </span>
                              </div>
                            </div>

                            {method.badge && (
                              <span
                                className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md ${
                                  isSelected
                                    ? "bg-[#3E2C26] text-white"
                                    : "bg-[#3E2C26]/10 text-[#3E2C26]/80"
                                }`}
                              >
                                {method.badge}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#3E2C26]/70 mt-2 pl-7">
                            {method.description}
                          </p>

                          {/* Selected Method Details / Demo Notice */}
                          {isSelected && (
                            <div className="mt-3.5 pl-7 pt-3 border-t border-[#3E2C26]/10">
                              {method.isOnline ? (
                                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2.5 text-xs text-amber-900">
                                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-semibold text-amber-950">
                                      Demo Payment — No real payment will be
                                      processed.
                                    </p>
                                    <p className="text-[11px] text-amber-900/80 mt-0.5">
                                      This is a mock checkout flow.
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="rounded-lg bg-[#3E2C26]/5 border border-[#3E2C26]/10 p-3 flex items-start gap-2.5 text-xs text-[#3E2C26]">
                                  <CheckCircle2 className="w-4 h-4 text-[#3E2C26] shrink-0 mt-0.5" />
                                  <p>
                                    Pay when your order arrives. Please keep
                                    exact amount ready.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {/* Navigation CTAs */}
                  <div className="mt-8 pt-6 border-t border-[#3E2C26]/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/70 hover:text-[#261815] transition-colors cursor-pointer px-3 py-2"
                    >
                      <span>← Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#3E2C26] px-7 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white hover:bg-[#261815] active:scale-98 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Review Order →</span>
                    </button>
                  </div>
                </section>
              )}

              {/* STEP 4: REVIEW STEP */}
              {currentStep === 4 && (
                <section
                  aria-labelledby="step4-title"
                  className="bg-white/80 rounded-2xl border border-[#3E2C26]/15 p-6 sm:p-8 shadow-xs transition-all"
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
                    {/* Customer Information Card */}
                    <div className="rounded-xl bg-[#FAF7F5] border border-[#3E2C26]/10 p-4.5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3E2C26]">
                          <User className="w-3.5 h-3.5" />
                          <span>Customer Information</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => jumpToStep(1)}
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

                    {/* Delivery Card */}
                    <div className="rounded-xl bg-[#FAF7F5] border border-[#3E2C26]/10 p-4.5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3E2C26]">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Delivery</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => jumpToStep(2)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#3E2C26] hover:underline cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <div className="text-xs text-[#261815] flex flex-col gap-1.5 mt-2">
                        <p className="font-medium">
                          {deliveryInfo.address}, {deliveryInfo.area},{" "}
                          {deliveryInfo.city} — {deliveryInfo.postalCode}
                        </p>
                        <div className="flex items-center gap-2 text-[#3E2C26]/70">
                          <Truck className="w-3.5 h-3.5 text-[#3E2C26]" />
                          <span>
                            {selectedDelivery.title} ({currencySymbol}{" "}
                            {selectedDelivery.cost}) —{" "}
                            {selectedDelivery.duration}
                          </span>
                        </div>
                        {deliveryInfo.deliveryNote && (
                          <p className="text-[11px] text-[#3E2C26]/60 italic mt-1 bg-white/60 p-2 rounded-lg border border-[#3E2C26]/5">
                            &ldquo;{deliveryInfo.deliveryNote}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Payment Card */}
                    <div className="rounded-xl bg-[#FAF7F5] border border-[#3E2C26]/10 p-4.5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3E2C26]">
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Payment</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => jumpToStep(3)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#3E2C26] hover:underline cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <div className="text-xs text-[#261815] flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 font-medium">
                          <span>
                            {selectedPaymentMethodObj?.name ||
                              "Cash on Delivery"}
                          </span>
                          {selectedPaymentMethodObj?.isOnline && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                              Demo Mode
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#3E2C26]/60">
                          {selectedPaymentMethodObj?.description}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Review */}
                    <div className="rounded-xl bg-[#FAF7F5] border border-[#3E2C26]/10 p-4.5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3E2C26]">
                          <Package className="w-3.5 h-3.5" />
                          <span>Order</span>
                        </div>
                      </div>
                      <div className="divide-y divide-[#3E2C26]/10">
                        {initialItems.map((item) => (
                          <div
                            key={item.id}
                            className="py-2.5 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#3E2C26]/10 bg-white shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-[#261815]">
                                  {item.name}
                                </h4>
                                <span className="text-[11px] text-[#3E2C26]/60">
                                  Qty: {item.quantity} • {currencySymbol}{" "}
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <span className="font-semibold text-[#261815]">
                              {currencySymbol}{" "}
                              {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Navigation CTAs & Place Order */}
                  <div className="mt-8 pt-6 border-t border-[#3E2C26]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#3E2C26]/70 hover:text-[#261815] transition-colors cursor-pointer px-3 py-2 order-2 sm:order-1"
                    >
                      <span>← Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isProcessingOrder}
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
                          <span>Place Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </section>
              )}
            </div>

            {/* RIGHT COLUMN: 40% Order Summary Sidebar */}
            <div className="lg:col-span-5 flex flex-col gap-6 order-1 lg:order-2 lg:sticky lg:top-28">
              <div className="bg-white/80 rounded-2xl border border-[#3E2C26]/15 p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#3E2C26]/10">
                  <h3 className="text-base sm:text-lg font-display font-semibold text-[#261815]">
                    Order Summary
                  </h3>
                  <span className="text-xs text-[#3E2C26]/60">
                    {initialItems.reduce((acc, i) => acc + i.quantity, 0)} items
                  </span>
                </div>

                {/* Products */}
                <div className="py-4 divide-y divide-[#3E2C26]/10">
                  {initialItems.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 flex gap-3.5 items-center"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#EDE4DC]/40 border border-[#3E2C26]/10">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                        <span className="absolute top-1 right-1 bg-[#3E2C26] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="text-xs sm:text-sm font-medium text-[#261815] truncate">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-[#3E2C26]/60 mt-0.5">
                              {item.variant || item.category}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[11px] text-[#3E2C26]/60">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-[#261815]">
                            {currencySymbol}{" "}
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
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError("");
                      }}
                      className="flex-1 rounded-xl bg-white border border-[#3E2C26]/20 px-3.5 py-2.5 text-xs text-[#261815] placeholder:text-[#3E2C26]/30 uppercase tracking-wider outline-none focus:ring-2 focus:ring-[#3E2C26]/20 focus:border-[#3E2C26]"
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
                        <span className="font-semibold">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[11px] text-emerald-700/80">
                          (−{currencySymbol}{" "}
                          {appliedCoupon.discountAmount.toLocaleString()})
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
                      {currencySymbol} {itemsSubtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#3E2C26]/80">
                    <span className="flex items-center gap-1">
                      <span>Shipping</span>
                    </span>
                    <span className="font-medium text-[#261815]">
                      {currencySymbol} {shippingCost}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount</span>
                      <span>
                        −{currencySymbol} {discountAmount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#3E2C26]/15 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm sm:text-base font-semibold text-[#261815]">
                        Total
                      </span>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-[#261815] font-serif">
                      {currencySymbol} {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
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
          </div>
        ) : (
          /* =========================================================
              COMPLETE STATE: Order Confirmed!
             ========================================================= */
          <div className="max-w-xl mx-auto py-2">
            <div className="bg-white/90 rounded-2xl border border-[#3E2C26]/15 px-5 py-6 shadow-sm text-center">
              {/* Check Icon */}
              <div className="mx-auto w-12 h-12 rounded-full bg-[#3E2C26] text-white flex items-center justify-center mb-3">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-display font-medium text-[#261815] tracking-tight">
                Order Confirmed!
              </h2>

              <p className="text-sm text-[#3E2C26]/65 mt-1.5 max-w-sm mx-auto leading-relaxed">
                Thank you for your purchase. Your order has been successfully
                placed.
              </p>

              {/* Order Metadata */}
              <div className="mt-5 rounded-xl bg-[#FAF7F5] border border-[#3E2C26]/10 p-4 text-left space-y-2.5 text-xs">
                {/* Order Number */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#3E2C26]/10">
                  <span className="text-[#3E2C26]/55">Order #</span>

                  <div className="flex items-center gap-1.5">
                    <strong className="font-mono text-sm text-[#261815]">
                      {orderConfirmedData?.orderNumber || "COV-20260827-001"}
                    </strong>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopyOrderId(
                          orderConfirmedData?.orderNumber || "COV-20260827-001",
                        )
                      }
                      aria-label="Copy order number"
                      className="p-1 rounded hover:bg-white cursor-pointer"
                    >
                      {copiedOrderId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#3E2C26]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Delivery */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#3E2C26]/55">Expected delivery</span>

                  <strong className="font-medium text-[#261815] text-right">
                    {orderConfirmedData?.shippingDuration ||
                      "3–5 business days"}
                  </strong>
                </div>

                {/* Payment */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#3E2C26]/55">Payment</span>

                  <strong className="font-medium text-[#261815] text-right">
                    {orderConfirmedData?.paymentName || "Cash on Delivery"}
                  </strong>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-2.5 border-t border-[#3E2C26]/10">
                  <span className="font-semibold text-sm text-[#261815]">
                    Total
                  </span>

                  <strong className="font-serif text-lg font-bold text-[#261815]">
                    {currencySymbol}{" "}
                    {orderConfirmedData?.total?.toLocaleString() || "12,030"}
                  </strong>
                </div>
              </div>

              {/* Shipping */}
              <div className="mt-2.5 rounded-xl bg-white border border-[#3E2C26]/10 p-3 text-left flex items-start gap-2.5 text-xs text-[#3E2C26]/65">
                <MapPin className="w-4 h-4 text-[#3E2C26] shrink-0 mt-0.5" />

                <div className="min-w-0">
                  <p className="font-medium text-sm text-[#261815]">
                    Shipping to: {customerInfo.firstName}{" "}
                    {customerInfo.lastName}
                  </p>

                  <p className="text-xs text-[#3E2C26]/55 mt-0.5 leading-relaxed">
                    {deliveryInfo.address}, {deliveryInfo.area},{" "}
                    {deliveryInfo.city} — {deliveryInfo.postalCode}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-5 flex flex-col items-center gap-1.5">
                {onContinueShopping ? (
                  <button
                    type="button"
                    onClick={onContinueShopping}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#3E2C26] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#261815] transition-all cursor-pointer"
                  >
                    Continue Shopping
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Link
                    href="/products"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#3E2C26] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#261815] transition-all cursor-pointer"
                  >
                    Continue Shopping
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    setOrderConfirmedData(null);
                  }}
                  className="text-xs text-[#3E2C26]/50 hover:text-[#3E2C26] font-medium py-1 cursor-pointer"
                >
                  Restart Demo Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export { Checkout as CheckoutPage };
