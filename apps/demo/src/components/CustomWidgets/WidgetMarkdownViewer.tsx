import { ContentParser } from '@content-ui/md/parser/ContentParser'
import { UIMetaReadContextType } from '@ui-schema/react/UIMetaReadContext'
import { TranslateTitle, WidgetProps } from '@ui-schema/react'
import React from 'react'
import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { ViewerBoxRouter } from '@content-ui/md-mui/ViewerBoxRouter'
import { ViewerFromText } from '@content-ui/react/ViewerFromText'
import { SettingsProvider } from '@content-ui/react/LeafSettings'

export const WidgetMarkdownViewer: React.ComponentType<WidgetProps & UIMetaReadContextType> = (
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
                    <TranslateTitle storeKeys={storeKeys} schema={schema}/>
                    {required ? ' *' : null}
                    {readOnly ? <em style={{paddingLeft: 3}}>ro</em> : null}
                </>}
            </FormLabel>
        </Box>

        <SettingsProvider
            headlineOffset={1}
            headlineLinkable
            headlineSelectable
            headlineSelectableOnHover
            dense={dense || (readActive && readDense)}
        >
            <ViewerFromText
                Viewer={ViewerBoxRouter}
                processor={ContentParser}
                textValue={typeof value === 'string' ? value : ''}
                onMount
            />
        </SettingsProvider>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </>
}
