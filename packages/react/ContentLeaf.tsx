import { RootContent } from 'mdast'
import React from 'react'
import { EditorSelection } from '@content-ui/react/useContent'
import { CodeMirrorComponentProps } from '@ui-schema/kit-codemirror/CodeMirror'
import { useSettings } from '@content-ui/react/LeafSettings'
import { DecoratorProps, DecoratorPropsNext, ReactBaseDecorator, ReactDeco } from '@content-ui/react/EngineDecorator'

export type GenericLeafsDataSpec<D extends {} = {}> = {
    [k: string]: D
}

export interface LeafsRenderMapping<TLeafsMapping extends {} = {}, TComponentsMapping extends {} = {},
    /**
     * The match params should be wider than the params each leaf expects,
     * to improve portability of matcher to work with similar leafs,
     * as mostly the matcher should work for more leafs than initially known.
     *
     * @example
     *  if some leaf param is:      `{ type: 'headline' | 'input' }`
     *  the match params should be: `{ type: string }`
     */
    TMatchParams extends {} = {},
    /**
     * @experimental
     */
    TMatchResult = any,
    /**
     * @experimental
     */
    THooks extends {} = {}> {
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

export interface LeafsEngine<TLeafsDataMapping extends GenericLeafsDataSpec, TComponents extends {}, TDeco extends ReactDeco<{}, {}, {}>, TRender extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponents>> {
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
export type ContentLeafPropsMapping = {
    // [K in CustomMdAstContent['type']]: { elem: K, child: CustomMdAstContent } & ContentLeafPayload
    // [K in Content['type']]: { elem: K, child: Content extends { type: K } ? Extract<Content, { type: K }> : never } & ContentLeafPayload
    [K in MdAstNodes['type']]: { elem: K, child: Extract<MdAstNodes, { type: K }> } & ContentLeafPayload
}

export type ContentLeafsNodeMapping = ReactLeafsNodeSpec<ContentLeafPropsMapping>

export type ContentLeafComponents = {
    CodeMirror?: React.ComponentType<CodeMirrorComponentProps & { lang?: string }>
}
export type ContentLeafProps<S extends keyof ContentLeafPropsMapping = keyof ContentLeafPropsMapping> = ContentLeafPropsMapping[S]

export type ContentRendererProps = {
    renderMap: LeafsRenderMapping<ReactLeafsNodeSpec<{ [k: string]: {} }>, {}, { type: string }>
    elem: string
}

export function ContentRenderer<P extends DecoratorPropsNext>(
    {
        renderMap,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next,
        ...p
    }: P & ContentRendererProps): React.ReactElement<P> {
    const leafs = renderMap.leafs
    if(!leafs[p.elem]) {
        throw new Error('No LeafNode found for ' + p.elem)
    }
    // todo: check if there is a better way to "auto memo the final Leaf",
    //       an extra render-component could be used, but would that be better/faster than this here?
    const Leaf = React.useMemo(
        () => React.memo(leafs[p.elem]) as any,
        [leafs, p.elem],
    )
    return <Leaf {...p}/>
}

export const contentUIDecorators = new ReactDeco<
    DecoratorPropsNext &
    ContentRendererProps
>()
    .use(ContentRenderer)

export const contentLeafsContext: React.Context<
    LeafsEngine<
        ContentLeafPropsMapping,
        ContentLeafComponents,
        ReactDeco<{}, {}>,
        LeafsRenderMapping<ReactLeafsNodeSpec<ContentLeafPropsMapping>, ContentLeafComponents, { type: string }>
    >
> = React.createContext(undefined as any)

export const useContentLeafs = <
    TLeafsDataMapping2 extends ContentLeafPropsMapping = ContentLeafPropsMapping,
    TComponents2 extends ContentLeafComponents = ContentLeafComponents,
    TDeco2 extends ReactDeco<{}, {}> = ReactDeco<{}, {}>,
    TRender2 extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping2>, TComponents2> = LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping2>, TComponents2>,
>() => {
    return React.useContext<LeafsEngine<TLeafsDataMapping2, TComponents2, TDeco2, TRender2>>(
        contentLeafsContext as unknown as React.Context<LeafsEngine<TLeafsDataMapping2, TComponents2, TDeco2, TRender2>>,
    )
}

export function ContentLeafsProvider<
    TLeafsDataMapping2 extends ContentLeafPropsMapping = ContentLeafPropsMapping,
    TComponents2 extends ContentLeafComponents = ContentLeafComponents,
    TDeco2 extends ReactDeco<{}, {}> = ReactDeco<{}, {}>,
    TRender2 extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping2>, TComponents2> = LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping2>, TComponents2>,
    // todo: integrate a typing which validates that the provided deco-result-props are compatible with props of `TRender2['leafs']`
>(
    {
        children,
        deco, renderMap,
    }: React.PropsWithChildren<LeafsEngine<TLeafsDataMapping2, TComponents2, TDeco2, TRender2>>,
) {
    const ctx = React.useMemo((): LeafsEngine<ContentLeafPropsMapping, ContentLeafComponents, ReactDeco<{}, {}, {}>, LeafsRenderMapping<ReactLeafsNodeSpec<ContentLeafPropsMapping>, ContentLeafComponents, {}, any, {}>> => ({
        deco: deco,
        renderMap: renderMap as LeafsRenderMapping<ReactLeafsNodeSpec<ContentLeafPropsMapping>, ContentLeafComponents, {}, any, {}>,
    }), [deco, renderMap])

    const LeafsContextProvider = contentLeafsContext.Provider
    return <LeafsContextProvider value={ctx}>{children}</LeafsContextProvider>
}

export type ContentLeafInjected = 'decoIndex' | 'next' | keyof LeafsEngine<any, any, any, any>

export function ContentLeaf<
    TLeafDataMapping extends ContentLeafPropsMapping,
    TLeafData extends TLeafDataMapping[keyof TLeafDataMapping] & {},
    TDeco extends ReactDeco<{}, {}> = ReactDeco<{}, {}>,
    TComponents extends ContentLeafComponents = ContentLeafComponents,
    TRenderMapping extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafDataMapping>, TComponents, { type: string }> = LeafsRenderMapping<ReactLeafsNodeSpec<TLeafDataMapping>, TComponents, { type: string }>,
    // todo: TProps not only need to support removing injected, but also allowing overriding
    TProps extends DecoratorProps<TLeafData, TDeco> = DecoratorProps<TLeafData, TDeco>,
>(
    props: Omit<TProps, ContentLeafInjected>,
): React.JSX.Element | null {
    const {renderMap, deco} = useContentLeafs<TLeafDataMapping, TComponents, TDeco, TRenderMapping>()
    if(!deco) {
        throw new Error('This LeafNode requires decorators, maybe missed `deco` at the `ContentLeafsProvider`?')
    }
    const settings = useSettings()
    const Next = deco.next(0) as ReactBaseDecorator<DecoratorPropsNext & { [k in ContentLeafInjected]: any }>
    // todo: `Next` can not be typed in any way i've found, thus here no error will be shown
    return <Next
        {...props}
        {...settings}
        next={deco.next}
        decoIndex={0}
        renderMap={renderMap}
        deco={deco}
    />
}
