import type { FC } from 'react'
import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import Box from '@mui/material/Box'
import { ContentLeafPayload, ContentLeafProps } from '@content-ui/react/ContentLeafsContext'
import { Insert, Mark, Sub, Super, Underline } from '@content-ui/struct/Ast'

export const LeafBr: FC<ContentLeafProps<'break'>> = () => <br/>

export const LeafText: FC<ContentLeafProps<'text'>> = ({child}) => child.value

export const LeafHtml: FC<ContentLeafProps<'html'>> = ({child}) => (
    child.value.trim().startsWith('<!--') && child.value.trim().endsWith('-->') ?
        <span style={{display: 'none'}}>{child.value}</span> :
        <pre><code>{child.value}</code></pre>
)

export const LeafEmphasis: FC<ContentLeafProps<'emphasis'>> = ({child}) =>
    <em><LeafChildNodes childNodes={child.children}/></em>

export const LeafStrong: FC<ContentLeafProps<'strong'>> = ({child}) =>
    <strong><LeafChildNodes childNodes={child.children}/></strong>

export const LeafUnderline: FC<ContentLeafPayload<Underline>> = ({child}) =>
    <u><LeafChildNodes childNodes={child.children}/></u>

export const LeafDelete: FC<ContentLeafProps<'delete'>> = ({child}) =>
    'children' in child ? <del><LeafChildNodes childNodes={child.children}/></del> : null

export const LeafInsert: FC<ContentLeafPayload<Insert>> = ({child}) =>
    <ins><LeafChildNodes childNodes={child.children}/></ins>

export const LeafSub: FC<ContentLeafPayload<Sub>> = ({child}) =>
    <sub><LeafChildNodes childNodes={child.children}/></sub>

export const LeafSuper: FC<ContentLeafPayload<Super>> = ({child}) =>
    <sup><LeafChildNodes childNodes={child.children}/></sup>

export const LeafMark: FC<ContentLeafPayload<Mark>> = ({child}) =>
    <Box
        component={'mark'}
        sx={theme => {
            const bgColor = theme.palette.mode === 'dark' ? theme.palette.info.light : theme.palette.info.dark
            return {
                backgroundColor: bgColor,
                color: theme.palette.getContrastText(bgColor),
            }
        }}
        px={0.25} py={0}
    ><LeafChildNodes childNodes={child.children}/></Box>

export const LeafThematicBreak: FC<ContentLeafProps<'thematicBreak'> & { dense?: boolean }> = ({dense}) =>
    <Box
        component={'hr'}
        sx={{
            borderColor: 'divider', borderStyle: 'solid',
            marginInlineStart: 0,
            marginInlineEnd: 0,
        }}
        my={dense ? 0.75 : 1.5}
    />
