import React, { MouseEventHandler } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { memo, PluginStack, StoreSchemaType, WidgetProps, WithValue } from '@ui-schema/ui-schema'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'
import { UIMetaReadContextType } from '@ui-schema/ui-schema/UIMetaReadContext'
import { TitleBoxRead } from '@ui-schema/ds-material/Component/TitleBoxRead'
import { extractValue } from '@ui-schema/ui-schema/UIStore'
import { List } from 'immutable'

export interface SimpleListBaseProps {
    onClick?: MouseEventHandler<HTMLDivElement> | undefined
}

export interface SimpleListReadProps extends SimpleListBaseProps {
    multiline?: boolean
    style?: React.CSSProperties
}

export const SimpleListReadBase = <P extends WidgetProps<MuiWidgetBinding> & UIMetaReadContextType = WidgetProps<MuiWidgetBinding> & UIMetaReadContextType>(
    {
        storeKeys, schema, value,
        showValidity, valid, errors,
        style,
        onClick,
        widgets,
    }: P & WithValue & SimpleListReadProps,
): React.ReactElement => {
    const hideTitle = Boolean(schema.getIn(['view', 'hideTitle']))
    const InfoRenderer = widgets?.InfoRenderer
    const list = List.isList(value) ? value : undefined
    const hasInfo = Boolean(InfoRenderer && schema?.get('info'))
    return <>
        <Box onClick={onClick} style={style}>
            <TitleBoxRead
                hideTitle={hideTitle}
                hasInfo={hasInfo}
                InfoRenderer={InfoRenderer}
                valid={valid}
                errors={errors}
                storeKeys={storeKeys}
                schema={schema}
            />
            {list?.size ?
                list?.map((line, i) =>
                    <PluginStack<{ asListItem?: boolean }>
                        key={i}
                        schema={schema.get('items') as StoreSchemaType}
                        storeKeys={storeKeys.push(i)}
                        parentSchema={schema}
                        asListItem
                    />,
                ).valueSeq() :
                <Typography><span style={{opacity: 0.65}}>-</span></Typography>}

            <ValidityHelperText
                errors={errors} showValidity={showValidity} schema={schema}
            />
        </Box>
    </>
}

export const SimpleListRead = extractValue(memo(SimpleListReadBase))
