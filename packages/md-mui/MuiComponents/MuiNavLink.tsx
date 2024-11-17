import { forwardRef } from 'react'
import { useMatch } from 'react-router-dom'
import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link'
import { LinkProps, RouterLink } from '@content-ui/md-mui/MuiComponents/MuiLink'

export type MuiNavLinkProps = Omit<MuiLinkProps, 'component' | 'underline' | 'ref'> & Pick<LinkProps, 'href'> & { exact?: boolean }
export const MuiNavLink = forwardRef<HTMLAnchorElement, MuiNavLinkProps>(function MuiNavLink(
    {
        children, exact,
        ...props
    },
) {
    const match = useMatch(props.href + (exact ? '' : props.href.endsWith('/') ? '*' : '/*'))
    return <MuiLink {...props} underline={match ? 'always' : 'hover'} component={RouterLink}>{children}</MuiLink>
})
