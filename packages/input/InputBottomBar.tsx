import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { WithContentEditor } from '@content-ui/input/useContentEditor'
import useTheme from '@mui/material/styles/useTheme'

export type InputBottomBarProps = Pick<WithContentEditor, 'textValue' | 'editorSelection'> & {
    py?: number
    px?: number
    pl?: number
    pr?: number
    mb?: number
    mt?: number
    begin?: React.ReactElement
    end?: React.ReactElement
}

export const InputBottomBar: React.ComponentType<InputBottomBarProps> = (
    {
        py, px, pr, pl, mb, mt,
        textValue,
        begin, end,
        editorSelection: selection,
    },
) => {
    const {palette} = useTheme()
    const selectionInfo = selection?.selected ? {
        chars: selection.end - selection.start,
        lineBreaks: selection.endLine - selection.startLine,
    } : undefined
    const color = palette.mode === 'dark' ? 'info.light' : 'info.dark'
    return <Box
        py={py} px={px} pl={pl} pr={pr}
        mb={mb} mt={mt}
        style={{display: 'flex'}}
    >
        {begin || null}

        <Box
            style={{display: 'flex', alignItems: 'center', flexGrow: 1}}
            ml={begin ? 'auto' : 0}
            mr={end ? 'auto' : 0}
        >
            <Typography variant={'caption'} sx={{mr: 1}} color={color}>
                <Tooltip title={'lines'} disableInteractive>
                    <span>{textValue.split('\n').length}L</span>
                </Tooltip>
            </Typography>
            <Typography variant={'caption'} sx={{mr: 1}} color={color}>
                <Tooltip title={'characters'} disableInteractive>
                    <span>{textValue.length}C</span>
                </Tooltip>
            </Typography>
            {selectionInfo && selection?.selected ?
                <Typography variant={'caption'} sx={{mr: 1}} color={color}>
                    <Tooltip title={'active selection'} disableInteractive>
                        <span>
                            <span>{selection.startLine}:{selection.start - selection.startLineStart + 1}</span>
                            {selection.start !== selection.end ?
                                <span style={{padding: '0 2px'}}>{'-'}</span> : null}
                            {selection.start !== selection.end ?
                                <span>
                                    {selection.startLine !== selection.endLine ?
                                        selection.endLine + ':' : ''}
                                    {selection.end - selection.endLineStart + 1}
                                </span> : null}
                            {selection.start !== selection.end ?
                                <span style={{padding: '0 4px', opacity: 0.75}}>{
                                    '(' +
                                    selectionInfo.chars + ' char' + (selectionInfo.chars > 1 ? 's' : '') +
                                    (
                                        selectionInfo.lineBreaks > 0 ?
                                            ', ' + selectionInfo.lineBreaks + ' line' + (selectionInfo.chars > 1 ? 's' : '') : ''
                                    ) +
                                    ')'
                                }</span> : null}
                        </span>
                    </Tooltip>
                </Typography> : null}
        </Box>

        {/* todo: end should be fullWidth in mobile or even hidden in a gear (together with `begin`) */}
        {end || null}
    </Box>
}
