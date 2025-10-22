import { readdir, stat } from "node:fs/promises"
import { join } from "node:path"

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

		// Skip Open Graph images directory entirely when scanning the top-level of public
		if (basePath === "" && item === "opengraph-images") {
			continue
		}
		const stats = await stat(fullPath)

		if (stats.isDirectory()) {
			// Recursively scan subdirectories
			const subPaths = await scanDirectory(fullPath, relativePath)
			imagePaths.push(...subPaths)
		} else if (stats.isFile()) {
			// Check if it's an image file
			const ext = item.split(".").pop()?.toLowerCase()
			if (ext && ["webp", "png", "jpg", "jpeg", "gif", "svg"].includes(ext)) {
				imagePaths.push(`/${relativePath.replace(/\\/g, "/")}`) // Add leading slash and normalize path separators
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
			if (!category) continue

			if (!categories.has(category)) {
				categories.set(category, [])
			}
			categories.get(category)?.push(path)
		} else {
			// Root level images
			if (!categories.has("root")) {
				categories.set("root", [])
			}
			categories.get("root")?.push(path)
		}
	}

	return Array.from(categories.entries()).map(([name, paths]) => ({
		name,
		paths: paths.sort(),
	}))
}

/**
 * Warn about duplicate string values within a set
 */
function warnDuplicates(label: string, values: string[]) {
	const counts = new Map<string, number>()
	for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
	const duplicates = Array.from(counts.entries()).filter(([, count]) => count > 1)
	if (duplicates.length > 0) {
		const sample = duplicates
			.slice(0, 5)
			.map(([value, count]) => `${value} (x${count})`)
			.join(", ")
		console.warn(
			`⚠️ Duplicate paths in ${label}: ${duplicates.length} unique duplicates. Samples: ${sample}`,
		)
	}
}

/**
 * Generate TypeScript type definitions for image paths
 */
function generateTypeDefinitions(data: GeneratedTypes): string {
	const { categories, totalCount } = data

	let output = `// Auto-generated image path types
// Generated on: ${new Date().toISOString()}
// Total images: ${totalCount}

/**
* Image paths by category
*/
`

	const typeNames: string[] = []

	// Generate category-specific types (deduped) and collect type names
	for (const category of categories) {
		warnDuplicates(`category "${category.name}"`, category.paths)

		const typeName =
			category.name === "root"
				? "RootImagePath"
				: `${category.name.charAt(0).toUpperCase() + category.name.slice(1).replace(/-/g, "")}ImagePath`

		const uniquePaths = Array.from(new Set(category.paths)).sort()
		if (uniquePaths.length === 0) continue

		typeNames.push(typeName)
		output += `export type ${typeName} = ${uniquePaths.map(path => `"${path}"`).join(" | ")}\n\n`
	}

	// Compose master type from category type names to prevent duplicate string literals
	if (typeNames.length > 0) {
		output += `export type ImagePath = ${typeNames.join(" | ")}\n`
	} else {
		output += `export type ImagePath = never\n`
	}

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
		// Global duplicate warning (optional but helpful)
		warnDuplicates("global", allPaths)
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
