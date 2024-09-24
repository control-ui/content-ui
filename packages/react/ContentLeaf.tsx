import { RootContent } from 'mdast'
import React, { useMemo, memo, createContext, useContext } from 'react'
import { EditorSelection } from '@content-ui/react/useContent'
import { useSettings } from '@content-ui/react/LeafSettings'
import { DecoratorProps, DecoratorPropsNext, ReactBaseDecorator, ReactDeco } from '@content-ui/react/EngineDecorator'

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
    selection?: EditorSelection | undefined
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

export type ContentLeafsNodeMapping = ReactLeafsNodeSpec<ContentLeafsPropsMapping>

export type ContentRenderComponents = {}

export type ContentLeafProps<S extends keyof ContentLeafsPropsMapping = keyof ContentLeafsPropsMapping> = ContentLeafsPropsMapping[S]

export type ContentRendererProps = {
    renderMap: LeafsRenderMapping<ReactLeafsNodeSpec<{ [k: string]: {} }>, ContentRenderComponents, ContentLeafMatchParams>
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
    TLeafsDataMapping2 extends ContentLeafsPropsMapping = ContentLeafsPropsMapping,
    TComponents2 extends ContentRenderComponents = ContentRenderComponents,
    TDeco2 extends ReactDeco<{}, {}> = ReactDeco<{}, {}>,
    TRender2 extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping2>, TComponents2, ContentLeafMatchParams> = LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping2>, TComponents2, ContentLeafMatchParams>,
>() => {
    return useContext<LeafsEngine<TDeco2, TRender2>>(
        contentLeafsContext as unknown as React.Context<LeafsEngine<TDeco2, TRender2>>,
    )
}

export function ContentLeafsProvider<
    TLeafsDataMapping2 extends ContentLeafsPropsMapping = ContentLeafsPropsMapping,
    TComponents2 extends ContentRenderComponents = ContentRenderComponents,
    TDeco2 extends ReactDeco<{}, {}> = ReactDeco<{}, {}>,
    TRender2 extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping2>, TComponents2, ContentLeafMatchParams> = LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping2>, TComponents2, ContentLeafMatchParams>,
    // todo: integrate a typing which validates that the provided deco-result-props are compatible with props of `TRender2['leafs']`
>(
    {
        children,
        deco, renderMap,
    }: React.PropsWithChildren<LeafsEngine<TDeco2, TRender2>>,
) {
    const ctx = useMemo((): LeafsEngine<TDeco2, TRender2> => ({
        deco: deco,
        renderMap: renderMap,
    }), [deco, renderMap])

    const LeafsContextProvider = contentLeafsContext.Provider
    return <LeafsContextProvider
        value={
            ctx as LeafsEngine<
                TDeco2,
                LeafsRenderMapping<ReactLeafsNodeSpec<ContentLeafsPropsMapping>, ContentRenderComponents, ContentLeafMatchParams, any, {}>
            >
        }
    >{children}</LeafsContextProvider>
}

export type ContentLeafInjected = 'decoIndex' | 'next' | keyof LeafsEngine<any, any>

export function ContentLeaf<
    TLeafDataMapping extends ContentLeafsPropsMapping,
    TLeafData extends TLeafDataMapping[keyof TLeafDataMapping] & {},
    TDeco extends ReactDeco<{}, {}> = ReactDeco<{}, {}>,
    TComponents extends ContentRenderComponents = ContentRenderComponents,
    TRenderMapping extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafDataMapping>, TComponents, ContentLeafMatchParams> = LeafsRenderMapping<ReactLeafsNodeSpec<TLeafDataMapping>, TComponents, ContentLeafMatchParams>,
    // todo: TProps not only need to support removing injected, but also allowing overriding
    TProps extends DecoratorProps<TLeafData, TDeco> = DecoratorProps<TLeafData, TDeco>,
>(
    props: Omit<TProps, ContentLeafInjected>,
): React.JSX.Element | null {
    const {renderMap, deco} = useContentLeafs<TLeafDataMapping, TComponents, TDeco, TRenderMapping>()
    if(!deco) {
        throw new Error('This LeafNode requires decorators, maybe missed `deco` at the `ContentLeafsProvider`?')
    }

    const Next = deco.next(0) as ReactBaseDecorator<DecoratorPropsNext & { [k in ContentLeafInjected]: any }>
    // todo: `Next` can not be typed in any way i've found, thus here no error will be shown, except for missing "injected props"
    return <Next
        {...props}
        next={deco.next}
        decoIndex={0}
        renderMap={renderMap}
        deco={deco}
    />
}
