import { LinkableHeadline } from '@content-ui/md-mui/MuiComponents/LinkableHeadline'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'
import type { Parent } from 'mdast'
import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import { FC } from 'react'
import { ContentLeafProps } from '@content-ui/react/ContentLeafsContext'
import { flattenText } from '@content-ui/struct/flattenText'
import { textToId } from '@content-ui/struct/textToId'

export const LeafHLocation: FC<ContentLeafProps<'heading'> & { selected?: boolean }> = (
    {child, selected, isFirst, isLast},
) => {
    const hRef = useLeafFollower<HTMLHeadingElement>(selected)
    const id = textToId(flattenText(child as Parent).join(''))
    return <LinkableHeadline
        ref={hRef}
        id={id}
        level={child.depth}
        onCopied={(id) => window.location.assign(window.location.pathname + '#' + id)}
        selected={selected}
        marginTop={!isFirst}
        marginBottom={!isLast}
    >
        <span><LeafChildNodes childNodes={child.children}/></span>
    </LinkableHeadline>
}
