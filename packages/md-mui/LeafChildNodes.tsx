import { ReactNode } from 'react'
import type { Parents } from 'mdast'
import { ContentLeaf } from '@content-ui/react/ContentLeaf'

export const LeafChildNodes = <TChildNodes extends Parents['children'] = Parents['children']>(
    props: {
        /**
         * A childs index is only passed down when `true`, for performance reasons.
         */
        addIndex?: boolean
        childNodes: TChildNodes
    },
): ReactNode => {
    const {childNodes, addIndex, ...p} = props
    const length = childNodes.length
    return childNodes
        .map((childNext, i) =>
            <ContentLeaf
                key={i}
                {...p}
                elem={childNext.type}
                child={childNext}
                index={addIndex ? i : undefined}
                isFirst={i === 0}
                isLast={i === length - 1}
            />,
        )
}
