import React from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import Container from '@mui/material/Container'
import { ApiPing } from '../components/ApiPing'
import Grid2 from '@mui/material/Unstable_Grid2'
import { ViewerFromText } from '@content-ui/md-mui/Viewer'

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

> Blockqoutes on the go..
>
> With multiple rows and a link [to the *input page*](/input).

Lorem ipsum __breaking **line**__.

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
                <Grid2 xs={12} md={6} mdOffset={3}>
                    <ViewerFromText
                        textValue={md}
                        onMount
                    />
                </Grid2>
                <Grid2 xs={12} md={6} mdOffset={3}>
                    <ApiPing/>
                </Grid2>
            </Grid2>
        </Container>
    </>
}
