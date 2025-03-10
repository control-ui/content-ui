import { useEffect, useCallback, useRef, useState } from 'react'
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
        forceAfter = 0,
        autoProcess = -1,
        processor,
        onMount = false,
    }: {
        textValue: string | undefined
        parseDelay?: number
        forceAfter?: number
        processor: ContentProcessor
        onMount?: boolean
        /**
         * `-1` automatic,
         * `0` off
         * `> 0` or `string` on every autoProcessing value change
         */
        autoProcess?: number | string
    },
): WithContent & { processText: (abort?: AbortSignal) => void } => {
    const [contentState, setContentState] = useState<WithContent>(() => {
        if(onMount) {
            if(typeof textValue === 'string' || typeof textValue === 'undefined' || textValue === null) {
                const file = new VFile(textValue || '')
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
        const file = new VFile(textValue)
        const ast = processor.parse(file)

        if(abort?.aborted) return

        setContentState(cs => ({
            ...cs,
            processing: 'loading',
            outdated: true,
        }))

        // even with async `run` the `then` cb may run in-sync,
        // which skips the `processing` state rendering
        // and with it some button state indicators
        window.setTimeout(() => {
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
        }, 0)
    }, [processor, textValue])

    const timer2 = useRef<number | undefined>(undefined)
    const mountedRef = useRef(false)
    const autoProcessingRef = useRef(autoProcess)
    const delayRefs = useRef({parseDelay, forceAfter})
    delayRefs.current = {parseDelay, forceAfter}

    useEffect(() => {
        return () => window.clearTimeout(timer2.current)
    }, [])

    useEffect(() => {
        if(onMount && !mountedRef.current) {
            mountedRef.current = true
            return
        }

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

        setContentState(cs => ({
            ...cs,
            outdated: true,
        }))

        if(autoProcess === 0) return

        if(
            autoProcess !== -1
            && autoProcess === autoProcessingRef.current
        ) {
            return
        }

        autoProcessingRef.current = autoProcess

        const {parseDelay, forceAfter} = delayRefs.current
        if(parseDelay <= 0) {
            processText(abort.signal)
            return
        }

        const timer = window.setTimeout(() => {
            window.clearTimeout(timer2.current)
            processText(abort.signal)
        }, parseDelay)
        if(forceAfter > 0 && forceAfter > parseDelay) {
            window.clearTimeout(timer2.current)
            timer2.current = window.setTimeout(() => {
                processText(abort.signal)
            }, parseDelay)
        }
        return () => {
            window.clearTimeout(timer)
            abort.abort()
        }
    }, [processText, textValue, onMount, processor, autoProcess])

    return {
        ...contentState,
        processText,
    }
}
