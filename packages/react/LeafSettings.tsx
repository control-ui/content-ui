import React from 'react'

export type LeafsSettings = {
    followEditor?: boolean
    headlineLinkable?: boolean
    headlineSelectable?: boolean
    headlineSelectableOnHover?: boolean
    headlineOffset?: number
    //headlineOnClick?: (hNode: TocHNode) => void
    //headlineOnCopy?: (doCopy: () => void) => void
}

// @ts-ignore
export const LeafsSettingsContext = React.createContext<{ settings: LeafsSettings, setSettings: React.Dispatch<React.SetStateAction<LeafsSettings>> }>({settings: {}})

export const useSettings = (): LeafsSettings => React.useContext(LeafsSettingsContext).settings
export const useSettingsSet = (): React.Dispatch<React.SetStateAction<LeafsSettings>> => React.useContext(LeafsSettingsContext).setSettings

export const SettingsProvider = (
    {children, ...props}: React.PropsWithChildren<LeafsSettings>,
) => {
    const [settings, setSettings] = React.useState(() => props)

    const ctx = React.useMemo(() => {
        return {settings, setSettings}
    }, [settings, setSettings])

    return <LeafsSettingsContext.Provider value={ctx}>{children}</LeafsSettingsContext.Provider>
}
