import { ContentParserExtended } from '@content-ui/md/parser/ContentParserExtended'
import { ContentSelectionProvider } from '@content-ui/react/ContentSelectionContext'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import IcVisibility from '@mui/icons-material/Visibility'
import IcVisibilityOff from '@mui/icons-material/VisibilityOff'
import { useTheme } from '@mui/material/styles'
import React, { useState } from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import Grid2 from '@mui/material/Unstable_Grid2'
import { ContentInput } from '@content-ui/input/ContentInput'
import { CustomCodeMirror, getHighlight } from '../components/CustomCodeMirror'
import Box from '@mui/material/Box'
import { ViewerBoxRouter } from '@content-ui/md-mui/ViewerBoxRouter'
import { SettingsProvider } from '@content-ui/react/LeafSettings'
import { useContentEditor } from '@content-ui/input/useContentEditor'
import { useContent } from '@content-ui/react/useContent'
import { ContentFileProvider } from '@content-ui/react/ContentFileContext'

const md = `# About a Note

> **About a note** is a *note* __about a note__.

Markdown editor with preview!

## Table of content

> Intro for auto generated block.

## Content

Some note with some content.

- with some lists
- and more *list items*
- [ ] item 1
- [x] task 2
- [ ] task 3
- list end

## More Content

With even more sentences, words and other things.

| Time | Name | Score |
| ---- | ---- | ----: |
| 8am  | Morning | 10 |
| 12am | Noon | 40 |
| 6pm  | Evening | 20 |
| 10pm | Night | 30 |

`

export const PageInput: React.ComponentType = () => {
    const {t} = useTranslation('translation')
    const [value, setValue] = React.useState(md)
    const {breakpoints} = useTheme()
    const isMediumScreen = useMediaQuery(breakpoints.up('md'))
    const {
        textValue,
        handleOnChange,
        editorSelection,
        bigSize, autoProcess, setAutoProcess,
    } = useContentEditor(
        typeof value === 'string' ? value : '',
        setValue,
    )
    const {processing, outdated, root, file, stringify} = useContent({
        textValue,
        // for direct preview, the parseDelay should be as low as possible,
        // with disabled preview it's better to use `600` for less unnecessary processing
        parseDelay:
            textValue.length > 10000 ? 460 :
                textValue.length > 1200 ? 160 :
                    textValue.length > 3500 ? 280 :
                        40,
        autoProcess,
        onMount: false,
        processor: ContentParserExtended,
    })

    const extensions = React.useMemo(() => {
        const highlight = getHighlight('md')
        return [
            ...(highlight ? [highlight] : []),
        ]
    }, [])

    const [showAst, setShowAst] = useState(false)

    return <>
        <Helmet>
            <title>{t('brand')} · Content-UI</title>
        </Helmet>

        <Box p={1} sx={{overflow: 'auto', display: 'flex', flexDirection: 'column'}}>
            <ContentFileProvider
                root={root}
                file={file}
            >
                <ContentSelectionProvider
                    selection={editorSelection}
                >
                    <SettingsProvider
                        followEditor={isMediumScreen}
                        headlineLinkable
                        headlineSelectable
                        headlineSelectableOnHover
                        // linkAnchorToHref={anchor => window.location.pathname + anchor}
                    >
                        <Grid2 container spacing={2} sx={{overflow: 'auto', flexWrap: {xs: 'wrap', md: 'nowrap'}}}>
                            <Grid2 xs={12} md={6} sx={{overflow: 'auto', scrollbarWidth: 'thin', maxHeight: {md: '100%'}}}>
                                <ContentInput
                                    CodeMirror={CustomCodeMirror}
                                    ViewerBox={ViewerBoxRouter}
                                    onChange={handleOnChange}
                                    extensions={extensions}
                                    textValue={textValue}
                                    bigSize={bigSize}
                                    processing={processing}
                                    outdated={outdated}
                                    autoProcess={autoProcess}
                                    setAutoProcess={setAutoProcess}
                                    onReformat={stringify ? () => setValue(stringify?.() || '') : undefined}
                                />
                            </Grid2>
                            <Grid2
                                xs={12} md={6}
                                sx={{
                                    overflowY: 'auto',
                                    scrollbarWidth: 'thin',
                                    maxHeight: {md: '100%'},
                                    // viewer with bigger paddings for headline buttons
                                    px: {md: 2, lg: 3},
                                    backgroundColor: 'background.paper',
                                }}
                            >
                                <ViewerBoxRouter
                                    outdated={outdated}
                                    processing={processing}
                                />
                                <Button
                                    startIcon={showAst ? <IcVisibilityOff/> : <IcVisibility/>}
                                    onClick={() => setShowAst(s => !s)}
                                    variant={'outlined'}
                                    sx={{mt: 2, mb: 1}}
                                >
                                    {'AST'}
                                </Button>
                                {showAst ?
                                    <CustomCodeMirror
                                        value={JSON.stringify(root || null, undefined, 4)}
                                        lang={'json'}
                                    /> : null}
                            </Grid2>
                        </Grid2>
                    </SettingsProvider>
                </ContentSelectionProvider>
            </ContentFileProvider>
        </Box>
    </>
}
