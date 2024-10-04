import { ContentParser } from '@content-ui/md/parser/ContentParser'
import { ContentSelectionProvider } from '@content-ui/react/ContentSelectionContext'
import React from 'react'
import Grid2 from '@mui/material/Unstable_Grid2'
import { ContentInput } from '@content-ui/input/ContentInput'
import { CustomCodeMirror, getHighlight } from '../components/CustomCodeMirror'
import Box from '@mui/material/Box'
import { Viewer } from '@content-ui/md-mui/Viewer'
import { SettingsProvider } from '@content-ui/react/LeafSettings'
import { useContentEditor } from '@content-ui/input/useContentEditor'
import { useContent } from '@content-ui/react/useContent'
import { ContentFileProvider } from '@content-ui/react/ContentFileContext'
import useTheme from '@mui/material/styles/useTheme'
import { useMediaQuery } from '@mui/material'

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
    const {processing, outdated, root, file} = useContent({
        textValue,
        // for direct preview, the parseDelay should be as low as possible,
        // with disabled preview it's better to use `600` for less unnecessary processing
        parseDelay:
            textValue.length > 10000
                ? 460
                : textValue.length > 1200
                    ? 160
                    : textValue.length > 3500
                        ? 280
                        : 40,
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
                            <Grid2
                                container
                                spacing={2}
                                sx={{overflow: 'auto', flexWrap: {xs: 'wrap', md: 'nowrap'}}}
                            >
                                <Grid2
                                    xs={12}
                                    md={6}
                                    sx={{
                                        overflow: 'auto',
                                        scrollbarWidth: 'thin',
                                        maxHeight: {md: '100%'},
                                    }}
                                >
                                    <ContentInput
                                        CodeMirror={CustomCodeMirror}
                                        onChange={handleOnChange}
                                        extensions={extensions}
                                        textValue={textValue}
                                        bigSize={bigSize}
                                        processing={processing}
                                        outdated={outdated}
                                        autoProcess={autoProcess}
                                        setAutoProcess={setAutoProcess}
                                    />
                                </Grid2>
                                <Grid2
                                    xs={12}
                                    md={6}
                                    sx={{
                                        overflowY: 'auto',
                                        scrollbarWidth: 'thin',
                                        maxHeight: {md: '100%'},
                                        // viewer with bigger paddings for headline buttons
                                        px: {md: 2, lg: 3},
                                        backgroundColor: 'background.paper',
                                    }}
                                >
                                    <Viewer
                                        outdated={outdated}
                                        processing={processing}
                                    />
                                </Grid2>
                            </Grid2>
                        </SettingsProvider>
                    </ContentSelectionProvider>
                </ContentFileProvider>
            </Box>
        </>
    )
}
