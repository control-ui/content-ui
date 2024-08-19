import { UIMetaReadContextType } from '@ui-schema/ui-schema/UIMetaReadContext/UIMetaReadContext'
import React from 'react'
import { TransTitle, WidgetProps, WithScalarValue } from '@ui-schema/ui-schema'
import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { ViewerFromText } from '@content-ui/md-mui/Viewer'
import { SettingsProvider } from '@content-ui/react/LeafSettings'

export const WidgetMarkdownViewer: React.ComponentType<WidgetProps & WithScalarValue & UIMetaReadContextType> = (
    {
        storeKeys, schema, value, readActive, readDense,
        valid, required, errors, showValidity,
    },
) => {
    const hideTitle = schema?.getIn(['view', 'hideTitle'])
    const dense = schema?.getIn(['view', 'dense']) as boolean
    const readOnly = schema?.get('readOnly')

    return <>
        <Box mb={0.5}>
            <FormLabel error={(!valid && showValidity)}>
                {hideTitle ? null : <>
                    <TransTitle storeKeys={storeKeys} schema={schema}/>
                    {required ? ' *' : null}
                    {readOnly ? <em style={{paddingLeft: 3}}>ro</em> : null}
                </>}
            </FormLabel>
        </Box>

        <SettingsProvider
            headlineOffset={1}
            dense={dense || (readActive && readDense)}
        >
            <ViewerFromText
                // storeKeys={storeKeys}
                textValue={typeof value === 'string' ? value : ''}
                onMount
            />
        </SettingsProvider>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </>
}
