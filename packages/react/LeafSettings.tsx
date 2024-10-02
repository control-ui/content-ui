import React from 'react'

export type LeafsSettings = {
    followEditor?: boolean
    headlineLinkable?: boolean
    headlineSelectable?: boolean
    headlineSelectableOnHover?: boolean
    headlineOffset?: number
    dense?: boolean
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
    //headlineOnClick?: (hNode: TocHNode) => void
    //headlineOnCopy?: (doCopy: () => void) => void
}

export const LeafsSettingsContext = React.createContext<{ settings: LeafsSettings }>({settings: {}})

export const useSettings = (): LeafsSettings => React.useContext(LeafsSettingsContext).settings

export const SettingsProvider = (
    {
        children,
        headlineLinkable, headlineSelectable, headlineSelectableOnHover, headlineOffset,
        linkBase, linkNotBlank,
        dense,
        followEditor,
    }: React.PropsWithChildren<LeafsSettings>,
) => {

    const ctx = React.useMemo(() => {
        return {
            settings: {
                headlineLinkable, headlineSelectable, headlineSelectableOnHover, headlineOffset,
                linkBase, linkNotBlank,
                dense,
                followEditor,
            },
        }
    }, [
        headlineLinkable, headlineSelectable, headlineSelectableOnHover, headlineOffset,
        linkBase, linkNotBlank,
        dense,
        followEditor,
    ])

    return <LeafsSettingsContext.Provider value={ctx}>{children}</LeafsSettingsContext.Provider>
}
