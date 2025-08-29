import { ContentSelectionState } from '@content-ui/react/ContentSelectionContext'

/**
 *  * A filter function for `useIsLeafSelected` that determines whether the selection should be shown based on the `showOnFocus` and `showFocus` settings.
 *
 * If `settings.showOnFocus` is true, the selection is only shown if the editor is currently focused (`selection.focused` is true).
 * Otherwise, the selection is shown if `settings.showFocus` is true (or true by default if `showFocus` is undefined).
 */
export function isSelectionShowFocus({selection, settings}: ContentSelectionState) {
    if(settings.showOnFocus) {
        return selection.focused
    }

    return settings.showFocus ?? true
}


/**
 * A filter function for `useIsLeafSelected` that determines whether the selection should trigger a "follow" action (e.g., scrolling into view) based on the `followFocus` setting.
 *
 * This function is typically used as a parameter to `useIsLeafSelected` to control when a leaf should be scrolled into view. If `settings.followFocus` is true, the leaf is only followed if the editor is currently focused (`selection.focused` is true). Otherwise, the leaf is not followed.
 *
 * @todo this is just a temporary solution, with the target behaviour having "is last selected in direction of last selection change", which fixes wrong scroll positions due to no repositioning, which needs more than a boolean flag with effects for performance;
 *       TBD: rethink the follow approach, maybe the provider should pre-build a mask, so that not each subscriber needs to compute possible visibility
 */
export function isSelectionFollowFocus({selection, settings}: ContentSelectionState) {
    if(settings.followFocus) {
        // depending on focused leads to repositioning when refocusing
        return selection.focused
    }

    return false
}
