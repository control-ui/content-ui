import * as React from 'react'
import { useSettings } from '@content-ui/react/LeafSettings'

export const useLeafFollower = <E extends HTMLElement = HTMLElement>(selected: boolean | undefined) => {
    const pRef = React.useRef<E | null>(null)
    const {followEditor} = useSettings()

    React.useEffect(() => {
        if(!followEditor) return
        if(pRef.current && selected) {
            pRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }
    }, [followEditor, selected, pRef])

    return pRef
}

