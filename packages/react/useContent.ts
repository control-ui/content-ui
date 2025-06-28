import { useEffect, useCallback, useRef, useState, RefObject } from 'react'
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

type ProcessText = (abort?: AbortSignal) => Promise<void>

const FACTOR_DYNAMIC_DELAY = 6
const FACTOR_RESET_DELAY = 6
const FACTOR_RESET_DYNAMIC_DELAY = 18

export const useContent = (
    {
        textValue = undefined,
        parseDelay = 100,
        adaptiveDelay = false,
        keepDelayActive = false,
        prioritizeLatest = true,
        autoProcess = -1,
        processor,
        onMount = false,
    }: {
        textValue: string | undefined
        parseDelay?: number
        /**
         * Adapt the parseDelay to a factor of the last durations average. Uses the `parseDelay` as upper maximum.
         * The last durations are weighted averaged, if the latest duration is higher than the average that maximum is used.
         * @experimental further configuration options for factors, min. and max. could be needed.
         */
        adaptiveDelay?: boolean
        keepDelayActive?: boolean
        /**
         * Default behaviour aborts any scheduled parsing and processing and only does the last one,
         * if set to `false` it instead parses as soon as possible and will debounce later arrived once during processing.
         */
        prioritizeLatest?: boolean
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
    processText: () => void
    // exposing to allow resetting manually
    delayActiveRef: RefObject<boolean>
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

    const parseDurRefs = useRef<number[]>([])
    const processTextInternal: ProcessText = useCallback(async(
        abort?,
    ) => {
        if(abort?.aborted) return

        setContentState(cs => cs.processing === 'loading' && cs.outdated ? cs : {
            ...cs,
            processing: 'loading',
            outdated: true,
        })

        // tracking the processing duration and use it to de-/increase the delay
        const start = performance.now()

        // todo: TBD, wait after parse for next render/tick to ensure possibility to cancel?
        const file = new VFile(typeof textValue === 'string' ? textValue : '')
        const ast = processor.parse(file)

        return processor
            .run(ast, file)
            .then((root) => {
                // todo: if abort is not used above, yet the async part is super slow,
                //       it will update the state even if some later one already finished,
                //       as no lock on processing exists, only on scheduling!
                if(abort?.aborted) {
                    return
                }
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
                if(abort?.aborted) {
                    return
                }
                console.error('Content processing error in effect', e)
                setContentState({
                    file: file,
                    root: undefined,
                    processing: 'error',
                    outdated: false,
                })
            })
            .finally(() => {
                const dur = performance.now() - start
                parseDurRefs.current.push(dur)
                if(parseDurRefs.current.length > 6) {
                    parseDurRefs.current.splice(0, parseDurRefs.current.length - 6)
                }
            })
    }, [textValue, processor])

    const processorRef = useRef<ProcessText | null>(null)
    const abortRef = useRef<AbortController | null>(null)
    const timerRef = useRef<number | undefined>(undefined)
    const resetTimerRef = useRef<number | undefined>(undefined)
    const delayActiveRef = useRef(false)
    const mountedRef = useRef(false)
    const autoProcessingRef = useRef(autoProcess)
    const optionsRef = useRef({parseDelay, adaptiveDelay, keepDelayActive, prioritizeLatest})
    optionsRef.current = {parseDelay, adaptiveDelay, keepDelayActive, prioritizeLatest}

    useEffect(() => {
        return () => {
            window.clearTimeout(timerRef.current)
            window.clearTimeout(resetTimerRef.current)
            timerRef.current = undefined
            abortRef.current?.abort()
        }
    }, [])

    useEffect(() => {
        if(onMount && !mountedRef.current) {
            mountedRef.current = true
            return
        }
        mountedRef.current = true
        window.clearTimeout(resetTimerRef.current)

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

        const {
            parseDelay, adaptiveDelay,
            keepDelayActive,
            prioritizeLatest,
        } = optionsRef.current

        if(prioritizeLatest) {
            window.clearTimeout(timerRef.current)
            timerRef.current = undefined
            abortRef.current?.abort()
        }

        const lastAbort = abortRef.current
        const abort = abortRef.current = new AbortController()

        if(parseDelay <= 0) {
            window.clearTimeout(timerRef.current)
            timerRef.current = undefined
            processorRef.current = null
            if(!prioritizeLatest && lastAbort && !lastAbort?.signal.aborted) {
                // always must abort last if next one starts
                lastAbort?.abort()
            }
            processTextInternal(abort.signal).catch()
            return
        }

        // creating cb, then store in ref, using that in the timer,
        // to use latest text, not the one it was scheduled with
        processorRef.current = processTextInternal

        if(typeof timerRef.current !== 'undefined') {
            return
        }

        const maxLastDuration = Math.max(...parseDurRefs.current)
        const latestDuration = parseDurRefs.current[parseDurRefs.current.length - 1]
        const durationAverage =
            parseDurRefs.current.length ?
                // get weighted average, then use max between last render and weighted average,
                // to respect large changes and not have too little delay then
                Math.max(getDurationAverage(parseDurRefs.current), latestDuration) :
                Infinity
        const appliedDelay =
            delayActiveRef.current ?
                // todo: refine adaptiveDelay; as PoC using parseDelay as maximum with a factor of maxLastDuration,
                //       which improved performance for e.g. 3ms renders, which then with a parseDelay of `80`
                //       would still only have a delay of `3ms * 4` = `12ms`, so `40ms / 12ms` = `3.33x` faster updates;
                // todo: support a small buffer factor, like `parseDelay * 2` when e.g. maxLastDuration is `260ms`,
                //       it increases the delay to `160ms` as a safeguard;
                //       the most interesting part would be sliding parseDurRefs based on their age, to not keep long delays,
                //       which where e.g. initial render with a bunch of other things
                adaptiveDelay && durationAverage !== Infinity ?
                    Math.min(durationAverage * FACTOR_DYNAMIC_DELAY, parseDelay) :
                    parseDelay : 0

        if(typeof latestDuration === 'number' && latestDuration !== Infinity && latestDuration > parseDelay) {
            console.warn('md: LONG PARSE DETECTED', {appliedDelay, durationAverage, maxLastDuration, latestDuration}, parseDurRefs.current.slice(0))
        }

        // todo: use adaptiveDelay or buffer when still ongoing? to prevent strain on render thread
        timerRef.current = window.setTimeout(() => {
            const currentProcessor = processorRef.current
            processorRef.current = null
            timerRef.current = undefined

            // todo: this can lead again to timespans where nothing is rendered due to overlapping processioning,
            //       where newer ones always cancel the slower ones; is there any other clean solution, than switching to a queue-buffer to handle that?
            if(!prioritizeLatest && lastAbort && !lastAbort?.signal.aborted) {
                // when abort is disabled, it still must abort the last processing if the next one starts,
                // indicating the `run` took longer than the appliedDelay
                lastAbort?.abort()
            }

            currentProcessor?.(
                abort.signal,
            )
                .catch()
                .finally(() => {
                    window.clearTimeout(resetTimerRef.current)

                    if(abortRef.current === abort) {
                        abortRef.current = null
                    }

                    if(keepDelayActive) return

                    // note: for adaptiveDelay added a later reset, as the reset is especially interesting
                    //       to counteract unnecessary slow delays when nothing happened for a long time and
                    //       a longer delay, like with a fixed universal one-size-fits-all 100ms+ delay vs. ~(2-8ms * 4 = 8-16ms) dynamic delay
                    //
                    // reset delay to be 0 when nothing has happened;
                    // but only reset after the last scheduled processing is done
                    const resetDelay =
                        // only use appliedDelay if some
                        appliedDelay > 0 ?
                            adaptiveDelay ? appliedDelay * FACTOR_RESET_DYNAMIC_DELAY : appliedDelay * FACTOR_RESET_DELAY :
                            // use default parseDelay otherwise
                            parseDelay * FACTOR_RESET_DELAY
                    resetTimerRef.current = window.setTimeout(() => {
                        window.clearTimeout(resetTimerRef.current)
                        resetTimerRef.current = undefined
                        delayActiveRef.current = false
                    }, resetDelay)
                })
        }, appliedDelay)

        delayActiveRef.current = true

    }, [processTextInternal, textValue, onMount, processor, autoProcess])

    const processText: ProcessText = useCallback(() => {
        window.clearTimeout(timerRef.current)

        const lastAbort = abortRef.current

        if(!prioritizeLatest && lastAbort && !lastAbort?.signal.aborted) {
            // when abort is disabled, it still must abort the last processing if the next one starts,
            // indicating the `run` took longer than the appliedDelay
            lastAbort?.abort()
        }

        const abort = abortRef.current = new AbortController()

        return processTextInternal(
            abort.signal,
        )
    }, [prioritizeLatest, processTextInternal])

    return {
        ...contentState,
        processText: processText,
        delayActiveRef,
    }
}

export const getDurationAverage = (durations: number[]): number => {
    if(!durations || durations.length === 0) {
        return Infinity
    }

    if(durations.length === 1) {
        return durations[0]
    }

    let weightedSum = 0
    let totalWeight = 0

    for(let i = 0; i < durations.length; i++) {
        const weight = i + 1
        weightedSum += durations[i] * weight
        totalWeight += weight
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0
}
