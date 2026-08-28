import { Product } from "./product";

export default interface FeaturedCategoryEntry {
  key: string;
  name: string;
  count: number;
  leftProduct: Product | null;
  rightProduct: Product | null;
}
