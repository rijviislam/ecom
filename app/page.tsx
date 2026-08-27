import BestSellers from "@/components/BestSellers";
import FeaturedCategories from "@/components/Category";
import Faq from "@/components/FAQ";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import ProductSection from "@/components/ProductSection";

export default function Home() {
  return (
    <div className="   ">
      <Hero />
      <BestSellers />
      <FeaturedCategories />
      <ProductSection />
      <Faq />
      <Newsletter />
    </div>
  );
}
