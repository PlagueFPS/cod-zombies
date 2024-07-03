import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TypeFeaturedMapsSkeleton } from "@/contentful/Types/contentful-types";
import { DATE_OPTIONS } from "@/utils/constants";
import { getPosts, resolveAsset, resolveEntry } from "@/utils/contentful-utils";
import Image from "next/image";
import Link from "next/link";


export default async function Home() {
  const posts = await getPosts<TypeFeaturedMapsSkeleton>({ content_type: 'featuredMaps', order: ['-sys.createdAt'] })
  const featuredMaps = posts.items

  return (
    <div className="container flex flex-col gap-12 justify-center items-center text-foreground">
      <section className="flex flex-col items-center justify-center gap-4 text-center max-w-2xl">
        <h2 className="font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Unlock the Secrets of Call of Duty: <span className="text-primary">Zombies</span>
        </h2>
        <p className="text-foreground text-lg">Explore our comprehensive guides to the most challenging and rewarding easter eggs in the Call of Duty Zombies universe</p>
        <Button className="mt-8">
          View Easter Egg Guides
        </Button>
      </section>
      <section className="flex flex-col gap-8 justify-center w-full">
        <h2 className="font-bold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">Featured Maps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
          { featuredMaps.map(map => {
            const { title, description, date, image, gameCategory, slug } = map.fields
            const mapImage = resolveAsset(image)
            const category = resolveEntry(gameCategory)

            return (
              <>
                <Link key={ map.sys.id } href={ `/maps/${slug}` } className="max-h-[450px] h-full">
                  <Card className="relative h-full group hover:border-primary cursor-pointer transition-all overflow-hidden">
                    <Badge className="absolute top-2 right-2 z-20">{ category?.fields.title }</Badge>
                    <div className="absolute -top-10 left-0 right-0 bottom-0 z-10 flex items-center w-full h-full rotate-[55deg] scale-150 opacity-25 blur-2xl">
                      <picture className="w-full h-full">
                        <Image 
                          src={ `https:${mapImage?.fields?.file?.url}` }
                          alt=""
                          fill
                          className="object-cover"
                          />
                      </picture>
                    </div>
                    <CardHeader className="flex flex-grow">
                      <picture className="relative overflow-hidden h-44 w-full rounded-md">
                        <Image 
                          src={ `https:${mapImage?.fields?.file?.url}` }
                          alt=""
                          fill
                          sizes="384px"
                          className="object-cover"
                        />
                      </picture>
                      <CardTitle className="group-hover:text-primary transition-all">{ title }</CardTitle>
                      <CardDescription>{ new Date(date).toLocaleDateString(undefined, DATE_OPTIONS) }</CardDescription>
                    </CardHeader>
                    <CardContent className="-mt-4">
                      <p>{ description }</p>
                    </CardContent>
                  </Card>
                </Link>
              </>
            )
          })}
        </div>
      </section>
    </div>
  );
}
