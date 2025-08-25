import { useSettings } from '@content-ui/react/LeafSettings'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'
import Typography from '@mui/material/Typography'
import { RootContent } from 'mdast'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import React from 'react'
import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import { ContentLeafPayload } from '@content-ui/react/ContentLeafsContext'

/**
 * @experimental basic implementation, Accordion isn't suitable for all positions
 */
export const LeafDetailsSummary: React.FC<ContentLeafPayload<{ type: 'details', data?: { hProperties?: Record<string, any> }, children: RootContent[] }> & { dense?: boolean }> = ({selected, child}) => {
    const {hideSelection} = useSettings()
    const summary = child.children[0]
    const cRef = useLeafFollower<HTMLDivElement>(selected)
    return <>
        <Accordion
            ref={cRef}
            slotProps={{heading: {component: 'p'}}}
            defaultExpanded={Boolean(child.data?.hProperties?.open)}
            sx={theme => ({
                backgroundColor: !hideSelection && selected ? theme.palette.mode === 'dark' ? 'rgba(5, 115, 115, 0.11)' : 'rgba(206, 230, 228, 0.31)' : undefined,
                boxShadow: !hideSelection && selected ? theme.palette.mode === 'dark' ? '-8px 0px 0px 0px rgba(5, 115, 115, 0.11)' : '-8px 0px 0px 0px rgba(206, 230, 228, 0.31)' : undefined,
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
