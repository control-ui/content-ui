import { LinkProps } from '@content-ui/md-mui/MuiComponents/MuiLink'
import { ContentRenderComponents } from '@content-ui/react/ContentLeafsContext'
import { LinkProps as MuiLinkProps } from '@mui/material/Link'
import { ComponentType, RefAttributes } from 'react'

export interface MuiContentRenderComponentsLinks {
    Link?: ComponentType<Omit<MuiLinkProps, 'component' | 'ref'> & Pick<LinkProps, 'href'>> & { ref?: RefAttributes<HTMLAnchorElement> }
}

export interface MuiContentRenderComponents extends ContentRenderComponents, MuiContentRenderComponentsLinks {
    /**
     * @deprecated use `Code` instead
     */
    CodeMirror?: ComponentType<{ value?: string, lang?: string }>
    /**
     * @todo support setting focus and retrieving e.g. selections
     */
    Code?: ComponentType<{ value?: string, lang?: string, dense?: boolean }>
}
