import brandsData from "@/database/brands.json";
import categoriesData from "@/database/categories.json";
import customersData from "@/database/customers.json";
import ordersData from "@/database/orders.json";
import productsData from "@/database/products.json";

// Maps raw ids in the data to display names — replace with a real
// lookup (DB join, CMS relation, etc.) once you have one.
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

export interface Product {
  uuid: string;
  isFeatured: unknown;
  isBestSeller: unknown;
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  isSale: boolean;
  description: string;
  longDescription: string;
  image: string;
  gallery: string[];
  aspectClass: string;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  specifications: {
    brand: string;
    category: string;
    sku: string;
  };
}

// Deterministic pseudo-aspect-ratio so masonry has variety without
// hydration mismatches from Math.random().
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
    longDescription: raw.content.replace(/<[^>]+>/g, ""), // strip HTML tags
    image: primaryImage,
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

// Very rough color-name → hex mapping for swatches. Extend as needed,
// or better: add a `hex` field to your variant data upstream.
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

// export function formatCurrency(amount: any) {
//   return `\u09F3${Number(amount).toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;
// }

/**
 * Filters + sorts the product catalog according to the same kind of
 * query params the real /products endpoint accepts.
 */
// export function queryProducts({
//   search,
//   categorySlug,
//   brandUuid,
//   minPrice,
//   maxPrice,
//   sortBy,
// }: {
//   search?: string;
//   categorySlug?: string;
//   brandUuid?: string;
//   minPrice?: number;
//   maxPrice?: number;
//   sortBy?: "price_asc" | "price_desc" | "newest";
// } = {}) {
//   let items = getProducts();

//   if (categorySlug) {
//     const category = getCategoryBySlug(categorySlug);
//     if (category) items = items.filter((p) => p.categoryUuid === category.uuid);
//   }

//   if (brandUuid) {
//     items = items.filter((p) => p.brandUuid === brandUuid);
//   }

//   if (search && search.trim()) {
//     const q = search.trim().toLowerCase();
//     items = items.filter(
//       (p) =>
//         p.name.toLowerCase().includes(q) ||
//         p.description?.toLowerCase().includes(q) ||
//         p.sku?.toLowerCase().includes(q),
//     );
//   }

//   if (minPrice != null) {
//     items = items.filter((p) => effectivePrice(p) >= Number(minPrice));
//   }
//   if (maxPrice != null) {
//     items = items.filter((p) => effectivePrice(p) <= Number(maxPrice));
//   }

//   switch (sortBy) {
//     case "price_asc":
//       items = [...items].sort((a, b) => effectivePrice(a) - effectivePrice(b));
//       break;
//     case "price_desc":
//       items = [...items].sort((a, b) => effectivePrice(b) - effectivePrice(a));
//       break;
//     case "newest":
//       items = [...items].sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
//       );
//       break;
//     default:
//       // featured first, then newest
//       items = [...items].sort((a, b) => {
//         if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       });
//   }

//   return items;
// }
