#!/usr/bin/env bun

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { glob } from "glob"
import { basename, join } from "path"

/**
 * Script to convert RichImage components from static imports to relative string paths
 *
 * This script:
 * 1. Finds all MDX files in the content/main-quests directory
 * 2. Extracts map names from import paths
 * 3. Converts RichImage components to use relative string paths
 * 4. Removes static image imports
 * 5. Preserves all other content and formatting
 */

// Configuration
const CONTENT_DIR = "content/main-quests"
const BACKUP_DIR = "backup-main-quests"

// Create backup directory
if (!existsSync(BACKUP_DIR)) {
	mkdirSync(BACKUP_DIR, { recursive: true })
}

/**
 * Extract map name from import path
 * Examples:
 * - '../images/origins/origins-filename.webp' -> 'origins'
 * - '../images/gorod-krovi/gk-filename.webp' -> 'gorod-krovi'
 * - '../images/firebase-z/firebase-z-filename.webp' -> 'firebase-z'
 */
function extractMapName(importPath: string): string | null {
	const match = importPath.match(/\.\.\/images\/([^/]+)\//)
	return match ? match[1] : null
}

/**
 * Convert import path to content path
 * Examples:
 * - '../images/origins/origins-filename.webp' -> '/content/origins/origins-filename.webp'
 * - '../images/gorod-krovi/gk-filename.webp' -> '/content/gorod-krovi/gk-filename.webp'
 */
function convertImportPath(importPath: string): string | null {
	const mapName = extractMapName(importPath)
	if (!mapName) return null

	// Extract filename from import path
	const filename = importPath.split("/").pop()
	return `/content/${mapName}/${filename}`
}

interface ProcessResult {
	filePath: string
	importsRemoved: number
	imagesConverted: number
}

/**
 * Process a single MDX file
 */
function processFile(filePath: string): ProcessResult {
	console.log(`Processing: ${filePath}`)

	// Read file content
	const content = readFileSync(filePath, "utf8")

	// Create backup
	const backupPath = join(BACKUP_DIR, basename(filePath))
	writeFileSync(backupPath, content)

	let processedContent = content

	// Step 1: Extract all image imports and create mapping
	const importMap = new Map<string, string>()
	const importRegex = /import\s+(\w+)\s+from\s+['"]([^'"]*images\/[^'"]*\.webp)['"];?/g

	let match: RegExpExecArray | null
	while ((match = importRegex.exec(content)) !== null) {
		const [_fullMatch, variableName, importPath] = match

		// Only process image imports (not component imports)
		if (importPath.includes("/images/")) {
			const contentPath = convertImportPath(importPath)
			if (contentPath) {
				importMap.set(variableName, contentPath)
				console.log(`  Mapping: ${variableName} -> ${contentPath}`)
			}
		}
	}

	// Step 2: Convert RichImage components
	const richImageRegex = /<RichImage\s+image=\{(\w+)\}\s+caption=([^>]+)\s*\/>/g
	processedContent = processedContent.replace(
		richImageRegex,
		(match, variableName: string, caption: string) => {
			const contentPath = importMap.get(variableName)
			if (contentPath) {
				console.log(`  Converting: ${variableName} -> ${contentPath}`)
				return `<RichImage image="${contentPath}" caption=${caption} />`
			}
			console.log(`  Warning: No mapping found for ${variableName}`)
			return match
		},
	)

	// Step 3: Remove static image imports
	const imageImportRegex = /import\s+\w+\s+from\s+['"][^'"]*images\/[^'"]*\.webp['"];?\s*/g
	processedContent = processedContent.replace(imageImportRegex, "")

	// Step 4: Clean up multiple empty lines
	processedContent = processedContent.replace(/\n\s*\n\s*\n/g, "\n\n")

	// Write processed content
	writeFileSync(filePath, processedContent)

	console.log(`  ✅ Completed: ${filePath}`)
	return {
		filePath,
		importsRemoved: importMap.size,
		imagesConverted: importMap.size,
	}
}

/**
 * Main execution
 */
async function main(): Promise<void> {
	console.log("🚀 Starting RichImage conversion script...\n")

	// Find all MDX files
	const pattern = join(CONTENT_DIR, "*.mdx")
	const files = await glob(pattern)

	if (files.length === 0) {
		console.log("❌ No MDX files found in", CONTENT_DIR)
		return
	}

	console.log(`📁 Found ${files.length} MDX files to process\n`)

	const results: ProcessResult[] = []

	// Process each file
	for (const filePath of files) {
		try {
			const result = processFile(filePath)
			results.push(result)
		} catch (error) {
			console.error(`❌ Error processing ${filePath}:`, (error as Error).message)
		}
	}

	// Summary
	console.log("\n📊 Summary:")
	console.log(`✅ Files processed: ${results.length}`)
	console.log(`📦 Total imports removed: ${results.reduce((sum, r) => sum + r.importsRemoved, 0)}`)
	console.log(
		`🖼️  Total images converted: ${results.reduce((sum, r) => sum + r.imagesConverted, 0)}`,
	)
	console.log(`💾 Backups created in: ${BACKUP_DIR}/`)

	console.log("\n🎉 Conversion complete!")
	console.log("\n📝 Next steps:")
	console.log("1. Review the converted files")
	console.log("2. Test that images load correctly")
	console.log("3. Delete backup folder if everything looks good")
	console.log("4. Run linter to check for any issues")
}

// Run the script
if (import.meta.main) {
	await main()
}

export { processFile, extractMapName, convertImportPath }
