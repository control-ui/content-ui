import React from 'react'
import { FootnoteReference } from 'mdast'
import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import { MuiLink } from '@content-ui/md-mui/MuiComponents/MuiLink'
import IcGoTo from '@mui/icons-material/SubdirectoryArrowLeft'
import Typography from '@mui/material/Typography'
import { ContentLeafProps } from '@content-ui/react/ContentLeaf'
import useTheme from '@mui/material/styles/useTheme'
import type { Theme } from '@mui/material/styles'
import { TypographyWithExtras } from '@content-ui/md-mui/MuiComponents/Theme'

const userContentPrefix = 'user-content-'
export const footnoteContainerId = 'footnote-label'

export const LeafFootnoteDefinition: React.FC<ContentLeafProps> = ({child}) => {
    const c = child.type === 'footnoteDefinition' ? child : undefined
    const {typography} = useTheme<Theme & { typography: TypographyWithExtras }>()
    return <Typography
        component={'li'} variant={'body1'} gutterBottom
        sx={{px: 0.5, listStyleType: 'none', ml: -3}}
    >
        <div style={{display: 'flex'}}>
            {c ?
                <small style={{marginRight: 4}}>
                    <code style={{
                        fontFamily: typography?.fontFamilyCode,
                        fontSize: typography?.fontSizeCode,
                        whiteSpace: 'pre',
                    }}>{'[' + c?.label + ']'}</code>
                </small> : null}

            <div id={userContentPrefix + 'fn-' + c?.identifier}>
                {child.type === 'footnoteDefinition' ? <LeafChildNodes childNodes={child.children}/> : null}
            </div>

            <MuiLink
                href={'#' + userContentPrefix + 'fnref-' + c?.identifier}
                aria-label={'Back to content'}
                sx={{
                    py: 0.25,
                    px: 0.5,
                }}
            >
                <small style={{paddingLeft: 3, display: 'flex'}}><IcGoTo fontSize={'small'} color={'inherit'} style={{verticalAlign: 'middle', opacity: 0.625}}/></small>
            </MuiLink>
        </div>
    </Typography>
}

export const LeafFootnoteReference: React.FC<ContentLeafProps> = ({child}) => {
    return <MuiLink
        href={'#' + userContentPrefix + 'fn-' + (child as FootnoteReference).identifier}
        id={userContentPrefix + 'fnref-' + (child as FootnoteReference).identifier}
        aria-describedby={footnoteContainerId}// todo: validate the aria selector
        sx={{
            py: 0.25,
            px: 0.5,
        }}
    >
        <sup>{child.type === 'footnoteReference' ? '[' + child.label + ']' : '*'}</sup>
    </MuiLink>
}

