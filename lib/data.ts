import brandsData from "@/database/brands.json";
import categoriesData from "@/database/categories.json";
import customersData from "@/database/customers.json";
import ordersData from "@/database/orders.json";
import productsData from "@/database/products.json";

// These helpers stand in for what would otherwise be `GET /products`,
// `GET /categories`, etc. against the real API described in
// API-GUIDELINE.md. Filtering/sorting logic mirrors the query params
// documented there (status, categoryUuid, brandUuid, search, sortBy...).

export function getProducts() {
  return productsData.filter((p) => p.status === "published");
}

export function getProductBySlug(slug: string) {
  return productsData.find((p) => p.slug === slug) || null;
}

export function getProductByUuid(uuid: string) {
  return productsData.find((p) => p.uuid === uuid) || null;
}

export function getFeaturedProducts() {
  return getProducts().filter((p) => p.isFeatured);
}

export function getRelatedProducts(product, limit = 4) {
  return getProducts()
    .filter(
      (p) => p.uuid !== product.uuid && p.categoryUuid === product.categoryUuid,
    )
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

export function effectivePrice(product) {
  return product.salePrice != null ? product.salePrice : product.retailPrice;
}

export function formatCurrency(amount) {
  return `\u09F3${Number(amount).toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;
}

/**
 * Filters + sorts the product catalog according to the same kind of
 * query params the real /products endpoint accepts.
 */
export function queryProducts({
  search,
  categorySlug,
  brandUuid,
  minPrice,
  maxPrice,
  sortBy,
} = {}) {
  let items = getProducts();

  if (categorySlug) {
    const category = getCategoryBySlug(categorySlug);
    if (category) items = items.filter((p) => p.categoryUuid === category.uuid);
  }

  if (brandUuid) {
    items = items.filter((p) => p.brandUuid === brandUuid);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q),
    );
  }

  if (minPrice != null) {
    items = items.filter((p) => effectivePrice(p) >= Number(minPrice));
  }
  if (maxPrice != null) {
    items = items.filter((p) => effectivePrice(p) <= Number(maxPrice));
  }

  switch (sortBy) {
    case "price_asc":
      items = [...items].sort((a, b) => effectivePrice(a) - effectivePrice(b));
      break;
    case "price_desc":
      items = [...items].sort((a, b) => effectivePrice(b) - effectivePrice(a));
      break;
    case "newest":
      items = [...items].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      break;
    default:
      // featured first, then newest
      items = [...items].sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }

  return items;
}
