#!/usr/bin/env bun
import { readdir, stat } from "fs/promises"
import { join, relative } from "path"

interface ImageCategory {
	name: string
	paths: string[]
}

interface GeneratedTypes {
	categories: ImageCategory[]
	allPaths: string[]
	totalCount: number
}

/**
 * Recursively scans a directory for image files and returns all found paths
 */
async function scanDirectory(dirPath: string, basePath: string = ""): Promise<string[]> {
	const items = await readdir(dirPath)
	const imagePaths: string[] = []

	for (const item of items) {
		const fullPath = join(dirPath, item)
		const relativePath = join(basePath, item)
		const stats = await stat(fullPath)

		if (stats.isDirectory()) {
			// Recursively scan subdirectories
			const subPaths = await scanDirectory(fullPath, relativePath)
			imagePaths.push(...subPaths)
		} else if (stats.isFile()) {
			// Check if it's an image file
			const ext = item.split(".").pop()?.toLowerCase()
			if (ext && ["webp", "png", "jpg", "jpeg", "gif", "svg"].includes(ext)) {
				imagePaths.push("/" + relativePath.replace(/\\/g, "/")) // Add leading slash and normalize path separators
			}
		}
	}

	return imagePaths
}

/**
 * Categorize image paths by their parent directory
 */
function categorizePaths(paths: string[]): ImageCategory[] {
	const categories = new Map<string, string[]>()

	for (const path of paths) {
		// Remove leading slash for categorization
		const pathWithoutSlash = path.startsWith("/") ? path.slice(1) : path
		const parts = pathWithoutSlash.split("/")
		if (parts.length > 1) {
			const category = parts[0]
			if (!categories.has(category)) {
				categories.set(category, [])
			}
			categories.get(category)!.push(path)
		} else {
			// Root level images
			if (!categories.has("root")) {
				categories.set("root", [])
			}
			categories.get("root")!.push(path)
		}
	}

	return Array.from(categories.entries()).map(([name, paths]) => ({
		name,
		paths: paths.sort(),
	}))
}

/**
 * Generate TypeScript type definitions for image paths
 */
function generateTypeDefinitions(data: GeneratedTypes): string {
	const { categories, allPaths, totalCount } = data

	let output = `// Auto-generated image path types
// Generated on: ${new Date().toISOString()}
// Total images: ${totalCount}

/**
 * All possible image paths in the public directory
 */
export type ImagePath = ${allPaths.map(path => `"${path}"`).join(" | ")}

/**
 * Image paths by category
 */
`

	// Generate category-specific types
	for (const category of categories) {
		const typeName =
			category.name === "root"
				? "RootImagePath"
				: `${category.name.charAt(0).toUpperCase() + category.name.slice(1).replace(/-/g, "")}ImagePath`
		output += `export type ${typeName} = ${category.paths.map(path => `"${path}"`).join(" | ")}\n\n`
	}

	// Generate utility types
	output += `/**
 * Utility types for image path validation
 */
export type ImageCategory = ${categories.map(cat => `"${cat.name}"`).join(" | ")}

export type GetImagesByCategory<T extends ImageCategory> = 
${categories
	.map(cat => {
		const typeName =
			cat.name === "root"
				? "RootImagePath"
				: `${cat.name.charAt(0).toUpperCase() + cat.name.slice(1).replace(/-/g, "")}ImagePath`
		return `  T extends "${cat.name}" ? ${typeName} : 'never'`
	})
	.join(" |\n")}

/**
 * Helper function to check if a path is a valid image path
 */
export function isValidImagePath(path: string): path is ImagePath {
  return ${allPaths.map(p => `path === "${p}"`).join(" || ")}
}

/**
 * Get all image paths for a specific category
 */
export function getImagesByCategory(category: ImageCategory): string[] {
  switch (category) {
${categories
	.map(
		cat => `    case "${cat.name}":
      return [${cat.paths.map(p => `"${p}"`).join(", ")}]`,
	)
	.join("\n")}
    default:
      return []
  }
}
`

	return output
}

/**
 * Main function to generate image path types
 */
async function main() {
	try {
		console.log("🔍 Scanning public directory for images...")

		const publicDir = join(process.cwd(), "public")
		const allPaths = await scanDirectory(publicDir)
		const categories = categorizePaths(allPaths)

		const data: GeneratedTypes = {
			categories,
			allPaths: allPaths.sort(),
			totalCount: allPaths.length,
		}

		console.log(`📊 Found ${data.totalCount} images across ${categories.length} categories:`)
		categories.forEach(cat => {
			console.log(`  - ${cat.name}: ${cat.paths.length} images`)
		})

		console.log("📝 Generating TypeScript definitions...")
		const typeDefinitions = generateTypeDefinitions(data)

		const outputPath = join(process.cwd(), "types", "image-paths.ts")
		await Bun.write(outputPath, typeDefinitions)

		console.log(`✅ Generated types saved to: ${outputPath}`)
		console.log(`📁 Total images processed: ${data.totalCount}`)
	} catch (error) {
		console.error("❌ Error generating types:", error)
		process.exit(1)
	}
}

// Run the script
main()
