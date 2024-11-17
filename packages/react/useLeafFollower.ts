import { useRef, useEffect } from 'react'
import { useSettings } from '@content-ui/react/LeafSettings'

export const useLeafFollower = <E extends HTMLElement = HTMLElement>(selected: boolean | undefined) => {
    const elemRef = useRef<E | null>(null)
    const {followEditor} = useSettings()

    useEffect(() => {
        if(!followEditor || !selected) return
        elemRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        })
    }, [followEditor, selected, elemRef])

    return elemRef
}

