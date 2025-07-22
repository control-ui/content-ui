import fs from 'fs/promises'
import path from 'path'

const packages = [
    {path: 'dist/input'},
    {path: 'dist/md-mui'},
]

for(const pkg of packages) {
    const packageJsonPath = path.join(pkg.path, 'package.json')
    try {
        const data = await fs.readFile(packageJsonPath, 'utf8').then(b => b.toString())
        const packageJson = JSON.parse(data)

        if(packageJson.type) {
            delete packageJson.type
            await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 4) + '\n')
        }
    } catch(error) {
        console.error(`Error processing ${packageJsonPath}:`, error)
        throw error
    }
}
