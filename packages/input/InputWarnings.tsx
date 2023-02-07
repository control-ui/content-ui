import React from 'react'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import IcWarning from '@mui/icons-material/Warning'
import { Theme, useTheme } from '@mui/material/styles'
import { TypographyWithExtras } from '@content-ui/md-mui/MuiComponents/Theme'

export const InputWarnings: React.ComponentType<{
    fileMessages: any[] | undefined
    processing: boolean
    showIcon?: boolean
    showLoading?: boolean
    showLintText?: boolean
    pl?: number
    pr?: number
}> = (
    {
        fileMessages,
        processing,
        showIcon, showLoading, showLintText,
        pr, pl,
    },
) => {
    const {palette} = useTheme()
    const hasWarnings = (fileMessages?.length || 0) > 0
    const title =
        <Tooltip title={'MarkDown is checked against basic formatting rules'} disableInteractive>
            <Typography
                variant={'caption'}
                color={
                    hasWarnings ?
                        palette.mode === 'dark' ? 'warning.main' : 'warning.dark' :
                        palette.mode === 'dark' ? 'info.light' : 'info.main'
                }
                sx={{display: 'flex', alignItems: 'center', pl, pr}}
            >
                {showIcon && hasWarnings ?
                    <IcWarning
                        color={hasWarnings ? 'warning' : 'secondary'} fontSize={'inherit'}
                        style={{marginRight: 3}}
                    /> : null}

                {showLintText ? <strong>{'Lint:'}</strong> : null}

                <span style={{marginLeft: 4}}>
                    {hasWarnings ? fileMessages?.length + (fileMessages?.length === 1 ? ' Warning' : ' Warnings') : 'all good'}
                </span>
            </Typography>
        </Tooltip>
    return <>
        {showLoading ?
            <>
                <Collapse in={processing}>
                    <Typography
                        variant={'caption'} color={'secondary'}
                        sx={{display: 'flex', alignItems: 'center', pl, pr}}
                    >
                        <CircularProgress size={14} color={'secondary'}/>
                        <span style={{paddingLeft: 4, whiteSpace: 'pre'}}>
                            {'processing text...'}
                        </span>
                    </Typography>
                </Collapse>
                <Collapse in={!processing}>
                    {title}
                </Collapse>
            </> :
            title}
    </>
}

export const InputWarningsDetails: React.ComponentType<{
    fileMessages: any[] | undefined
    processing: boolean
}> = (
    {
        fileMessages,
    },
) => {
    const {typography} = useTheme<Theme & { typography: TypographyWithExtras }>()
    const hasWarnings = (fileMessages?.length || 0) > 0
    return <Collapse in={hasWarnings}>
        <Table size={'small'}>
            <TableHead>
                <TableRow>
                    <TableCell sx={{py: 0.25}}>
                        Position
                    </TableCell>
                    <TableCell sx={{py: 0.25}}>
                        Message
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {fileMessages?.map((message, i) =>
                    <TableRow key={i}>
                        <TableCell sx={{py: 0.25}}>
                            <code
                                style={{
                                    fontFamily: typography?.fontFamilyCode,
                                    fontSize: typography?.fontSizeCode,
                                    whiteSpace: 'pre',
                                }}
                            >
                                {message.position?.start?.line}:{message.position?.start?.column}
                                {' - '}
                                {message.position?.end?.line}:{message.position?.end?.column}
                            </code>
                        </TableCell>
                        <TableCell sx={{py: 0.25}}>
                            {message.reason}
                        </TableCell>
                    </TableRow>)}
            </TableBody>
        </Table>
    </Collapse>
}
