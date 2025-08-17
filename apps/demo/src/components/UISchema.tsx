import { requiredPlugin, validatorPlugin } from '@ui-schema/json-schema'
import { DefaultHandler, GroupRendererProps, UIMetaContextInternal, useUIMeta, ValidityReporter } from '@ui-schema/react'
import { schemaPluginsAdapterBuilder } from '@ui-schema/react/SchemaPluginsAdapter'
import { SchemaPlugin } from '@ui-schema/ui-schema'
import { SchemaPluginProps } from '@ui-schema/ui-schema/SchemaPlugin'
import React from 'react'
import { TableAdvanced } from '@ui-schema/ds-material/Widgets/TableAdvanced'
import { SelectChips } from '@ui-schema/ds-material/Widgets/SelectChips'
import { NumberRendererRead, StringRendererRead, TextRendererRead, WidgetBooleanRead, WidgetChipsRead, WidgetOptionsRead } from '@ui-schema/ds-material'
import { UIMetaReadContextType } from '@ui-schema/react/UIMetaReadContext'
import { MuiBinding } from '@ui-schema/ds-material/BindingType'
import Grid, { GridSpacing } from '@mui/material/Grid'
import { WidgetMarkdownViewer } from './CustomWidgets/WidgetMarkdownViewer.js'
import { WidgetMarkdownEditor } from './CustomWidgets/WidgetMarkdownEditor.js'
import { bindingComponents } from '@ui-schema/ds-material/Binding/Components'
import { widgetsDefault } from '@ui-schema/ds-material/Binding/WidgetsDefault'
import { widgetsExtended } from '@ui-schema/ds-material/Binding/WidgetsExtended'
import { GridItemPlugin } from '@ui-schema/ds-material/GridItemPlugin'

const GroupRenderer: React.ComponentType<React.PropsWithChildren<GroupRendererProps>> = ({schema, children, noGrid}) => {
    const {readDense, readActive} = useUIMeta<UIMetaReadContextType & UIMetaContextInternal>()
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

export const customBinding: MuiBinding = {
    // ...binding,
    // GroupRenderer: GroupRenderer,
    // pluginStack: [
    //     InjectSplitSchemaPlugin,
    //     SortPlugin,
    //     ...widgets.pluginStack,
    // ],
    // pluginSimpleStack: [
    //     emailValidator,
    //     ...widgets.pluginSimpleStack,
    // ],
    // types: widgets.types,
    // custom: {
    //     ...widgets.custom,
    // },
    ...bindingComponents,
    GroupRenderer: GroupRenderer,

    // Widget mapping by schema type or custom ID.
    widgets: {
        ...widgetsDefault,
        ...widgetsExtended,

        SelectChips: SelectChips,
        // Table: CustomTable,
        TableAdvanced: TableAdvanced,
        // Time: CustomTimePicker,
        // Date: CustomDatePicker,
        // DateTime: CustomDateTimePicker,
        Markdown: WidgetMarkdownEditor,
    },

    // Plugins that wrap each rendered widget.
    widgetPlugins: [
        DefaultHandler, // handles `default` keyword

        // Runs SchemaPlugins, connects to SchemaResource (if enabled)
        schemaPluginsAdapterBuilder([
            // runs `validate` and related schema postprocessing
            validatorPlugin,

            // injects the `required` prop
            requiredPlugin,

            {
                handle: ({schema, readDense}) => ({
                    schema: readDense ? schema.setIn(['view', 'dense'], readDense) : schema,
                }),
            } satisfies SchemaPlugin<SchemaPluginProps & UIMetaReadContextType>,
        ]),

        // SchemaGridHandler, // MUI v5/6 Grid item
        GridItemPlugin, // MUI v7 Grid item

        ValidityReporter, // keeps `valid`/`errors` in sync with `store`
    ],
}

export const readWidgets: any = {
    ...widgetsDefault,
    string: StringRendererRead,
    number: NumberRendererRead,
    integer: NumberRendererRead,
    boolean: WidgetBooleanRead,
    Text: TextRendererRead,
    Select: WidgetOptionsRead,
    SelectMulti: WidgetOptionsRead,
    SelectChips: WidgetChipsRead,
    OptionsRadio: WidgetOptionsRead,
    OptionsCheck: WidgetOptionsRead,
    // SimpleList: SimpleListRead,
    // Code: CustomWidgetCode,
    // CodeSelectable: CustomWidgetCodeSelectable,
    // Time: TextRendererRead,
    // Date: TextRendererRead,
    // DateTime: TextRendererRead,
    Markdown: WidgetMarkdownViewer,
}
