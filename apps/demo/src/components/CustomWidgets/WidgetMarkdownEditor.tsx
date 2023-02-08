import React from 'react'
import { TransTitle, WidgetProps, WithScalarValue } from '@ui-schema/ui-schema'
import { SettingsProvider } from '@content-ui/react/LeafSettings'
import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'
import { IconButtonTooltip } from '@content-ui/md-mui/MuiComponents/IconButtonTooltip'
import Badge from '@mui/material/Badge'
import IcCheck from '@mui/icons-material/Check'
import IcWarning from '@mui/icons-material/Warning'
import IcEdit from '@mui/icons-material/Edit'
import IcPreview from '@mui/icons-material/Preview'
import { CustomCodeMirror, getHighlight } from '../CustomCodeMirror'
import { ContentInput } from '@content-ui/input/ContentInput'
import { useContentEditor } from '@content-ui/react/useContentEditor'
import { useContent } from '@content-ui/react/useContent'
import { ContentFileProvider } from '@content-ui/react/ContentFileProvider'

export const WidgetMarkdownEditor: React.ComponentType<WidgetProps & WithScalarValue & { readOnly?: boolean }> = (
    {
        storeKeys, schema, value,
        valid, required, showValidity, readOnly,
        onChange,
    },
) => {
    const [lintWarnings, setLintWarnings] = React.useState<number | null>(0)
    const refWarningBox = React.useRef<HTMLDivElement | null>(null)
    const [preview, setPreview] = React.useState<boolean | undefined>(undefined)

    const onChangeText = React.useCallback(
        (newValue: string) =>
            onChange({
                type: 'set',
                storeKeys: storeKeys,
                schema: schema,
                scopes: ['value'],
                data: {
                    value: newValue,
                },
            }),
        [onChange, storeKeys, schema],
    )

    const {
        textValue,
        handleOnChange,
        editorSelection,
        bigSize, autoProcess, setAutoProcess,
    } = useContentEditor(
        typeof value === 'string' ? value : '',
        onChangeText,
    )
    const {processing, root, file} = useContent(textValue, textValue.length > 10000 ? 460 : 280, 0, autoProcess)

    const extensions = React.useMemo(() => {
        const highlight = getHighlight('md')
        return [
            ...(highlight ? [highlight] : []),
        ]
    }, [])

    const hideTitle = schema?.getIn(['view', 'hideTitle'])

    return <>
        <SettingsProvider
            followEditor
            headlineLinkable
            headlineSelectable headlineSelectableOnHover
            headlineOffset={1}
        >
            <Box mb={0.5} style={{display: 'flex', alignItems: 'center'}}>
                <FormLabel error={(!valid && showValidity)} style={{marginRight: 'auto'}}>
                    {hideTitle ? null : <>
                        <TransTitle storeKeys={storeKeys} schema={schema}/>
                        {required ? ' *' : null}
                    </>}
                </FormLabel>
                <IconButtonTooltip
                    tooltip={lintWarnings === null ? 'processing text...' : (lintWarnings === 0 ? 'no ' : '') + 'lint warnings'}
                    onClick={() => setTimeout(() => refWarningBox?.current?.scrollIntoView({behavior: 'smooth'}), 20)}
                    disabled={lintWarnings === 0}
                    size={'small'} sx={{mr: 0.5}}
                    disableInteractive
                >
                    <Badge badgeContent={lintWarnings || 0} hidden={lintWarnings === null} overlap="circular" max={99}>
                        {lintWarnings === 0 ?
                            <IcCheck/> :
                            <IcWarning
                                color={lintWarnings === null ? 'secondary' : 'warning'}
                            />}
                    </Badge>
                </IconButtonTooltip>
                <IconButtonTooltip
                    tooltip={preview ? 'edit' : 'preview'}
                    onClick={() => setPreview(s => !s)}
                    size={'small'} sx={{mr: 0.5}}
                    disableInteractive
                >
                    {preview ? <IcEdit/> : <IcPreview/>}
                </IconButtonTooltip>
            </Box>

            <ContentFileProvider
                root={root}
                file={file}
                editorSelection={editorSelection}
            >
                <ContentInput
                    preview={preview}
                    setLintWarnings={setLintWarnings}
                    refWarningBox={refWarningBox}
                    CodeMirror={CustomCodeMirror}
                    onChange={readOnly ? undefined : handleOnChange}
                    extensions={extensions}
                    textValue={textValue}
                    bigSize={bigSize}
                    processing={processing}
                    autoProcess={autoProcess}
                    setAutoProcess={setAutoProcess}
                    valid={valid}
                    mb={1}
                />
            </ContentFileProvider>
        </SettingsProvider>
    </>
}

