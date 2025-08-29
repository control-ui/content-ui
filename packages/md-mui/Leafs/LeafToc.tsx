import { MuiContentRenderComponentsLinks } from '@content-ui/md-mui/LeafsComponents'
import { ContentSelectionState, useIsLeafSelected } from '@content-ui/react/ContentSelectionContext'
import { isSelectionShowFocus } from '@content-ui/react/Utils/isSelectionSetting'
import Link from '@mui/material/Link'
import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react'
import type { Heading, ListItem, Root, RootContent } from 'mdast'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ContentLeaf } from '@content-ui/react/ContentLeaf'
import type { ContentLeafMatchParams, ContentLeafPayload, ContentLeafsPropsMapping, LeafsRenderMapping, ReactLeafsNodeSpec } from '@content-ui/react/ContentLeafsContext'
import { useContentLeafs } from '@content-ui/react/ContentLeafsContext'
import { useSettings } from '@content-ui/react/LeafSettings'
import { flattenText } from '@content-ui/struct/flattenText'
import { textToId } from '@content-ui/struct/textToId'
import { useTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import type { TypographyWithExtras } from '@content-ui/md-mui/MuiComponents/Theme'
import type { TocHNode, TocListItem } from '@content-ui/struct/Ast'

/**
 * If selection should be shown for the node, only highlights the ToC entry if the selection is only inside its position range.
 */
function isSelectionSingleLine(
    state: ContentSelectionState,
    position: { start: { line: number }, end: { line: number } },
) {
    if(!isSelectionShowFocus(state)) {
        return false
    }
    const {selection} = state
    return (
        typeof selection.startLine === 'number' && typeof selection.endLine === 'number' &&
        selection.startLine === selection.endLine &&
        selection.startLine >= (position?.start?.line || 0) &&
        selection.endLine <= (position?.end?.line || 0)
    )
}

export const LeafTocListItem: FC<ContentLeafPayload<TocListItem> & { textVariant?: 'body1' | 'body2' | 'caption' }> = ({child, textVariant}) => {
    const {smallList, showLines, onClick} = useToc()
    const {
        headlineLinkable, linkAnchorToHref,
    } = useSettings()
    const {renderMap} = useContentLeafs<
        RootContent,
        ContentLeafsPropsMapping, MuiContentRenderComponentsLinks,
        LeafsRenderMapping<ReactLeafsNodeSpec<ContentLeafsPropsMapping>, MuiContentRenderComponentsLinks, ContentLeafMatchParams>
    >()
    const {typography} = useTheme<Theme & { typography: TypographyWithExtras }>()
    const selectedByLine = useIsLeafSelected(
        child?.headline.headline.position?.start?.line,
        child?.headline.headline.position?.end?.line,
        isSelectionSingleLine,
    )
    const MuiLink = renderMap.components?.Link || Link

    const id = headlineLinkable ? '#' + textToId(child?.headline.flatText.join('')) : undefined
    return child ? <Typography component={'li'} variant={textVariant || (smallList ? 'body2' : 'body1')} sx={{pl: 0.5}}>
        <Box style={{display: 'inline-flex'}}>
            {id ?
                <MuiLink
                    href={linkAnchorToHref ? linkAnchorToHref(id) : id}
                    color={selectedByLine ? 'primary' : 'inherit'}
                    underline={'hover'}
                    sx={{
                        border: 0, outline: 0, flexGrow: 1,
                        display: 'flex',
                        '&:focus': {
                            textDecoration: 'underline',
                        },
                    }}
                    onClick={() => onClick?.(child?.headline)}
                >
                    {child.headline.flatText.join('')}
                </MuiLink> :
                <Typography>
                    {child.headline.flatText.join('')}
                </Typography>}

            {showLines ?
                <Typography
                    component={'code'} variant={'inherit'}
                    style={{
                        fontFamily: typography?.fontFamilyCode,
                        fontSize: typography?.fontSizeCode,
                        whiteSpace: 'pre',
                        marginLeft: 8,
                        opacity: selectedByLine ? 1 : 0.65,
                        transition: '0.26s ease-out opacity',
                        fontWeight: selectedByLine ? 'bold' : undefined,
                    }}
                    color={selectedByLine ? 'primary' : 'inherit'}
                    title={'line in source document'}
                >
                    {'L'}
                    {child.headline.headline.position?.start?.line}
                    {child.headline.headline.position?.start?.line !== child.headline.headline.position?.end?.line ?
                        ' to L' + child.headline.headline.position?.end?.line : ''}
                </Typography> : null}
        </Box>

        {/* todo: refactor to use `leafs` */}
        {child?.headline.nested?.length || 0 > 0 ?
            <LeafTocList
                headLines={child.headline.nested as TocHNode[]}
                depth={child.headline.headline.depth + 1}
                dense
            /> : null}
    </Typography> : null
}

/**
 * @todo refactor as Leaf component
 */
export const LeafTocList: FC<{
    headLines: TocHNode[]
    depth: number
    dense?: boolean
}> = ({headLines, depth, dense}) => {
    const sameDepth = headLines.filter(h => h.headline.depth === depth)
    const sameDepthTree = sameDepth.map((h, i) => {
        return {
            ...h,
            nested: headLines.filter(
                h2 =>
                    h2.headline.depth >= depth + 1 &&
                    h2.headlineIndex > h.headlineIndex &&
                    (!sameDepth[i + 1] || (h2.headlineIndex < sameDepth[i + 1].headlineIndex)),
            ),
        }
    })
    return <ContentLeaf<RootContent, ContentLeafsPropsMapping, 'list', ContentLeafsPropsMapping['list'] & { child: { dense?: boolean } }>
        elem={'list'}
        child={{
            type: 'list',
            ordered: true,
            dense: dense,
            children: sameDepthTree.map((hNode): TocListItem => ({
                type: 'tocListItem',
                headline: hNode,
                children: [],
            })) as unknown as ListItem[],
        }}
    />
}

export interface LeafTocContextType {
    smallList?: boolean
    showLines?: boolean
    onClick?: (hNode: TocHNode) => void
}

export const LeafTocContext = createContext<LeafTocContextType>({})

export const useToc = (): LeafTocContextType => useContext(LeafTocContext)

export const TocProvider: FC<PropsWithChildren<LeafTocContextType>> = ({children, showLines, smallList, onClick}) => {
    const ctx = useMemo(
        () => ({showLines, smallList, onClick}),
        [showLines, smallList, onClick],
    )
    return <LeafTocContext.Provider value={ctx}>{children}</LeafTocContext.Provider>
}

export const defaultTocIds: string[] = ['table-of-content', 'toc']

export const useLeafToc = (root: Root | undefined, tocIds?: string[]) => {
    const headlines = useMemo(() => {
        if(!root?.children) return []

        const headLines = root.children
            .map((h, i) => ({h, i}))
            .filter(c => c.h.type === 'heading') as { h: Heading, i: number }[] | undefined

        if(!headLines || headLines.length === 0) return []

        return headLines.reduce((tree, headline, i) => {
            const flatText = flattenText(headline.h)
            return [
                ...tree,
                {
                    headline: headline.h,
                    headlineIndex: i,
                    rootIndex: headline.i,
                    flatText: flatText,
                    id: textToId(flatText.join('')),
                },
            ]
        }, [] as TocHNode[])
    }, [root])

    const tocInject = useMemo(() => {
        if(headlines.length === 0) return undefined

        const afterHeadline = !tocIds || tocIds.length === 0 ? undefined :
            headlines.findIndex(c => tocIds.includes(c.id))
        if(afterHeadline === -1) return undefined

        const startIndex = typeof afterHeadline === 'number' ? afterHeadline : 0
        const startHeadline = headlines[startIndex]
        const nextHeadlineIndex = startIndex + 1
        const nextHeadline = headlines[nextHeadlineIndex]
        if(!startHeadline) return undefined
        return {
            start: startHeadline,
            next: nextHeadline,
            doInject: Boolean(afterHeadline),
        }
    }, [headlines, tocIds])

    return {headlines, tocInject}
}

export interface LeafTocProps {
    tocInject: { start: TocHNode, next: TocHNode, doInject: boolean } | undefined
    headlines: TocHNode[] | undefined
}

/**
 * @todo move to components mapping
 */
export const LeafToc: FC<LeafTocContextType & LeafTocProps> = (
    {
        smallList, showLines, onClick,
        tocInject, headlines,
    },
) => {
    const startHeadline = tocInject?.start

    if(!startHeadline || !headlines || headlines.length === 0) return null

    // todo: decouple the startDepth from the startHeadline, as otherwise TOC in third-level are not possible
    const startDepth = startHeadline.headline.depth

    return <TocProvider
        smallList={smallList}
        showLines={showLines}
        onClick={onClick}
    >
        <LeafTocList
            headLines={
                tocInject?.doInject ?
                    headlines.filter(h => h.headlineIndex > startHeadline.headlineIndex) :
                    headlines
            }
            depth={startDepth}
        />
    </TocProvider>
}
