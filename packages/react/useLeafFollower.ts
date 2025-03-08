import { scrollIntoViewSafe } from '@content-ui/react/Utils/scrollIntoViewSafe'
import { useRef, useEffect } from 'react'
import { useSettings } from '@content-ui/react/LeafSettings'

export const useLeafFollower = <E extends HTMLElement = HTMLElement>(selected: boolean | undefined) => {
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

        onFollowElement({
            element: elemRef.current,
            container: scrollContainer?.current,
        })
    }, [onFollowElement, followEditor, selected, elemRef, scrollContainer])

    return elemRef
}
