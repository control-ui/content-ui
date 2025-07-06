import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget.js'
import { NumberRendererCell, StringRendererCell, TextRendererCell } from '@ui-schema/ds-material/Widgets/TextFieldCell'
import { Table } from '@ui-schema/ds-material/Widgets/Table'
import { CustomWidgetsBinding } from '../UISchema.js'

export const CustomTable: React.ComponentType<WidgetProps<CustomWidgetsBinding>> = ({widgets, ...props}) => {
    const customWidgets = React.useMemo(() => ({
        ...widgets,
        types: {
            ...widgets.types,
            string: StringRendererCell,
            number: NumberRendererCell,
            integer: NumberRendererCell,
        },
        custom: {
            ...widgets.custom,
            Text: TextRendererCell,
        },
    }), [widgets])

    return <Table
        {...props}
        widgets={customWidgets}
    />
}
