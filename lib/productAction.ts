function readIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(key);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: string[], eventName: string) {
  localStorage.setItem(key, JSON.stringify(ids));
  window.dispatchEvent(new Event(eventName));
}

export function isInWishlist(productId: string) {
  return readIds("wishlist").includes(productId);
}

export function isInCart(productId: string) {
  return readIds("cart").includes(productId);
}

export function toggleWishlist(productId: string): boolean {
  const ids = readIds("wishlist");
  const nextState = !ids.includes(productId);
  const updated = nextState
    ? [...ids, productId]
    : ids.filter((id) => id !== productId);

  writeIds("wishlist", updated, "wishlist-updated");
  return nextState;
}

export function toggleCart(productId: string): boolean {
  const ids = readIds("cart");
  const nextState = !ids.includes(productId);
  const updated = nextState
    ? [...ids, productId]
    : ids.filter((id) => id !== productId);

  writeIds("cart", updated, "cart-updated");
  return nextState;
}
