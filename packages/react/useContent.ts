import { useEffect, useCallback, useRef, useState, MutableRefObject } from 'react'
import { Processor } from 'unified'
import { VFile } from 'vfile'
import type { Root } from 'mdast'

export type ContentProcessor = Processor<Root, Root, Root, Root, string>

export interface WithContent {
    file: VFile | undefined
    root: Root | undefined
    processing: 'loading' | 'success' | 'error'
    outdated?: boolean
    stringify?: () => string
}

export const useContent = (
    {
        textValue = undefined,
        parseDelay = 100,
        autoProcess = -1,
        processor,
        onMount = false,
    }: {
        textValue: string | undefined
        parseDelay?: number
        processor: ContentProcessor
        onMount?: boolean
        /**
         * `-1` automatic,
         * `0` off
         * `> 0` or `string` on every autoProcessing value change
         */
        autoProcess?: number | string
    },
): WithContent & {
    processText: (abort?: AbortSignal) => void
    // exposing to allow resetting manually
    delayActiveRef: MutableRefObject<boolean>
} => {
    const [contentState, setContentState] = useState<WithContent>(() => {
        if(onMount) {
            if(typeof textValue === 'string' || typeof textValue === 'undefined' || textValue === null) {
                const file = new VFile(typeof textValue === 'string' ? textValue : '')
                try {
                    const ast = processor.runSync(processor.parse(file), file)
                    return {
                        file: file,
                        root: ast,
                        processing: 'success',
                        outdated: !onMount,
                        stringify: () => processor.stringify(ast, file),
                    }
                } catch(e) {
                    console.error('Content processing error in mount', e)
                    return {
                        file: file,
                        root: undefined,
                        processing: 'error',
                        outdated: false,
                    }
                }
            }
        }

        return {
            file: undefined,
            root: undefined,
            processing: 'loading',
            outdated: !onMount,
        }
    })

    const processText = useCallback((abort?: AbortSignal) => {
        const file = new VFile(typeof textValue === 'string' ? textValue : '')
        const ast = processor.parse(file)

        if(abort?.aborted) return

        setContentState(cs => ({
            ...cs,
            processing: 'loading',
            outdated: true,
        }))

        processor
            .run(ast, file)
            .then((root) => {
                if(abort?.aborted) return
                // lint warnings only exist on `file` after `run`,
                // as ref is the same, must only be set to state here for react render
                // toString: () => parser.stringify(root, file) as string
                setContentState({
                    file: file,
                    root: root,
                    processing: 'success',
                    outdated: false,
                    stringify: () => processor.stringify(ast, file),
                })
            })
            .catch((e) => {
                if(abort?.aborted) return
                console.error('Content processing error in effect', e)
                setContentState({
                    file: file,
                    root: undefined,
                    processing: 'error',
                    outdated: false,
                })
            })
    }, [textValue, processor])

    const timerRef = useRef<number | undefined>(undefined)
    const resetTimerRef = useRef<number | undefined>(undefined)
    const delayActiveRef = useRef(false)
    const mountedRef = useRef(false)
    const autoProcessingRef = useRef(autoProcess)
    const delayRefs = useRef({parseDelay})
    delayRefs.current = {parseDelay}

    useEffect(() => {
        return () => {
            window.clearTimeout(timerRef.current)
            window.clearTimeout(resetTimerRef.current)
            timerRef.current = undefined
        }
    }, [])
    const processorRef = useRef<((abort?: AbortSignal) => void) | null>(null)

    useEffect(() => {
        if(onMount && !mountedRef.current) {
            mountedRef.current = true
            return
        }
        mountedRef.current = true

        if(typeof textValue !== 'string' || !textValue) {
            const file = new VFile('')
            const ast = processor.parse(file)
            setContentState({
                file: file,
                root: ast,
                processing: 'success',
                outdated: false,
            })
            return
        }
        const abort = new AbortController()

        setContentState(cs => cs.outdated ? cs : {
            ...cs,
            outdated: true,
        })

        if(autoProcess === 0) return

        if(
            autoProcess !== -1
            && autoProcess === autoProcessingRef.current
        ) {
            return
        }

        autoProcessingRef.current = autoProcess

        const {parseDelay} = delayRefs.current
        if(parseDelay <= 0) {
            window.clearTimeout(resetTimerRef.current)
            window.clearTimeout(timerRef.current)
            processorRef.current = null
            processText(abort.signal)
            return
        }

        // creating cb, then store in ref, using that in the timer,
        // to use latest text, not the one it was scheduled with
        processorRef.current = processText

        if(typeof timerRef.current !== 'undefined') {
            return
        }

        timerRef.current = window.setTimeout(() => {
            processorRef.current?.(abort.signal)
            processorRef.current = null
            timerRef.current = undefined
        }, delayActiveRef.current ? parseDelay : 0)

        delayActiveRef.current = true

        // reset delay to be 0 when nothing has happened
        window.clearTimeout(resetTimerRef.current)
        resetTimerRef.current = window.setTimeout(() => {
            resetTimerRef.current = undefined
            delayActiveRef.current = false
        }, parseDelay * 4)
    }, [processText, textValue, onMount, processor, autoProcess])

    return {
        ...contentState,
        processText,
        delayActiveRef,
    }
}
