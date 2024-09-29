import React from 'react'
import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import Box from '@mui/material/Box'
import { ContentLeafProps } from '@content-ui/react/ContentLeaf'
import { WithMdAstChild } from '@content-ui/struct/Ast'

export const LeafBr: React.FC<ContentLeafProps> = () => <br/>

export const LeafText: React.FC<ContentLeafProps<'text'> & WithMdAstChild> = ({child}): React.ReactNode => (
    child.value
)

export const LeafHtml: React.FC<ContentLeafProps<'html'> & WithMdAstChild> = ({child}): React.ReactNode => (
    child.value.trim().startsWith('<!--') && child.value.trim().endsWith('-->') ?
        <span style={{display: 'none'}}>{child.value}</span> :
        <pre><code>{child.value}</code></pre>
)

export const LeafEmphasis: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) =>
    'children' in child ? <em><LeafChildNodes childNodes={child.children}/></em> : null

export const LeafStrong: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) =>
    'children' in child ? <strong><LeafChildNodes childNodes={child.children}/></strong> : null

export const LeafUnderline: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) =>
    'children' in child ? <u><LeafChildNodes childNodes={child.children}/></u> : null

export const LeafDelete: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) =>
    'children' in child ? <del><LeafChildNodes childNodes={child.children}/></del> : null

export const LeafInsert: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) =>
    'children' in child ? <ins><LeafChildNodes childNodes={child.children}/></ins> : null

export const LeafSub: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) =>
    'children' in child ? <sub><LeafChildNodes childNodes={child.children}/></sub> : null

export const LeafSuper: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) =>
    'children' in child ? <sup><LeafChildNodes childNodes={child.children}/></sup> : null

export const LeafMark: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) =>
    'children' in child ? <Box component={'mark'} sx={{backgroundColor: 'info.light'}} px={0.25} py={0}><LeafChildNodes childNodes={child.children}/></Box> : null

export const LeafThematicBreak: React.FC<ContentLeafProps> = () => <Box component={'hr'} sx={{borderColor: 'divider', borderStyle: 'solid'}} my={0.5}/>
