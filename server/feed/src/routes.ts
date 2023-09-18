import { Express } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { contentHandler } from './handler/ContentHandler.js'
import { tacticHandler } from './handler/TacticReactHandler.js'
// import { reactHandler } from './handler/ReactHandler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const routes = (app: Express) => {
    app.get('/', (req, res) => {
        return res.send({message: 'Feed API - a small markdown content example server'})
    })

    app.get('/ping', (req, res) => {
        return res.send({
            result: 'pong',
            now: new Date().toISOString(),
        })
    })

    contentHandler(app, path.join(__dirname, 'content'))
    // reactHandler(app)
    tacticHandler(app)

    app.get('/*', (req, res) => {
        return res.status(404).send({error: '404 Not Found'})
    })
}
