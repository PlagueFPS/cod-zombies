#!/usr/bin/env bun

import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs"
import { convertImportPath, extractMapName, processFile } from "./convert-rich-images"

/**
 * Test script to validate the conversion logic
 */

console.log("🧪 Testing conversion logic...\n")

// Test map name extraction
console.log("📋 Testing map name extraction:")
const testPaths = [
	"../images/origins/origins-filename.webp",
	"../images/gorod-krovi/gk-filename.webp",
	"../images/firebase-z/firebase-z-filename.webp",
	"../images/some-map/map-filename.webp",
]

testPaths.forEach(path => {
	const mapName = extractMapName(path)
	console.log(`  ${path} -> ${mapName}`)
})

console.log("\n📋 Testing path conversion:")
testPaths.forEach(path => {
	const contentPath = convertImportPath(path)
	console.log(`  ${path} -> ${contentPath}`)
})

// Test with sample content
console.log("\n📋 Testing with sample content:")
const sampleContent = `
import SomeImage from '../images/origins/origins-filename.webp'
import Component from '@/components/some-component'

<RichImage image={SomeImage} caption='Test caption' />
<RichImage image={SomeImage} caption="Another caption" />
`

console.log("Input:")
console.log(sampleContent)

// Create a temporary test file
const testFilePath = "test-sample.mdx"
writeFileSync(testFilePath, sampleContent)

try {
	const result = processFile(testFilePath)
	console.log("\nOutput:")
	console.log(readFileSync(testFilePath, "utf8"))
	console.log("\nResult:", result)
} catch (error) {
	console.error("Error:", (error as Error).message)
} finally {
	// Clean up test file
	if (existsSync(testFilePath)) {
		unlinkSync(testFilePath)
	}
	if (existsSync("backup-main-quests/test-sample.mdx")) {
		unlinkSync("backup-main-quests/test-sample.mdx")
	}
}

console.log("\n✅ Test completed!")
