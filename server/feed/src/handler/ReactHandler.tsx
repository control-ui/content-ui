import { Viewer } from '@content-ui/md-mui/Viewer'
import { ContentParser } from '@content-ui/md/parser/ContentParser'
import { ContentFileProvider } from '@content-ui/react/ContentFileProvider'
import { ContentLeafsProvider, contentUIDecorators } from '@content-ui/react/ContentLeaf'
import { Express } from 'express'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { VFile } from 'vfile'
import { contentUIMapping } from '../../../../apps/demo/src/components/ContentUI.js'

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
                <ContentLeafsProvider deco={contentUIDecorators} renderMap={contentUIMapping}>
                    <ContentFileProvider
                        root={root}
                        file={file}
                    >
                        <Viewer
                            editorSelection={undefined}
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
