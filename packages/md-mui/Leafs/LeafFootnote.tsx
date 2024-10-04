import React from 'react'
import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import { MuiLink } from '@content-ui/md-mui/MuiComponents/MuiLink'
import IcGoTo from '@mui/icons-material/SubdirectoryArrowLeft'
import Typography from '@mui/material/Typography'
import { ContentLeafProps } from '@content-ui/react/ContentLeafsContext'
import { useTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import { TypographyWithExtras } from '@content-ui/md-mui/MuiComponents/Theme'

const userContentPrefix = 'user-content-'
export const footnoteContainerId = 'footnote-label'

export const LeafFootnoteDefinition: React.FC<ContentLeafProps<'footnoteDefinition'>> = ({child}) => {
    const {typography} = useTheme<Theme & { typography: TypographyWithExtras }>()
    return <Typography
        component={'li'} variant={'body1'} gutterBottom
        sx={{px: 0.5, listStyleType: 'none', ml: -3}}
    >
        <div style={{display: 'flex'}}>
            {child ?
                <small style={{marginRight: 4}}>
                    <code style={{
                        fontFamily: typography?.fontFamilyCode,
                        fontSize: typography?.fontSizeCode,
                        whiteSpace: 'pre',
                    }}>{'[' + child?.label + ']'}</code>
                </small> : null}

            <div id={userContentPrefix + 'fn-' + child?.identifier}>
                <LeafChildNodes childNodes={child.children}/>
            </div>

            <MuiLink
                href={'#' + userContentPrefix + 'fnref-' + child?.identifier}
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

export const LeafFootnoteReference: React.FC<ContentLeafProps<'footnoteReference'>> = ({child}) => {
    return <MuiLink
        href={'#' + userContentPrefix + 'fn-' + child.identifier}
        id={userContentPrefix + 'fnref-' + child.identifier}
        aria-describedby={footnoteContainerId}// todo: validate the aria selector
        sx={{
            py: 0.25,
            px: 0.5,
        }}
    >
        <sup>{'[' + child.label + ']'}</sup>
    </MuiLink>
}

