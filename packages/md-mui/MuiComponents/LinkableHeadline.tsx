import Tooltip from '@mui/material/Tooltip'
import Typography, { TypographyProps } from '@mui/material/Typography'
import IcLink from '@mui/icons-material/Link'
import { forwardRef, PropsWithChildren, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useSettings } from '@content-ui/react/LeafSettings'
import { copyToClipBoard } from '@content-ui/react/Utils/copyToClipboard'

export interface LinkableHeadlineProps {
    selected?: boolean
    marginTop?: boolean
    marginBottom?: boolean
    id?: string
    level: 1 | 2 | 3 | 4 | 5 | 6
    onCopied?: (id: string) => void
}

export const LinkableHeadline = forwardRef<HTMLHeadingElement, PropsWithChildren<LinkableHeadlineProps>>(function LinkableHeadline(
    {
        marginTop, marginBottom,
        id,
        level,
        selected,
        onCopied,
        children,
    },
    ref,
) {
    const {palette} = useTheme()
    const {
        headlineLinkable,
        headlineSelectable, headlineSelectableOnHover,
        headlineOffset,
        // todo: is injected in `ContentRenderer`, move to props
    } = useSettings()
    const [copied, setCopied] = useState(false)
    const [showCopy, setShowCopy] = useState(false)
    const timer = useRef<number | undefined>(undefined)

    useEffect(() => {
        return () => window.clearTimeout(timer.current)
    }, [id])

    const handleCopy = () => {
        if(!id) return
        window.clearTimeout(timer.current)
        copyToClipBoard(window.location.toString().split('#')[0] + '#' + id)
            .then((hasCopied) => {
                setCopied(hasCopied)
                if(hasCopied) {
                    timer.current = window.setTimeout(() => {
                        setCopied(false)
                    }, 1800)
                }
                onCopied?.(id)
            })
    }

    const btnCopy = headlineLinkable && headlineSelectable && typeof id === 'string' ?
        <Box
            component={'span'}
            sx={{
                display: 'inline-block',
                width: 0,
                height: 0,
                overflow: 'visible',
            }}
        >
            <Tooltip
                title={copied ? 'link copied' : ''}
                arrow
            >
                <Box
                    component={'span'}
                    aria-hidden="true"
                    tabIndex={0}
                    onFocus={() => setShowCopy(true)}
                    onBlur={() => setShowCopy(false)}
                    onMouseEnter={() => setShowCopy(true)}
                    onMouseLeave={() => setShowCopy(false)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.ctrlKey) {
                            handleCopy()
                        }
                    }}
                    onClick={handleCopy}
                    style={{
                        cursor: 'pointer',
                        display: 'inline-flex',
                        opacity: copied ? 1 : showCopy ? 0.875 : headlineLinkable && headlineSelectable && headlineSelectableOnHover ? 0 : 0.425,
                        transition: '0.46ms ease-out opacity',
                        outline: 0,
                        verticalAlign: 'top',
                    }}
                    sx={{
                        backgroundColor: copied ? 'success.main' : 'background.paper',
                        color: copied ? 'success.contrastText' : undefined,
                        ml: -2,
                        mr: 0,
                        mt: 'auto',
                        mb: 'auto',
                        py: 0.5,
                        px: '1px',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: 'divider',
                        borderRadius: '6px',
                    }}
                >
                    <IcLink
                        fontSize={'inherit'}
                        color={copied ? 'inherit' : 'secondary'}
                        style={{
                            transform: 'rotate(-45deg)',
                            transition: '0.0865s ease-out color',
                            fontSize: '0.875rem',
                        }}
                    />
                </Box>
            </Tooltip>
        </Box> : null

    return <Typography
        variant={
            level + (headlineOffset || 0) <= 6 ?
                ('h' + (level + (headlineOffset || 0))) as TypographyProps['variant'] :
                'h6'
        }
        id={headlineLinkable ? id : undefined}
        ref={ref}
        gutterBottom
        onMouseEnter={headlineLinkable && headlineSelectable ? () => setShowCopy(true) : undefined}
        onMouseLeave={headlineLinkable && headlineSelectable ? () => setShowCopy(false) : undefined}
        sx={{
            mt: marginTop ? '0.3625em' : undefined,
            mb: marginBottom ? '0.67215em' : undefined,
            // backgroundColor: selected ? 'info.light' : 'default',
            backgroundColor: selected ? palette.mode === 'dark' ? 'rgba(5, 115, 115, 0.11)' : 'rgba(206, 230, 228, 0.31)' : undefined,
            boxShadow: selected ? palette.mode === 'dark' ? '-8px 0px 0px 0px rgba(5, 115, 115, 0.11)' : '-8px 0px 0px 0px rgba(206, 230, 228, 0.31)' : undefined,
            // backgroundColor: selected ? palette.mode === 'dark' ? 'rgba(5, 115, 115, 0.11)' : 'rgba(206, 230, 228, 0.31)' : undefined,
        }}
        // color={selected ? 'info.light' : 'default'}
    >
        {btnCopy}
        {children}
    </Typography>
})
