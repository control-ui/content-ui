import fs from 'fs/promises'
import path from 'path'

const packages = [
    { name: 'struct', dir: 'dist/struct' },
    { name: 'md', dir: 'dist/md' },
    { name: 'react', dir: 'dist/react' },
    { name: 'md-mui', dir: 'dist/md-mui', stripType: true },
    { name: 'input', dir: 'dist/input', stripType: true },
]

const licenseSource = 'LICENSE'

for (const pkg of packages) {
    const licenseDest = path.join(pkg.dir, 'LICENSE')
    try {
        await fs.copyFile(licenseSource, licenseDest)
        console.log(`Copied LICENSE to ${pkg.dir}`)
    } catch (error) {
        console.error(`Error copying LICENSE to ${licenseDest}:`, error)
        throw error
    }

    const packageJsonPath = path.join(pkg.dir, 'package.json')
    try {
        const data = await fs.readFile(packageJsonPath, 'utf8')
        const packageJson = JSON.parse(data)

        let modified = false
        if (pkg.stripType && packageJson.type) {
            delete packageJson.type
            modified = true
        }

        if (modified) {
            await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 4) + '\n')
            console.log(`Updated manifest for ${pkg.name}`)
        }
    } catch (error) {
        console.error(`Error processing ${packageJsonPath}:`, error)
        throw error
    }
}
