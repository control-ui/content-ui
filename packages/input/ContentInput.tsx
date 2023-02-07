import React from 'react'
import { CodeMirrorComponentProps } from '@ui-schema/kit-codemirror/CodeMirror'
import { Extension } from '@codemirror/state'
import Box from '@mui/material/Box'
import IcRefresh from '@mui/icons-material/Refresh'
import { ButtonProgress } from '@ui-controls/progress/ButtonProgress'
import { WithContentEditor } from '@content-ui/react/useContentEditor'
import { InputWarnings, InputWarningsDetails } from '@content-ui/input/InputWarnings'
import { ProgressStateWithContext, ps } from 'react-progress-state'
import { InputBottomBar } from '@content-ui/input/InputBottomBar'
import { IconButtonProgress } from '@ui-controls/progress/IconButtonProgress'
import IcAutoProcess from '@mui/icons-material/ModelTraining'
import { CodeMirrorOnChange } from '@ui-schema/kit-codemirror/useCodeMirror'
import { useContentContext, useContentSelection } from '@content-ui/react/useContent'
import { Viewer, ViewerProps } from '@content-ui/md-mui/Viewer'

export interface ViewEditorProps extends Pick<WithContentEditor, 'autoProcess' | 'setAutoProcess'> {
    CodeMirror: React.FC<CodeMirrorComponentProps>
    extensions?: Extension[]
    preview?: boolean
    setLintWarnings?: (warnings: null | number) => void
    refWarningBox?: React.MutableRefObject<HTMLDivElement | null>
    onChange?: CodeMirrorOnChange
    valid: boolean | undefined
    textValue: string
    bigSize?: boolean
    processing: ProgressStateWithContext<any>
}

export const ContentInput: React.ComponentType<ViewEditorProps & Omit<ViewerProps, 'needsProcessing' | 'editorSelection' | 'keepMounted'>> = (
    {
        valid,
        preview,
        textValue, onChange,
        setLintWarnings, refWarningBox,
        extensions,
        CodeMirror,
        processing,
        autoProcess, setAutoProcess,
        bigSize,
        ...props
    },
) => {
    const {file} = useContentContext()
    const editorSelection = useContentSelection()
    const warnings = file?.messages.length

    React.useEffect(() => {
        setLintWarnings?.(typeof warnings === 'number' ? warnings : null)
    }, [warnings, setLintWarnings])

    const classNamesContent = React.useMemo(() => (valid ? undefined : ['invalid']), [valid])

    return <>
        {preview ?
            <Viewer
                // handleTocClick={}
                needsProcessing={(processing.progress === ps.none || processing.progress === ps.start)}
                editorSelection={editorSelection}
                keepMounted
                {...props}
            /> :
            <CodeMirror
                value={textValue}
                onChange={onChange}
                extensions={extensions}
                classNamesContent={classNamesContent}
            />}

        <InputBottomBar
            pl={1} mb={0} mt={0}
            textValue={textValue}
            editorSelection={preview ? undefined : editorSelection}
            end={<>
                <InputWarnings
                    fileMessages={file?.messages}
                    processing={processing.progress === ps.start}
                    pr={0.5}
                />
                <IconButtonProgress
                    tooltip={
                        bigSize ? 'auto processing disabled, content too big' :
                            autoProcess === -1 ? 'disable auto processing' : 'enable auto processing'
                    }
                    progress={autoProcess === -1 ? processing.progress : ps.none}
                    size={'small'}
                    color={autoProcess === -1 ? 'success' : 'secondary'}
                    onClick={() => setAutoProcess(p => p === -1 ? 0 : -1)}
                    disabled={bigSize}
                    boxSx={{alignItems: 'center'}}
                    style={{padding: 4}}
                >
                    <IcAutoProcess fontSize={'small'}/>
                </IconButtonProgress>
            </>}
        />

        {bigSize || autoProcess >= 0 ?
            <Box my={1}>
                <ButtonProgress
                    progress={processing.progress}
                    size={'small'} variant={'outlined'} color={'primary'}
                    onClick={() => setAutoProcess(p => p + 1)}
                    startIcon={<IcRefresh/>}
                >
                    process content
                </ButtonProgress>
            </Box> : null}

        <Box
            style={{position: 'relative'}}
            ref={refWarningBox}
        >
            <InputWarningsDetails fileMessages={file?.messages} processing={processing.progress === ps.start}/>
        </Box>
    </>
}
