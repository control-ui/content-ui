import { ViewerContent, ViewerContentProps } from '@content-ui/md-mui/ViewerContent'
import { forwardRef, PropsWithoutRef } from 'react'
import Box, { BoxProps } from '@mui/material/Box'

export type ViewerBoxProps = ViewerContentProps & PropsWithoutRef<BoxProps>

export const ViewerBox = forwardRef<HTMLDivElement, ViewerBoxProps>(function ViewerBox(
    {
        processing,
        outdated,
        ...props
    }: ViewerBoxProps,
    ref,
) {
    return <Box
        {...props}
        ref={ref}
    >
        <ViewerContent
            processing={processing}
            outdated={outdated}
        />
    </Box>
})
