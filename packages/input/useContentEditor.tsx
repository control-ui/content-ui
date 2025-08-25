import { Transaction } from '@codemirror/state'
import { ContentSelection, createContentSelectionStore, ContentSelectionStore } from '@content-ui/react/ContentSelectionContext'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { CodeMirrorOnChange } from '@ui-schema/kit-codemirror/useCodeMirror'

export type WithContentEditor = {
    editorSelectionStore: ContentSelectionStore

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
    // note: this already must use/create the editor selection store, to not cause re-renders for every selection change, but support scheduling a re-render through that;
    //       and the changes here should be rendered ASAP, while for follower + selection highlight lazy is better due to amount of nodes
    const [editorSelectionStore] = useState<ContentSelectionStore>(
        () => createContentSelectionStore(undefined),
    )

    const bigSize = textValue.length > 50000
    const [autoProcess, setAutoProcess] = useState(bigSize ? 0 : -1)

    useEffect(() => {
        setAutoProcess(bigSize ? 0 : -1)
    }, [bigSize, setAutoProcess])

    const handleOnChange: CodeMirrorOnChange = useCallback((v, newValue) => {
        if(v.view.hasFocus) {
            const startLine = v.state.doc.lineAt(v.state.selection.main.from)
            const endLine = v.state.doc.lineAt(v.state.selection.main.to)

            const nextSelection: ContentSelection = {
                selected: true,
                start: v.state.selection.main.from,
                startLine: startLine.number,
                startLineStart: startLine.from,
                startLineEnd: startLine.to,
                end: v.state.selection.main.to,
                endLine: endLine.number,
                endLineStart: endLine.from,
                endLineEnd: endLine.to,
                endDoc: v.state.doc.length,
                endLineDoc: v.state.doc.lineAt(v.state.doc.length).number,
            }

            // find prev/next if either start or end are empty lines, to ensure a md-leaf will be selected,
            // this still doesn't work if the respective leaf is hidden, e.g. like frontmatter
            const sameLine = startLine.number === endLine.number
            const startIsEmpty = startLine.from === startLine.to
            const endIsEmpty = endLine.from === endLine.to

            // if not sameLine, check if any non-empty line is between them
            let emptyRange = true
            if(!sameLine && startIsEmpty && endIsEmpty) {
                let tmpLine = v.state.doc.lineAt(startLine.to + 1)
                while(tmpLine.number < endLine.number) {
                    if(tmpLine.from !== tmpLine.to) {
                        emptyRange = false
                        break
                    }
                    tmpLine = v.state.doc.lineAt(tmpLine.to + 1)
                }
            }

            if(emptyRange && startLine.from > 0 && startIsEmpty && endIsEmpty) {
                // if not first line and empty line, find previous non-empty line
                let tmpLine = v.state.doc.lineAt(startLine.from - 1)
                while(tmpLine.from > 0 && tmpLine.from === tmpLine.to) {
                    tmpLine = v.state.doc.lineAt(tmpLine.from - 1)
                }
                nextSelection.startLine = tmpLine.number
                nextSelection.startLineStart = tmpLine.from
                nextSelection.startLineEnd = tmpLine.to
            }

            if(
                emptyRange &&
                // only calc non-empty end line if non-empty start line could not be found
                nextSelection.startLineStart === nextSelection.startLineEnd
                && endIsEmpty
                && v.state.doc.length > endLine.to + 1
            ) {
                // on empty line, find next non-empty line
                let tmpLine = v.state.doc.lineAt(endLine.to + 1)
                while(tmpLine.from > 0 && tmpLine.from === tmpLine.to) {
                    tmpLine = v.state.doc.lineAt(tmpLine.to + 1)
                }
                nextSelection.endLine = tmpLine.number
                nextSelection.endLineStart = tmpLine.from
                nextSelection.endLineEnd = tmpLine.to
            }

            editorSelectionStore?.setValue(nextSelection)
        } else {
            editorSelectionStore?.setValue(undefined)
        }
        if(!v.docChanged || typeof newValue !== 'string') {
            return
        }
        const isFromRemote = v.transactions.some(t => t.annotation(Transaction.remote))
        if(isFromRemote) {
            return
        }
        onChange(newValue)
    }, [editorSelectionStore, onChange])

    return {
        lines: textValue.split('\n').length,
        textValue: textValue,
        bigSize: bigSize,
        autoProcess: autoProcess,
        setAutoProcess: setAutoProcess,
        handleOnChange: handleOnChange,
        editorSelectionStore: editorSelectionStore,
    }
}
