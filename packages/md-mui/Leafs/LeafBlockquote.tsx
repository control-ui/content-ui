import { useIsLeafSelected } from '@content-ui/react/ContentSelectionContext'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { FC } from 'react'
import Box from '@mui/material/Box'
import IcInfoOutlined from '@mui/icons-material/InfoOutlined'
import IcLightbulbOutlined from '@mui/icons-material/LightbulbOutlined'
import IcAnnouncementOutlined from '@mui/icons-material/AnnouncementOutlined'
import IcReportProblemOutlined from '@mui/icons-material/ReportProblemOutlined'
import IcReportOutlined from '@mui/icons-material/ReportOutlined'
import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import { ContentLeafProps } from '@content-ui/react/ContentLeafsContext'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'

const alertTypeColors = {
    note: 'info.main',
    tip: 'success.main',
    important: 'secondary.main',
    warning: 'warning.main',
    caution: 'error.main',
}

const alertTypeLabels = {
    note: 'Note',
    tip: 'Tip',
    important: 'Important',
    warning: 'Warning',
    caution: 'Caution',
}

const alertTypeIcons = {
    note: IcInfoOutlined,
    tip: IcLightbulbOutlined,
    important: IcAnnouncementOutlined,
    warning: IcReportProblemOutlined,
    caution: IcReportOutlined,
}

export const LeafBlockquoteAlert: FC<ContentLeafProps<'blockquote'> & { alertType: string }> = ({alertType, child}) => {
    const bRef = useLeafFollower<HTMLQuoteElement>(child)
    const {palette} = useTheme()

    // note: titleLine does not contain position
    // const titleLine = child.children[0]
    const contentLines = child.children.slice(1)
    // removing empty paragraph lines, for `> [!NOTE]` without actual content
    for(const contentLine of contentLines) {
        if(
            contentLine.type === 'paragraph'
            && contentLine.children.length === 0
        ) {
            contentLines.shift()
        } else {
            break
        }
    }

    const Icon = alertType in alertTypeIcons ? alertTypeIcons[alertType] : undefined

    // todo: if no blank lines between titleLine and contentLines, the first contentLine is incorrectly highlighted when editor selection is on titleLine
    const titleLineSelected = useIsLeafSelected(
        child.position?.start?.line,
        child.position?.start?.line,
    )

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
                alertType in alertTypeColors
                    ? alertTypeColors[alertType]
                    : 'divider',
            borderLeftWidth: 4,
            borderLeftStyle: 'solid',
        }}
    >
        <Typography
            gutterBottom={Boolean(contentLines?.length)}
            color={
                alertType in alertTypeColors
                    ? alertTypeColors[alertType]
                    : 'divider'
            }
            sx={{
                display: 'flex', alignItems: 'center', columnGap: 1,
                backgroundColor:  titleLineSelected ? palette.mode === 'dark' ? 'rgba(5, 115, 115, 0.11)' : 'rgba(206, 230, 228, 0.31)' : undefined,
                boxShadow: titleLineSelected ? palette.mode === 'dark' ? '-8px 0px 0px 0px rgba(5, 115, 115, 0.11)' : '-8px 0px 0px 0px rgba(206, 230, 228, 0.31)' : undefined,
            }}
        >
            {Icon ? <Icon fontSize={'small'}/> : null}
            {alertType in alertTypeLabels ? alertTypeLabels[alertType] : alertType.toUpperCase()}
        </Typography>

        {contentLines?.length ?
            <LeafChildNodes childNodes={contentLines}/>
            : null}
    </Box>
}

export const LeafBlockquote: FC<ContentLeafProps<'blockquote'>> = ({child, ...props}) => {
    const alertType =
        typeof child.data === 'object'
        && child.data
        && 'hProperties' in child.data
        && typeof child.data.hProperties?.class === 'string'
        && child.data.hProperties.class.includes('markdown-alert')
            ? child.data.hProperties.class.split(' ').find(c => c.startsWith('markdown-alert-'))?.slice(15)
            : undefined

    if(alertType) {
        return <LeafBlockquoteAlert
            child={child}
            alertType={alertType}
            {...props}
        />
    }

    return <LeafBlockquoteStandard
        child={child}
        {...props}
    />
}

export const LeafBlockquoteStandard: FC<ContentLeafProps<'blockquote'>> = ({child}) => {
    const bRef = useLeafFollower<HTMLQuoteElement>(child)

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
            borderLeftWidth: 4,
            borderLeftStyle: 'solid',
        }}
    >
        <LeafChildNodes childNodes={child.children}/>
    </Box>
}
