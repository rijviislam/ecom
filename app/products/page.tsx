import ProductsPage from "@/components/Products";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProductsPage />
    </Suspense>
  );
}
