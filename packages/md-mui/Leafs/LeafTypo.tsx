import React from 'react'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { Parent } from 'mdast'
import { BaseLeafContent } from '@content-ui/md-mui/Leafs/BaseLeafContent'
import Link from '@mui/material/Link'
import IcLink from '@mui/icons-material/Link'
import IcOpenIn from '@mui/icons-material/OpenInNew'
import { RouterMuiLink } from '@content-ui/md-mui/MuiComponents/MuiNavLink'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import useTheme from '@mui/material/styles/useTheme'
import { useSettings } from '@content-ui/react/LeafSettings'
import { ContentLeafProps } from '@content-ui/react/ContentLeaf'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'
import { copyToClipBoard } from '@content-ui/react/Utils/copyToClipboard'
import { flattenText } from '@content-ui/md/flattenText'
import { textToId } from '@content-ui/md/textToId'
import { WithMdAstChild } from '@content-ui/md/Ast'

export const LeafP: React.FC<ContentLeafProps & WithMdAstChild & { selected?: boolean, dense?: boolean }> = ({child, selected, dense, isLast}) => {
    const {palette} = useTheme()
    const pRef = useLeafFollower<HTMLParagraphElement>(selected)
    return <Typography
        gutterBottom={!isLast}
        variant={dense ? 'body2' : 'body1'}
        component={'p'} ref={pRef}
        style={{
            backgroundColor: selected ? palette.mode === 'dark' ? 'rgba(5, 115, 115, 0.11)' : 'rgba(206, 230, 228, 0.31)' : undefined,
            boxShadow: selected ? palette.mode === 'dark' ? '-8px 0px 0px 0px rgba(5, 115, 115, 0.11)' : '-8px 0px 0px 0px rgba(206, 230, 228, 0.31)' : undefined,
        }}
    >
        {child.type === 'paragraph' ? <BaseLeafContent child={child}/> : null}
    </Typography>
}

export const LeafH: React.FC<ContentLeafProps & WithMdAstChild & { selected?: boolean }> = ({child, selected, isFirst, isLast}) => {
    const {palette} = useTheme()
    const {
        headlineLinkable,
        headlineSelectable, headlineSelectableOnHover,
        headlineOffset,
        // todo: is injected in `ContentLeaf`, move to props
    } = useSettings()
    const hRef = useLeafFollower<HTMLHeadingElement>(selected)
    const [copied, setCopied] = React.useState(false)
    const [showCopy, setShowCopy] = React.useState(false)
    const timer = React.useRef<number | undefined>(undefined)
    const c = child.type === 'heading' ? child : undefined
    const id = c ? textToId(flattenText(c as Parent).join('')) : undefined
    const navigate = useNavigate()

    React.useEffect(() => {
        return () => window.clearTimeout(timer.current)
    }, [timer, id])

    const handleCopy = () => {
        window.clearTimeout(timer.current)
        copyToClipBoard(window.location.toString().split('#')[0] + '#' + id)
            .then((hasCopied) => {
                setCopied(hasCopied)
                if(hasCopied) {
                    timer.current = window.setTimeout(() => {
                        setCopied(false)
                    }, 2400)
                }
                navigate('#' + id)
            })
    }

    const depth = child.type === 'heading' ? child.depth : 1

    const btnCopy = headlineLinkable && headlineSelectable && typeof id === 'string' ?
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
                backgroundColor: 'background.paper',
                ml: '-19px',
                mr: 0,
                mt: 'auto',
                mb: 'auto',
                py: 0.5,
                px: 0,
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'divider',
                borderRadius: '6px',
            }}
        >
            <IcLink
                fontSize={'inherit'} color={copied ? 'primary' : 'secondary'}
                style={{
                    transform: 'rotate(-45deg)',
                    transition: '0.0865s ease-out color',
                    fontSize: '1rem',
                }}
            />
        </Box> : null

    return <Typography
        variant={
            depth + (headlineOffset || 0) <= 6 ?
                ('h' + (depth + (headlineOffset || 0))) as TypographyProps['variant'] :
                'h6'
        }
        id={headlineLinkable ? id : undefined} ref={hRef}
        gutterBottom
        onMouseEnter={headlineLinkable && headlineSelectable ? () => setShowCopy(true) : undefined}
        onMouseLeave={headlineLinkable && headlineSelectable ? () => setShowCopy(false) : undefined}
        sx={{
            mt: isFirst ? undefined : '0.3625em',
            mb: isLast ? undefined : '0.67215em',
            // backgroundColor: selected ? 'info.light' : 'default',
            backgroundColor: selected ? palette.mode === 'dark' ? 'rgba(5, 115, 115, 0.11)' : 'rgba(206, 230, 228, 0.31)' : undefined,
            boxShadow: selected ? palette.mode === 'dark' ? '-8px 0px 0px 0px rgba(5, 115, 115, 0.11)' : '-8px 0px 0px 0px rgba(206, 230, 228, 0.31)' : undefined,
            // backgroundColor: selected ? palette.mode === 'dark' ? 'rgba(5, 115, 115, 0.11)' : 'rgba(206, 230, 228, 0.31)' : undefined,
        }}
        // color={selected ? 'info.light' : 'default'}
    >
        {btnCopy}
        {c ? <span><BaseLeafContent child={c}/></span> : null}
    </Typography>
}

export const LeafLink: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) => {
    if(child.type !== 'link') return null

    if(child.url.startsWith('http://') || child.url.startsWith('https://') || child.url.startsWith('ftp://') || child.url.startsWith('ftps://')) {
        return <Link href={child.url} target={'_blank'} rel={'noreferrer noopener'}>
            <BaseLeafContent child={child}/>
            <small style={{paddingLeft: 3}}><IcOpenIn fontSize={'inherit'} color={'inherit'} style={{verticalAlign: 'middle', opacity: 0.625}}/></small>
        </Link>
    }

    if(child.url.indexOf(':') !== -1 && child.url.indexOf(':') < child.url.indexOf('/')) {
        // mailto/tel etc.
        return <Link href={child.url}>
            <BaseLeafContent child={child}/>
        </Link>
    }

    return <RouterMuiLink href={child.url}>
        <BaseLeafContent child={child}/>
    </RouterMuiLink>
}
