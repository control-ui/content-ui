import { ViewerBoxRouter } from '@content-ui/md-mui/ViewerBoxRouter'
import { ContentParser } from '@content-ui/md/parser/ContentParser'
import { ContentSelectionProvider } from '@content-ui/react/ContentSelectionContext'
import React from 'react'
import Grid from '@mui/material/Grid'
import { ContentInput } from '@content-ui/input/ContentInput'
import { CustomCodeMirror, getHighlight } from '../components/CustomCodeMirror.js'
import Box from '@mui/material/Box'
import { SettingsProvider } from '@content-ui/react/LeafSettings'
import { useContentEditor } from '@content-ui/input/useContentEditor'
import { useContent } from '@content-ui/react/useContent'
import { ContentFileProvider } from '@content-ui/react/ContentFileContext'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

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

| Time | Name |
| ---- | ---- |
| 8am  | Morning |
| 12am | Noon |
| 6pm  | Evening |
| 10pm | Night |

`

export const PageInput: React.ComponentType = () => {
    const [value, setValue] = React.useState(md)
    const {breakpoints} = useTheme()
    const isMediumScreen = useMediaQuery(breakpoints.up('md'))
    const {
        textValue,
        handleOnChange,
        editorSelection,
        bigSize,
        autoProcess,
        setAutoProcess,
    } = useContentEditor(typeof value === 'string' ? value : '', setValue)
    const {processing, outdated, root, file, stringify} = useContent({
        textValue,
        // with adaptiveDelay: true, the parseDelay marks the maximum it should respect
        parseDelay:
            textValue.length > 10000
                ? 560
                : 180,
        adaptiveDelay: true,
        autoProcess,
        onMount: true,
        processor: ContentParser,
    })

    const extensions = React.useMemo(() => {
        const highlight = getHighlight('md')
        return [...(highlight ? [highlight] : [])]
    }, [])

    return (
        <>
            <Box
                p={1}
                sx={{overflow: 'auto', display: 'flex', flexDirection: 'column'}}
            >
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
                        >
                            <Grid
                                container
                                spacing={2}
                                sx={{overflow: 'auto', flexWrap: {xs: 'wrap', md: 'nowrap'}}}
                            >
                                <Grid
                                    size={{xs: 12, md: 6}}
                                    sx={{
                                        overflow: 'auto',
                                        scrollbarWidth: 'thin',
                                        maxHeight: {md: '100%'},
                                    }}
                                >
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
                                </Grid>
                                <Grid
                                    size={{xs: 12, md: 6}}
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
                                </Grid>
                            </Grid>
                        </SettingsProvider>
                    </ContentSelectionProvider>
                </ContentFileProvider>
            </Box>
        </>
    )
}
