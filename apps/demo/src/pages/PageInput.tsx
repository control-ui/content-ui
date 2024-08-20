import { ContentParser } from '@content-ui/md/parser/ContentParser'
import React from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import Grid2 from '@mui/material/Unstable_Grid2'
import { ContentInput } from '@content-ui/input/ContentInput'
import { CustomCodeMirror, getHighlight } from '../components/CustomCodeMirror'
import Box from '@mui/material/Box'
import { Viewer } from '@content-ui/md-mui/Viewer'
import { SettingsProvider } from '@content-ui/react/LeafSettings'
import { useContentEditor } from '@content-ui/react/useContentEditor'
import { useContent } from '@content-ui/react/useContent'
import { ContentFileProvider } from '@content-ui/react/ContentFileProvider'

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
    const {t} = useTranslation('translation')
    const [value, setValue] = React.useState(md)
    const {
        textValue,
        handleOnChange,
        editorSelection,
        bigSize, autoProcess, setAutoProcess,
    } = useContentEditor(
        typeof value === 'string' ? value : '',
        setValue,
    )
    const {processing, outdated, root, file} = useContent({
        textValue,
        // for direct preview, the parseDelay should be as low as possible,
        // with disabled preview it's better to use `600` for less unnecessary processing
        parseDelay:
            textValue.length > 10000 ? 460 :
                textValue.length > 1200 ? 160 :
                    textValue.length > 3500 ? 280 :
                        40,
        autoProcess,
        onMount: true,
        processor: ContentParser,
    })

    const extensions = React.useMemo(() => {
        const highlight = getHighlight('md')
        return [
            ...(highlight ? [highlight] : []),
        ]
    }, [])

    return <>
        <Helmet>
            <title>{t('brand')} · Content-UI</title>
        </Helmet>

        <Box p={1} sx={{overflow: 'auto', display: 'flex', flexDirection: 'column'}}>
            <ContentFileProvider
                root={root}
                file={file}
                editorSelection={editorSelection}
            >
                <SettingsProvider
                    followEditor
                    headlineLinkable
                    headlineSelectable
                    headlineSelectableOnHover
                >
                    <Grid2 container spacing={2} sx={{overflow: 'auto'}}>
                        <Grid2 xs={12} md={6} sx={{overflow: 'auto', scrollbarWidth: 'thin', maxHeight: {md: '100%'}}}>
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
                            xs={12} md={6}
                            sx={{
                                overflowY: 'auto',
                                scrollbarWidth: 'thin',
                                maxHeight: {md: '100%'},
                                // viewer with bigger paddings for headline buttons
                                px: {md: 2, lg: 3},
                            }}
                        >
                            <Viewer
                                outdated={outdated}
                                processing={processing}
                                editorSelection={editorSelection}
                            />
                        </Grid2>
                    </Grid2>
                </SettingsProvider>
            </ContentFileProvider>
        </Box>
    </>
}
