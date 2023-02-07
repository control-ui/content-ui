import React from 'react'
import { VFile } from 'vfile'
import { ProgressStateWithContext, ps, useProgress } from 'react-progress-state'
import { Root } from 'mdast'
import { ContentParser } from '@content-ui/md/parser/ContentParser'
import { parseTo } from '@content-ui/md/parser/ParseTo'

export interface EditorSelectionPosition {
    start: number
    startLine: number
    startLineStart: number
    startLineEnd: number

    end: number
    endLine: number
    endLineStart: number
    endLineEnd: number
}

export interface EditorSelectionFilled extends EditorSelectionPosition {
    selected: true
}

export interface EditorSelectionEmpty extends Partial<EditorSelectionPosition> {
    selected?: false
}

export type EditorSelection = EditorSelectionEmpty | EditorSelectionFilled

export interface ContentFileContextType {
    // root?: OrderedMap<string, any>
    root?: Root
    file?: VFile
}

export const ContentContext = React.createContext<ContentFileContextType>({})

export const useContentContext = () => React.useContext(ContentContext)

export const ContentSelectionContext = React.createContext<EditorSelection | undefined>(undefined)

export const useContentSelection = () => React.useContext(ContentSelectionContext)

export interface WithContent {
    file: VFile | undefined
    root: Root | undefined
    processing: ProgressStateWithContext<any>
}

export const useContent = (
    textValue: string | undefined,
    parseDelay: number = 0,
    forceAfter: number = 0,
    runState: number = -1,// `== -1` automatic, `== 0` off, `> 0` on each increment
): WithContent => {
    const [processing, setProcessing, startProcessing, resetProcessing] = useProgress()
    const [v, setV] = React.useState<number>(0)
    const nextParser = React.useRef<undefined | (() => () => void)>(undefined)
    const [astValue, setAstValue] = React.useState<{
        root: Root
        file: VFile
    } | undefined>(undefined)

    React.useEffect(() => {
        if(typeof textValue !== 'string') {
            setAstValue(undefined)
            resetProcessing(ps.done)
            return undefined
        }

        nextParser.current = () => {
            const pid = startProcessing()
            return () => {
                parseTo(textValue, ContentParser)
                    .then((parsed) => {
                        const isPid = setProcessing(ps.done, undefined, pid)
                        if(!isPid) return
                        setAstValue(parsed)
                    })
                    .catch((e) => {
                        console.error('useContent parsing failed', e)
                        const isPid = setProcessing(ps.error, e, pid)
                        if(!isPid) return
                        setAstValue(undefined)
                    })
            }
        }

        if(runState === -1) {
            setV(v => v + 1)
        }
    }, [textValue, setProcessing, startProcessing, runState, resetProcessing])

    React.useEffect(() => {
        if(runState >= 0) {
            setV(runState)
        }
    }, [runState])

    React.useEffect(() => {
        if(!nextParser.current || v === 0) return
        const runParser = nextParser.current()
        if(parseDelay <= 0) {
            runParser()
            return
        }
        const timer2: { current: undefined | number } = {current: undefined}
        const timer = window.setTimeout(() => {
            window.clearTimeout(timer2.current)
            runParser()
        }, parseDelay)
        if(forceAfter > 0 && forceAfter > parseDelay) {
            timer2.current = window.setTimeout(() => {
                runParser()
            }, parseDelay)
        }
        // for animation edge case, to reduce jumping, it is better to not reset setProcessing on every change
        return () => window.clearTimeout(timer)
    }, [v, parseDelay, forceAfter])

    return {
        processing: processing,
        root: astValue?.root,
        file: astValue?.file,
    }
}
