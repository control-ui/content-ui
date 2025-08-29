import { isLeafSelected } from '@content-ui/react/Utils/isLeafSelected'
import {
    createContext, useContext,
    useSyncExternalStore,
    useEffect, PropsWithChildren, useCallback, useState,
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
}

export interface EditorDocumentStatus {
    /**
     * Document editor is focused.
     */
    focused?: boolean
    /**
     * Document length.
     */
    endDoc?: number
    /**
     * Line number the document ends.
     */
    endLineDoc?: number
}

export type ContentSelection = EditorSelectionPosition & EditorDocumentStatus

export type ContentSelectionSettings = {
    /**
     * Whether to show the selection focus.
     * If `true`, the selection will be visually indicated when the editor is focused.
     * Defaults to `true`.
     */
    showFocus?: boolean

    /**
     * Whether to show the selection only when the editor is focused.
     * If `true`, the selection will only be visible when the editor has focus.
     * If `false`, the selection might be visible even when the editor is not focused,
     * depending on `showFocus` and `followFocus` settings.
     * Defaults to `false`.
     */
    showOnFocus?: boolean

    /**
     * Whether the selection should follow the cursor or current view.
     * If `true`, the editor view will adjust to keep the selection in sight.
     */
    followFocus?: boolean
}

export type ContentSelectionState<T extends ContentSelection = ContentSelection> = {
    selection: T
    settings: ContentSelectionSettings
}

export type SelectionStore<T extends ContentSelection = ContentSelection> = {
    getSnapshot: () => T | undefined
    getPreviousSnapshot: () => T | undefined
    subscribe: (cb: () => void) => () => void
    /**
     * @deprecated use `setSelection` instead
     */
    setValue: (v: T | undefined) => void
    setSelection: (v: T | undefined) => void

    getSettings: () => ContentSelectionSettings
    setSettings: (v: ContentSelectionSettings) => void
}

export const defaultSelectionSettings: ContentSelectionSettings = {
    followFocus: true,
    showFocus: true,
    showOnFocus: false,
}

export function createSelectionStore<T extends ContentSelection = ContentSelection>(
    initial?: T,
    initialSettings: ContentSelectionSettings = defaultSelectionSettings,
): SelectionStore<T> {
    let selection = initial
    let previousSelection: T | undefined = undefined
    let settings: ContentSelectionSettings = initialSettings
    const listeners = new Set<() => void>()

    const subscribe = (cb: () => void) => {
        listeners.add(cb)
        return () => listeners.delete(cb)
    }
    const setSelection = (v: T | undefined) => {
        if(Object.is(selection, v)) {
            return
        }

        if(selection && v) {
            const removedKeys = new Set(Object.keys(selection || {}))
            let changed = false
            for(const k of Object.keys(v)) {
                removedKeys.delete(k)
                if(selection[k] !== v[k]) {
                    changed = true
                    break
                }
            }
            if(!changed && !removedKeys.size) {
                return
            }
        }

        previousSelection = selection
        selection = v
        listeners.forEach((cb) => cb())
    }
    const setSettings = (v: ContentSelectionSettings) => {
        if(Object.is(settings, v)) return
        settings = v
        listeners.forEach((cb) => cb())
    }

    const getSnapshot = () => selection
    const getPreviousSnapshot = () => previousSelection
    const getSettings = () => settings

    return {
        getSnapshot: getSnapshot,
        getPreviousSnapshot: getPreviousSnapshot,
        subscribe: subscribe,
        setValue: setSelection,
        setSelection: setSelection,
        getSettings: getSettings,
        setSettings: setSettings,
    }
}

export function useSelectionStore<TSelection extends ContentSelection = ContentSelection>(
    settings?: ContentSelectionSettings,
    initial?: TSelection | undefined | (() => TSelection | undefined),
) {
    const [store] = useState<SelectionStore<TSelection>>(
        () => createSelectionStore<TSelection>(
            typeof initial === 'function'
                ? initial()
                : initial,
            settings,
        ),
    )

    const {
        showFocus = defaultSelectionSettings.showFocus,
        showOnFocus = defaultSelectionSettings.showOnFocus,
        followFocus = defaultSelectionSettings.followFocus,
    } = settings || {}
    useEffect(() => {
        const currentSettings = store.getSettings()
        if(
            currentSettings.showOnFocus === showOnFocus
            && currentSettings.showFocus === showFocus
            && currentSettings.followFocus === followFocus
        ) {
            return
        }
        store.setSettings({
            followFocus,
            showOnFocus,
            showFocus,
        })
    }, [followFocus, showOnFocus, store, showFocus])

    return store
}

export const ContentSelectionContext = createContext<SelectionStore<ContentSelection> | undefined>(undefined)

export const useContentSelectionStore = <TSelection extends ContentSelection = ContentSelection>(): SelectionStore<TSelection> => {
    // supporting non-existing store, with static dummy fallbacks
    return (useContext(ContentSelectionContext) || fallbackStore) as unknown as SelectionStore<TSelection>
}

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

const fallbackStore: SelectionStore = {
    getSnapshot: () => undefined,
    getPreviousSnapshot: () => undefined,
    subscribe: () => () => {
        // noop
    },
    setValue: () => {
        // noop
    },
    setSelection: () => {
        // noop
    },
    getSettings: () => ({}),
    setSettings: () => {
        // noop
    },
}

export const ContentSelectionProvider = <TSelection extends ContentSelection = ContentSelection>(
    {
        children,
        selectionStore,
        // delay = 41,
    }: PropsWithChildren<{
        selectionStore: SelectionStore<TSelection> | undefined
        // /**
        //  * Debounce delay for updating the selection.
        //  */
        // delay?: number
    }>,
) => {
    // todo: extract scribble as debounce store? or add debounce to respective other event listener/handler?
    // const store = useSelectionStore<TSelection>(
    //     () => selectionStore?.getSnapshot(),
    //     {showOnFocus, followFocus},
    // )
    //
    // const timerRef = useRef(false)
    // useEffect(() => {
    //     if(!selectionStore) {
    //         store.setSelection(undefined)
    //         return
    //     }
    //     // todo: using this provider for debouncing atm., move out of here? check again later
    //     let timer: ReturnType<typeof setTimeout>
    //     let timerReset: ReturnType<typeof setTimeout>
    //     const sub = () => {
    //         clearTimeout(timer)
    //         clearTimeout(timerReset)
    //         timer = setTimeout(() => {
    //             store.setSelection(selectionStore.getSnapshot())
    //
    //             timerReset = setTimeout(() => {
    //                 timerRef.current = false
    //             }, delay * 2)
    //         }, timerRef.current ? delay : 0)
    //         timerRef.current = true
    //     }
    //     const unsub = selectionStore.subscribe(sub)
    //     return () => {
    //         unsub()
    //         clearTimeout(timer)
    //         clearTimeout(timerReset)
    //     }
    // }, [store, selectionStore, delay])

    // useEffect(() => {
    //     if(!selectionStore) return
    //     const currentSettings = selectionStore.getSettings()
    //     if(
    //         currentSettings.showOnFocus === showOnFocus
    //         && currentSettings.showFocus === showFocus
    //         && currentSettings.followFocus === followFocus
    //     ) {
    //         return
    //     }
    //     selectionStore.setSettings({
    //         followFocus,
    //         showOnFocus,
    //         showFocus,
    //     })
    // }, [followFocus, showOnFocus, selectionStore, showFocus])

    return <ContentSelectionContext.Provider
        value={selectionStore as SelectionStore<any> | undefined}
    >
        {children}
    </ContentSelectionContext.Provider>
}

/**
 * Subscribes to the provider store and returns boolean for a leaf described by (startLine, endLine).
 *
 * This implementation provides a filtered `subscribe` so the consumer only
 * re-renders when the *boolean* selected state for the given leaf changes.
 *
 * @todo support that it returns styling for selection highlighting/or add as extra hook
 */
export function useIsLeafSelected(
    startLine: number | undefined,
    endLine: number | undefined,
    filter?: (
        state: {
            selection: ContentSelection
            settings: ContentSelectionSettings
        },
        position: {
            start: { line: number }
            end: { line: number }
        },
    ) => boolean | undefined,
): boolean {
    const store = useContext(ContentSelectionContext) || fallbackStore

    // memoized getter for the derived boolean selection for this leaf
    const getSelected = useCallback(() => {
        if(typeof startLine !== 'number' || typeof endLine !== 'number') {
            return false
        }
        const selection = store.getSnapshot()
        if(selection && typeof selection.startLine === 'number' && typeof selection.endLine === 'number') {
            if(filter && !filter(
                {
                    selection: selection,
                    settings: store.getSettings(),
                },
                {
                    start: {line: startLine},
                    end: {line: endLine},
                },
            )) {
                return false
            }
            return isLeafSelected(
                {
                    start: {line: selection.startLine},
                    end: {line: selection.endLine},
                },
                startLine,
                endLine,
            )
        }

        return false
    }, [store, startLine, endLine, filter])

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
