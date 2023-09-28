import { createLeafsContext, defineLeafsContext } from '@tactic-ui/react/LeafsContext'
import {
    LeafsRenderMapping, LeafsEngine,
    ReactLeafsNodeSpec,
} from '@tactic-ui/react/LeafsEngine'
import React from 'react'
import { DecoratorProps, DecoratorPropsNext, ReactBaseDecorator, ReactDeco } from '@tactic-ui/react/Deco'
import { EditorSelection } from '@content-ui/react/useContent'
import { CodeMirrorComponentProps } from '@ui-schema/kit-codemirror/CodeMirror'
import { CustomMdAstContent } from '@content-ui/md/Ast'
import { useSettings } from '@content-ui/react/LeafSettings'

export interface ContentLeafPayload {
    elem: string
    selection?: EditorSelection | undefined
    selected?: boolean
    // `true` when first Leaf inside the parent level
    isFirst?: boolean
    // `true` when last Leaf inside the parent level
    isLast?: boolean
}

export type ContentLeafPropsMapping = {
    [K in CustomMdAstContent['type']]: { elem: K, child: CustomMdAstContent } & ContentLeafPayload
}

export type ContentLeafsNodeMapping = ReactLeafsNodeSpec<ContentLeafPropsMapping>

export type ContentLeafComponents = {
    CodeMirror: React.ComponentType<CodeMirrorComponentProps & { lang?: string }>
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

export const contentLeafsContext = createLeafsContext<
    ContentLeafPropsMapping, ContentLeafComponents,
    ReactDeco<{}, {}>,
    LeafsRenderMapping<ReactLeafsNodeSpec<ContentLeafPropsMapping>, ContentLeafComponents, { type: string }>
>()

export const {
    LeafsProvider: ContentLeafsProvider,
    useLeafs: useContentLeafs,
} = defineLeafsContext(contentLeafsContext)

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
