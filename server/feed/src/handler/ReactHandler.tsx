import { ContentFileProvider } from '@content-ui/react/ContentFileContext'
import { ContentLeafsProvider, ContentRendererMemo } from '@content-ui/react/ContentLeafsContext'
import { ContentParser } from '@content-ui/md/parser/ContentParser'
import { ViewerBoxRouter } from '@content-ui/md-mui/ViewerBoxRouter'
import { renderMapping } from '@content-ui/md-mui/LeafsMarkdown'
import { Express } from 'express'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { VFile } from 'vfile'

// todo: this demo now works, with mui@7, but still needs type: "module" in md-mui,
//       which wouldn't be mui@5 compatible and thus must wait
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
                <ContentLeafsProvider Renderer={ContentRendererMemo} renderMap={renderMapping}>
                    <ContentFileProvider
                        root={root}
                        file={file}
                    >
                        <ViewerBoxRouter
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
