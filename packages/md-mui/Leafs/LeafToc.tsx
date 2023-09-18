import React from 'react'
import { Heading, ListItem, Root } from 'mdast'
import { RouterMuiLink } from '@content-ui/md-mui/MuiComponents/MuiNavLink'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ContentLeaf, ContentLeafProps, ContentLeafPropsMapping } from '@content-ui/react/ContentLeaf'
import { EditorSelection } from '@content-ui/react/useContent'
import { useSettings } from '@content-ui/react/LeafSettings'
import { flattenText } from '@content-ui/md/flattenText'
import { textToId } from '@content-ui/md/textToId'
import useTheme from '@mui/material/styles/useTheme'
import type { Theme } from '@mui/material/styles'
import { TypographyWithExtras } from '@content-ui/md-mui/MuiComponents/Theme'
import { TocHNode, WithMdAstChild } from '@content-ui/md/Ast'

export const LeafTocListItem: React.FC<ContentLeafProps & WithMdAstChild & { textVariant?: 'body1' | 'body2' | 'caption' }> = ({child, textVariant}) => {
    const {smallList, showLines, editorSelection, onClick} = useToc()
    const c = child.type === 'tocListItem' ? child : undefined
    // todo: with the tui@0.0.3 it is injected in the renderer and thus should be moved to props
    const {headlineLinkable} = useSettings()
    const {typography} = useTheme<Theme & { typography: TypographyWithExtras }>()
    const [focus, setFocus] = React.useState(false)
    const selectedByLine = c && (
        editorSelection?.startLine === c?.value.headline.position?.start?.line ||
        editorSelection?.endLine === c?.value.headline.position?.end?.line
    )
    return c ? <Typography component={'li'} variant={textVariant || (smallList ? 'body2' : 'body1')} sx={{pl: 0.5}}>
        <Box style={{display: 'inline-flex'}}>
            {headlineLinkable ?
                <RouterMuiLink
                    href={'#' + textToId(c?.value.flatText.join(''))}
                    color={selectedByLine ? 'primary' : 'inherit'}
                    underline={'hover'}
                    style={{
                        border: 0, outline: 0, flexGrow: 1,
                        display: 'flex',
                        textDecoration: focus ? 'underline' : undefined,
                    }}
                    onClick={() => onClick?.(c?.value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                >
                    {c.value.flatText.join('')}
                </RouterMuiLink> :
                <Typography>
                    {c.value.flatText.join('')}
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
                >
                    {'L'}
                    {c.value.headline.position?.start?.line}
                    {c.value.headline.position?.start?.line !== c.value.headline.position?.end?.line ?
                        ' to L' + c.value.headline.position?.end?.line : ''}
                </Typography> : null}
        </Box>

        {c?.value.nested?.length || 0 > 0 ?
            <LeafTocList
                headLines={c.value.nested as TocHNode[]}
                depth={c.value.headline.depth + 1}
                dense
            /> : null}
    </Typography> : null
}

export const LeafTocList: React.FC<{
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
    return <ContentLeaf<ContentLeafPropsMapping, ContentLeafPropsMapping['list'] & { child: { dense?: boolean } }>
        elem={'list'}
        child={{
            type: 'list',
            ordered: true,
            dense: dense,
            children: sameDepthTree.map((hNode) => ({
                type: 'tocListItem' as 'listItem',
                value: hNode,
                children: [],
            })) as ListItem[],
        }}
    />
}

export interface LeafTocContextType {
    smallList?: boolean
    showLines?: boolean
    editorSelection?: EditorSelection
    onClick?: (hNode: TocHNode) => void
}

export const LeafTocContext = React.createContext<LeafTocContextType>({})

export const useToc = (): LeafTocContextType => React.useContext(LeafTocContext)

export const TocProvider: React.FC<React.PropsWithChildren<LeafTocContextType>> = ({children, showLines, editorSelection, smallList, onClick}) => {
    const ctx = React.useMemo(
        () => ({showLines, editorSelection, smallList, onClick}),
        [showLines, editorSelection, smallList, onClick],
    )
    return <LeafTocContext.Provider value={ctx}>{children}</LeafTocContext.Provider>
}

export const defaultTocIds: string[] = ['table-of-content', 'toc']

export const useLeafToc = (root: Root | undefined, tocIds?: string[]) => {
    const headlines = React.useMemo(() => {
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

    const tocInject = React.useMemo(() => {
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

export const LeafToc: React.FC<LeafTocContextType & LeafTocProps> = (
    {
        smallList, showLines, editorSelection, onClick,
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
        editorSelection={editorSelection}
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
