import React from 'react'
import Box from '@mui/material/Box'
import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import { ContentLeafProps } from '@content-ui/react/ContentLeafsContext'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'

export const LeafBlockquote: React.FC<ContentLeafProps<'blockquote'>> = ({child, selected}) => {
    const bRef = useLeafFollower<HTMLQuoteElement>(selected)
    const classNames =
        typeof child.data === 'object'
        && child.data
        && 'hProperties' in child.data
        && typeof child.data.hProperties?.class === 'string'
            ? child.data.hProperties.class.split(' ')
            : undefined

    // todo: remove first `child.children`, as this contains the SVG icon and alert title,
    //       add MUI icon and render title in same color here

    return <Box
        component={'blockquote'}
        ref={bRef}
        sx={{
            mt: 1.5,
            mb: 1.5,
            pt: 1,
            pb: 1,
            pl: 1.5,
            mr: 1,
            ml: 0,
            borderLeftColor:
                classNames?.includes('markdown-alert-note')
                    ? 'info.main'
                    : classNames?.includes('markdown-alert-tip')
                        ? 'success.main'
                        : classNames?.includes('markdown-alert-important')
                            ? 'secondary.main'
                            : classNames?.includes('markdown-alert-warning')
                                ? 'warning.main'
                                : classNames?.includes('markdown-alert-caution')
                                    ? 'error.main'
                                    : 'divider',
            borderLeftWidth: 4,
            borderLeftStyle: 'solid',
        }}
    >
        <LeafChildNodes childNodes={child.children}/>
    </Box>
}

