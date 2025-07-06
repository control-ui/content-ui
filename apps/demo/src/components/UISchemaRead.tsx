import React from 'react'
import { createOrderedMap, createStore, injectPluginStack, onChangeHandler, storeUpdater, UIStoreProvider, useUIMeta } from '@ui-schema/ui-schema'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { UIMetaReadContextType } from '@ui-schema/ui-schema/UIMetaReadContext'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings.js'
import { UIMetaProvider } from '@ui-schema/ui-schema/UIMeta'
import { readWidgets } from './UISchema.js'

const GridStack = injectPluginStack(GridContainer)

export const UISchemaRead = (
    {
        schema, read, data,
        readDense,
    }: Omit<UIMetaReadContextType, 'readActive'> & { schema: any | undefined, data: any, read?: any },
): React.ReactElement => {
    const {widgets, t} = useUIMeta()
    const [store, setStore] = React.useState(() => createStore(undefined))

    const onChange: onChangeHandler = React.useCallback(
        (actions) => setStore(storeUpdater(actions)),
        [setStore],
    )

    React.useEffect(() => {
        // @ts-ignore
        setStore(s => s.set('values', data ? createOrderedMap(data) : undefined))
    }, [data])

    const customWidgetsRtd = React.useMemo(() => ({
        ...widgets,
        types: readWidgets.types,
        custom: readWidgets.custom,
    }), [widgets])

    const storeSchema = React.useMemo(() => schema ? createOrderedMap(schema) as StoreSchemaType : undefined, [schema])

    // <UIMetaProvider<UIMetaReadContextType & MetaWithStyleSchema>
    return <>
        <UIMetaProvider<UIMetaReadContextType & any>
            widgets={customWidgetsRtd}
            t={t}
            readDense={readDense}
            readActive
            styleSchema={read}
        >
            <UIStoreProvider store={store} onChange={onChange} showValidity>
                {storeSchema ? <GridStack isRoot schema={storeSchema as StoreSchemaType}/> : null}
            </UIStoreProvider>
        </UIMetaProvider>
    </>
}
