import { ViewerBox, ViewerBoxProps } from '@content-ui/md-mui/ViewerBox'
import IcAutoFixNormal from '@mui/icons-material/AutoFixNormal'
import { useContentSelection } from '@content-ui/react/ContentSelectionContext'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { ComponentType, CSSProperties, MutableRefObject, useMemo } from 'react'
import { CodeMirrorComponentProps } from '@ui-schema/kit-codemirror/CodeMirror'
import { Extension } from '@codemirror/state'
import Box from '@mui/material/Box'
import IcRefresh from '@mui/icons-material/Refresh'
import { ButtonProgress } from '@ui-controls/progress/ButtonProgress'
import { WithContentEditor } from '@content-ui/input/useContentEditor'
import { InputWarnings, InputWarningsDetails } from '@content-ui/input/InputWarnings'
import { InputBottomBar } from '@content-ui/input/InputBottomBar'
import { IconButtonProgress } from '@ui-controls/progress/IconButtonProgress'
import IcAutoProcess from '@mui/icons-material/ModelTraining'
import { CodeMirrorOnChange } from '@ui-schema/kit-codemirror/useCodeMirror'
import { useContentContext } from '@content-ui/react/ContentFileContext'
import { WithContent } from '@content-ui/react/useContent'

export interface ViewEditorProps extends Pick<WithContentEditor, 'autoProcess' | 'setAutoProcess'>, Omit<WithContent, 'file' | 'root'> {
    CodeMirror: ComponentType<CodeMirrorComponentProps>
    extensions?: Extension[]
    preview?: boolean
    refWarningBox?: MutableRefObject<HTMLDivElement | null>
    onChange?: CodeMirrorOnChange
    valid?: boolean
    textValue: string
    bigSize?: boolean
    noLint?: boolean
    ViewerBox?: ComponentType<ViewerBoxProps>
    // passed to the `CodeMirror` component
    editorStyle?: CSSProperties
    onReformat?: () => void
}

export const ContentInput = (
    {
        valid,
        preview,
        textValue, onChange,
        refWarningBox,
        extensions,
        editorStyle,
        CodeMirror,
        processing, noLint, outdated,
        autoProcess, setAutoProcess,
        bigSize,
        ViewerBox: ViewerBoxProp = ViewerBox,
        onReformat,
        ...props
    }: ViewEditorProps & Omit<ViewerBoxProps, 'needsProcessing' | 'editorSelection' | 'onChange'>,
) => {
    const {file} = useContentContext()
    const editorSelection = useContentSelection()

    const classNamesContent = useMemo(() => (valid === false ? ['invalid'] : undefined), [valid])

    return <>
        {preview ?
            <ViewerBoxProp
                outdated={outdated}
                processing={processing}
                {...props}
            /> :
            <CodeMirror
                value={textValue}
                onChange={onChange}
                extensions={extensions}
                classNamesContent={classNamesContent}
                style={editorStyle}
            />}

        <InputBottomBar
            pl={1} mb={0} mt={0}
            textValue={textValue}
            editorSelection={preview ? undefined : editorSelection}
            end={<>
                {noLint ? null :
                    <InputWarnings
                        fileMessages={file?.messages}
                        processing={processing === 'loading'}
                        mr={0.5}
                    />}

                {onReformat ?
                    <Tooltip title={'reformat'} disableInteractive>
                        <IconButton
                            onClick={() => onReformat()} size={'small'}
                            sx={theme => ({
                                padding: 0.5, mr: 0.5,
                                color: theme.palette.grey[500],
                                '&:hover, &:focus-within': {
                                    color: theme.palette.text.primary,
                                },
                            })}
                        >
                            <IcAutoFixNormal fontSize={'small'}/>
                        </IconButton>
                    </Tooltip> : null}

                <IconButtonProgress
                    tooltip={
                        bigSize ? 'auto processing disabled, content too big' :
                            autoProcess === -1 ? 'disable auto processing' : 'enable auto processing'
                    }
                    progress={autoProcess === -1 ? processing : 'none'}
                    size={'small'}
                    color={autoProcess === -1 ? 'success' : outdated ? 'info' : undefined}
                    onClick={() => setAutoProcess(p => p === -1 ? 0 : -1)}
                    disabled={bigSize}
                    boxSx={{alignItems: 'center'}}
                    sx={theme => ({
                        padding: 0.5,
                        color: autoProcess === -1 ? 'success.main' : outdated ? 'info.main' : theme.palette.grey[500],
                        '&:hover, &:focus-within': {
                            color: autoProcess === -1 ? 'success.main' : outdated ? 'info.main' : theme.palette.text.primary,
                        },
                    })}
                >
                    <IcAutoProcess fontSize={'small'}/>
                </IconButtonProgress>
            </>}
        />

        {bigSize || autoProcess >= 0 ?
            <Box my={1} sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <ButtonProgress
                    progress={processing}
                    size={'small'} variant={'outlined'} color={'primary'}
                    onClick={() => setAutoProcess(p => p + 1)}
                    startIcon={<IcRefresh/>}
                >
                    process content
                </ButtonProgress>

                {outdated ?
                    <Typography
                        variant={'caption'}
                        fontWeight={'bold'}
                        color={'info.main'}
                    >{'outdated'}</Typography> : null}
            </Box> : null}

        <Box
            style={{position: 'relative', display: noLint ? 'none' : undefined}}
            ref={refWarningBox}
        >
            <InputWarningsDetails fileMessages={file?.messages} processing={processing === 'loading'}/>
        </Box>
    </>
}
