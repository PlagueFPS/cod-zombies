import { getGameCategories, getSkipAndPage } from "@/data/data";
import HeroSection from "@/components/HeroSection/HeroSection";
import FeaturedMaps from "@/components/FeaturedMaps/FeaturedMaps";

interface HomePageProps {
  searchParams: { 
    [key: string]: string | string[] | undefined 
  }
}

export default async function Home({ searchParams }: HomePageProps) {
  const { page } = searchParams
  const categoriesPromise = getGameCategories()
  const pagePromise = getSkipAndPage(page)
  const [gameCategories, { skip, currentPage, totalPages }] = await Promise.all([categoriesPromise, pagePromise])

  return (
    <div className="container flex flex-col gap-16 justify-center items-center">
      <HeroSection text="Call of Duty: Zombies" />
      <FeaturedMaps gameCategories={ gameCategories } skip={ skip } currentPage={ currentPage } totalPages={ totalPages } />
    </div>
  );
}
