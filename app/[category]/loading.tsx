"use client"
import { useParams } from "next/navigation";
import HomePageLoader from "@/components/Loaders/HomePageLoader";
import { checkParams } from "@/utils/functions";

export default function CategoryPageLoader() {
  const { category } = useParams()
  return <HomePageLoader category={ checkParams(category) ?? undefined } />
}
