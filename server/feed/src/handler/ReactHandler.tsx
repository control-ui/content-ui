import { Viewer } from '@content-ui/md-mui/Viewer'
import { renderMapping } from '@content-ui/md-mui/LeafsMarkdown'
import { ContentParser } from '@content-ui/md/parser/ContentParser'
import { ContentFileProvider } from '@content-ui/react/ContentFileContext'
import { ContentLeafsProvider, contentUIDecorators } from '@content-ui/react/ContentLeafsContext'
import { Express } from 'express'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { VFile } from 'vfile'

export const reactHandler = (app: Express) => {
    app.get('/preview', async(req, res) => {
        const md = `# ReactJS Rendered Markdown

This is **rendered static on server**.
`
        const file = new VFile(md)
        const ast = ContentParser.parse(file)

        const {root} = await ContentParser
            .run(ast, file)
            .then((root) => {
                return {
                    root: root,
                    file: file,
                    toString: () => ContentParser.stringify(root, file) as string,
                }
            })

        const html = renderToStaticMarkup(
            <StaticRouter location={req.url}>
                <ContentLeafsProvider deco={contentUIDecorators} renderMap={renderMapping}>
                    <ContentFileProvider
                        root={root}
                        file={file}
                    >
                        <Viewer
                            outdated={false}
                            processing={'success'}
                        />
                    </ContentFileProvider>
                </ContentLeafsProvider>
            </StaticRouter>,
        )
        return res.send(html)
    })
}
