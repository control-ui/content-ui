export function getScrollableParent(element: HTMLElement): HTMLElement | null {
    let parent = element.parentElement
    while(parent) {
        const {overflowY} = getComputedStyle(parent)
        const isScrollable = overflowY === 'auto' || overflowY === 'scroll'
        if(isScrollable && parent.scrollHeight > parent.clientHeight) {
            return parent
        }
        parent = parent.parentElement
    }
    return document.documentElement
}
