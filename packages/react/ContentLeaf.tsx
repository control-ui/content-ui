import {
    LeafsRenderMapping, LeafsEngine,
    defineLeafEngine, ReactLeafsNodeSpec,
} from '@tactic-ui/react/LeafsEngine'
import React from 'react'
import { DecoratorProps, DecoratorPropsNext, ReactDeco } from '@tactic-ui/react/Deco'
import { EditorSelection } from '@content-ui/react/useContent'
import { CodeMirrorComponentProps } from '@ui-schema/kit-codemirror/CodeMirror'
import { CustomMdAstContent } from '@content-ui/md/Ast'
import { useSettings } from './LeafSettings'

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
    render: LeafsRenderMapping<ReactLeafsNodeSpec<{ [k: string]: {} }>, {}>
    elem: string
}

export function ContentRenderer<P extends DecoratorPropsNext>(
    {
        render,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next,
        ...p
    }: P & ContentRendererProps): React.ReactElement<P> {
    const leafs = render.leafs
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

const {
    LeafsProvider, useLeafs,
} = defineLeafEngine<
    ContentLeafPropsMapping, ContentLeafComponents,
    LeafsRenderMapping<ReactLeafsNodeSpec<ContentLeafPropsMapping>, ContentLeafComponents>,
    ReactDeco<{}, {}>
>()

export const ContentLeafsProvider = LeafsProvider
export const useContentLeafs = useLeafs

export type ContentLeafInjected = 'decoIndex' | 'next' | keyof LeafsEngine<any, any, any, any>

export function ContentLeaf<
    TLeafDataMapping extends ContentLeafPropsMapping,
    TLeafData extends TLeafDataMapping[keyof TLeafDataMapping] & {},
    TDeco extends ReactDeco<{}, {}> = ReactDeco<{}, {}>,
    TComponents extends ContentLeafComponents = ContentLeafComponents,
    TRenderMapping extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafDataMapping>, TComponents> = LeafsRenderMapping<ReactLeafsNodeSpec<TLeafDataMapping>, TComponents>,
    // todo: TProps not only need to support removing injected, but also allowing overriding
    TProps extends DecoratorProps<TLeafData, TDeco> = DecoratorProps<TLeafData, TDeco>,
>(
    props: Omit<TProps, ContentLeafInjected>,
): React.JSX.Element | null {
    const {render, deco} = useLeafs<TLeafDataMapping, TComponents, TRenderMapping, TDeco>()
    if(!deco) {
        throw new Error('This LeafNode requires decorators, maybe missed `deco` at the `LeafsProvider`?')
    }
    const settings = useSettings()
    const Next = deco.next(0)
    // todo: `Next` can not be typed in any way i've found, thus here no error will be shown
    return <Next
        {...props}
        {...settings}
        next={deco.next}
        decoIndex={0}
        render={render}
        deco={deco}
    />
}
