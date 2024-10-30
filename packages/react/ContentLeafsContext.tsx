import type { RootContent } from 'mdast'
import React, { useMemo, memo, createContext, useContext } from 'react'
import { useSettings } from '@content-ui/react/LeafSettings'
import { DecoratorPropsNext, ReactBaseDecorator, ReactDeco } from '@content-ui/react/EngineDecorator'
import { ContentSelection, useContentSelection } from '@content-ui/react/ContentSelectionContext'
import { ContentLeafInjected } from '@content-ui/react/ContentLeaf'
import { isLeafSelected } from '@content-ui/react/Utils/isLeafSelected'

export interface LeafsRenderMapping<
    TLeafsMapping extends {} = {},
    TComponentsMapping extends {} = {},
    /**
     * The match params should be wider than the params each leaf expects,
     * to improve portability of matcher to work with similar leafs,
     * as mostly the matcher should work for more leafs than initially known.
     *
     * @example
     *  if some leaf param is:      `{ elem: 'headline' | 'input' }`
     *  the match params should be: `{ elem: string }`
     */
    TMatchParams extends {} = {},
    /**
     * @experimental
     */
    TMatchResult = unknown,
    /**
     * @experimental
     */
    THooks extends {} = {}
> {
    components: TComponentsMapping
    leafs: TLeafsMapping
    /**
     * Responsible to match leafs of this mapping.
     */
    matchLeaf: <P extends TMatchParams>(params: P, leafs: TLeafsMapping) => TMatchResult & React.ComponentType<P> | undefined
    children?: never
    hooks?: THooks
}

export type GenericLeafsDataSpec<D extends {} = {}> = {
    [k: string]: D
}

/**
 * A wider `React.ComponentType`, as the remapping had a lot of issues when `React.ComponentType` was used internally.
 * (this should be solved with the different `matchLeaf` typing approach, kept as note and for further investigation of the other issues)
 *
 * @todo it seems it has to do with incompatible props for different leafs
 *       - when using `React.ComponentType` the component types of each component in `leafs` must be strict
 *       - when using the loose `ReactLeafDefaultNodeType` the component types of `leafs` can differ,
 *         even allowing just `ContentLeafProps`, while using `.ComponentType` or `.FunctionComponent` requires e.g. `ContentLeafProps<'thematicBreak'>`
 *       - for FC it is related to their `propTypes` and `defaultProps` typing, not the actual `props` typing
 */
export type ReactLeafDefaultNodeType<P = {}> = React.ComponentClass<P> | ((props: P, context?: any) => React.ReactNode)
// export type ReactLeafDefaultNodeType<P = {}> = React.ComponentClass<P> | React.FunctionComponent<P>
export type ReactLeafsNodeSpec<LDS extends GenericLeafsDataSpec> = {
    // [K in keyof LDS]?: ReactLeafDefaultNodeType<NonNullable<LDS[K]>> | null
    // - partial to not require all implementations
    // - null to support suppressing matching warning
    [K in keyof LDS]?: React.ComponentType<NonNullable<LDS[K]>> | null
}

export interface LeafsEngine<TDeco extends ReactDeco<{}, {}, {}>, TRender extends {}> {
    renderMap: TRender
    deco?: TDeco
}

export interface ContentLeafPayload<TChild extends { type: string } = { type: string }> {
    elem: TChild['type']
    child: TChild
    selected?: boolean
    // `true` when first Leaf inside the parent level
    isFirst?: boolean
    // `true` when last Leaf inside the parent level
    isLast?: boolean
}

export type ContentLeafsPropsMapping<TAstNodes extends { type: string } = RootContent> = {
    [K in TAstNodes['type']]: ContentLeafPayload<Extract<TAstNodes, { type: K }>>
}

export type ContentLeafsNodeMapping<TLeafDataMapping extends ContentLeafsPropsMapping = ContentLeafsPropsMapping> = ReactLeafsNodeSpec<TLeafDataMapping>

export type ContentRenderComponents = {}

export type ContentLeafProps<S extends keyof ContentLeafsPropsMapping = keyof ContentLeafsPropsMapping> = ContentLeafsPropsMapping[S]

export type ContentLeafMatchParams = { elem: string }

/**
 * @todo remove/split up elem+child and use some other typing for it
 */
export type ContentRendererProps<
    TLeafDataMapping extends ContentLeafsPropsMapping = ContentLeafsPropsMapping,
    TElem extends keyof ContentLeafsPropsMapping = keyof ContentLeafsPropsMapping
> = {
    renderMap: LeafsRenderMapping<ReactLeafsNodeSpec<TLeafDataMapping>, ContentRenderComponents, ContentLeafMatchParams>
    elem: TElem
    child: TLeafDataMapping[TElem]['child']
}

export function ContentRenderer<P extends DecoratorPropsNext>(
    {
        renderMap,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next, decoIndex,
        ...props
    }: P & ContentRendererProps,
): React.ReactElement<P> | null {
    const settings = useSettings()
    const Leaf = renderMap.matchLeaf(props, renderMap.leafs)

    if(typeof Leaf === 'undefined') {
        console.error('No LeafNode found for ' + props.elem, props)
        return null
    }

    if(Leaf === null) {
        return null
    }

    return <Leaf
        {...settings}
        {...props}
    />
}

export const ContentRendererMemo = memo(ContentRenderer)

export function ContentSelectionDecorator<P extends DecoratorPropsNext>(
    {
        renderMap,
        next, decoIndex,
        ...props
    }: P & ContentRendererProps & { selection?: ContentSelection },
): React.ReactElement<P> {
    const editorSelection = useContentSelection()
    const Next = next(decoIndex) as ReactBaseDecorator<DecoratorPropsNext & { [k in ContentLeafInjected]: any }>
    return <Next
        {...props}
        next={next}
        decoIndex={decoIndex + 1}
        renderMap={renderMap}
        // todo: add support for multiple selections, e.g. multiple lines with unselected lines in between
        selected={editorSelection ? isLeafSelected(props.child.position, editorSelection.startLine, editorSelection.endLine) : false}
    />
}

export const contentUIDecorators = new ReactDeco<
    DecoratorPropsNext &
    ContentRendererProps
>()
    .use(ContentSelectionDecorator)
    .use(ContentRendererMemo as typeof ContentRenderer)

export const contentLeafsContext: React.Context<
    LeafsEngine<
        ReactDeco<{}, {}>,
        LeafsRenderMapping<ReactLeafsNodeSpec<ContentLeafsPropsMapping>, ContentRenderComponents, ContentLeafMatchParams>
    >
> = createContext(undefined as any)

export const useContentLeafs = <
    TLeafsDataMapping extends ContentLeafsPropsMapping = ContentLeafsPropsMapping,
    TComponents extends ContentRenderComponents = ContentRenderComponents,
    TDeco extends ReactDeco<{}, {}> = ReactDeco<{}, {}>,
    TRender extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponents, ContentLeafMatchParams> = LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponents, ContentLeafMatchParams>,
>() => {
    return useContext<LeafsEngine<TDeco, TRender>>(
        contentLeafsContext as unknown as React.Context<LeafsEngine<TDeco, TRender>>,
    )
}

export function ContentLeafsProvider<
    TLeafsDataMapping extends ContentLeafsPropsMapping = ContentLeafsPropsMapping,
    TComponents extends ContentRenderComponents = ContentRenderComponents,
    TDeco extends ReactDeco<{}, {}, {}> = ReactDeco<{}, {}, {}>,
    TRender extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponents, ContentLeafMatchParams> = LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponents, ContentLeafMatchParams>,
    // todo: integrate a typing which validates that the provided deco-result-props are compatible with props of `TRender['leafs']`
>(
    {
        children,
        deco, renderMap,
    }: React.PropsWithChildren<LeafsEngine<TDeco, TRender>>,
) {
    const ctx = useMemo((): LeafsEngine<TDeco, TRender> => ({
        deco: deco,
        renderMap: renderMap,
    }), [deco, renderMap])

    const LeafsContextProvider = contentLeafsContext.Provider
    return <LeafsContextProvider
        value={
            ctx as LeafsEngine<
                TDeco,
                LeafsRenderMapping<ReactLeafsNodeSpec<ContentLeafsPropsMapping>, TComponents, ContentLeafMatchParams, any, {}>
            >
        }
    >{children}</LeafsContextProvider>
}
