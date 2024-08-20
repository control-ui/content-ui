import React from 'react'
import { FootnoteReference } from 'mdast'
import { BaseLeafContent } from '@content-ui/md-mui/Leafs/BaseLeafContent'
import { RouterMuiLink } from '@content-ui/md-mui/MuiComponents/MuiNavLink'
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
                {child.type === 'footnoteDefinition' ? <BaseLeafContent child={child}/> : null}
            </div>

            <RouterMuiLink
                href={'#' + userContentPrefix + 'fnref-' + c?.identifier}
                aria-label={'Back to content'}
                sx={{
                    py: 0.25,
                    px: 0.5,
                }}
            >
                <small style={{paddingLeft: 3, display: 'flex'}}><IcGoTo fontSize={'small'} color={'inherit'} style={{verticalAlign: 'middle', opacity: 0.625}}/></small>
            </RouterMuiLink>
        </div>
    </Typography>
}

export const LeafFootnoteReference: React.FC<ContentLeafProps> = ({child}) => {
    return <RouterMuiLink
        href={'#' + userContentPrefix + 'fn-' + (child as FootnoteReference).identifier}
        id={userContentPrefix + 'fnref-' + (child as FootnoteReference).identifier}
        aria-describedby={footnoteContainerId}// todo: validate the aria selector
        sx={{
            py: 0.25,
            px: 0.5,
        }}
    >
        <sup>{child.type === 'footnoteReference' ? '[' + child.label + ']' : '*'}</sup>
    </RouterMuiLink>
}

