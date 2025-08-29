import { useIsLeafSelected } from '@content-ui/react/ContentSelectionContext'
import { isSelectionShowFocus } from '@content-ui/react/Utils/isSelectionSetting'
import { DefListDescriptionNode, DefListNode, DefListTermNode } from 'mdast-util-definition-list'
import type { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { ContentLeafPayload } from '@content-ui/react/ContentLeafsContext'
import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'

export const LeafDefList: FC<ContentLeafPayload<DefListNode> & { dense?: boolean }> = ({dense, child}) => {
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

export const LeafDefListTerm: FC<ContentLeafPayload<DefListTermNode>> = ({child}) => {
    const {palette} = useTheme()
    const selected = useIsLeafSelected(
        child.position?.start?.line, child.position?.end?.line,
        isSelectionShowFocus,
    )
    const dtRef = useLeafFollower<HTMLElement>(child)
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

export const LeafDefListDescription: FC<ContentLeafPayload<DefListDescriptionNode>> = ({child}) => {
    const dtRef = useLeafFollower<HTMLElement>(child)
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
