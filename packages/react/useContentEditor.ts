import React from 'react'
import { EditorSelection } from '@content-ui/react/useContent'
import { CodeMirrorOnChange } from '@ui-schema/kit-codemirror/useCodeMirror'

export type WithContentEditor = {
    editorSelection: EditorSelection | undefined
    setEditorSelection: React.Dispatch<React.SetStateAction<EditorSelection | undefined>>

    lines: number
    textValue: string
    bigSize: boolean
    autoProcess: number
    setAutoProcess: React.Dispatch<React.SetStateAction<number>>
    handleOnChange: CodeMirrorOnChange
}

export const useContentEditor = (
    textValue: string,
    onChange: (newValue: string) => void,
): WithContentEditor => {
    const [editorSelection, setEditorSelection] = React.useState<EditorSelection | undefined>(undefined)

    const bigSize = textValue.length > 50000
    const [autoProcess, setAutoProcess] = React.useState(bigSize ? 0 : -1)

    const valueTextRef = React.useRef(textValue)
    valueTextRef.current = textValue

    React.useEffect(() => {
        setAutoProcess(bigSize ? 0 : -1)
    }, [bigSize, setAutoProcess])

    const handleOnChange: CodeMirrorOnChange = React.useCallback((v, newValue) => {
        if(v.view.hasFocus) {
            const startLine = v.state.doc.lineAt(v.state.selection.main.from)
            const endLine = v.state.doc.lineAt(v.state.selection.main.to)
            setEditorSelection({
                selected: true,
                start: v.state.selection.main.from,
                startLine: startLine.number,
                startLineStart: startLine.from,
                startLineEnd: startLine.from,
                end: v.state.selection.main.to,
                endLine: endLine.number,
                endLineStart: endLine.from,
                endLineEnd: endLine.to,
            })
        } else {
            setEditorSelection(undefined)
        }
        if(!v.docChanged || typeof newValue !== 'string') {
            return
        }
        onChange(newValue)
    }, [onChange, setEditorSelection])

    return {
        lines: textValue.split('\n').length,
        textValue: textValue,
        bigSize: bigSize,
        autoProcess: autoProcess,
        setAutoProcess: setAutoProcess,
        handleOnChange: handleOnChange,
        editorSelection: editorSelection,
        setEditorSelection: setEditorSelection,
    }
}
