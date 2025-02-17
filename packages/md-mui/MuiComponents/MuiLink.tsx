import { AnchorHTMLAttributes, forwardRef } from 'react'
import { useLocation } from 'react-router'
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

/**
 * Preserves the `location.search` for links starting with `#` and not containing a `?`.
 *
 * > This also can be achieved with `LeafsSettings.linkAnchorToHref`, this component may or may not be better for performance, depending on your setup and app.
 */
export const MuiLinkWithSearch = forwardRef<HTMLAnchorElement, Omit<MuiLinkProps, 'component' | 'ref'> & Pick<LinkProps, 'href'>>(function MuiLink(
    {children, href: hrefInitial, ...props},
    ref,
) {
    const location = useLocation()

    // Preserve the search params if href starts with #
    const href = hrefInitial.startsWith('#') && !hrefInitial.includes('?')
        ? `${location.pathname}${location.search}${hrefInitial}`
        : hrefInitial

    return <MuiLinkBase {...props} href={href} component={RouterLink} ref={ref}>{children}</MuiLinkBase>
})
