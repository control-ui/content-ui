import type { RootContent } from 'mdast'
import { useMemo, memo, createContext, useContext, ReactNode, FunctionComponent, ComponentType, Context, PropsWithChildren } from 'react'
import { useSettings } from '@content-ui/react/LeafSettings'

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
    components: TComponentsMapping | undefined
    leafs: TLeafsMapping
    /**
     * Responsible to match leafs of this mapping.
     */
    matchLeaf: <P extends TMatchParams>(params: P, leafs: TLeafsMapping) => TMatchResult & ComponentType<P> | undefined
    children?: never
    hooks?: THooks
}

export type GenericLeafsDataSpec<D extends {} = {}> = {
    [k: string]: D
}

export type ReactLeafsNodeSpec<LDS extends GenericLeafsDataSpec> = {
    // - partial to not require all implementations
    // - null to support suppressing matching warning
    [K in keyof LDS]?: ComponentType<NonNullable<LDS[K]>> | null
}

export interface LeafsEngine<TRenderer, TRender extends {}> {
    renderMap: TRender
    Renderer?: TRenderer
}

export interface ContentLeafPayload<TChild extends { type: string } = { type: string }> {
    elem: TChild['type']
    child: TChild
    /**
     * A childs index, only passed down if specified by parent, for performance reasons.
     */
    index?: number
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

export type ContentRendererProps<
    TAstNodes extends { type: string } = RootContent,
    TLeafDataMapping extends ContentLeafsPropsMapping<TAstNodes> = ContentLeafsPropsMapping<TAstNodes>,
    TElem extends TAstNodes['type'] = TAstNodes['type']
> =
    {
        renderMap: LeafsRenderMapping<ReactLeafsNodeSpec<TLeafDataMapping>, ContentRenderComponents, ContentLeafMatchParams>
    } &
    ContentLeafPayload<Extract<TAstNodes, { type: TElem }>>

type RendererComponent<
    TAstNodes extends { type: string } = RootContent,
    TLeafDataMapping extends ContentLeafsPropsMapping<TAstNodes> = ContentLeafsPropsMapping<TAstNodes>
> =
    <TElem extends TAstNodes['type'] = TAstNodes['type']>(
        props: ContentRendererProps<TAstNodes, TLeafDataMapping, TElem>,
    ) => ReturnType<FunctionComponent>

export function ContentRenderer<P extends object>(
    {
        renderMap,
        ...props
    }: Omit<NoInfer<P>, keyof ContentRendererProps> & ContentRendererProps,
): ReactNode {
    const settings = useSettings()
    const Leaf = renderMap.matchLeaf(props, renderMap.leafs)

    if(typeof Leaf === 'undefined') {
        console.error('No leaf component found for ' + props.elem, props)
        return null
    }

    if(Leaf === null) {
        return null
    }

    return <Leaf
        // todo: `dense` is the last remaining prop-setting, refactor remaining usages, but must still support prop based overwrites
        dense={settings.dense}
        {...props}
    />
}

export const ContentRendererMemo = memo(ContentRenderer) as typeof ContentRenderer

export const contentLeafsContext: Context<
    LeafsEngine<
        any,
        LeafsRenderMapping<ReactLeafsNodeSpec<ContentLeafsPropsMapping>, ContentRenderComponents, ContentLeafMatchParams>
    >
> = createContext(undefined as any)

export const useContentLeafs = <
    TAstNodes extends { type: string } = RootContent,
    TLeafsDataMapping extends ContentLeafsPropsMapping<TAstNodes> = ContentLeafsPropsMapping<TAstNodes>,
    TComponents extends ContentRenderComponents = ContentRenderComponents,
    TRender extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponents, ContentLeafMatchParams> = LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponents, ContentLeafMatchParams>,
    TRenderer = RendererComponent<TAstNodes, TLeafsDataMapping>
>() => {
    return useContext<LeafsEngine<TRenderer, TRender>>(
        contentLeafsContext as unknown as Context<LeafsEngine<TRenderer, TRender>>,
    )
}

export function ContentLeafsProvider<
    TAstNodes extends { type: string } = RootContent,
    TLeafsDataMapping extends ContentLeafsPropsMapping<TAstNodes> = ContentLeafsPropsMapping<TAstNodes>,
    TComponents extends ContentRenderComponents = ContentRenderComponents,
    TRender extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponents, ContentLeafMatchParams> = LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponents, ContentLeafMatchParams>,
    TRenderer = RendererComponent<TAstNodes, TLeafsDataMapping>
>(
    {
        children,
        Renderer,
        renderMap,
    }: PropsWithChildren<LeafsEngine<TRenderer, TRender>>,
) {
    const ctx = useMemo((): LeafsEngine<TRenderer, TRender> => ({
        Renderer: Renderer,
        renderMap: renderMap,
    }), [Renderer, renderMap])

    const LeafsContextProvider = contentLeafsContext.Provider
    return <LeafsContextProvider
        value={
            ctx as LeafsEngine<
                TRenderer,
                LeafsRenderMapping<ReactLeafsNodeSpec<ContentLeafsPropsMapping>, TComponents, ContentLeafMatchParams, any, {}>
            >
        }
    >{children}</LeafsContextProvider>
}
