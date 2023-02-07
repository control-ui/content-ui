import React from 'react'
import { BaseLeafContent } from '@content-ui/md-mui/Leafs/BaseLeafContent'
import Box from '@mui/material/Box'
import { ContentLeafProps } from '@content-ui/react/ContentLeaf'
import { WithMdAstChild } from '@content-ui/md/Ast'

export const LeafBr: React.FC<ContentLeafProps> = () => <br/>

export const LeafText: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) => (
    child.type === 'text' ? child.value : null
) as unknown as React.ReactElement

export const LeafHtml: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) => (
    child.type === 'html' ?
        child.value.trim().startsWith('<!--') && child.value.trim().endsWith('-->') ?
            <span style={{display: 'none'}}>{child.value}</span> :
            <pre><code>{child.value}</code></pre> : null
) as unknown as React.ReactElement

export const LeafEmphasis: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) =>
    'children' in child ? <em><BaseLeafContent child={child}/></em> : null

export const LeafStrong: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) =>
    'children' in child ? <strong><BaseLeafContent child={child}/></strong> : null

export const LeafUnderline: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) =>
    'children' in child ? <u><BaseLeafContent child={child}/></u> : null

export const LeafDelete: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) =>
    'children' in child ? <del><BaseLeafContent child={child}/></del> : null

export const LeafInsert: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) =>
    'children' in child ? <ins><BaseLeafContent child={child}/></ins> : null

export const LeafThematicBreak: React.FC<ContentLeafProps> = () => <Box component={'hr'} sx={{borderColor: 'divider', borderStyle: 'solid'}} my={0.5}/>
