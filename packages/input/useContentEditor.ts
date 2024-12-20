import { Transaction } from '@codemirror/state'
import { ContentSelection } from '@content-ui/react/ContentSelectionContext'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { CodeMirrorOnChange } from '@ui-schema/kit-codemirror/useCodeMirror'

export type WithContentEditor = {
    editorSelection: ContentSelection | undefined
    setEditorSelection: Dispatch<SetStateAction<ContentSelection | undefined>>

    lines: number
    textValue: string
    bigSize: boolean
    autoProcess: number
    setAutoProcess: Dispatch<SetStateAction<number>>
    handleOnChange: CodeMirrorOnChange
}

export const useContentEditor = (
    textValue: string,
    onChange: (newValue: string) => void,
): WithContentEditor => {
    const [editorSelection, setEditorSelection] = useState<ContentSelection | undefined>(undefined)

    const bigSize = textValue.length > 50000
    const [autoProcess, setAutoProcess] = useState(bigSize ? 0 : -1)

    const valueTextRef = useRef(textValue)
    valueTextRef.current = textValue

    useEffect(() => {
        setAutoProcess(bigSize ? 0 : -1)
    }, [bigSize, setAutoProcess])

    const handleOnChange: CodeMirrorOnChange = useCallback((v, newValue) => {
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
        const isFromRemote = v.transactions.some(t => t.annotation(Transaction.remote))
        if(isFromRemote) {
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
