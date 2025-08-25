import { ContentSelectionContext } from '@content-ui/react/ContentSelectionContext'
import { scrollIntoViewSafe } from '@content-ui/react/Utils/scrollIntoViewSafe'
import { useRef, useEffect, useContext } from 'react'
import { useSettings } from '@content-ui/react/LeafSettings'

export const useLeafFollower = <E extends HTMLElement = HTMLElement>(selected: boolean | undefined) => {
    const store = useContext(ContentSelectionContext)
    const elemRef = useRef<E | null>(null)
    const {
        followEditor,
        scrollContainer,
        onFollowElement = scrollIntoViewSafe,
    } = useSettings()

    useEffect(() => {
        if(
            !followEditor
            || !selected
            || !elemRef.current
        ) return

        // todo: this can sub directly, for no render dep., but that doubles the subs for most leafs; whats better?

        // todo: further refactor together with `selected`
        //      - [x] make this not scroll when e.g. the whole document is selected (e.g. CTRL+A)
        //      - [ ] after ending full document-selection it will not directly scroll to an still-focused-line!
        //            - it would need to focus the last remaining selected leaf afterward, but that wouldn't know if top or bottom and can't position reliable, min 1 line change is needed
        //            - with a has-selection-changed, and not just is-selected, it would be possible to dispatch here whenever really needing to scroll into view

        const previousSelection = store?.getPreviousSnapshot()
        const currentSelection = store?.getSnapshot()

        // if the new currentSelection increased from a single-line to all-selected, ignore it
        if(
            currentSelection
            && currentSelection.startLine === 1
            && currentSelection.endLine === currentSelection.endLineDoc
            && (
                !previousSelection ||
                (
                    previousSelection
                    && previousSelection.startLine === previousSelection.endLine
                )
            )
        ) {
            return
        }

        onFollowElement({
            element: elemRef.current,
            container: scrollContainer?.current,
        })
    }, [onFollowElement, followEditor, selected, elemRef, scrollContainer, store])

    return elemRef
}
