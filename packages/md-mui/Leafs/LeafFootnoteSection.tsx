import React from 'react'
import Box from '@mui/material/Box'
import type { ListItem, Root } from 'mdast'
import Typography from '@mui/material/Typography'
import { ContentLeaf } from '@content-ui/react/ContentLeaf'

export interface FootnoteSectionProps {
    rootChildren: Root['children']
}

export const FootnoteSection: React.FC<FootnoteSectionProps> = ({rootChildren: footnoteDefinitions}) => {
    const nextChild = React.useMemo(
        () => ({type: 'list' as const, children: footnoteDefinitions as ListItem[]}),
        [footnoteDefinitions],
    )
    return footnoteDefinitions?.length ?
        <Box mt={2} pt={1} mb={2} sx={{borderTopWidth: '2px', borderTopColor: 'divider', borderTopStyle: 'dashed'}}>
            <Typography variant={'subtitle1'} gutterBottom color={'textSecondary'}>Footnotes</Typography>
            <ContentLeaf
                elem={'list'}
                child={nextChild}
            />
        </Box> : null
}
