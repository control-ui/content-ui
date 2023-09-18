import React from 'react'
import { Parent } from 'mdast'
import { useContentSelection } from '@content-ui/react/useContent'
import { ContentLeaf } from '@content-ui/react/ContentLeaf'
import { isLeafSelected } from '@content-ui/react/isLeafSelected'

export const BaseLeafContent = <P extends { selected?: boolean } = { selected?: boolean }>(
    props:
        P &
        {
            child: {
                children: Parent['children']
            }
        },
) => {
    const editorSelection = useContentSelection()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {child, selected, ...p} = props
    const length = child.children.length
    return child.children
        .map((childNext, i) =>
            <ContentLeaf
                key={i}
                elem={childNext.type}
                child={childNext}
                // todo: why also checking here if selected? shouldn't be the hook-usage and then pass-down be enough?
                selected={selected || isLeafSelected(childNext.position, editorSelection?.startLine, editorSelection?.endLine)}
                isFirst={i === 0}
                isLast={i === length - 1}
                {...p as unknown as P}
            />,
        ) as unknown as React.ReactElement
}
