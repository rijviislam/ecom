export interface Product {
  thumbnail: string;
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
