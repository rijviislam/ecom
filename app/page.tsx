import FeaturedCategories from "@/components/Category";
import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";

export default function Home() {
  return (
    <div className="   ">
      <Hero />
      <FeaturedProducts />
      <FeaturedCategories />
      <ProductSection />
    </div>
  );
}
