import React from 'react'

export type LeafsSettings = {
    followEditor?: boolean
    headlineLinkable?: boolean
    headlineSelectable?: boolean
    headlineSelectableOnHover?: boolean
    headlineOffset?: number
    dense?: boolean
    //headlineOnClick?: (hNode: TocHNode) => void
    //headlineOnCopy?: (doCopy: () => void) => void
}

// @ts-ignore
export const LeafsSettingsContext = React.createContext<{ settings: LeafsSettings }>({settings: {}})

export const useSettings = (): LeafsSettings => React.useContext(LeafsSettingsContext).settings

export const SettingsProvider = (
    {children, ...props}: React.PropsWithChildren<LeafsSettings>,
) => {

    const ctx = React.useMemo(() => {
        return {settings: props}
        // todo: add correct handling, just a dirty compat to prev.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...Object.keys(props), ...Object.values(props)])

    return <LeafsSettingsContext.Provider value={ctx}>{children}</LeafsSettingsContext.Provider>
}
