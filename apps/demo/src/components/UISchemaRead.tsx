import { createStore, onChangeHandler, storeUpdater, UIStoreProvider, useUIMeta, WidgetEngine } from '@ui-schema/react'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { UIMetaReadContextType } from '@ui-schema/react/UIMetaReadContext'
import { createOrderedMap, SomeSchema } from '@ui-schema/ui-schema'
import React from 'react'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { readWidgets } from './UISchema.js'

export const UISchemaRead = (
    {
        schema, read, data,
        readDense,
    }: Omit<UIMetaReadContextType, 'readActive'> & { schema: any | undefined, data: any, read?: any },
): React.ReactElement => {
    const {binding, t, validate} = useUIMeta()
    const [store, setStore] = React.useState(() => createStore(undefined))

    const onChange: onChangeHandler = React.useCallback(
        (actions) => setStore(storeUpdater(actions)),
        [setStore],
    )

    React.useEffect(() => {
        // @ts-ignore
        setStore(s => s.set('values', data ? createOrderedMap(data) : undefined))
    }, [data])

    const customBindingRtd = React.useMemo(() => ({
        ...binding,
        widgets: readWidgets,
    }), [binding])

    const storeSchema = React.useMemo(() => schema ? createOrderedMap(schema) as SomeSchema : undefined, [schema])

    // <UIMetaProvider<UIMetaReadContextType & MetaWithStyleSchema>
    return <>
        <UIMetaProvider<UIMetaReadContextType & any>
            binding={customBindingRtd}
            t={t}
            validate={validate}
            readDense={readDense}
            readActive
            styleSchema={read}
        >
            <UIStoreProvider store={store} onChange={onChange} showValidity>
                <GridContainer>
                    {storeSchema ? <WidgetEngine isRoot schema={storeSchema}/> : null}
                </GridContainer>
            </UIStoreProvider>
        </UIMetaProvider>
    </>
}
