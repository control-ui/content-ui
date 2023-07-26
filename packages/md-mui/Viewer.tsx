import React from 'react'
import Box from '@mui/material/Box'
import { EditorSelection, useContent, useContentContext } from '@content-ui/react/useContent'
import Typography from '@mui/material/Typography'
import { useLocation } from 'react-router-dom'
import { ps } from 'react-progress-state'
import LinearProgress from '@mui/material/LinearProgress'
import { ContentFileProvider } from '@content-ui/react/ContentFileProvider'
import { Renderer } from '@content-ui/md-mui/Renderer'
import { ContentParserType } from '@content-ui/md/parser/ContentParser'

export interface ViewerProps {
    keepMounted?: boolean
    editorSelection?: EditorSelection
    needsProcessing?: boolean
    m?: number
    mx?: number
    my?: number
    mt?: number
    mr?: number
    mb?: number
    ml?: number
    p?: number
    px?: number
    py?: number
    pt?: number
    pr?: number
    pb?: number
    pl?: number
}

export const Viewer = <P extends ViewerProps>(
    {
        keepMounted,
        editorSelection,
        needsProcessing,
        ...props
    }: P,
): React.ReactNode => {
    const contentRoot = React.useRef<HTMLDivElement | null>(null)
    const location = useLocation()
    const {root} = useContentContext()

    const isReady = Boolean(root?.children)
    React.useLayoutEffect(() => {
        const hash = location.hash
        if(!hash || !isReady) return
        const targetElement = contentRoot?.current?.querySelector(hash)
        targetElement?.scrollIntoView({
            behavior: 'smooth',
        })
    }, [contentRoot, location, isReady])

    return <Box
        {...props}
        ref={contentRoot}
        sx={{
            opacity: keepMounted || !needsProcessing ? 1 : 0,
            transition: '0.35s ease-in-out opacity',
        }}
    >
        {keepMounted || !needsProcessing ?
            <Renderer
                // handleTocClick={}
                editorSelection={editorSelection}
            /> : null}
        {/* todo: strict `none`/`start` distinction allows better UX when no-auto-process but previewing */}
        {needsProcessing && (!keepMounted || !isReady) ?
            <Box>
                <LinearProgress/>
                <Typography variant={'caption'} color={'primary'} component={'p'}>generating preview...</Typography>
            </Box> : null}
    </Box>
}

export interface ViewerFromTextProps extends ViewerProps {
    textValue: string
    parser?: ContentParserType
}

export const ViewerFromText: React.ComponentType<ViewerFromTextProps> = (
    {
        textValue, keepMounted,
        editorSelection, parser,
    },
) => {
    const {root, file, processing} = useContent(textValue, undefined, undefined, -1, parser)

    const needsProcessing = (processing.progress === ps.none || processing.progress === ps.start)
    return <ContentFileProvider
        root={root}
        file={file}
    >
        <Viewer
            editorSelection={editorSelection}
            keepMounted={keepMounted}
            needsProcessing={needsProcessing}
        />
    </ContentFileProvider>
}
