import { RootContent } from 'mdast'
import React, { useMemo, memo, createContext, useContext } from 'react'
import { useSettings } from '@content-ui/react/LeafSettings'
import { DecoratorPropsNext, ReactDeco } from '@content-ui/react/EngineDecorator'
import { ContentSelection } from '@content-ui/react/ContentSelectionContext'

export type GenericLeafsDataSpec<D extends {} = {}> = {
    [k: string]: D
}

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
    TMatchResult = any,
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
    matchLeaf: <P extends TMatchParams>(params: P, leafs: TLeafsMapping) => TMatchResult
    children?: never
    hooks?: THooks
}

/**
 * A wider `React.ComponentType`, as the remapping had a lot of issues when `React.ComponentType` was used internally, somehow not reproducible here or in others with React18.
 * But in ui-schema with the latest React 18 setup, `React.ComponentType` won't work without the `React.ComponentClass<P>`
 */
export type ReactLeafDefaultNodeType<P = {}> = React.ComponentClass<P> | ((props: P, context?: any) => React.ReactNode)
export type ReactLeafsNodeSpec<LDS extends GenericLeafsDataSpec> = {
    [K in keyof LDS]: ReactLeafDefaultNodeType<NonNullable<LDS[K]>>;
}

export type ContentLeafMatchParams = { elem: string }

export interface LeafsEngine<TDeco extends ReactDeco<{}, {}, {}>, TRender extends {}> {
    renderMap: TRender
    deco?: TDeco
}

export interface ContentLeafPayload {
    elem: string
    selection?: ContentSelection
    selected?: boolean
    // `true` when first Leaf inside the parent level
    isFirst?: boolean
    // `true` when last Leaf inside the parent level
    isLast?: boolean
}

type MdAstNodes = RootContent

/**
 * @todo make generic and easy to add further mdast types
 */
export type ContentLeafsPropsMapping = {
    // [K in CustomMdAstContent['type']]: { elem: K, child: CustomMdAstContent } & ContentLeafPayload
    // [K in Content['type']]: { elem: K, child: Content extends { type: K } ? Extract<Content, { type: K }> : never } & ContentLeafPayload
    [K in MdAstNodes['type']]: { elem: K, child: Extract<MdAstNodes, { type: K }> } & ContentLeafPayload
}

export type ContentLeafsNodeMapping<TLeafDataMapping extends ContentLeafsPropsMapping = ContentLeafsPropsMapping> = ReactLeafsNodeSpec<TLeafDataMapping>

export type ContentRenderComponents = {}

export type ContentLeafProps<S extends keyof ContentLeafsPropsMapping = keyof ContentLeafsPropsMapping> = ContentLeafsPropsMapping[S]

export type ContentRendererProps<TLeafDataMapping extends ContentLeafsPropsMapping = ContentLeafsPropsMapping> = {
    renderMap: LeafsRenderMapping<ReactLeafsNodeSpec<TLeafDataMapping>, ContentRenderComponents, ContentLeafMatchParams>
    elem: string
}

export function ContentRenderer<P extends DecoratorPropsNext>(
    {
        renderMap,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next,
        ...p
    }: P & ContentRendererProps,
): React.ReactElement<P> | null {
    const settings = useSettings()
    const leafs = renderMap.leafs
    const Leaf = renderMap.matchLeaf(p, leafs)

    if(!Leaf) {
        console.error('No LeafNode found for ' + p.elem, p)
        return null
    }

    return <Leaf
        {...settings}
        {...p}
    />
}

export const ContentRendererMemo = memo(ContentRenderer)

export const contentUIDecorators = new ReactDeco<
    DecoratorPropsNext &
    ContentRendererProps
>()
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
    // todo: integrate a typing which validates that the provided deco-result-props are compatible with props of `TRender2['leafs']`
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
