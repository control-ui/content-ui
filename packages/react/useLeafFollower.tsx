import { ContentSelectionContext, useIsLeafSelected } from '@content-ui/react/ContentSelectionContext'
import { isSelectionFollowFocus } from '@content-ui/react/Utils/isSelectionSetting'
import { scrollIntoViewSafe } from '@content-ui/react/Utils/scrollIntoViewSafe'
import { useRef, useEffect, useContext } from 'react'
import { useSettings } from '@content-ui/react/LeafSettings'
import { Node } from 'unist'

export const useLeafFollower = <E extends HTMLElement = HTMLElement, TNode extends Node = Node>(
    node: TNode,
) => {
    const store = useContext(ContentSelectionContext)
    const elemRef = useRef<E | null>(null)
    const {
        // eslint-disable-next-line deprecation/deprecation
        followEditor,
        scrollContainer,
        onFollowElement = scrollIntoViewSafe,
    } = useSettings()

    const selected = useIsLeafSelected(
        node.position?.start?.line, node.position?.end?.line,
        isSelectionFollowFocus,
    )

    useEffect(() => {
        if(
            !(followEditor ?? true) // fallback here is true since 0.2.1, to prefer the selection settings property
            || !selected
            || !elemRef.current
        ) return

        // todo: this can sub directly, for no render dep., but that doubles the subs for most leafs; whats better?

        // todo: further refactor together with `selected`
        //      - [x] make this not scroll when e.g. the whole document is selected (e.g. CTRL+A)
        //      - [ ] after ending full document-selection it will not directly scroll to an still-focused-line!
        //            - it would need to focus the last remaining selected leaf afterward, but that wouldn't know if top or bottom and can't position reliable, min 1 line change is needed
        //            - with a has-selection-changed, and not just is-selected, it would be possible to dispatch here whenever really needing to scroll into view
        //      - [ ] when unselecting lines, the focus stays where it was and does not go to the last available
        //      ... could this require a ref+query selector based approach to reliable calculate the scroll target based on position? is that heaver or less? e.g. needs `data-line-start` and complex region/visible queries

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
