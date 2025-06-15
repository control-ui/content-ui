import { ReactNode } from 'react'
import { ContentProcessor, useContent, WithContent } from '@content-ui/react/useContent'
import { ContentFileProvider } from '@content-ui/react/ContentFileContext'

export interface ViewerProps {
    outdated?: boolean
    processing: WithContent['processing']
}

export interface ViewerFromTextProps {
    textValue: string
    /**
     * @todo make available with `ContentLeafsProvider` or `LeafsSettings`/`SettingsProvider`?
     */
    processor: ContentProcessor
    parseDelay?: number
    adaptiveDelay?: boolean
    keepDelayActive?: boolean
    prioritizeLatest?: boolean
    onMount?: boolean
    Viewer: (props: Pick<ViewerProps, 'processing' | 'outdated'>) => ReactNode
}

export const ViewerFromText = (
    {
        textValue,
        processor,
        parseDelay,
        onMount = false,
        adaptiveDelay,
        keepDelayActive,
        prioritizeLatest,
        Viewer,
        // note: using children render-prop didn't play well with HMR
        // children = Viewer,
    }: ViewerFromTextProps,
) => {
    const {root, file, processing, outdated} = useContent({
        textValue,
        processor: processor,
        parseDelay,
        adaptiveDelay,
        prioritizeLatest,
        keepDelayActive,
        onMount,
    })
    return <ContentFileProvider
        root={root}
        file={file}
    >
        {/*children ? children({
            outdated: outdated,
            processing: processing,
        }) : null*/}
        <Viewer
            processing={processing}
            outdated={outdated}
        />
    </ContentFileProvider>
}
