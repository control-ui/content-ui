import React from 'react'
import { GroupRendererProps, WidgetsBindingFactory } from '@ui-schema/ui-schema/WidgetsBinding'
import { MuiWidgetsBindingCustom, MuiWidgetsBindingTypes, widgets } from '@ui-schema/ds-material/widgetsBinding'
import { TableAdvanced } from '@ui-schema/ds-material/Widgets/TableAdvanced'
import { SelectChips } from '@ui-schema/ds-material/Widgets/SelectChips'
import { MuiWidgetBinding, NumberRendererRead, WidgetBooleanRead, WidgetChipsRead, WidgetOptionsRead } from '@ui-schema/ds-material'
import { emailValidator, escapePointer, getNextPlugin, PluginProps, useUIMeta, WidgetType } from '@ui-schema/ui-schema'
import { List, Map, OrderedMap } from 'immutable'
import { UIMetaReadContextType } from '@ui-schema/ui-schema/UIMetaReadContext'
import { StringRendererRead, TextRendererRead } from './CustomWidgets/WidgetTextFieldRead'
import Grid, { GridSpacing } from '@mui/material/Grid'
import { CustomWidgetCode, CustomWidgetCodeSelectable } from './CustomWidgets/WidgetCode'
import { SimpleListRead } from './CustomWidgets/WidgetSimpleListRead'
import { CustomDatePicker, CustomDateTimePicker, CustomTimePicker } from './CustomWidgets/WidgetPickers'
import { CustomTable } from './CustomWidgets/WidgetTable'
import { WidgetMarkdownViewer } from './CustomWidgets/WidgetMarkdownViewer'
import { WidgetMarkdownEditor } from './CustomWidgets/WidgetMarkdownEditor'

export type CustomWidgetsBinding = WidgetsBindingFactory<{}, MuiWidgetsBindingTypes<{}>, MuiWidgetsBindingCustom<{}>>

const GroupRenderer: React.ComponentType<React.PropsWithChildren<GroupRendererProps>> = ({schema, children, noGrid}) => {
    const {readDense, readActive} = useUIMeta<UIMetaReadContextType>()
    return noGrid ? children as unknown as React.ReactElement :
        <Grid
            container
            spacing={
                readActive && readDense ? 1 :
                    typeof schema.getIn(['view', 'spacing']) === 'number' ?
                        schema.getIn(['view', 'spacing']) as GridSpacing | undefined :
                        2
            }
            wrap={'wrap'}
        >
            {children}
        </Grid>
}

export const SortPlugin: React.ComponentType<PluginProps> = (props) => {
    const {currentPluginIndex, schema} = props

    const sortedSchema = React.useMemo(() => {
        if(!schema?.get('sortOrder')) {
            return schema
        }
        const nonSortedProps = (schema.get('properties') as OrderedMap<string, any>)?.keySeq()
            .filter(k => !(schema.get('sortOrder') as List<string>)?.includes(k))
        return schema.set(
            'properties',
            (schema.get('sortOrder') as List<string>)
                .filter((key) => typeof schema.getIn(['properties', key]) !== 'undefined')
                .concat(nonSortedProps)
                .reduce(
                    (properties, key) =>
                        typeof key === 'string' ? properties.set(key, schema.getIn(['properties', key])) : properties,
                    OrderedMap() as OrderedMap<string, any>,
                ),
        )
    }, [schema])

    const next = currentPluginIndex + 1
    const Plugin = getNextPlugin(next, props.widgets)
    return <Plugin {...props} currentPluginIndex={next} schema={sortedSchema}/>
}

const InjectSplitSchemaPlugin: React.ComponentType<PluginProps> = (props) => {
    const {
        schema, storeKeys,
        currentPluginIndex,
    } = props
    // const {styleSchema} = useUIMeta<MetaWithStyleSchema>()
    const {styleSchema} = useUIMeta<any>()
    const next = currentPluginIndex + 1
    const Plugin = getNextPlugin(next, props.widgets)
    const pointer = storeKeys.size > 0 ? '/' + storeKeys.map(k => escapePointer(String(k))).join('/') : '/'

    const schemaStyleClean = React.useMemo(() => {
        const schemaStyleLevel = styleSchema?.get(pointer as `/${string}`) as Map<string, any> | undefined
        let schemaStyleClean
        if(schemaStyleLevel && Map.isMap(schemaStyleLevel)) {
            schemaStyleClean = schemaStyleLevel
                .delete('properties')
                .delete('items')
                .delete('if')
                .delete('else')
                .delete('then')
                .delete('not')
                .delete('allOf')
                .delete('anyOf')
                .delete('oneOf')
                .delete('required')
        }
        return schemaStyleClean ? schema.mergeDeep(schemaStyleClean) : schema
    }, [pointer, schema, styleSchema])

    return <Plugin
        {...props}
        currentPluginIndex={next}
        isVirtual={Boolean(props.isVirtual || schemaStyleClean?.get('hidden'))}
        schema={schemaStyleClean}
    />
}

export const getCustomWidgets: () => CustomWidgetsBinding = () => ({
    ...widgets,
    GroupRenderer: GroupRenderer,
    pluginStack: [
        InjectSplitSchemaPlugin,
        SortPlugin,
        ...widgets.pluginStack,
    ],
    pluginSimpleStack: [
        emailValidator,
        ...widgets.pluginSimpleStack,
    ],
    types: widgets.types,
    custom: {
        ...widgets.custom,
        SelectChips: SelectChips,
        Table: CustomTable,
        TableAdvanced: TableAdvanced,
        Time: CustomTimePicker,
        Date: CustomDatePicker,
        DateTime: CustomDateTimePicker,
        Markdown: WidgetMarkdownEditor,
    },
})

export const readWidgets: any = {
    types: {
        string: StringRendererRead,
        number: NumberRendererRead,
        integer: NumberRendererRead,
        boolean: WidgetBooleanRead,
    },
    custom: {
        Text: TextRendererRead,
        Select: WidgetOptionsRead,
        SelectMulti: WidgetOptionsRead,
        SelectChips: WidgetChipsRead,
        OptionsRadio: WidgetOptionsRead,
        OptionsCheck: WidgetOptionsRead,
        SimpleList: SimpleListRead,
        Code: CustomWidgetCode as WidgetType<UIMetaReadContextType, MuiWidgetBinding>,
        CodeSelectable: CustomWidgetCodeSelectable as WidgetType<UIMetaReadContextType, MuiWidgetBinding>,
        Time: TextRendererRead,
        Date: TextRendererRead,
        DateTime: TextRendererRead,
        Markdown: WidgetMarkdownViewer,
    },
}
