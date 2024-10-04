import React from 'react'
import { Parents } from 'mdast'
import { useContentSelection } from '@content-ui/react/ContentSelectionContext'
import { ContentLeaf } from '@content-ui/react/ContentLeaf'
import { isLeafSelected } from '@content-ui/react/isLeafSelected'

export const LeafChildNodes = <P extends {} = {}>(
    props:
        P &
        {
            childNodes: Parents['children']
        },
) => {
    // todo: move this hook into the decorators
    const editorSelection = useContentSelection()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {childNodes, ...p} = props
    const length = childNodes.length
    return childNodes
        .map((childNext, i) =>
            <ContentLeaf
                key={i}
                {...p}
                elem={childNext.type}
                child={childNext}
                // todo: add support for multiple selections, e.g. multiple lines with unselected lines in between
                selected={editorSelection ? isLeafSelected(childNext.position, editorSelection.startLine, editorSelection.endLine) : false}
                isFirst={i === 0}
                isLast={i === length - 1}
            />,
        ) as unknown as React.ReactElement
}
