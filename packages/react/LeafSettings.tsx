import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

export type LeafsSettings = {
    followEditor?: boolean
    headlineLinkable?: boolean
    headlineSelectable?: boolean
    headlineSelectableOnHover?: boolean
    headlineOffset?: number
    dense?: boolean
    fmHide?: 'always' | 'first' | ((node) => boolean)
    /**
     * Absolute links will use react-router if starting with this base.
     * The base URL must be absolute and without trailing slash.
     * If not set, falls back to open domain.
     */
    linkBase?: string
    /**
     * Absolute links will not open in a new window if starting with this base.
     * The base URL must be absolute and without trailing slash.
     * But will use a normal anchor tag, instead of react-router.
     */
    linkNotBlank?: string | RegExp

    /**
     * Convert pure anchor links `#tag` to a different target.
     * - when using react-router, the Link component automatically creates a `href` relative to the open page
     * - when using native `a` elements, it must be manually transformed
     */
    linkAnchorToHref?: (anchor: string) => string
    //headlineOnClick?: (hNode: TocHNode) => void
    //headlineOnCopy?: (doCopy: () => void) => void
}

export const LeafsSettingsContext = createContext<{ settings: LeafsSettings }>({settings: {}})

export const useSettings = (): LeafsSettings => useContext(LeafsSettingsContext).settings

export const SettingsProvider = (
    {
        children,
        headlineLinkable, headlineSelectable, headlineSelectableOnHover, headlineOffset,
        linkBase, linkNotBlank, linkAnchorToHref,
        fmHide,
        dense,
        followEditor,
    }: PropsWithChildren<LeafsSettings>,
) => {

    const ctx = useMemo(() => {
        return {
            settings: {
                headlineLinkable, headlineSelectable, headlineSelectableOnHover, headlineOffset,
                linkBase, linkNotBlank, linkAnchorToHref,
                fmHide,
                dense,
                followEditor,
            },
        }
    }, [
        headlineLinkable, headlineSelectable, headlineSelectableOnHover, headlineOffset,
        linkBase, linkNotBlank, linkAnchorToHref,
        fmHide,
        dense,
        followEditor,
    ])

    return <LeafsSettingsContext.Provider value={ctx}>{children}</LeafsSettingsContext.Provider>
}
