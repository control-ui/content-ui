import { DefListDescriptionNode, DefListNode, DefListTermNode } from 'mdast-util-definition-list'
import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { ContentLeafPayload } from '@content-ui/react/ContentLeafsContext'
import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'

export const LeafDefList: React.FC<ContentLeafPayload<DefListNode> & { dense?: boolean }> = ({dense, child}) => {
    // todo: check where the child.dense was used/injected or not all all anymore
    const denseApplied = dense || ('dense' in child && child.dense)
    return <Box
        component={'dl'}
        sx={{
            mt: denseApplied ? 0.5 : 1.5,
            mb: denseApplied ? 0.5 : 1.5,
        }}
    >
        <LeafChildNodes childNodes={child.children}/>
    </Box>
}

export const LeafDefListTerm: React.FC<ContentLeafPayload<DefListTermNode>> = ({child, selected}) => {
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
        <LeafChildNodes childNodes={child.children}/>
    </Typography>
}

export const LeafDefListDescription: React.FC<ContentLeafPayload<DefListDescriptionNode>> = ({child, selected}) => {
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
        <LeafChildNodes childNodes={child.children}/>
    </Box>
}
