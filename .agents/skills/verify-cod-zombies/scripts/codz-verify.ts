#!/usr/bin/env bun
/**
 * Launch, check, drive, and stop a disposable Call of Duty: Zombies Guides dev server.
 *
 *   .agents/skills/verify-cod-zombies/scripts/codz-verify launch
 *   .agents/skills/verify-cod-zombies/scripts/codz-verify doctor
 *   .agents/skills/verify-cod-zombies/scripts/codz-verify drive main-quests
 *   .agents/skills/verify-cod-zombies/scripts/codz-verify cleanup
 */
import { execFileSync, spawn, type ChildProcess } from "node:child_process"
import { createServer } from "node:net"
import {
	closeSync,
	existsSync,
	mkdirSync,
	openSync,
	readFileSync,
	readdirSync,
	readlinkSync,
	realpathSync,
	rmSync,
	writeFileSync,
} from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium, type Locator, type Page } from "@playwright/test"

const SITE_TITLE = "Call of Duty: Zombies Guides"

const FEATURES = ["main-quests", "side-quests", "relics", "bestiary", "maps"] as const

type Feature = (typeof FEATURES)[number]

type CommandName = "launch" | "doctor" | "drive" | "cleanup"

interface RunMeta {
	runId: string
	pid: number
	port: number
	baseUrl: string
	logPath: string
	repoRoot: string
	gitRevision: string
	startedAt: string
}

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(scriptDir, "../../../..")
const stateRoot = "/tmp/codz-verify"
const latestPath = join(stateRoot, "latest")

const serverEnv = {
	LINEAR_API_KEY: "playwright-linear-api-key",
	LINEAR_TEAM_ID: "playwright-linear-team-id",
	E2E_MOCK_EMAIL: "success",
	RESEND_API_KEY: "playwright-resend-api-key",
	RESEND_AUDIENCE_ID: "playwright-resend-audience-id",
}

function fail(message: string): never {
	console.error(message)
	process.exit(1)
}

function sleep(ms: number) {
	return new Promise(resolveSleep => {
		setTimeout(resolveSleep, ms)
	})
}

function readMetaFile(path: string): RunMeta | null {
	if (!existsSync(path)) return null
	const parsed: unknown = JSON.parse(readFileSync(path, "utf8"))
	if (!isRunMeta(parsed)) return null
	return parsed
}

function isRunMeta(value: unknown): value is RunMeta {
	if (typeof value !== "object" || value === null) return false
	if (!("runId" in value) || typeof value.runId !== "string") return false
	if (!("pid" in value) || typeof value.pid !== "number") return false
	if (!("port" in value) || typeof value.port !== "number") return false
	if (!("baseUrl" in value) || typeof value.baseUrl !== "string") return false
	if (!("logPath" in value) || typeof value.logPath !== "string") return false
	if (!("repoRoot" in value) || typeof value.repoRoot !== "string") return false
	if (!("gitRevision" in value) || typeof value.gitRevision !== "string") return false
	if (!("startedAt" in value) || typeof value.startedAt !== "string") return false
	return true
}

function isAlive(pid: number) {
	try {
		process.kill(pid, 0)
		return true
	} catch {
		return false
	}
}

function runDir(runId: string) {
	return join(stateRoot, runId)
}

function metaPath(runId: string) {
	return join(runDir(runId), "meta.json")
}

function evidenceDir(runId: string) {
	const override = process.env.VERIFY_EVIDENCE_DIR
	if (override) return join(override, runId)
	return join("/opt/cursor/artifacts/verify-cod-zombies", runId)
}

function gitRevision() {
	try {
		return execFileSync("git", ["rev-parse", "HEAD"], { cwd: repoRoot, encoding: "utf8" }).trim()
	} catch {
		return "unknown"
	}
}

function liveRuns(): RunMeta[] {
	if (!existsSync(stateRoot)) return []
	const found: RunMeta[] = []
	for (const entry of readdirSync(stateRoot, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue
		const meta = readMetaFile(join(stateRoot, entry.name, "meta.json"))
		if (meta && isAlive(meta.pid)) found.push(meta)
	}
	return found
}

function resolveRunId(): string {
	const fromEnv = process.env.VERIFY_RUN_ID
	if (fromEnv) return fromEnv
	if (existsSync(latestPath)) return readFileSync(latestPath, "utf8").trim()
	fail("No verification run is recorded. Launch one, or set VERIFY_RUN_ID.")
}

function loadMeta(): RunMeta {
	const runId = resolveRunId()
	const meta = readMetaFile(metaPath(runId))
	if (!meta) fail(`No meta for run ${runId} at ${metaPath(runId)}`)
	return meta
}

function cmdline(pid: number) {
	try {
		return readFileSync(`/proc/${pid}/cmdline`, "utf8").replaceAll("\0", " ").trim()
	} catch {
		return ""
	}
}

function processCwd(pid: number) {
	try {
		return realpathSync(`/proc/${pid}/cwd`)
	} catch {
		return ""
	}
}

function foreignDevServers(ourPid: number | null): number[] {
	const conflicts: number[] = []
	let entries: string[] = []
	try {
		entries = readdirSync("/proc")
	} catch {
		return conflicts
	}
	for (const entry of entries) {
		if (!/^\d+$/.test(entry)) continue
		const pid = Number(entry)
		if (ourPid !== null && pid === ourPid) continue
		const command = cmdline(pid)
		if (!command.includes("vite") && !command.includes(" dev")) continue
		if (processCwd(pid) !== repoRoot) continue
		if (ourPid !== null && sameGroup(pid, ourPid)) continue
		conflicts.push(pid)
	}
	return conflicts
}

function sameGroup(pid: number, leader: number) {
	try {
		const stat = readFileSync(`/proc/${pid}/stat`, "utf8")
		const rest = stat.slice(stat.lastIndexOf(")") + 2).split(" ")
		return rest[2] === String(leader)
	} catch {
		return false
	}
}

async function reservePort() {
	for (let port = 4180; port < 4280; port += 1) {
		const free = await new Promise<boolean>(resolveFree => {
			const server = createServer()
			server.once("error", () => resolveFree(false))
			server.listen(port, "127.0.0.1", () => {
				server.close(() => resolveFree(true))
			})
		})
		if (free) return port
	}
	fail("No free verification port in 4180-4279.")
}

async function waitUntilReady(meta: RunMeta, child: ChildProcess) {
	const deadline = Date.now() + 120_000
	while (Date.now() < deadline) {
		if (child.exitCode !== null) {
			fail(`Dev server exited with code ${child.exitCode}. See ${meta.logPath}`)
		}
		try {
			const response = await fetch(meta.baseUrl, { redirect: "follow" })
			const html = await response.text()
			if (response.ok && html.includes(SITE_TITLE)) return
		} catch {
			// Server is still booting.
		}
		await sleep(500)
	}
	fail(`Dev server did not become ready within 120s. See ${meta.logPath}`)
}

async function launch() {
	const existing = liveRuns()
	if (existing.length > 0) {
		const ids = existing.map(run => run.runId).join(", ")
		fail(
			`A verification server is already running for this checkout (${ids}). Clean it up before launching another.`,
		)
	}
	const outsiders = foreignDevServers(null)
	if (outsiders.length > 0) {
		fail(
			`Refusing to start a second Vite server in ${repoRoot}. Live dev pid(s): ${outsiders.join(", ")}.`,
		)
	}

	const runId = process.env.VERIFY_RUN_ID ?? `${Date.now()}`
	const port = await reservePort()
	const dir = runDir(runId)
	mkdirSync(dir, { recursive: true })
	const logPath = join(dir, "server.log")
	const meta: RunMeta = {
		runId,
		pid: 0,
		port,
		baseUrl: `http://127.0.0.1:${port}`,
		logPath,
		repoRoot,
		gitRevision: gitRevision(),
		startedAt: new Date().toISOString(),
	}

	const logFd = openSync(logPath, "a")
	const child = spawn(
		process.execPath,
		["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)],
		{
			cwd: repoRoot,
			detached: true,
			env: { ...process.env, ...serverEnv },
			stdio: ["ignore", logFd, logFd],
		},
	)
	child.unref()
	closeSync(logFd)
	if (!child.pid) fail("Failed to spawn the dev server.")
	meta.pid = child.pid
	writeFileSync(metaPath(runId), JSON.stringify(meta, null, 2))
	writeFileSync(latestPath, runId)
	await waitUntilReady(meta, child)
	console.log(`runId=${meta.runId}`)
	console.log(`baseUrl=${meta.baseUrl}`)
	console.log(`pid=${meta.pid}`)
	console.log(`log=${meta.logPath}`)
	console.log(`git=${meta.gitRevision}`)
	console.log("ready=yes")
}

function listeningInodes(port: number) {
	const hexPort = port.toString(16).toUpperCase().padStart(4, "0")
	const inodes: string[] = []
	for (const file of ["/proc/net/tcp", "/proc/net/tcp6"]) {
		if (!existsSync(file)) continue
		const lines = readFileSync(file, "utf8").split("\n").slice(1)
		for (const line of lines) {
			const parts = line.trim().split(/\s+/)
			const local = parts[1]
			const state = parts[3]
			const inode = parts[9]
			if (!local || state !== "0A" || !inode) continue
			if (local.toUpperCase().endsWith(`:${hexPort}`)) inodes.push(inode)
		}
	}
	return inodes
}

function processTree(pid: number) {
	const seen = new Set<number>()
	const stack = [pid]
	while (stack.length > 0) {
		const current = stack.pop()
		if (current === undefined || seen.has(current)) continue
		seen.add(current)
		const childrenPath = `/proc/${current}/task/${current}/children`
		if (!existsSync(childrenPath)) continue
		const children = readFileSync(childrenPath, "utf8").trim().split(/\s+/).filter(Boolean)
		for (const child of children) stack.push(Number(child))
	}
	return seen
}

function ownsListenPort(pid: number, port: number) {
	const inodes = new Set(listeningInodes(port))
	if (inodes.size === 0) return false
	for (const candidate of processTree(pid)) {
		const fdDir = `/proc/${candidate}/fd`
		if (!existsSync(fdDir)) continue
		let fds: string[] = []
		try {
			fds = readdirSync(fdDir)
		} catch {
			continue
		}
		for (const fd of fds) {
			try {
				const target = readlinkSync(join(fdDir, fd))
				const match = /^socket:\[(\d+)\]$/.exec(target)
				if (match?.[1] && inodes.has(match[1])) return true
			} catch {
				// fd disappeared
			}
		}
	}
	return false
}

async function doctor() {
	const meta = loadMeta()
	const problems: string[] = []
	if (!isAlive(meta.pid)) problems.push(`pid ${meta.pid} is not running`)
	if (meta.repoRoot !== repoRoot) problems.push(`meta repo ${meta.repoRoot} is not ${repoRoot}`)
	if (isAlive(meta.pid) && !ownsListenPort(meta.pid, meta.port)) {
		problems.push(`pid ${meta.pid} does not listen on ${meta.baseUrl}`)
	}
	let title = ""
	try {
		const response = await fetch(meta.baseUrl)
		const html = await response.text()
		const matched = /<title>([^<]*)<\/title>/.exec(html)
		title = matched?.[1] ?? ""
		if (!response.ok) problems.push(`GET / returned ${response.status}`)
		if (!html.includes(SITE_TITLE)) problems.push(`response body is missing ${SITE_TITLE}`)
	} catch (error) {
		const message = error instanceof Error ? error.message : "fetch failed"
		problems.push(message)
	}
	console.log(`runId=${meta.runId}`)
	console.log(`baseUrl=${meta.baseUrl}`)
	console.log(`pid=${meta.pid}`)
	console.log(`portOwned=${ownsListenPort(meta.pid, meta.port)}`)
	console.log(`title=${title}`)
	console.log(`git=${meta.gitRevision}`)
	console.log(`log=${meta.logPath}`)
	console.log(`emailMock=${serverEnv.E2E_MOCK_EMAIL}`)
	if (problems.length > 0) {
		for (const problem of problems) console.log(`problem=${problem}`)
		process.exit(1)
	}
	console.log("healthy=yes")
}

function killRun(meta: RunMeta) {
	if (isAlive(meta.pid)) {
		try {
			process.kill(-meta.pid, "SIGTERM")
		} catch {
			try {
				process.kill(meta.pid, "SIGTERM")
			} catch {
				// already gone
			}
		}
	}
}

function cleanup() {
	const runId = process.env.VERIFY_RUN_ID
	const targets = runId ? [runId] : liveRuns().map(run => run.runId)
	if (!runId && existsSync(latestPath)) {
		const latest = readFileSync(latestPath, "utf8").trim()
		if (!targets.includes(latest)) targets.push(latest)
	}
	if (targets.length === 0) {
		console.log("cleanup=nothing-to-stop")
		return
	}
	for (const id of targets) {
		const meta = readMetaFile(metaPath(id))
		if (meta) killRun(meta)
		rmSync(runDir(id), { recursive: true, force: true })
		console.log(`stopped=${id}`)
	}
	if (existsSync(latestPath)) {
		const latest = readFileSync(latestPath, "utf8").trim()
		if (!existsSync(runDir(latest))) rmSync(latestPath, { force: true })
	}
	console.log("evidenceKept=/opt/cursor/artifacts/verify-cod-zombies")
}

function parseFeature(value: string | undefined): Feature {
	switch (value) {
		case "main-quests":
		case "side-quests":
		case "relics":
		case "bestiary":
		case "maps":
			return value
		default:
			fail(`drive requires one of: ${FEATURES.join(", ")}`)
	}
}

async function openPage(baseUrl: string) {
	const browser = await chromium.launch({
		channel: "chrome",
		chromiumSandbox: false,
		args: ["--disable-dev-shm-usage"],
	})
	const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
	await context.addInitScript(() => {
		localStorage.setItem(
			"react-scan-options",
			JSON.stringify({ enabled: false, showToolbar: false, showFPS: false }),
		)
	})
	const page = await context.newPage()
	page.setDefaultTimeout(20_000)
	page.setDefaultNavigationTimeout(45_000)
	await page.goto(baseUrl, { waitUntil: "domcontentloaded" })
	await page.getByRole("heading", { name: /Unlock the Secrets of/ }).waitFor()
	return { browser, page }
}

function featureDir(root: string, feature: Feature) {
	const dir = join(root, feature)
	mkdirSync(dir, { recursive: true })
	return dir
}

function logStep(dir: string, line: string) {
	console.log(line)
	writeFileSync(join(dir, "steps.log"), `${line}\n`, { flag: "a" })
}

async function hideDevOverlays(page: Page) {
	await page.evaluate(() => {
		const overlays = document.querySelectorAll(
			"[data-react-scan], #react-scan-toolbar-root, #react-scan-root",
		)
		overlays.forEach(node => {
			node.remove()
		})
		document.querySelectorAll("canvas").forEach(canvas => {
			if (canvas.style.position === "fixed") canvas.remove()
		})
	})
}

async function shot(page: Page, dir: string, name: string) {
	await hideDevOverlays(page)
	const path = join(dir, name)
	await page.screenshot({ path, fullPage: false })
	logStep(dir, `screenshot=${path}`)
	return path
}

async function snapshot(page: Page, dir: string, name: string) {
	await hideDevOverlays(page)
	const path = join(dir, name)
	const body = await page.locator("body").ariaSnapshot()
	writeFileSync(path, body)
	logStep(dir, `aria=${path}`)
	return path
}

async function clickLink(page: Page, name: string | RegExp) {
	await page.getByRole("link", { name }).click()
}

async function goHome(page: Page) {
	await page.getByRole("link", { name: "Go to Home Page" }).first().click()
	await page.getByRole("heading", { name: /Unlock the Secrets of/ }).waitFor()
}

/** Server HTML accepts the click, but the list opens only after React attaches. */
async function waitForHydratedCombobox(page: Page, placeholder: string) {
	await page.waitForFunction(name => {
		const inputs = document.querySelectorAll("input[role='combobox']")
		for (const input of inputs) {
			if (!(input instanceof HTMLInputElement)) continue
			if (input.placeholder !== name && input.getAttribute("aria-label") !== name) continue
			return Object.keys(input).some(key => key.startsWith("__react"))
		}
		return false
	}, placeholder)
}

async function chooseFilter(page: Page, placeholder: string, optionName: string) {
	await waitForHydratedCombobox(page, placeholder)
	const box = page.getByRole("combobox", { name: placeholder })
	const item = page.locator('[data-slot="combobox-item"]').getByText(optionName, { exact: true })
	await box.click()
	try {
		await item.waitFor({ state: "visible", timeout: 2_000 })
	} catch {
		await box.click()
		await item.waitFor({ state: "visible" })
	}
	await item.click()
	await page.keyboard.press("Escape")
}

async function chooseSelect(page: Page, triggerText: string, optionName: string) {
	await page.locator('[data-slot="select-trigger"]').filter({ hasText: triggerText }).first().click()
	await page.locator('[data-slot="select-item"]').filter({ hasText: optionName }).first().click()
	await page.keyboard.press("Escape")
}

function viewAllForHeading(page: Page, heading: string): Locator {
	return page
		.getByRole("heading", { name: heading, exact: true })
		.locator("..")
		.getByRole("link", { name: "View All" })
}

async function driveMainQuests(page: Page, dir: string) {
	logStep(dir, "entry=header-nav")
	await shot(page, dir, "01-home.png")
	await clickLink(page, "Go to Main Quests page")
	await page.getByRole("heading", { name: "Main Quests", exact: true }).waitFor()
	await shot(page, dir, "02-main-quests-nav.png")
	logStep(dir, `url=${page.url()}`)

	logStep(dir, "entry=home-view-all")
	await goHome(page)
	await viewAllForHeading(page, "Main Quests").click()
	await page.getByRole("heading", { name: "Main Quests", exact: true }).waitFor()
	logStep(dir, `url=${page.url()}`)

	logStep(dir, "entry=mobile-nav")
	await goHome(page)
	await page.setViewportSize({ width: 390, height: 844 })
	await page.getByRole("button", { name: "Toggle Nav" }).click()
	await clickLink(page, "Navigate to Main Quests page")
	await page.getByRole("heading", { name: "Main Quests", exact: true }).waitFor()
	await shot(page, dir, "03-main-quests-mobile.png")
	await page.setViewportSize({ width: 1280, height: 900 })

	logStep(dir, "entry=search")
	await goHome(page)
	await page.getByRole("button", { name: /^Search/ }).click()
	await page.getByPlaceholder("Search quests, relics, zombies, maps").fill("Totenreich")
	await page.getByRole("option", { name: "Totenreich", exact: true }).click()
	await page.waitForURL(/\/main-quests\/black-ops-7\/totenreich/)
	await page.getByRole("heading", { name: "Totenreich", exact: true }).waitFor()
	await shot(page, dir, "04-search-totenreich.png")
	logStep(dir, `url=${page.url()}`)

	logStep(dir, "entry=filter-and-open-guide")
	await clickLink(page, "Go to Main Quests page")
	await page.getByRole("heading", { name: "Main Quests", exact: true }).waitFor()
	await chooseFilter(page, "Filter: Game, Difficulty, Completion Time", "Black Ops 7")
	await page.getByLabel("Black Ops 7").waitFor()
	await page.waitForURL(/game=.*black-ops-7/)
	await chooseSelect(page, "Latest", "Oldest")
	await page.waitForURL(/sort=.*oldest/)
	await shot(page, dir, "05-filtered.png")
	await clickLink(page, "View Guide for Totenreich")
	await page.waitForURL(/\/main-quests\/black-ops-7\/totenreich/)
	await page.getByRole("heading", { name: "Totenreich", exact: true }).waitFor()
	await shot(page, dir, "06-guide.png")
	await snapshot(page, dir, "06-guide.aria.txt")
	const title = await page.title()
	if (!title.includes("Totenreich Main Quest")) {
		fail(`Guide title was ${title}`)
	}
	logStep(dir, `title=${title}`)
	logStep(dir, "result=main-quests-ok")
}

async function driveSideQuests(page: Page, dir: string) {
	logStep(dir, "entry=header-nav")
	await clickLink(page, "Go to Side Quests page")
	await page.getByRole("heading", { name: "Side Quests", exact: true }).waitFor()
	await shot(page, dir, "01-listing.png")
	logStep(dir, `url=${page.url()}`)
	logStep(dir, "entry=filter")
	await chooseFilter(page, "Filter: Game or Map", "Black Ops 3")
	await page.getByLabel("Black Ops 3").waitFor()
	await page.waitForURL(/game=.*black-ops-3/)
	logStep(dir, "entry=sort-oldest")
	await chooseSelect(page, "Latest", "Oldest")
	await page.waitForURL(/sort=.*oldest/)
	logStep(dir, `url=${page.url()}`)
	logStep(dir, "entry=open-guide")
	await clickLink(page, "View Guide for Free 500 Points")
	await page.waitForURL(/\/side-quests\/black-ops-3\/shadows-of-evil\/free-500-points/)
	await page.getByRole("heading", { name: "Free 500 Points", exact: true }).first().waitFor()
	await shot(page, dir, "02-guide.png")
	await snapshot(page, dir, "02-guide.aria.txt")
	logStep(dir, `url=${page.url()}`)
	logStep(dir, "result=side-quests-ok")
}

function typeSearchValues(url: URL): string[] | null {
	const raw = url.searchParams.get("type")
	if (raw == null) return null

	try {
		const parsed: unknown = JSON.parse(raw)
		if (!Array.isArray(parsed) || !parsed.every(item => typeof item === "string")) return null

		return parsed
	} catch {
		return null
	}
}

function typeSearchIncludes(url: URL, expected: readonly string[]) {
	const values = typeSearchValues(url)
	if (!values || values.length !== expected.length) return false

	return expected.every(value => values.includes(value))
}

async function driveRelics(page: Page, dir: string) {
	logStep(dir, "entry=header-nav")
	await clickLink(page, "Go to Relics page")
	await page.getByRole("heading", { name: "Cursed Relics", exact: true }).waitFor()
	await shot(page, dir, "01-listing.png")
	logStep(dir, `url=${page.url()}`)
	logStep(dir, "entry=filter-special")
	await chooseFilter(page, "Filter: Map, Type", "Special")
	await page.getByLabel("Special").waitFor()
	await page.waitForURL(url => typeSearchIncludes(url, ["special"]))
	await page.getByRole("link", { name: "View Guide for the Mister Peeks Mayhem relic" }).waitFor()
	await shot(page, dir, "02-special.png")
	await snapshot(page, dir, "02-special.aria.txt")
	logStep(dir, `url=${page.url()}`)
	logStep(dir, "entry=filter-special-and-grim")
	await chooseFilter(page, "Filter: Map, Type", "Grim")
	await page.getByLabel("Grim").waitFor()
	await page.waitForURL(url => typeSearchIncludes(url, ["grim", "special"]))
	await shot(page, dir, "03-combined.png")
	logStep(dir, `url=${page.url()}`)
	logStep(dir, "entry=filter-type")
	await chooseFilter(page, "Filter: Map, Type", "Special")
	await page.getByLabel("Grim").waitFor()
	await page.waitForURL(url => typeSearchIncludes(url, ["grim"]))
	logStep(dir, `url=${page.url()}`)
	logStep(dir, "entry=open-guide")
	await clickLink(page, "View Guide for the Lawyer's Pen relic")
	await page.waitForURL(/\/relics\/black-ops-7\/lawyers-pen/)
	await page.getByRole("heading", { name: "Lawyer's Pen", exact: true }).waitFor()
	await shot(page, dir, "04-guide.png")
	await snapshot(page, dir, "04-guide.aria.txt")
	logStep(dir, `url=${page.url()}`)
	logStep(dir, "result=relics-ok")
}

async function driveBestiary(page: Page, dir: string) {
	logStep(dir, "entry=header-nav")
	await clickLink(page, "Go to Bestiary page")
	await page.getByRole("heading", { name: "Bestiary", exact: true }).waitFor()
	await shot(page, dir, "01-listing.png")
	logStep(dir, `url=${page.url()}`)
	logStep(dir, "entry=filter-boss")
	await chooseFilter(page, "Filter: Type, Game, Map, or Weakness", "Boss")
	await page.getByLabel("Boss").waitFor()
	await page.waitForURL(/type=.*boss/)
	logStep(dir, "entry=sort-oldest")
	await chooseSelect(page, "Latest", "Oldest")
	await page.waitForURL(/sort=.*oldest/)
	await shot(page, dir, "02-filtered.png")
	logStep(dir, `url=${page.url()}`)
	logStep(dir, "entry=open-detail")
	await clickLink(page, "View details for Avogadro")
	await page.waitForURL(/\/bestiary\/avogadro/)
	await page.getByText("Avogadro", { exact: true }).first().waitFor()
	await shot(page, dir, "03-detail.png")
	await snapshot(page, dir, "03-detail.aria.txt")
	logStep(dir, `url=${page.url()}`)
	logStep(dir, "result=bestiary-ok")
}

async function driveMaps(page: Page, dir: string) {
	logStep(dir, "entry=header-nav")
	await clickLink(page, "Go to Maps page")
	await page.getByRole("heading", { name: "Interactive Maps", exact: true }).waitFor()
	await shot(page, dir, "01-listing.png")
	logStep(dir, `url=${page.url()}`)
	logStep(dir, "entry=filter-game")
	await chooseFilter(page, "Filter: Game", "Black Ops 6")
	await page.getByLabel("Black Ops 6").waitFor()
	await page.waitForURL(/game=.*black-ops-6/)
	logStep(dir, `url=${page.url()}`)
	logStep(dir, "entry=open-terminus")
	await clickLink(page, "View Terminus interactive map")
	await page.waitForURL(/\/maps\/terminus/)
	await page.getByRole("button", { name: "Hide All Markers" }).waitFor()
	await shot(page, dir, "02-terminus.png")
	logStep(dir, "entry=toggle-markers")
	await page.getByRole("button", { name: "Hide All Markers" }).click()
	await page.waitForURL(/exclude=/)
	await page.getByRole("button", { name: "Show All Markers" }).click()
	await page.waitForURL(url => !url.toString().includes("exclude="))
	logStep(dir, "entry=switch-layer")
	await page.goto(`${new URL(page.url()).origin}/maps/totenreich`, { waitUntil: "domcontentloaded" })
	await page.getByRole("button", { name: "Hide All Markers" }).waitFor()
	await chooseSelect(page, "Eidskallen", "Boss Fight Arena")
	await page.waitForURL(/layer=.*boss-fight-arena/)
	await page.getByText("Current Layer").waitFor()
	await shot(page, dir, "03-totenreich-layer.png")
	await snapshot(page, dir, "03-totenreich-layer.aria.txt")
	logStep(dir, `url=${page.url()}`)
	logStep(dir, "result=maps-ok")
}

async function drive(feature: Feature) {
	const meta = loadMeta()
	if (!isAlive(meta.pid) || !ownsListenPort(meta.pid, meta.port)) {
		fail(`Run ${meta.runId} is not healthy. Run doctor before drive.`)
	}
	const dir = featureDir(evidenceDir(meta.runId), feature)
	rmSync(dir, { recursive: true, force: true })
	mkdirSync(dir, { recursive: true })
	writeFileSync(join(dir, "steps.log"), "")
	logStep(dir, `feature=${feature}`)
	logStep(dir, `baseUrl=${meta.baseUrl}`)
	const session = await openPage(meta.baseUrl)
	let failure: string | null = null
	try {
		switch (feature) {
			case "main-quests":
				await driveMainQuests(session.page, dir)
				break
			case "side-quests":
				await driveSideQuests(session.page, dir)
				break
			case "relics":
				await driveRelics(session.page, dir)
				break
			case "bestiary":
				await driveBestiary(session.page, dir)
				break
			case "maps":
				await driveMaps(session.page, dir)
				break
			default: {
				const unreachable: never = feature
				failure = `Unhandled feature ${unreachable}`
			}
		}
	} catch (error) {
		failure = error instanceof Error ? error.message : "drive failed"
		await shot(session.page, dir, "failure.png").catch(() => undefined)
		await snapshot(session.page, dir, "failure.aria.txt").catch(() => undefined)
		logStep(dir, `error=${failure}`)
	} finally {
		await session.browser.close()
	}
	if (failure) fail(failure)
	console.log(`evidence=${dir}`)
}

function parseCommand(value: string | undefined): CommandName {
	switch (value) {
		case "launch":
		case "doctor":
		case "drive":
		case "cleanup":
			return value
		default:
			fail(
				"Usage: codz-verify.ts <launch|doctor|drive|cleanup> [main-quests|side-quests|relics|bestiary|maps]",
			)
	}
}

const command = parseCommand(process.argv[2])
switch (command) {
	case "launch":
		await launch()
		break
	case "doctor":
		await doctor()
		break
	case "drive":
		await drive(parseFeature(process.argv[3]))
		break
	case "cleanup":
		cleanup()
		break
	default: {
		const unreachable: never = command
		fail(`Unhandled command ${unreachable}`)
	}
}
