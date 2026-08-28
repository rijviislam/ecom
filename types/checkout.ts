export interface CheckoutItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  image: string;
  variant?: string;
}
type StoredCartEntry = { id: string; quantity: number };

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
  localStorageKey?: string;
  onOrderComplete?: (orderData: Record<string, unknown>) => void;
  onContinueShopping?: () => void;
}
