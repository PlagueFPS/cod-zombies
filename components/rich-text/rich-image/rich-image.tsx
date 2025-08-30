import type { SerializedUploadNode } from "@payloadcms/richtext-lexical"
import type { ImageProps } from "@/types/images"
import FeaturedImage from "@/components/featured-image/featured-image"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"

interface RichImageProps {
	node: SerializedUploadNode
}

export default function RichImage({ node }: RichImageProps) {
	console.log(node)
	return null
	// const imageProps: ImageProps = {
	// 	featuredImage: createMediaDto(node.value),
	// 	sizes: "(max-width: 828px) calc(100vw - 16px), 776px",
	// }

	// return (
	// 	<div className="relative mt-8 w-full">
	// 		<div className="absolute top-4 right-0 left-0 z-10 mx-auto w-full opacity-35 blur-2xl">
	// 			<FeaturedImage
	// 				{...imageProps}
	// 				quality={100}
	// 				description={node.fields.description}
	// 				className="rounded-lg"
	// 			/>
	// 		</div>
	// 		<Dialog>
	// 			<DialogTrigger className="pointer-events-none relative z-20 w-full sm:pointer-events-auto">
	// 				<FeaturedImage
	// 					{...imageProps}
	// 					quality={100}
	// 					description={node.fields.description}
	// 					alt={node.fields.description}
	// 					className="cursor-default rounded-lg sm:cursor-zoom-in"
	// 				/>
	// 			</DialogTrigger>
	// 			<DialogContent
	// 				className="border-none bg-transparent sm:max-w-[calc(80%)]"
	// 				closeButton={false}
	// 			>
	// 				<DialogTitle className="sr-only">
	// 					{node.fields.description || "Preview Image"}
	// 				</DialogTitle>
	// 				<DialogDescription className="sr-only">
	// 					{node.fields.description || "Preview Image"}
	// 				</DialogDescription>
	// 				<DialogClose>
	// 					<FeaturedImage
	// 						{...imageProps}
	// 						quality={100}
	// 						alt={node.fields.description}
	// 						sizes="(max-width: 1920px) calc(100vw - 16px), 1920px"
	// 						className="cursor-zoom-out rounded-lg"
	// 					/>
	// 				</DialogClose>
	// 			</DialogContent>
	// 		</Dialog>
	// 	</div>
	// )
}
