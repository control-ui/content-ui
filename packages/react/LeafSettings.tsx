import { useMemoObject } from '@content-ui/react/useMemoObject'
import { createContext, ReactNode, useContext, useMemo } from 'react'

/**
 * @todo split up "base" vs custom, like MUI specific and allow overwriting via generics
 */
export type LeafsSettings = {
    /**
     * Follow the editor selection by scrolling the viewer to a selected leaf.
     *
     * @deprecated use selection store settings `.followFocus` instead
     */
    followEditor?: boolean
    /**
     * Reference to the scroll container, used to calculate scroll behaviour when following editor selection.
     */
    scrollContainer?: { current?: HTMLElement | null }
    onFollowElement?: (leaf: {
        element: HTMLElement
        container?: HTMLElement | null
    }) => void

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

export const useSettings =
    <TSettings extends object>(): LeafsSettings & Omit<NoInfer<TSettings>, keyof LeafsSettings> =>
        useContext(LeafsSettingsContext).settings as LeafsSettings & Omit<NoInfer<TSettings>, keyof LeafsSettings>

export const SettingsProvider = <TSettings extends object>(
    {
        children,
        ...props
    }: LeafsSettings & Omit<NoInfer<TSettings>, keyof LeafsSettings | 'children'> & { children?: ReactNode | undefined },
) => {
    const settings = useMemoObject(props)
    const ctx = useMemo(() => {
        return {
            settings: settings,
        }
    }, [settings])

    return <LeafsSettingsContext.Provider value={ctx}>{children}</LeafsSettingsContext.Provider>
}
