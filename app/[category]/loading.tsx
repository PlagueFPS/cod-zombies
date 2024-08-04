"use client"
import { useParams } from "next/navigation";
import HomePageLoader from "@/components/Loaders/HomePageLoader";
import { capatilize } from "@/utils/functions";

export default function CategoryPageLoader() {
  const { category } = useParams()
  return <HomePageLoader category={ !Array.isArray(category) ? capatilize(category) : '' } />
}
