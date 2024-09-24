import { Express } from 'express'
import util from 'util'
import fs from 'fs'
import path from 'path'

const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)

export const contentHandler = (app: Express, folder: string) => {

    app.get('/contents', async(req, res) => {
        const files = await readdir(folder, {withFileTypes: true})
        return res.send({
            files: files
                .filter(file => file.name.endsWith('.md'))
                .map(file => ({
                    name: file.name.slice(0, -3),
                })),
        })
    })

    app.get('/contents/:contentId', async(req, res) => {
        const contentId = req.params.contentId
        try {
            const file = await readFile(path.join(folder, contentId + '.md'))
            return res.send({
                file: file.toString('utf8'),
            })
        } catch(e) {
            return res.status(404).send({
                error: 'Missing content file',
            })
        }
    })
}
