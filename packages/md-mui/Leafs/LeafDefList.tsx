import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useTheme from '@mui/material/styles/useTheme'
import { ContentLeafProps } from '@content-ui/react/ContentLeaf'
import { BaseLeafContent } from './BaseLeafContent'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'

export const LeafDefList: React.FC<ContentLeafProps> = ({child}) => {
    const dense = 'dense' in child && child.dense
    return <Box
        component={'dl'}
        sx={{
            mt: dense ? 0.5 : 1.5,
            mb: dense ? 0.5 : 1.5,
        }}
    >
        {child.type === 'defList' ? <BaseLeafContent child={child}/> : null}
    </Box>
}

export const LeafDefListTerm: React.FC<ContentLeafProps> = ({child, selected}) => {
    const {palette} = useTheme()
    const dtRef = useLeafFollower<HTMLElement>(selected)
    return <Typography
        variant={'subtitle2'} component={'dt'}
        ref={dtRef}
        sx={{
            pt: 0.5,
            pb: 0.5,
            pl: 1,
            ml: 0,
            borderLeftColor: 'divider',
            borderLeftWidth: 4,
            borderLeftStyle: 'dotted',
        }}
        style={{
            backgroundColor: selected ? palette.mode === 'dark' ? 'rgba(5, 115, 115, 0.11)' : 'rgba(206, 230, 228, 0.31)' : undefined,
            boxShadow: selected ? palette.mode === 'dark' ? '-8px 0px 0px 0px rgba(5, 115, 115, 0.11)' : '-8px 0px 0px 0px rgba(206, 230, 228, 0.31)' : undefined,
        }}
    >
        {child.type === 'defListTerm' ? <BaseLeafContent child={child}/> : null}
    </Typography>
}

export const LeafDefListDescription: React.FC<ContentLeafProps> = ({child, selected}) => {
    const dtRef = useLeafFollower<HTMLElement>(selected)
    return <Box
        component={'dd'}
        sx={{
            pt: 0.5,
            pb: 0.5,
            pl: 2.5,
            ml: 0,
            borderLeftColor: 'divider',
            borderLeftWidth: 4,
            borderLeftStyle: 'dotted',
        }}
        ref={dtRef}
    >
        {child.type === 'defListDescription' ? <BaseLeafContent child={child}/> : null}
    </Box>
}
