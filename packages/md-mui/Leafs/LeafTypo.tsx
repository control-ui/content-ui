import { MuiContentRenderComponentsLinks } from '@content-ui/md-mui/LeafsComponents'
import { LinkableHeadline } from '@content-ui/md-mui/MuiComponents/LinkableHeadline'
import { ReactDeco } from '@content-ui/react/EngineDecorator'
import Typography from '@mui/material/Typography'
import type { Parent } from 'mdast'
import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import Link from '@mui/material/Link'
import IcOpenIn from '@mui/icons-material/OpenInNew'
import { FC } from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useSettings } from '@content-ui/react/LeafSettings'
import { ContentLeafMatchParams, ContentLeafProps, ContentLeafsPropsMapping, LeafsRenderMapping, ReactLeafsNodeSpec, useContentLeafs } from '@content-ui/react/ContentLeafsContext'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'
import { flattenText } from '@content-ui/struct/flattenText'
import { textToId } from '@content-ui/struct/textToId'

export const LeafP: FC<ContentLeafProps<'paragraph'> & { selected?: boolean, dense?: boolean }> = ({child, selected, dense, isLast}) => {
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
        <LeafChildNodes childNodes={child.children}/>
    </Typography>
}

export const LeafH: FC<ContentLeafProps<'heading'> & { selected?: boolean }> = ({child, selected, isFirst, isLast}) => {
    const hRef = useLeafFollower<HTMLHeadingElement>(selected)
    const id = textToId(flattenText(child as Parent).join(''))
    return <LinkableHeadline
        ref={hRef}
        id={id}
        level={child.depth}
        selected={selected}
        marginTop={!isFirst}
        marginBottom={!isLast}
    >
        <span><LeafChildNodes childNodes={child.children}/></span>
    </LinkableHeadline>
}

const urlIsRelativeTo = (linkBase: string, url: string) => {
    return (
        linkBase === url
        || url.startsWith(linkBase + '/')
        || url.startsWith(linkBase + '/?')
        || url.startsWith(linkBase + '?')
        || url.startsWith(linkBase + '/#')
        || url.startsWith(linkBase + '#')
    )
}

export const LeafLink: FC<ContentLeafProps<'link'>> = ({child}) => {
    // todo: is injected in `ContentRenderer`, move to props
    const {linkBase, linkNotBlank, linkAnchorToHref} = useSettings()
    const {renderMap} = useContentLeafs<
        ContentLeafsPropsMapping, MuiContentRenderComponentsLinks, ReactDeco<{}, {}>,
        LeafsRenderMapping<ReactLeafsNodeSpec<ContentLeafsPropsMapping>, MuiContentRenderComponentsLinks, ContentLeafMatchParams>
    >()

    const isHttp = child.url.startsWith('http://') || child.url.startsWith('https://')
    const isControlled = (isHttp && urlIsRelativeTo(linkBase || (window.location.protocol + '//' + window.location.host), child.url))
    const notBlank = (
        isHttp && linkNotBlank &&
        (typeof linkNotBlank === 'string'
            ? urlIsRelativeTo(linkNotBlank, child.url)
            : linkNotBlank.test(child.url))
    )

    if(
        (child.url.startsWith('ftp://') || child.url.startsWith('ftps://'))
        || (isHttp && !isControlled && !notBlank)
    ) {
        return <Link href={child.url} target={'_blank'} rel={'noreferrer noopener'}>
            <LeafChildNodes childNodes={child.children}/>
            <Box component={'small'} sx={{pl: '3px'}}><IcOpenIn fontSize={'inherit'} color={'inherit'} style={{verticalAlign: 'middle', opacity: 0.625}}/></Box>
        </Link>
    }

    if(
        (!isHttp && child.url.indexOf(':') !== -1 && child.url.indexOf(':') < child.url.indexOf('/'))
        || (notBlank && !isControlled)
    ) {
        // mailto/tel etc. or URLs configured to not use `_blank`
        return <Link href={child.url}>
            <LeafChildNodes childNodes={child.children}/>
        </Link>
    }

    const MuiLink = renderMap.components.Link || Link

    return <MuiLink href={linkAnchorToHref && child.url.startsWith('#') ? linkAnchorToHref(child.url) : child.url}>
        <LeafChildNodes childNodes={child.children}/>
    </MuiLink>
}
