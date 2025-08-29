import { ContentParserExtended } from '@content-ui/md/parser/ContentParserExtended'
import { ContentSelectionProvider, ContentSelectionSettings, defaultSelectionSettings } from '@content-ui/react/ContentSelectionContext'
import { scrollIntoViewWithMargin } from '@content-ui/react/Utils/scrollIntoViewWithMargin'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import IcVisibility from '@mui/icons-material/Visibility'
import IcVisibilityOff from '@mui/icons-material/VisibilityOff'
import IcCheckBox from '@mui/icons-material/CheckBox'
import IcCheckBoxOutlineBlank from '@mui/icons-material/CheckBoxOutlineBlank'
import { useTheme } from '@mui/material/styles'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import { ContentInput } from '@content-ui/input/ContentInput'
import { CustomCodeMirror, getHighlight } from '../components/CustomCodeMirror.js'
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
    const {breakpoints} = useTheme()
    const isMediumScreen = useMediaQuery(breakpoints.up('md'))

    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const [value, setValue] = useState(md)

    const [selectionSettings, setSelectionSettings] = useState<ContentSelectionSettings>(defaultSelectionSettings)
    const {
        textValue,
        handleOnChange,
        editorSelectionStore,
        bigSize, autoProcess, setAutoProcess,
    } = useContentEditor(
        typeof value === 'string' ? value : '',
        setValue,
        {
            selectionSettings: selectionSettings,
        },
    )
    const {processing, outdated, root, file, stringify} = useContent({
        textValue,
        // with adaptiveDelay: true, the parseDelay marks the maximum it should respect
        parseDelay:
            textValue.length > 10000
                ? 560
                : 180,
        adaptiveDelay: true,
        prioritizeLatest: false,
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
        <>
            <title>{t('brand')} · Content-UI</title>
        </>

        <Box p={1} sx={{overflow: 'auto', display: 'flex', flexDirection: 'column', flexGrow: 1}}>
            <ContentFileProvider
                root={root}
                file={file}
            >
                <ContentSelectionProvider
                    selectionStore={editorSelectionStore}
                    // showFocus={selectionSettings.showFocus} // controls visibility if showOnFocus is not set or false
                    // showOnFocus={selectionSettings.showOnFocus} // makes visibility dependent to focus, if `true` then `showFocus` is ignored
                    // // filterShowOnFocus
                    // // styleOnFocus/focusStyle (or in theme?)
                    // followFocus={selectionSettings.followFocus && isMediumScreen}
                    // // filterFollowFocus
                    // // onFollowElement
                >
                    <SettingsProvider
                        scrollContainer={scrollContainerRef}
                        onFollowElement={scrollIntoViewWithMargin}
                        headlineLinkable
                        headlineSelectable
                        headlineSelectableOnHover
                        // linkAnchorToHref={anchor => window.location.pathname + anchor}
                    >
                        <Grid container spacing={2} sx={{overflow: 'auto', flexGrow: 1, flexWrap: {xs: 'wrap', md: 'nowrap'}}}>
                            <Grid size={{xs: 12, md: 6}} sx={{display: 'flex', flexDirection: 'column', overflow: 'auto', maxHeight: {md: '100%'}}}>
                                <ContentInput
                                    CodeMirror={CustomCodeMirror}
                                    ViewerBox={ViewerBoxRouter}
                                    onChange={handleOnChange}
                                    codeMirrorProps={{
                                        extensions: extensions,
                                        variant: 'embed',
                                        style: {
                                            overflow: 'auto',
                                            display: 'flex',
                                            flexGrow: 1,
                                        },
                                    }}
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
                                ref={scrollContainerRef}
                                size={{xs: 12, md: 6}}
                                sx={{
                                    overflowY: 'auto',
                                    maxHeight: {md: '100%'},
                                    py: 2,
                                    px: {
                                        xs: 2,
                                        // bigger paddings for linkable headline buttons
                                        lg: 3,
                                    },
                                    backgroundColor: 'background.paper',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'flex-end',
                                        gap: 1,
                                        mb: 2,
                                    }}
                                >
                                    <Button
                                        startIcon={selectionSettings.followFocus ? <IcCheckBox/> : <IcCheckBoxOutlineBlank/>}
                                        disabled={!isMediumScreen}
                                        size={'small'} color={'secondary'}
                                        onClick={() => {
                                            setSelectionSettings((s) => ({...s, followFocus: !s.followFocus}))
                                        }}
                                    >
                                        {'follow focus'}
                                    </Button>
                                    <Button
                                        startIcon={selectionSettings.showOnFocus ? <IcCheckBox/> : <IcCheckBoxOutlineBlank/>}
                                        size={'small'} color={'secondary'}
                                        onClick={() => {
                                            setSelectionSettings((s) => ({...s, showOnFocus: !s.showOnFocus}))
                                        }}
                                    >
                                        {'show selection on focus'}
                                    </Button>
                                    <Button
                                        startIcon={selectionSettings.showFocus ? <IcCheckBox/> : <IcCheckBoxOutlineBlank/>}
                                        size={'small'} color={'secondary'}
                                        onClick={() => {
                                            setSelectionSettings((s) => ({...s, showFocus: !s.showFocus}))
                                        }}
                                    >
                                        {'show selection'}
                                    </Button>
                                </Box>
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
                            </Grid>
                        </Grid>
                    </SettingsProvider>
                </ContentSelectionProvider>
            </ContentFileProvider>
        </Box>
    </>
}
