import { ContentParser } from '@content-ui/md/parser/ContentParser'
import Paper from '@mui/material/Paper'
import React from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import Container from '@mui/material/Container'
import Grid2 from '@mui/material/Unstable_Grid2'
import { ViewerBoxRouter } from '@content-ui/md-mui/ViewerBoxRouter'
import { ViewerFromText } from '@content-ui/react/ViewerFromText'

const md = `# Content-UI Demo

Lorem ipsum dolor sit amet...

Hey there this is some content, rendered from Markdown as ReactJS components using MUI.

Some code: \`var some = true\`.

> Blockquotes :+1:
>
> With multiple rows and a link [to the *input page*](/input).

---

> ⚠️ Warning Note: Experimental ⚗️

Last line in text.
`

export const PageHome: React.ComponentType = () => {
    const {t} = useTranslation('translation')
    return <>
        <Helmet>
            <title>{t('brand')} · Content-UI</title>
        </Helmet>

        <Container maxWidth={'lg'} fixed>
            <Grid2 container spacing={2}>
                <Grid2 xs={12} md={8} mdOffset={2}>
                    <Paper sx={{px: 1.5, py: 1}}>
                        <ViewerFromText
                            Viewer={ViewerBoxRouter}
                            processor={ContentParser}
                            textValue={md}
                            onMount
                        />
                    </Paper>
                </Grid2>
            </Grid2>
        </Container>
    </>
}
