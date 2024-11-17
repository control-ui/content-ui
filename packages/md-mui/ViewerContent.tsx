import Skeleton from '@mui/material/Skeleton'
import Box from '@mui/material/Box'
import { useContentContext } from '@content-ui/react/ContentFileContext'
import {
    ViewerProps as BaseViewerProps,
} from '@content-ui/react/ViewerFromText'
import { RendererMemo } from '@content-ui/md-mui/Renderer'

export type ViewerContentProps = BaseViewerProps

export const ViewerContent = (
    {
        processing,
        outdated,
    }: ViewerContentProps,
) => {
    const {root} = useContentContext()
    const isReady = Boolean(root)

    return <>
        {processing === 'success' || isReady ?
            <RendererMemo
                // handleTocClick={}
            /> : null}

        {(processing === 'loading' || outdated) && !isReady ?
            <Box>
                <Skeleton variant={'text'}/>
                <Skeleton variant={'text'}/>
                <Skeleton variant={'text'}/>
            </Box> : null}
    </>
}
