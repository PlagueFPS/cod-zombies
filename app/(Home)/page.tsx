import type { SearchParams } from "@/utils/validationSchemas";
import HeroSection from "@/components/HeroSection/HeroSection";
import FeaturedMaps from "@/components/FeaturedMaps/FeaturedMaps";

interface HomePageProps {
  searchParams: Promise<SearchParams>
}

export default async function Home({ searchParams }: HomePageProps) {
  return (
    <div className="container flex flex-col gap-16 justify-center items-center">
      <HeroSection />
      <FeaturedMaps searchParams={ searchParams } />
    </div>
  );
}