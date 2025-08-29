import type { CSSProperties, ReactNode } from 'react'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { SxProps } from '@mui/material/styles'
import visuallyHidden from '@mui/utils/visuallyHidden'

export interface IconButtonTooltipProps extends IconButtonProps {
    tooltip: string | ReactNode
    boxSx?: SxProps
    boxStyle?: CSSProperties
    disableInteractive?: boolean
}

export const IconButtonTooltip = ({tooltip, boxSx, boxStyle, disableInteractive, children, ...props}: IconButtonTooltipProps) => {
    return <Tooltip title={tooltip} disableInteractive={disableInteractive}>
        <Box component={'span'} sx={{display: 'inline-flex', ...boxSx || {}}} style={boxStyle}>
            <IconButton {...props}>
                {children}
                <span style={visuallyHidden}>{tooltip}</span>
            </IconButton>
        </Box>
    </Tooltip>
}
