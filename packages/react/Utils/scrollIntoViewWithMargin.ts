import { getScrollableParent } from '@content-ui/react/Utils/getScrollableParent'

export function scrollIntoViewWithMargin(
    {
        element,
        margin = 32,
        container,
    }: {
        element: HTMLElement
        container?: HTMLElement | null
        margin?: number
    },
) {
    if(!element) return

    const scrollParent = container || getScrollableParent(element)
    if(!scrollParent) return

    const rect = element.getBoundingClientRect()
    const parentRect = scrollParent.getBoundingClientRect()
    const containerSize = scrollParent.clientHeight
    const targetSize = element.clientHeight
    const ratio = targetSize / containerSize

    const isAbove = rect.top > parentRect.top + margin
    const isBelow = rect.bottom < parentRect.bottom - margin
    const isVisible =
        rect.bottom - margin > parentRect.top &&
        rect.top + margin < parentRect.bottom

    // if children is less than half the size of the container, always center
    if(ratio < 0.45) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        })
        return
    }

    if(isVisible) return

    if(isAbove) {
        scrollParent.scrollBy({
            behavior: 'smooth',
            top: rect.top - parentRect.top - margin,
        })
    } else if(isBelow) {
        scrollParent.scrollBy({
            behavior: 'smooth',
            top: rect.bottom - parentRect.bottom + margin,
        })
    }
}
