import { ViewerBox, ViewerBoxProps } from '@content-ui/md-mui/ViewerBox'
import { useEffect, useRef } from 'react'
import { useContentContext } from '@content-ui/react/ContentFileContext'
import { useLocation } from 'react-router'

export const ViewerBoxRouter = (
    {
        disableScrollIntoView,
        ...props
    }: ViewerBoxProps & { disableScrollIntoView?: boolean },
) => {
    const contentRoot = useRef<HTMLDivElement | null>(null)
    const {root} = useContentContext()
    const location = useLocation()
    const isReady = Boolean(root)

    useEffect(() => {
        if(disableScrollIntoView || !isReady) return
        const hash = location.hash
        if(!hash) return
        const targetElement = contentRoot?.current?.querySelector('#' + CSS.escape(hash.slice(1)))
        targetElement?.scrollIntoView({
            behavior: 'smooth',
        })
    }, [location.hash, isReady, disableScrollIntoView])

    return <ViewerBox
        {...props}
        ref={contentRoot}
    />
}
