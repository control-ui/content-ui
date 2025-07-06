import { getScrollableParent } from '@content-ui/react/Utils/getScrollableParent'

/**
 * A safer "scroll element to nearest visible position" while showing as much as possible of it.
 *
 * - if element height is smaller than 45% of container, center
 * - if element height is between 45% and 75% of container, position at start, to not overflow at bottom
 * - if element is bigger than scrollContainer hidden overflow can't be prevented, go to nearest edge from last position
 */
export function scrollIntoViewSafe(
    {
        element,
        container,
    }: {
        element: HTMLElement
        container?: HTMLElement | null
    },
) {
    const scrollParent = container || getScrollableParent(element)
    if(!scrollParent) return
    const containerSize = scrollParent.clientHeight
    const targetSize = element.clientHeight
    const ratio = targetSize / containerSize

    const position =
        ratio < 0.45 ? 'center' :
            ratio < 0.75 ? 'start' : 'nearest'

    element?.scrollIntoView({
        behavior: 'smooth',
        block: position,
    })
}
