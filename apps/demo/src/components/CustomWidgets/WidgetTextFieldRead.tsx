import React, { MouseEventHandler } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { WidgetProps, WithScalarValue } from '@ui-schema/ui-schema'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'
import { UIMetaReadContextType } from '@ui-schema/ui-schema/UIMetaReadContext'
import { TitleBoxRead } from '@ui-schema/ds-material/Component/TitleBoxRead'
import Link from '@mui/material/Link'

export interface StringRendererBaseProps {
    onClick?: MouseEventHandler<HTMLDivElement> | undefined
}

export interface StringRendererReadProps extends StringRendererBaseProps {
    multiline?: boolean
    style?: React.CSSProperties
}

export const StringRendererRead = <P extends WidgetProps<MuiWidgetBinding> & UIMetaReadContextType = WidgetProps<MuiWidgetBinding> & UIMetaReadContextType & { asListItem?: boolean }>(
    {
        multiline,
        storeKeys, schema, value,
        showValidity, valid, errors,
        style,
        onClick,
        widgets, readDense, asListItem,
    }: P & WithScalarValue & StringRendererReadProps & { asListItem?: boolean },
): React.ReactElement => {
    const hideTitle = Boolean(schema.getIn(['view', 'hideTitle']))
    const InfoRenderer = widgets?.InfoRenderer
    const lines = multiline && typeof value === 'string' ? value.split('\n') : []
    const hasInfo = Boolean(InfoRenderer && schema?.get('info'))
    return <>
        <Box onClick={onClick} style={style} sx={{display: asListItem ? 'flex' : undefined}}>
            <TitleBoxRead
                hideTitle={hideTitle}
                hasInfo={hasInfo}
                InfoRenderer={InfoRenderer}
                valid={valid}
                errors={errors}
                storeKeys={storeKeys}
                schema={schema}
            />
            {multiline ?
                typeof value === 'string' ?
                    lines.map((line, i) =>
                        <Typography
                            key={i}
                            gutterBottom={i < lines.length - 1}
                            variant={readDense ? 'body2' : 'body1'}
                            sx={{pl: asListItem ? 1 : undefined}}
                        >{line}</Typography>,
                    ) :
                    <Typography><span style={{opacity: 0.65}}>-</span></Typography> :
                <Typography variant={readDense ? 'body2' : 'body1'} sx={{pl: asListItem ? 1 : undefined}}>
                    {(typeof value === 'string' && value.trim().length) || typeof value === 'number' ?
                        typeof value === 'string' && (schema.get('format') === 'tel' || schema.get('format') === 'email') ?
                            <Link href={(schema.get('format') === 'email' ? 'mailto' : 'tel') + ':' + value.trim()}>{value}</Link> :
                            value :
                        <span style={{opacity: 0.65}}>-</span>
                    }
                </Typography>}

            <ValidityHelperText
                errors={errors} showValidity={showValidity} schema={schema}
            />
        </Box>
    </>
}

export const TextRendererRead = <P extends WidgetProps<MuiWidgetBinding> & UIMetaReadContextType = WidgetProps<MuiWidgetBinding> & UIMetaReadContextType>(
    {
        schema,
        ...props
    }: P & WithScalarValue & StringRendererBaseProps,
): React.ReactElement => {
    return <StringRendererRead
        {...props}
        schema={schema}
        multiline
    />
}
