import { Express } from 'express'
import { renderToStaticMarkup } from 'react-dom/server'
import { DemoAutomatic } from '../tui/PageDemoDecoratorBasic.js'

export const tacticHandler = (app: Express) => {
    app.get('/tactic', async(req, res) => {
        // a test rendering of just `tactic-ui`
        const html = renderToStaticMarkup(
            <DemoAutomatic/>,
        )
        return res.send(html)
    })
}
