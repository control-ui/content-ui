import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { SxProps } from '@mui/material/styles'
import visuallyHidden from '@mui/utils/visuallyHidden'

export interface IconButtonTooltipProps extends IconButtonProps {
    tooltip: string | React.ReactElement
    boxSx?: SxProps
    boxStyle?: React.CSSProperties
    disableInteractive?: boolean
}

export const IconButtonTooltip: React.FC<IconButtonTooltipProps> = ({tooltip, boxSx, boxStyle, disableInteractive, children, ...props}) => {
    return <Tooltip title={tooltip} disableInteractive={disableInteractive}>
        <Box component={'span'} sx={{display: 'inline-flex', ...boxSx || {}}} style={boxStyle}>
            <IconButton {...props}>
                {children}
                <span style={visuallyHidden}>{tooltip}</span>
            </IconButton>
        </Box>
    </Tooltip>
}
