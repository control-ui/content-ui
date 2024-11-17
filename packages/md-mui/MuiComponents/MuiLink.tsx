import { AnchorHTMLAttributes, forwardRef } from 'react'
import { Link as LinkBase } from 'react-router-dom'
import MuiLinkBase, { LinkProps as MuiLinkProps } from '@mui/material/Link'

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
}

export const RouterLink = forwardRef<HTMLAnchorElement, LinkProps>(function NavLink(
    {href, ...props},
    ref,
) {
    return <LinkBase ref={ref} {...props} to={href}/>
})

export const MuiLink = forwardRef<HTMLAnchorElement, Omit<MuiLinkProps, 'component' | 'ref'> & Pick<LinkProps, 'href'>>(function MuiLink(
    {children, ...props},
    ref,
) {
    return <MuiLinkBase {...props} component={RouterLink} ref={ref}>{children}</MuiLinkBase>
})
