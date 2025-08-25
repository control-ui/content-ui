import { isLeafSelected } from '@content-ui/react/Utils/isLeafSelected'
import {
    createContext, useContext,
    useRef,
    useSyncExternalStore,
    useEffect, PropsWithChildren, useCallback,
} from 'react'

/**
 * Position of a selection.
 *
 * Lines are `1` based.
 * @todo simplify, make easier to understand, normalize with codemirror ranges, support multiple selections
 */
export interface EditorSelectionPosition {
    /**
     * Start position of the selection.
     */
    start: number
    /**
     * Start line of the selection.
     */
    startLine: number
    /**
     * Start position of the selected line.
     */
    startLineStart: number
    /**
     * End position of the selected line.
     */
    startLineEnd: number

    end: number
    endLine: number
    endLineStart: number
    endLineEnd: number

    /**
     * Document length.
     */
    endDoc?: number
    /**
     * Line number the document ends.
     */
    endLineDoc?: number
}

export interface EditorSelectionFilled extends EditorSelectionPosition {
    selected: true
}

export interface EditorSelectionEmpty extends Partial<EditorSelectionPosition> {
    selected?: false
}

export type ContentSelection = EditorSelectionEmpty | EditorSelectionFilled

type Store<T> = {
    getSnapshot: () => T
    getPreviousSnapshot: () => T | undefined
    subscribe: (cb: () => void) => () => void
    setValue: (v: T) => void
}

function createStore<T>(initial: T): Store<T> {
    let value = initial
    let previous: T | undefined = undefined
    const listeners = new Set<() => void>()

    return {
        getSnapshot: () => value,
        getPreviousSnapshot: () => previous,
        subscribe(cb: () => void) {
            listeners.add(cb)
            return () => listeners.delete(cb)
        },
        setValue(v: T) {
            if(Object.is(value, v)) return
            previous = value
            value = v
            listeners.forEach((cb) => cb())
        },
    }
}

export function createContentSelectionStore<TSelection extends ContentSelection = ContentSelection>(
    initial: TSelection | undefined = undefined,
) {
    const store = createStore<TSelection | undefined>(initial)
    return store
}

export type ContentSelectionStore<TSelection extends ContentSelection = ContentSelection> = Store<TSelection | undefined>

export const ContentSelectionContext = createContext<Store<ContentSelection | undefined> | undefined>(undefined)

export const useContentSelection = (disabled: boolean = false): ContentSelection | undefined => {
    // supporting non-existing store, with static dummy fallbacks
    const store = useContext(ContentSelectionContext) || fallbackStore
    return useSyncExternalStore(
        useCallback((onStoreChange) => {
            if(disabled) return () => undefined
            return store.subscribe(onStoreChange)
        }, [store, disabled]),
        store.getSnapshot,
        store.getSnapshot,
    )
}

const fallbackStore = {
    getSnapshot: () => undefined,
    getPreviousSnapshot: () => undefined,
    subscribe: () => () => {
        // noop
    },
    setValue: () => {
        // noop
    },
}

export const ContentSelectionProvider = <TSelection extends ContentSelection = ContentSelection>(
    {
        children,
        selectionStore,
        delay = 41,
    }: PropsWithChildren<{
        selectionStore: Store<TSelection | undefined> | undefined
        /**
         * Debounce delay for updating the selection.
         */
        delay?: number
    }>,
) => {
    const timerRef = useRef(false)
    const storeRef = useRef<Store<TSelection | undefined> | undefined>(undefined)
    if(!storeRef.current) {
        storeRef.current = createStore<TSelection | undefined>(selectionStore?.getSnapshot())
    }

    useEffect(() => {
        if(!selectionStore) {
            storeRef.current!.setValue(undefined)
            return
        }
        // todo: using this provider for debouncing atm., move out of here? check again later
        let timer: ReturnType<typeof setTimeout>
        let timerReset: ReturnType<typeof setTimeout>
        const sub = () => {
            clearTimeout(timer)
            clearTimeout(timerReset)
            timer = setTimeout(() => {
                storeRef.current!.setValue(selectionStore.getSnapshot())

                timerReset = setTimeout(() => {
                    timerRef.current = false
                }, delay * 2)
            }, timerRef.current ? delay : 0)
            timerRef.current = true
        }
        const unsub = selectionStore.subscribe(sub)
        return () => {
            unsub()
            clearTimeout(timer)
            clearTimeout(timerReset)
        }
    }, [selectionStore, delay])

    return <ContentSelectionContext.Provider
        value={storeRef.current as Store<ContentSelection | undefined>}
    >
        {children}
    </ContentSelectionContext.Provider>
}

/**
 * Hook: useIsLeafSelected
 * - subscribes to the provider store and returns boolean for a leaf described
 *   by (startLine, endLine).
 *
 * This implementation provides a filtered `subscribe` so the consumer only
 * re-renders when the *boolean* selected state for the given leaf changes.
 */
export function useIsLeafSelected(
    startLine: number | undefined,
    endLine: number | undefined,
): boolean {
    const store = useContext(ContentSelectionContext) || fallbackStore

    // memoized getter for the derived boolean selection for this leaf
    const getSelected = useCallback(() => {
        const sel = store.getSnapshot()
        if(sel && typeof sel.startLine === 'number' && typeof sel.endLine === 'number') {
            return isLeafSelected(
                {
                    start: {line: sel.startLine},
                    end: {line: sel.endLine},
                },
                startLine,
                endLine,
            )
        }
        return false
    }, [store, startLine, endLine])

    // filtered subscribe: only call onStoreChange when the derived boolean changes
    const subscribe = useCallback((onStoreChange: () => void) => {
        // keep track of the previous derived boolean for this subscriber
        let prev = getSelected()

        const unsub = store.subscribe(() => {
            const next = getSelected()
            if(next !== prev) {
                prev = next
                onStoreChange()
            }
        })

        return unsub
    }, [store, getSelected])

    return useSyncExternalStore(
        subscribe,
        getSelected,
        getSelected,
    )
}
