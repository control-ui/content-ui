import { Viewer } from '@content-ui/md-mui/Viewer'
import { ContentParser } from '@content-ui/md/parser/ContentParser'
import { parseTo } from '@content-ui/md/parser/ParseTo'
import { ContentFileProvider } from '@content-ui/react/ContentFileProvider'
import { ContentLeafsProvider, contentUIDecorators } from '@content-ui/react/ContentLeaf'
import { Express } from 'express'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { contentUIMapping } from '../../../../apps/demo/src/components/ContentUI.js'

export const reactHandler = (app: Express) => {
    app.get('/preview', async(req, res) => {
        const md = `# ReactJS Rendered Markdown

This is **rendered static on server**.
`
        const ast = await parseTo(md, ContentParser)
        const html = renderToStaticMarkup(
            <StaticRouter location={req.url}>
                <ContentLeafsProvider deco={contentUIDecorators} renderMap={contentUIMapping}>
                    <ContentFileProvider
                        root={ast.root}
                        file={ast.file}
                    >
                        <Viewer
                            editorSelection={undefined}
                            keepMounted
                            needsProcessing={false}
                        />
                    </ContentFileProvider>
                </ContentLeafsProvider>
            </StaticRouter>,
        )
        return res.send(html)
    })
}
