import { LinkableHeadline } from '@content-ui/md-mui/MuiComponents/LinkableHeadline'
import { useIsLeafSelected } from '@content-ui/react/ContentSelectionContext'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'
import { isSelectionShowFocus } from '@content-ui/react/Utils/isSelectionSetting'
import type { Parent } from 'mdast'
import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import { FC } from 'react'
import { useNavigate } from 'react-router'
import { ContentLeafProps } from '@content-ui/react/ContentLeafsContext'
import { flattenText } from '@content-ui/struct/flattenText'
import { textToId } from '@content-ui/struct/textToId'

/**
 * Heading component with react-router. Navigates the user to the location when the link was copied.
 */
export const LeafHRouter: FC<ContentLeafProps<'heading'>> = ({child, isFirst, isLast}) => {
    const selected = useIsLeafSelected(
        child.position?.start?.line, child.position?.end?.line,
        isSelectionShowFocus,
    )
    const hRef = useLeafFollower<HTMLHeadingElement>(child)
    const navigate = useNavigate()
    const id = textToId(flattenText(child as Parent).join(''))
    return <LinkableHeadline
        ref={hRef}
        id={id}
        level={child.depth}
        onCopied={(id) => navigate('#' + id)}
        selected={selected}
        marginTop={!isFirst}
        marginBottom={!isLast}
    >
        <span><LeafChildNodes childNodes={child.children}/></span>
    </LinkableHeadline>
}
