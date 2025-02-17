import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import { ViewerBoxRouter } from '@content-ui/md-mui/ViewerBoxRouter'
import { ViewerFromText } from '@content-ui/react/ViewerFromText'
import { ContentParser } from '@content-ui/md/parser/ContentParser'

const md = `# Content-UI Demo

Lorem ipsum dolor sit amet...

Hey there this is some content, rendered from Markdown as ReactJS components using MUI.

\`\`\`json
{
    "demo": true,
    "val": "test"
}
\`\`\`

Some code: \`var some = true\`.

> Blockquotes :+1:
>
> With multiple rows and a link [to the *input page*](/input).

Lorem ipsum __breaking **line**__.

---

> ⚠️ Warning Note: Experimental ⚗️

Last line in text.
`

export const PageHome = () => {
    return (
        <Container maxWidth={'lg'} fixed>
            <Paper sx={{px: 1.5, py: 1}}>
                <ViewerFromText
                    Viewer={ViewerBoxRouter}
                    processor={ContentParser}
                    textValue={md}
                    onMount
                />
            </Paper>
        </Container>
    )
}
