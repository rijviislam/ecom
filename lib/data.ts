import brandsData from "@/database/brands.json";
import categoriesData from "@/database/categories.json";
import customersData from "@/database/customers.json";
import ordersData from "@/database/orders.json";
import productsData from "@/database/products.json";
import {
  FulfillmentStatus,
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/types/order";
import { Product } from "@/types/product";

const BRAND_NAMES: Record<string, string> = {
  "brand-zenith": "Zenith",
  "brand-nimbus": "Nimbus",
  "brand-urbancraft": "UrbanCraft",
  "brand-coral": "Coral",
  "brand-generic": "Generic",
};

const CATEGORY_NAMES: Record<string, string> = {
  "cat-electronics": "Electronics",
  "cat-fashion": "Fashion",
  "cat-home": "Home",
  "cat-beauty": "Beauty",
};

const ASPECT_CLASSES = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[2/3]",
  "aspect-[4/5]",
  "aspect-[4/3]",
];

function pickAspectClass(id: string): string {
  const hash = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return ASPECT_CLASSES[hash % ASPECT_CLASSES.length];
}

function normalizeProduct(raw: (typeof productsData)[number]): Product {
  const images = (raw.images ?? [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => img.url);

  const primaryImage =
    raw.images?.find((img) => img.isPrimary)?.url ??
    images[0] ??
    "/placeholder-product.jpg";

  const hasSale =
    typeof raw.salePrice === "number" && raw.salePrice < raw.retailPrice;

  const discountPercent = hasSale
    ? Math.round((1 - (raw.salePrice as number) / raw.retailPrice) * 100)
    : undefined;

  const sizes = Array.from(
    new Set(
      raw.variants?.filter((v) => v.attribute === "Size").map((v) => v.value) ??
        [],
    ),
  );

  const colors = raw.variants
    ?.filter((v) => v.attribute === "Color")
    .map((v) => ({ name: v.value, hex: colorNameToHex(v.value) }));

  return {
    id: raw.uuid,
    slug: raw.slug,
    uuid: raw.uuid,
    name: raw.name,
    brand: BRAND_NAMES[raw.brandUuid] ?? raw.brandUuid,
    category: CATEGORY_NAMES[raw.categoryUuid] ?? raw.categoryUuid,
    price: hasSale ? (raw.salePrice as number) : raw.retailPrice,
    originalPrice: hasSale ? raw.retailPrice : undefined,
    discount: discountPercent ? `${discountPercent}% OFF` : undefined,
    isSale: hasSale,
    isFeatured: raw.isFeatured,
    isBestSeller: false,
    description: raw.description,
    longDescription: raw.content.replace(/<[^>]+>/g, ""),
    image: primaryImage,
    thumbnail: primaryImage,
    gallery: images.length > 0 ? images : [primaryImage],
    aspectClass: pickAspectClass(raw.uuid),
    colors: colors && colors.length > 0 ? colors : undefined,
    sizes: sizes.length > 0 ? sizes : undefined,
    specifications: {
      brand: BRAND_NAMES[raw.brandUuid] ?? raw.brandUuid,
      category: CATEGORY_NAMES[raw.categoryUuid] ?? raw.categoryUuid,
      sku: raw.sku,
    },
  };
}

function colorNameToHex(name: string): string {
  const map: Record<string, string> = {
    Black: "#1a1a1a",
    White: "#f5f5f5",
    Blue: "#3b6ea5",
    Clay: "#b5651d",
  };
  return map[name] ?? "#cccccc";
}

export function getProducts(): Product[] {
  return productsData
    .filter((p) => p.status === "published")
    .map(normalizeProduct);
}
export function getOrders(): Order[] {
  return ordersData
    .filter((order) => Boolean(order.status))
    .map((order) => ({
      ...order,
      status: order.status as OrderStatus,
      paymentStatus: order.paymentStatus as PaymentStatus,
      fulfillmentStatus: order.fulfillmentStatus as FulfillmentStatus,
      items: order.items.map((item) => {
        const rawProduct = productsData.find(
          (p) => p.uuid === item.productUuid,
        );
        return {
          ...item,
          product: rawProduct ? normalizeProduct(rawProduct) : undefined,
        };
      }),
    }));
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getProductByUuid(uuid: string) {
  return productsData.find((p) => p.uuid === uuid) || null;
}

export function getFeaturedProducts() {
  return getProducts().filter((p) => p.isFeatured);
}

export function getRelatedProducts(
  product: { uuid: string; categoryUuid: string },
  limit = 4,
) {
  const categoryName =
    CATEGORY_NAMES[product.categoryUuid] ?? product.categoryUuid;
  return getProducts()
    .filter((p) => p.id !== product.uuid && p.category === categoryName)
    .slice(0, limit);
}

export function getCategories() {
  return categoriesData.filter((c) => c.isActive);
}

export function getCategoryBySlug(slug: string) {
  return categoriesData.find((c) => c.slug === slug) || null;
}

export function getBrands() {
  return brandsData.filter((b) => b.isActive);
}

export function getBrandByUuid(uuid: string) {
  return brandsData.find((b) => b.uuid === uuid) || null;
}

export function getCategoryByUuid(uuid: string) {
  return categoriesData.find((c) => c.uuid === uuid) || null;
}

export function getSeedOrders() {
  return ordersData;
}

export function getDemoCustomer() {
  return customersData[0];
}

export function effectivePrice(
  product:
    | {
        uuid: string;
        name: string;
        slug: string;
        description: string;
        content: string;
        sku: string;
        barcode: string;
        categoryUuid: string;
        brandUuid: string;
        status: string;
        costPrice: number;
        retailPrice: number;
        salePrice: number;
        compareAtPrice: number;
        weight: number;
        hasVariants: boolean;
        isFeatured: boolean;
        isDigital: boolean;
        seoTitle: string;
        seoDescription: string;
        tags: { uuid: string; name: string; slug: string }[];
        images: {
          uuid: string;
          url: string;
          altText: string;
          sortOrder: number;
          isPrimary: boolean;
        }[];
        variants: {
          uuid: string;
          label: string;
          attribute: string;
          value: string;
          priceDelta: number;
          stock: number;
        }[];
        createdAt: string;
        updatedAt: string;
      }
    | {
        uuid: string;
        name: string;
        slug: string;
        description: string;
        content: string;
        sku: string;
        barcode: string;
        categoryUuid: string;
        brandUuid: string;
        status: string;
        costPrice: number;
        retailPrice: number;
        salePrice: null;
        compareAtPrice: null;
        weight: number;
        hasVariants: boolean;
        isFeatured: boolean;
        isDigital: boolean;
        seoTitle: string;
        seoDescription: string;
        tags: { uuid: string; name: string; slug: string }[];
        images: {
          uuid: string;
          url: string;
          altText: string;
          sortOrder: number;
          isPrimary: boolean;
        }[];
        variants: {
          uuid: string;
          label: string;
          attribute: string;
          value: string;
          priceDelta: number;
          stock: number;
        }[];
        createdAt: string;
        updatedAt: string;
      },
) {
  return product.salePrice != null ? product.salePrice : product.retailPrice;
}
