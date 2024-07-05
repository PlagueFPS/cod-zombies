import { getMaps, resolveEntry } from "@/utils/contentful-utils"
import SearchInput from "./SearchInput"

export default async function SearchBar() {
  const posts = await getMaps()
  const maps = posts.items.map(post => {
    const category = resolveEntry(post.fields.gameCategory)
    
    return {
      title: post.fields.title,
      slug: post.fields.slug,
      category: category?.fields.title
    }
  })

  return (
    <div className="flex justify-center items-center w-1/2">
      <SearchInput maps={ maps } />
    </div>
  )
}
