import { ViewerBoxRouter } from '@content-ui/md-mui/ViewerBoxRouter'
import {
    ViewerFromText as BaseViewerFromText,
    ViewerFromTextProps as BaseViewerFromTextProps,
} from '@content-ui/react/ViewerFromText'

/**
 * @deprecated use `ViewerBoxRouter` or `ViewerBoxWithNavigation` instead
 */
export const Viewer = ViewerBoxRouter

/**
 * @deprecated use the type from @content-ui/react/ViewerFromText
 */
export type ViewerFromTextProps =
    Omit<BaseViewerFromTextProps, 'Viewer'> &
    Partial<Pick<BaseViewerFromTextProps, 'Viewer'>>

/**
 * @deprecated use the component from @content-ui/react/ViewerFromText
 */
export const ViewerFromText = (
    {
        Viewer: ViewerProp = ViewerBoxRouter,
        ...props
        // eslint-disable-next-line deprecation/deprecation
    }: ViewerFromTextProps,
) => {
    return <BaseViewerFromText
        Viewer={ViewerProp}
        {...props}
    />
}
