import React from 'react'

export interface IViewSettingsContext {
    lang?: string
    theme: 'dark' | 'light'
}

const ViewSettingsContext = React.createContext<IViewSettingsContext>({
    lang: undefined,
    // @ts-ignore
    theme: undefined,
})
// @ts-ignore
const ViewSettingsSetContext = React.createContext<React.Dispatch<React.SetStateAction<IViewSettingsContext>>>(undefined)

export const useViewSettings = (): IViewSettingsContext => React.useContext(ViewSettingsContext)
export const useViewSettingsToggle = (): {
    // will toggle a field in the settings, if `valueA` already is the value, `valueB` is used; otherwise `valueA` is applied
    toggleField: (field: string, valueA: string, valueB: string) => void
    setField: (field: string, value: string) => void
} => {
    const setCtx = React.useContext(ViewSettingsSetContext)
    const toggleField = React.useCallback((field: string, valueA: string, valueB: string) => {
        setCtx(ctx => ({
            ...ctx,
            // @ts-ignore
            [field]: ctx[field] === valueA ? valueB : valueA,
        }))
    }, [setCtx])
    const setField = React.useCallback((field: string, value: string) => {
        setCtx(ctx => ({
            ...ctx,
            [field]: value,
        }))
    }, [setCtx])
    return {
        toggleField, setField,
    }
}

export interface FileUploadConfigProviderProps {
    initialTheme: 'dark' | 'light'
}

export const ViewSettingsProvider = (
    {
        initialTheme,
        children,
    }: React.PropsWithChildren<FileUploadConfigProviderProps>,
): React.ReactElement => {
    const [ctx, setCtx] = React.useState<IViewSettingsContext>({
        theme: initialTheme,
    })

    return <ViewSettingsContext.Provider value={ctx as IViewSettingsContext}>
        <ViewSettingsSetContext.Provider value={setCtx as React.Dispatch<React.SetStateAction<IViewSettingsContext>>}>
            {children}
        </ViewSettingsSetContext.Provider>
    </ViewSettingsContext.Provider>
}
