import { ViewerBox, ViewerBoxProps } from '@content-ui/md-mui/ViewerBox'
import { useEffect, useRef } from 'react'
import { useContentContext } from '@content-ui/react/ContentFileContext'

export const ViewerBoxNavigation = (
    {
        disableScrollIntoView,
        ...props
    }: ViewerBoxProps & { disableScrollIntoView?: boolean },
) => {
    const contentRoot = useRef<HTMLDivElement | null>(null)
    const {root} = useContentContext()

    const isReady = Boolean(root)
    useEffect(() => {
        if(disableScrollIntoView || !isReady) return

        let lastHash = window.location.hash

        const scrollToHash = (hash: string) => {
            if(!hash || hash === lastHash) return
            lastHash = hash
            const targetElement = contentRoot?.current?.querySelector('#' + CSS.escape(hash.slice(1)))
            targetElement?.scrollIntoView({
                behavior: 'smooth',
            })
        }

        scrollToHash(lastHash)

        if('navigation' in window) {
            // not widely supported https://caniuse.com/mdn-api_navigation
            const onNavigate = (e/*: NavigationEvent*/) => {
                // fired for any navigation event, incl. popstate/pushstate and manual changes
                scrollToHash(new URL(e.destination.url).hash)
            }
            // @ts-expect-error modern feature
            window.navigation.addEventListener('navigate', onNavigate)

            return () => {
                // @ts-expect-error modern feature
                window.navigation.removeEventListener('navigate', onNavigate)
            }
        } else {
            const onHashChange = (e: HashChangeEvent) => {
                // fired for manual changes, popstate - but not pushState/replaceState
                scrollToHash(new URL(e.newURL).hash)
            }

            // polling as fallback to navigation API for pushState/replaceState
            const timer = window.setInterval(() => {
                if(lastHash !== window.location.hash) {
                    scrollToHash(window.location.hash)
                }
            }, 220)

            return () => {
                window.clearInterval(timer)
                window.addEventListener('hashchange', onHashChange)
            }
        }
    }, [isReady, disableScrollIntoView])

    return <ViewerBox
        {...props}
        ref={contentRoot}
    />
}
