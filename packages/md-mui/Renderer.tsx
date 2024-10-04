import { useContentSelection } from '@content-ui/react/ContentSelectionContext'
import { Fragment, memo, ReactNode } from 'react'
import { useContentContext } from '@content-ui/react/ContentFileContext'
import Typography from '@mui/material/Typography'
import { defaultTocIds, LeafToc, LeafTocContextType, useLeafToc } from '@content-ui/md-mui/Leafs/LeafToc'
import { isLeafSelected } from '@content-ui/react/Utils/isLeafSelected'
import { ContentLeaf } from '@content-ui/react/ContentLeaf'
import { FootnoteSection } from '@content-ui/md-mui/Leafs/LeafFootnoteSection'

export interface RendererProps {
    handleTocClick?: LeafTocContextType['onClick']
}

export const Renderer = ({handleTocClick}: RendererProps): ReactNode => {
    const {root} = useContentContext()
    const editorSelection = useContentSelection()
    const {headlines, tocInject} = useLeafToc(root, defaultTocIds)
    const bodyNodes = root?.children?.filter(c => c.type !== 'footnoteDefinition')

    const footnoteDefinitions = root?.children?.filter(c => c.type === 'footnoteDefinition')

    const startLine = editorSelection?.startLine
    const endLine = editorSelection?.endLine
    const length = bodyNodes?.length || 0
    return <>
        {length > 0 ?
            <>
                {bodyNodes?.map((child, i) =>
                    typeof tocInject?.start?.rootIndex === 'number' && (
                        i >= tocInject?.start?.rootIndex || (
                            typeof tocInject?.next?.rootIndex === 'number' &&
                            tocInject?.next?.rootIndex <= i
                        )
                    ) && (
                        (typeof tocInject?.next?.rootIndex === 'number' && tocInject?.next?.rootIndex === i + 1) ||
                        (typeof tocInject?.next?.rootIndex === 'undefined' && tocInject?.start?.rootIndex === i)
                    ) ?
                        <Fragment key={i}>
                            {/* todo: slice the whole toc area and render separately, not only injecting but "container wrapping" */}
                            <ContentLeaf
                                elem={child.type}
                                child={child}
                                selected={isLeafSelected(child.position, startLine, endLine)}
                                isFirst={i === 0}
                                isLast={i === length - 1}
                            />
                            {(typeof tocInject?.next?.rootIndex === 'number' && tocInject?.next?.rootIndex === i + 1) ||
                            (typeof tocInject?.next?.rootIndex === 'undefined' && tocInject?.start?.rootIndex === i) ?
                                <LeafToc
                                    headlines={headlines}
                                    tocInject={tocInject}
                                    onClick={handleTocClick}
                                /> : null}
                        </Fragment> :
                        <ContentLeaf
                            key={i}
                            elem={child.type}
                            child={child}
                            selected={isLeafSelected(child.position, startLine, endLine)}
                            isFirst={i === 0}
                            isLast={i === length - 1}
                        />,
                )}
                {footnoteDefinitions?.length ?
                    <FootnoteSection
                        rootChildren={footnoteDefinitions}
                    /> : null}
            </> :
            <Typography variant={'body2'} color={'disabled'}>{'-'}</Typography>}
    </>
}

export const RendererMemo = memo(Renderer)
