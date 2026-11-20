import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'node:fs/promises'
import path from 'node:path'

const execAsync = promisify(exec)

const DEFAULT_PACKAGES = [
    'dist/struct',
    'dist/md',
    'dist/react',
    'dist/md-mui',
    'dist/input',
]

const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run') || args.includes('-d')
const targetFolders = args.filter(arg => !arg.startsWith('-'))
const foldersToPublish = targetFolders.length > 0 ? targetFolders : DEFAULT_PACKAGES

console.log(`Starting publication process (dryRun=${isDryRun})...`)

async function getPublishedVersions(pkgName) {
    try {
        const { stdout } = await execAsync(`npm view ${pkgName} versions --json`)
        const parsed = JSON.parse(stdout.trim())
        return Array.isArray(parsed) ? parsed : [parsed]
    } catch (error) {
        const stdout = error.stdout || ''
        const stderr = error.stderr || ''
        const message = error.message || ''
        if (
            stderr.includes('E404') ||
            stderr.includes('404 Not Found') ||
            stdout.includes('E404') ||
            message.includes('E404')
        ) {
            return []
        }
        throw error
    }
}

async function publishPackage(folder) {
    const pkgJsonPath = path.resolve(folder, 'package.json')
    let pkgJson
    try {
        const content = await fs.readFile(pkgJsonPath, 'utf8')
        pkgJson = JSON.parse(content)
    } catch (err) {
        console.error(`Failed to read package.json at ${pkgJsonPath}:`, err.message)
        process.exit(1)
    }

    const { name, version } = pkgJson
    console.log(`\nChecking ${name}@${version} (${folder})...`)

    let publishedVersions = []
    try {
        publishedVersions = await getPublishedVersions(name)
    } catch (err) {
        console.error(`Failed to query npm registry for ${name}:`, err.stderr || err.message)
        process.exit(1)
    }

    if (publishedVersions.includes(version)) {
        console.log(`  > [skip] ${name}@${version} is already published`)
        return
    }

    const latest = publishedVersions.length > 0 ? publishedVersions[publishedVersions.length - 1] : 'none'
    console.log(`  > New version detected (latest on registry: ${latest})`)

    if (isDryRun) {
        console.log(`  > [dry-run] Would execute 'npm publish' in ${folder}`)
        return
    }

    console.log(`  > Publishing ${name}@${version}...`)
    try {
        const { stdout, stderr } = await execAsync('npm publish', { cwd: path.resolve(folder) })
        if (stdout) console.log(stdout.trim())
        if (stderr) console.error(stderr.trim())
        console.log(`  > Successfully published ${name}@${version}`)
    } catch (err) {
        console.error(`  > Failed to publish ${name}@${version}:`)
        if (err.stdout) console.error(err.stdout.trim())
        if (err.stderr) console.error(err.stderr.trim())
        console.error(err.message)
        process.exit(1)
    }
}

async function run() {
    for (const folder of foldersToPublish) {
        await publishPackage(folder)
    }
    console.log('\nPublish process completed successfully.')
}

run().catch(err => {
    console.error('Unexpected error during publishing:', err)
    process.exit(1)
})
