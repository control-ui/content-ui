import express from 'express'
import process from 'process'
import { routes } from './routes.js'

const app = express()
app.disable('x-powered-by')
app.disable('etag')
//
// app.use(express.static(path.join(__dirname), {
//     index: false,
//     maxAge: 3600 * 24 * 3,
//     etag: false,
// }))

app.use(function corsMiddleware(_req: express.Request, res: express.Response, next: () => void) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE, HEAD, OPTIONS')
    res.header('Access-Control-Allow-Headers', [
        'Content-Type',
        'Cache-Control',
        'Origin',
        'Accept',
        'Authorization',
        'Audience',
        'X-Performance',
    ].join(', '))
    res.header('Access-Control-Expose-Headers', [
        'X-Performance',
    ].join(', '))

    next()
})

routes(app)

const server = app.listen(process.env.PORT || 80, () => {
    console.log('server: listening on port ' + (process.env.PORT || 80))
})

const shutdown = function() {
    console.log('server: closing')
    server.close(() => {
        console.log('server: closed')
        process.exit()
    })
}

let closing = false
const registerShutdown = (event: string) => {
    process.on(event, () => {
        if(closing) return
        closing = true
        console.debug('[' + event + '] process termination signal')
        shutdown()
    })
}

registerShutdown('SIGINT')
registerShutdown('SIGTERM')
registerShutdown('SIGHUP')
registerShutdown('SIGQUIT')

