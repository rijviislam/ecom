import { Product } from "./product";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus =
  | "paid"
  | "unpaid"
  | "pending"
  | "refunded"
  | "failed";

export type FulfillmentStatus =
  | "fulfilled"
  | "unfulfilled"
  | "partially_fulfilled"
  | "returned";

export interface OrderItem {
  productUuid: string;
  variantUuid: string | null;
  name: string;
  variantLabel: string | null;
  image: string;
  unitPrice: number;
  quantity: number;
  product?: Product;
}

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface StatusHistoryItem {
  status: OrderStatus | string;
  label: string;
  timestamp: string;
  note: string;
}

export interface Order {
  uuid: string;
  orderNumber: string;
  customerUuid: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  grandTotal: number;
  shippingAddress: ShippingAddress;
  createdAt: string;
  statusHistory: StatusHistoryItem[];
}

export interface OrderItem {
  productUuid: string;
  variantUuid: string | null;
  name: string;
  variantLabel: string | null;
  image: string;
  unitPrice: number;
  quantity: number;
}

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface StatusHistoryItem {
  status: string;
  label: string;
  timestamp: string;
  note: string;
}

export interface OrderData {
  uuid: string;
  orderNumber: string;
  customerUuid: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  grandTotal: number;
  shippingAddress: ShippingAddress;
  createdAt: string;
  statusHistory: StatusHistoryItem[];
}

export interface MyOrdersProps {
  brandName?: string;
  currencySymbol?: string;
  initialOrders?: OrderData[];
  onBackToShop?: () => void;
}
