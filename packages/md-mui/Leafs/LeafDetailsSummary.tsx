import { useIsLeafSelected } from '@content-ui/react/ContentSelectionContext'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'
import { isSelectionShowFocus } from '@content-ui/react/Utils/isSelectionSetting'
import Typography from '@mui/material/Typography'
import { RootContent } from 'mdast'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import type { FC } from 'react'
import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import { ContentLeafPayload } from '@content-ui/react/ContentLeafsContext'
import { Node } from 'unist'

/**
 * @experimental basic implementation, Accordion isn't suitable for all positions
 */
export const LeafDetailsSummary: FC<ContentLeafPayload<{ type: 'details', position?: Node['position'], data?: { hProperties?: Record<string, any> }, children: RootContent[] }> & { dense?: boolean }> = ({child}) => {
    const summary = child.children[0]
    const selected = useIsLeafSelected(
        child.position?.start?.line, child.position?.end?.line,
        isSelectionShowFocus,
    )
    const cRef = useLeafFollower<HTMLDivElement>(child)
    return <>
        <Accordion
            ref={cRef}
            slotProps={{heading: {component: 'p'}}}
            defaultExpanded={Boolean(child.data?.hProperties?.open)}
            sx={theme => ({
                backgroundColor: selected ? theme.palette.mode === 'dark' ? 'rgba(5, 115, 115, 0.11)' : 'rgba(206, 230, 228, 0.31)' : undefined,
                boxShadow: selected ? theme.palette.mode === 'dark' ? '-8px 0px 0px 0px rgba(5, 115, 115, 0.11)' : '-8px 0px 0px 0px rgba(206, 230, 228, 0.31)' : undefined,
            })}
        >
            <AccordionSummary>
                <Typography component="span">
                    {/* @ts-expect-error */}
                    {summary.type === 'summary' ?
                        /* @ts-expect-error */
                        <LeafChildNodes childNodes={summary.children}/> :
                        'Show More'}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {/* @ts-expect-error */}
                <LeafChildNodes childNodes={summary.type === 'summary' ? child.children.slice(1) : child.children}/>
            </AccordionDetails>
        </Accordion>
    </>
}
