"use client"
import HomePageLoader from "@/components/Loaders/HomePageLoader";
import { capatilize } from "@/utils/constants";
import { usePathname } from "next/navigation";

export default function CategoryPageLoader() {
  const pathname = usePathname().replace('/', '')

  return <HomePageLoader category={ capatilize(pathname) } />
}
