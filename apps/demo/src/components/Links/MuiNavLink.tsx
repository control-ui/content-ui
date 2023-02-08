import React from 'react'
import { Link as LinkBase, useMatch } from 'react-router-dom'
import MuiLink, { LinkProps } from '@mui/material/Link'

export interface NavLinkProps {
    style?: React.CSSProperties
    href: string
    className?: string
}

export const RouterLink = React.forwardRef<HTMLAnchorElement, React.PropsWithChildren<NavLinkProps>>(function NavLink({href, ...props}, ref) {
    return <LinkBase
        ref={ref}
        {...props}
        to={href}
    />
})

export const RouterMuiLink: React.FC<Omit<LinkProps, 'component'> & { href: string }> = ({children, ...props}) => {
    return <MuiLink {...props} component={RouterLink}>{children}</MuiLink>
}

export const MuiNavLink: React.FC<Omit<LinkProps, 'component' | 'underline'> & { href: string, exact?: boolean }> = ({children, exact, ...props}) => {
    const match = useMatch(props.href + (exact ? '' : '*'))
    return <MuiLink {...props} underline={match ? 'always' : 'hover'} component={RouterLink}>{children}</MuiLink>
}
