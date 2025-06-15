import { ViewerBoxRouter } from '@content-ui/md-mui/ViewerBoxRouter'
import { ContentParser } from '@content-ui/md/parser/ContentParser'
import { ContentSelectionProvider } from '@content-ui/react/ContentSelectionContext'
import { UIMetaReadContextType } from '@ui-schema/ui-schema/UIMetaReadContext'
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
import { useContentEditor } from '@content-ui/input/useContentEditor'
import { useContent } from '@content-ui/react/useContent'
import { ContentFileProvider } from '@content-ui/react/ContentFileContext'

export const WidgetMarkdownEditor: React.ComponentType<WidgetProps & WithScalarValue & { readOnly?: boolean } & UIMetaReadContextType> = (
    {
        storeKeys, schema, value,
        valid, required, showValidity,
        readActive, readDense, readOnly,
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
    const {processing, outdated, root, file} = useContent({
        textValue,
        parseDelay:
            textValue.length > 10000
                ? 560
                : 180,
        adaptiveDelay: true,
        prioritizeLatest: false,
        autoProcess,
        onMount: true,
        processor: ContentParser,
    })

    const warnings = file?.messages.length

    React.useEffect(() => {
        setLintWarnings?.(typeof warnings === 'number' ? warnings : null)
    }, [warnings, setLintWarnings])

    const extensions = React.useMemo(() => {
        const highlight = getHighlight('md')
        return [
            ...(highlight ? [highlight] : []),
        ]
    }, [])
    const hideTitle = schema?.getIn(['view', 'hideTitle'])
    const dense = schema?.getIn(['view', 'dense']) as boolean

    return <>
        <SettingsProvider
            followEditor
            headlineLinkable
            headlineSelectable headlineSelectableOnHover
            headlineOffset={1}
            dense={dense || (readActive && readDense)}
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
            >
                <ContentSelectionProvider selection={editorSelection}>
                    <ContentInput
                        preview={preview}
                        refWarningBox={refWarningBox}
                        CodeMirror={CustomCodeMirror}
                        ViewerBox={ViewerBoxRouter}
                        onChange={readOnly ? undefined : handleOnChange}
                        extensions={extensions}
                        textValue={textValue}
                        bigSize={bigSize}
                        processing={processing}
                        outdated={outdated}
                        autoProcess={autoProcess}
                        setAutoProcess={setAutoProcess}
                        valid={valid}
                        mb={1}
                    />
                </ContentSelectionProvider>
            </ContentFileProvider>
        </SettingsProvider>
    </>
}

