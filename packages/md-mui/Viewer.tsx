import React from 'react'
import Box from '@mui/material/Box'
import { EditorSelection, useContent, useContentContext, WithContent } from '@content-ui/react/useContent'
import Typography from '@mui/material/Typography'
import { useLocation } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'
import { ContentFileProvider } from '@content-ui/react/ContentFileProvider'
import { Renderer } from '@content-ui/md-mui/Renderer'
import { ContentParserType } from '@content-ui/md/parser/ContentParser'

export interface ViewerProps {
    editorSelection?: EditorSelection
    outdated?: boolean
    processing: WithContent['processing']
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
        editorSelection,
        processing,
        outdated,
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
    >
        {processing === 'success' || isReady ?
            <Renderer
                // handleTocClick={}
                editorSelection={editorSelection}
            /> : null}

        {(processing === 'loading' || outdated) && !isReady ?
            <Box>
                <LinearProgress/>
                <Typography variant={'caption'} color={'primary'} component={'p'}>generating preview...</Typography>
            </Box> : null}
    </Box>
}

export interface ViewerFromTextProps extends Omit<ViewerProps, 'processing' | 'outdated'> {
    textValue: string
    parser?: ContentParserType
    parseDelay?: number
    onMount?: boolean
}

export const ViewerFromText: React.ComponentType<ViewerFromTextProps> = (
    {
        textValue,
        editorSelection, parser,
        parseDelay,
        onMount = false,
        ...props
    },
) => {
    const {root, file, processing, outdated} = useContent({
        textValue,
        parser,
        parseDelay,
        onMount,
    })

    return <ContentFileProvider
        root={root}
        file={file}
    >
        <Viewer
            editorSelection={editorSelection}
            processing={processing}
            outdated={outdated}
            {...props}
        />
    </ContentFileProvider>
}
