import React from 'react'
import { List } from 'immutable'
import { WidgetProps, WithScalarValue, StoreSchemaType } from '@ui-schema/ui-schema'
import { WidgetDateTimePicker } from '@ui-schema/material-pickers/WidgetDateTimePicker'
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker'
import { WidgetDatePicker } from '@ui-schema/material-pickers/WidgetDatePicker'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import { WidgetTimePicker } from '@ui-schema/material-pickers/WidgetTimePicker'
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker'

const getExtraProps = (schema: StoreSchemaType, type: 'date' | 'date-time' | 'time') => {
    const data: { [k: string]: any } = {}
    if(
        schema.getIn(['date', 'variant']) === 'static' ||
        schema.getIn(['date', 'variant']) === 'dialog'
    ) {
        data.clearable = schema.getIn(['date', 'clearable']) as boolean | undefined
        data.showTodayButton = schema.getIn(['date', 'today']) as boolean | undefined
        data.showToolbar = schema.getIn(['date', 'toolbar']) as boolean | undefined
    }
    if(type === 'date-time' || type === 'time') {
        data.ampm = schema.getIn(['date', 'ampm'])
    }
    return data
}

export const CustomDateTimePicker: React.FC<WidgetProps & WithScalarValue> = (props) => {
    const {schema} = props
    const Picker =
        schema.getIn(['date', 'variant']) === 'dialog' ?
            MobileDateTimePicker :
            schema.getIn(['date', 'variant']) === 'static' ?
                StaticDateTimePicker : DesktopDateTimePicker
    const pickerProps = React.useMemo(() => getExtraProps(schema, 'date-time'), [schema])
    return <WidgetDateTimePicker
        {...props}
        Picker={Picker}
        schema={
            // fix fatal error when missing `views`, seems tu be bug in @mui/x
            schema.getIn(['date', 'variant']) === 'static' ?
                schema.setIn(['date', 'views'], List(['year', 'month', 'day', 'hours', 'minutes', 'seconds'])) :
                schema
        }
        pickerProps={pickerProps}
    />
}

export const CustomDatePicker: React.FC<WidgetProps & WithScalarValue> = (props) => {
    const {schema} = props
    const Picker =
        schema.getIn(['date', 'variant']) === 'dialog' ?
            MobileDatePicker :
            schema.getIn(['date', 'variant']) === 'static' ?
                StaticDatePicker : DesktopDatePicker
    const pickerProps = React.useMemo(() => getExtraProps(schema, 'date'), [schema])
    return <WidgetDatePicker
        {...props}
        Picker={Picker}
        schema={
            // fix fatal error when missing `views`, seems tu be bug in @mui/x
            schema.getIn(['date', 'variant']) === 'static' ?
                schema.setIn(['date', 'views'], List(['year', 'month', 'day'])) :
                schema
        }
        pickerProps={pickerProps}
    />
}

export const CustomTimePicker: React.FC<WidgetProps & WithScalarValue> = (props) => {
    const {schema} = props
    const Picker =
        schema.getIn(['date', 'variant']) === 'dialog' ?
            MobileTimePicker :
            schema.getIn(['date', 'variant']) === 'static' ?
                StaticTimePicker : DesktopTimePicker
    const pickerProps = React.useMemo(() => getExtraProps(schema, 'time'), [schema])
    return <WidgetTimePicker
        {...props}
        Picker={Picker}
        schema={
            // fix fatal error when missing `views`, seems tu be bug in @mui/x
            schema.getIn(['date', 'variant']) === 'static' ?
                schema.setIn(['date', 'views'], List(['hours', 'minutes', 'seconds'])) :
                schema
        }
        pickerProps={pickerProps}
    />
}
