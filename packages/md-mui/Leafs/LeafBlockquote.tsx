import React from 'react'
import Box from '@mui/material/Box'
import { BaseLeafContent } from '@content-ui/md-mui/Leafs/BaseLeafContent'
import { ContentLeafProps } from '@content-ui/react/ContentLeaf'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'

export const LeafBlockquote: React.FC<ContentLeafProps> = ({child, selected}) => {
    const bRef = useLeafFollower<HTMLQuoteElement>(selected)
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
            borderLeftColor: 'divider',
            borderLeftWidth: 4,
            borderLeftStyle: 'solid',
        }}
    >
        {child.type === 'blockquote' ?
            <BaseLeafContent child={child}/> : null}
    </Box>
}

